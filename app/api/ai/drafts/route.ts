import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import type { Json, TablesInsert } from "@/lib/database.types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_BUCKETS = new Map<
  string,
  { count: number; resetAt: number }
>();

const allowedStatuses = new Set(["draft", "review"]);
const allowedContentTypes = new Set([
  "guide",
  "comparison",
  "tool_review",
  "category_page",
  "stack_finder",
  "news",
]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const aiDraftPayloadSchema = {
  additionalProperties: false,
  properties: {
    affiliate_cta_blocks: { items: { type: "object" }, type: "array" },
    author: { maxLength: 120, type: "string" },
    body_markdown: { maxLength: 80_000, minLength: 1, type: "string" },
    content_type: {
      enum: [...allowedContentTypes],
      type: "string",
    },
    excerpt: { maxLength: 500, type: "string" },
    primary_category_id: { format: "uuid", type: "string" },
    related_tool_ids: {
      items: { format: "uuid", type: "string" },
      type: "array",
      uniqueItems: true,
    },
    seo_description: { maxLength: 240, type: "string" },
    seo_title: { maxLength: 160, type: "string" },
    slug: {
      maxLength: 140,
      pattern: slugPattern.source,
      type: "string",
    },
    status: {
      default: "review",
      enum: [...allowedStatuses],
      type: "string",
    },
    subtitle: { maxLength: 240, type: "string" },
    title: { maxLength: 180, minLength: 1, type: "string" },
    topic_id: { format: "uuid", type: "string" },
  },
  required: ["title", "slug", "body_markdown"],
  type: "object",
} as const;
const aiDraftPayloadKeys = new Set(
  Object.keys(aiDraftPayloadSchema.properties),
);

type AiDraftPayload = {
  affiliate_cta_blocks?: unknown;
  author?: unknown;
  body_markdown?: unknown;
  content_type?: unknown;
  excerpt?: unknown;
  primary_category_id?: unknown;
  related_tool_ids?: unknown;
  seo_description?: unknown;
  seo_title?: unknown;
  slug?: unknown;
  status?: unknown;
  subtitle?: unknown;
  title?: unknown;
  topic_id?: unknown;
};

type ValidatedAiDraftPayload = {
  affiliate_cta_blocks: Json;
  author: string | null;
  body_markdown: string;
  content_type:
    | "category_page"
    | "comparison"
    | "guide"
    | "news"
    | "stack_finder"
    | "tool_review";
  excerpt: string | null;
  primary_category_id: string | null;
  related_tool_ids: string[];
  seo_description: string | null;
  seo_title: string | null;
  slug: string;
  status: "draft" | "review";
  subtitle: string | null;
  title: string;
  topic_id: string | null;
};

type ValidationResult =
  | { errors: string[]; payload?: never }
  | { errors?: never; payload: ValidatedAiDraftPayload };

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

function getWebhookSecret() {
  return process.env.AI_DRAFT_WEBHOOK_SECRET;
}

function headerValue(request: NextRequest, name: string, maxLength = 500) {
  const value = request.headers.get(name)?.trim();

  return value ? value.slice(0, maxLength) : "";
}

function getClientIp(request: NextRequest) {
  const forwardedFor = headerValue(request, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headerValue(request, "x-real-ip") || "unknown";
}

function checkRateLimit(request: NextRequest) {
  const now = Date.now();
  const key = getClientIp(request);
  const bucket = RATE_LIMIT_BUCKETS.get(key);

  if (!bucket || bucket.resetAt <= now) {
    RATE_LIMIT_BUCKETS.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  bucket.count += 1;

  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function verifyBearerToken(request: NextRequest, secret: string) {
  const authorization = headerValue(request, "authorization");

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return false;
  }

  return safeEqual(authorization.slice("bearer ".length).trim(), secret);
}

function normalizeSignature(value: string) {
  return value.startsWith("sha256=") ? value.slice("sha256=".length) : value;
}

function verifyHmacSignature(
  request: NextRequest,
  rawBody: string,
  secret: string,
) {
  const signature = normalizeSignature(headerValue(request, "x-ai-signature"));

  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  return safeEqual(signature, expected);
}

function isAuthorized(request: NextRequest, rawBody: string) {
  const secret = getWebhookSecret();

  if (!secret) {
    return { authorized: false, reason: "missing_secret" };
  }

  if (
    verifyBearerToken(request, secret) ||
    verifyHmacSignature(request, rawBody, secret)
  ) {
    return { authorized: true };
  }

  return { authorized: false, reason: "invalid_signature" };
}

function textField(
  payload: AiDraftPayload,
  name: keyof AiDraftPayload,
  errors: string[],
  options: { maxLength?: number; required?: boolean } = {},
) {
  const value = payload[name];

  if (value === undefined || value === null || value === "") {
    if (options.required) {
      errors.push(`${name} is required.`);
    }

    return null;
  }

  if (typeof value !== "string") {
    errors.push(`${name} must be a string.`);
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed && options.required) {
    errors.push(`${name} is required.`);
    return null;
  }

  if (options.maxLength && trimmed.length > options.maxLength) {
    errors.push(`${name} must be ${options.maxLength} characters or fewer.`);
    return null;
  }

  return trimmed;
}

function optionalUuid(
  payload: AiDraftPayload,
  name: "primary_category_id" | "topic_id",
  errors: string[],
) {
  const value = textField(payload, name, errors, { maxLength: 36 });

  if (!value) {
    return null;
  }

  if (!uuidPattern.test(value)) {
    errors.push(`${name} must be a UUID.`);
    return null;
  }

  return value;
}

function parseRelatedToolIds(value: unknown, errors: string[]) {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push("related_tool_ids must be an array.");
    return [];
  }

  const toolIds = value.filter((item): item is string => {
    if (typeof item === "string" && uuidPattern.test(item)) {
      return true;
    }

    errors.push("related_tool_ids must contain only UUID strings.");
    return false;
  });

  return [...new Set(toolIds)];
}

function parseAffiliateCtaBlocks(value: unknown, errors: string[]): Json {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push("affiliate_cta_blocks must be an array.");
    return [];
  }

  if (
    value.some(
      (item) => !item || typeof item !== "object" || Array.isArray(item),
    )
  ) {
    errors.push("affiliate_cta_blocks must contain only JSON objects.");
    return [];
  }

  return value as Json;
}

function validatePayload(payload: AiDraftPayload): ValidationResult {
  const errors: string[] = [];

  for (const key of Object.keys(payload)) {
    if (!aiDraftPayloadKeys.has(key)) {
      errors.push(`${key} is not allowed.`);
    }
  }

  const title = textField(payload, "title", errors, {
    maxLength: 180,
    required: true,
  });
  const slug = textField(payload, "slug", errors, {
    maxLength: 140,
    required: true,
  })?.toLowerCase();
  const bodyMarkdown = textField(payload, "body_markdown", errors, {
    maxLength: 80_000,
    required: true,
  });
  const requestedStatus =
    textField(payload, "status", errors, { maxLength: 20 }) ?? "review";
  const requestedContentType =
    textField(payload, "content_type", errors, { maxLength: 40 }) ?? "guide";

  if (slug && !slugPattern.test(slug)) {
    errors.push("slug must use lowercase letters, numbers, and hyphens.");
  }

  if (requestedStatus === "published") {
    errors.push("status=published is not allowed for AI draft ingestion.");
  } else if (!allowedStatuses.has(requestedStatus)) {
    errors.push("status must be draft or review.");
  }

  if (!allowedContentTypes.has(requestedContentType)) {
    errors.push("content_type is invalid.");
  }

  const validated = {
    affiliate_cta_blocks: parseAffiliateCtaBlocks(
      payload.affiliate_cta_blocks,
      errors,
    ),
    author: textField(payload, "author", errors, { maxLength: 120 }),
    body_markdown: bodyMarkdown,
    content_type: requestedContentType,
    excerpt: textField(payload, "excerpt", errors, { maxLength: 500 }),
    primary_category_id: optionalUuid(payload, "primary_category_id", errors),
    related_tool_ids: parseRelatedToolIds(payload.related_tool_ids, errors),
    seo_description: textField(payload, "seo_description", errors, {
      maxLength: 240,
    }),
    seo_title: textField(payload, "seo_title", errors, { maxLength: 160 }),
    slug,
    status: requestedStatus,
    subtitle: textField(payload, "subtitle", errors, { maxLength: 240 }),
    title,
    topic_id: optionalUuid(payload, "topic_id", errors),
  };

  if (errors.length || !validated.title || !validated.slug || !bodyMarkdown) {
    return { errors };
  }

  return {
    payload: validated as ValidatedAiDraftPayload,
  };
}

function duplicateSlug(errorMessage: string) {
  return errorMessage.includes("articles_slug_key");
}

function logWebhookAudit(
  outcome: "accepted" | "error" | "rejected",
  details: Record<string, unknown>,
) {
  console.info("[ai_draft_webhook]", outcome, details);
}

async function syncArticleTools(articleId: string, toolIds: string[]) {
  if (!toolIds.length) {
    return;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("article_tools").insert(
    toolIds.map((toolId, index) => ({
      article_id: articleId,
      relationship: "ai_context",
      sort_order: (index + 1) * 10,
      tool_id: toolId,
    })),
  );

  if (error) {
    throw new Error(`Article tool sync failed: ${error.message}`);
  }
}

async function markTopicDrafted(topicId: string | null) {
  if (!topicId) {
    return;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("topic_queue")
    .update({ status: "drafted" })
    .eq("id", topicId)
    .eq("status", "briefed");

  if (error) {
    throw new Error(`Topic update failed: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (checkRateLimit(request)) {
    logWebhookAudit("rejected", {
      reason: "rate_limited",
      rawBody,
    });

    return jsonResponse(
      { error: "Too many webhook requests." },
      { status: 429 },
    );
  }

  const auth = isAuthorized(request, rawBody);

  if (!auth.authorized) {
    logWebhookAudit("rejected", {
      reason: auth.reason,
      rawBody,
    });

    return jsonResponse(
      { error: "Unauthorized webhook request." },
      {
        status: auth.reason === "missing_secret" ? 503 : 401,
      },
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    logWebhookAudit("error", {
      error: "invalid_json",
      rawBody,
    });

    return jsonResponse(
      { error: "Request body must be valid JSON." },
      {
        status: 400,
      },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    logWebhookAudit("error", {
      error: "invalid_shape",
      payload: body,
    });

    return jsonResponse(
      { error: "Request body must be a JSON object." },
      {
        status: 400,
      },
    );
  }

  const validation = validatePayload(body as AiDraftPayload);

  if (validation.errors) {
    logWebhookAudit("error", {
      errors: validation.errors,
      payload: body,
    });

    return jsonResponse(
      {
        error: "Payload validation failed.",
        fields: validation.errors,
        schema: aiDraftPayloadSchema,
      },
      { status: 422 },
    );
  }

  const articlePayload = {
    affiliate_cta_blocks: validation.payload.affiliate_cta_blocks,
    ai_assisted: true,
    author: validation.payload.author ?? "IndieAppStack AI Draft Assistant",
    body_markdown: validation.payload.body_markdown,
    content_type: validation.payload.content_type,
    excerpt: validation.payload.excerpt,
    human_reviewed: false,
    primary_category_id: validation.payload.primary_category_id,
    published_at: null,
    seo_description: validation.payload.seo_description,
    seo_title: validation.payload.seo_title,
    slug: validation.payload.slug,
    status: validation.payload.status,
    subtitle: validation.payload.subtitle,
    title: validation.payload.title,
  } satisfies TablesInsert<"articles">;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("articles")
      .insert(articlePayload)
      .select("id,slug,status,human_reviewed,ai_assisted,published_at")
      .single();

    if (error) {
      logWebhookAudit("error", {
        error: error.message,
        payload: body,
      });

      return jsonResponse(
        {
          error: duplicateSlug(error.message)
            ? "Article slug already exists."
            : "Draft could not be created.",
        },
        { status: duplicateSlug(error.message) ? 409 : 500 },
      );
    }

    await syncArticleTools(data.id, validation.payload.related_tool_ids);
    await markTopicDrafted(validation.payload.topic_id);

    logWebhookAudit("accepted", {
      article: data,
      payload: body,
    });

    return jsonResponse(
      {
        article: data,
      },
      { status: 201 },
    );
  } catch (error) {
    logWebhookAudit("error", {
      error: error instanceof Error ? error.message : "Unknown error",
      payload: body,
    });

    return jsonResponse({ error: "Draft ingestion failed." }, { status: 500 });
  }
}
