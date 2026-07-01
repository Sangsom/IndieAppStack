"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emitAdminAnalyticsEvent } from "@/lib/analytics/admin";
import {
  articleQualityChecklistItems,
  articleContentTypeOptions,
  articleStatusOptions,
  type ArticleContentType,
  type ArticleStatus,
} from "@/lib/admin-articles";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json, TablesInsert } from "@/lib/database.types";

type ArticleFormResult = {
  errors: string[];
  payload?: TablesInsert<"articles">;
  relatedToolIds?: string[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const internalLinkPattern =
  /\]\((\/(?:guides|tools|categories|comparisons|stack-finder)(?:\/[a-z0-9/-]+)?)(?:[)#?])/g;
const lastCheckedPattern =
  /(last[-\s]?checked|pricing\/features checked|pricing checked|features checked)[^\n]{0,120}\d{4}-\d{2}-\d{2}/i;
const testingClaimPattern =
  /\b(?:i|we)\s+(?:personally\s+)?(?:tested|used|tried|installed|benchmarked)\b|hands-on testing|in our testing/i;

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function nullableText(formData: FormData, name: string) {
  const value = textValue(formData, name);
  return value.length ? value : null;
}

function isChecked(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function parseStatus(value: string, errors: string[]): ArticleStatus {
  const allowed = articleStatusOptions.map((option) => option.value);

  if (allowed.includes(value as ArticleStatus)) {
    return value as ArticleStatus;
  }

  errors.push("Choose a valid article status.");
  return "draft";
}

function parseContentType(value: string, errors: string[]): ArticleContentType {
  const allowed = articleContentTypeOptions.map((option) => option.value);

  if (allowed.includes(value as ArticleContentType)) {
    return value as ArticleContentType;
  }

  errors.push("Choose a valid content type.");
  return "guide";
}

function parseJson(value: string, errors: string[]): Json {
  if (!value.trim()) {
    return [];
  }

  try {
    return JSON.parse(value) as Json;
  } catch {
    errors.push("Affiliate CTA blocks must be valid JSON.");
    return [];
  }
}

function requiresAffiliateDisclosure(
  bodyMarkdown: string | null,
  blocks: Json,
) {
  const hasAffiliateBlocks = Array.isArray(blocks) && blocks.length > 0;
  const hasRedirectLinks = bodyMarkdown?.includes("](/go/") ?? false;

  return hasAffiliateBlocks || hasRedirectLinks;
}

function hasAffiliateDisclosure(bodyMarkdown: string | null) {
  return /affiliate|commission|disclosure/i.test(bodyMarkdown ?? "");
}

function countInternalLinks(bodyMarkdown: string | null) {
  return new Set(
    [...(bodyMarkdown ?? "").matchAll(internalLinkPattern)].map(
      (match) => match[1],
    ),
  ).size;
}

function hasFitGuidance(bodyMarkdown: string | null) {
  const body = bodyMarkdown ?? "";

  return (
    /(best for|best-fit|best fit)/i.test(body) &&
    /(not good for|not-good-for|poor fit|not a fit)/i.test(body)
  );
}

function validatePublishChecklist(
  formData: FormData,
  payload: TablesInsert<"articles">,
  relatedToolIds: string[],
  errors: string[],
) {
  if (payload.status !== "published") {
    return;
  }

  const bodyMarkdown = payload.body_markdown ?? null;
  const affiliateBlocks = payload.affiliate_cta_blocks ?? [];

  articleQualityChecklistItems.forEach((item) => {
    if (!isChecked(formData, item.name)) {
      errors.push(
        `${item.label} checklist item is required before publishing.`,
      );
    }
  });

  if (!bodyMarkdown) {
    errors.push("Publishing requires body markdown.");
  }

  if (payload.ai_assisted && testingClaimPattern.test(bodyMarkdown ?? "")) {
    errors.push(
      "AI drafts cannot publish with unsupported personal testing claims.",
    );
  }

  if (
    requiresAffiliateDisclosure(bodyMarkdown, affiliateBlocks) &&
    !hasAffiliateDisclosure(bodyMarkdown)
  ) {
    errors.push("Affiliate disclosure is required before publishing.");
  }

  if (relatedToolIds.length > 0 && !hasFitGuidance(bodyMarkdown)) {
    errors.push("Publishing requires best-for and not-good-for guidance.");
  }

  if (countInternalLinks(bodyMarkdown) < 3) {
    errors.push("Publishing requires at least three internal links.");
  }

  if (!lastCheckedPattern.test(bodyMarkdown ?? "")) {
    errors.push("Publishing requires a pricing/features last-checked date.");
  }
}

function parseArticleForm(formData: FormData): ArticleFormResult {
  const errors: string[] = [];
  const title = textValue(formData, "title");
  const slug = textValue(formData, "slug").toLowerCase();
  const status = parseStatus(textValue(formData, "status"), errors);
  const humanReviewed = isChecked(formData, "human_reviewed");
  const confirmPublish = isChecked(formData, "confirm_publish");
  const existingPublishedAt = nullableText(formData, "published_at");

  if (!title) {
    errors.push("Title is required.");
  }

  if (!slugPattern.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  }

  if (status === "published" && !humanReviewed) {
    errors.push("Publishing requires the human-reviewed flag.");
  }

  if (status === "published" && !confirmPublish) {
    errors.push("Publishing requires explicit confirmation.");
  }

  const payload = {
    affiliate_cta_blocks: parseJson(
      textValue(formData, "affiliate_cta_blocks"),
      errors,
    ),
    ai_assisted: isChecked(formData, "ai_assisted"),
    author: nullableText(formData, "author"),
    body_markdown: nullableText(formData, "body_markdown"),
    content_type: parseContentType(textValue(formData, "content_type"), errors),
    excerpt: nullableText(formData, "excerpt"),
    human_reviewed: humanReviewed,
    primary_category_id: nullableText(formData, "primary_category_id"),
    published_at:
      status === "published"
        ? (existingPublishedAt ?? new Date().toISOString())
        : null,
    seo_description: nullableText(formData, "seo_description"),
    seo_title: nullableText(formData, "seo_title"),
    slug,
    status,
    subtitle: nullableText(formData, "subtitle"),
    title,
  } satisfies TablesInsert<"articles">;

  const relatedToolIds = [
    ...new Set(
      formData
        .getAll("related_tool_ids")
        .filter((value): value is string => typeof value === "string"),
    ),
  ];

  validatePublishChecklist(formData, payload, relatedToolIds, errors);

  return {
    errors,
    payload,
    relatedToolIds,
  };
}

function adminArticlesUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/articles?${query.toString()}`;
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("articles_slug_key") || message.includes("duplicate key")
  );
}

async function syncArticleTools(articleId: string, toolIds: string[]) {
  const { supabase } = await requireAdmin();

  const { error: deleteError } = await supabase
    .from("article_tools")
    .delete()
    .eq("article_id", articleId);

  if (deleteError) {
    throw new Error(`Article tool sync failed: ${deleteError.message}`);
  }

  if (!toolIds.length) {
    return;
  }

  const { error: insertError } = await supabase.from("article_tools").insert(
    toolIds.map((toolId, index) => ({
      article_id: articleId,
      relationship: "related",
      sort_order: (index + 1) * 10,
      tool_id: toolId,
    })),
  );

  if (insertError) {
    throw new Error(`Article tool assignment failed: ${insertError.message}`);
  }
}

function revalidateArticlePaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/guides");
  revalidatePath("/guides/[slug]", "page");
  revalidatePath(`/guides/${slug}`);
  revalidatePath("/comparisons");
  revalidatePath("/comparisons/[slug]", "page");
  revalidatePath(`/comparisons/${slug}`);
  revalidatePath("/categories");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath("/tools");
  revalidatePath("/tools/[slug]", "page");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/guides/${previousSlug}`);
    revalidatePath(`/comparisons/${previousSlug}`);
  }
}

function redirectForValidation(errors: string[]): never {
  if (errors.some((error) => error.includes("human-reviewed"))) {
    redirect(adminArticlesUrl({ error: "publish_requires_review" }));
  }

  if (errors.some((error) => error.includes("explicit confirmation"))) {
    redirect(adminArticlesUrl({ error: "publish_requires_confirmation" }));
  }

  if (errors.some((error) => error.includes("testing claims"))) {
    redirect(adminArticlesUrl({ error: "publish_testing_claims" }));
  }

  if (errors.some((error) => error.includes("Affiliate disclosure"))) {
    redirect(adminArticlesUrl({ error: "publish_affiliate_disclosure" }));
  }

  if (errors.some((error) => error.includes("best-for"))) {
    redirect(adminArticlesUrl({ error: "publish_fit_guidance" }));
  }

  if (errors.some((error) => error.includes("internal links"))) {
    redirect(adminArticlesUrl({ error: "publish_internal_links" }));
  }

  if (errors.some((error) => error.includes("last-checked"))) {
    redirect(adminArticlesUrl({ error: "publish_last_checked" }));
  }

  if (errors.some((error) => error.includes("checklist item"))) {
    redirect(adminArticlesUrl({ error: "publish_quality_checklist" }));
  }

  if (errors.some((error) => error.includes("valid JSON"))) {
    redirect(adminArticlesUrl({ error: "invalid_json" }));
  }

  redirect(adminArticlesUrl({ error: "invalid_article" }));
}

async function emitArticleEvent(
  articleId: string,
  articleSlug: string,
  status: ArticleStatus,
) {
  if (status === "published") {
    await emitAdminAnalyticsEvent("article_published", {
      article_id: articleId,
      article_slug: articleSlug,
    });
    return;
  }

  await emitAdminAnalyticsEvent("article_drafted", {
    article_id: articleId,
    article_slug: articleSlug,
  });
}

export async function createArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseArticleForm(formData);

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(result.payload)
    .select("id,slug,status")
    .single();

  if (error) {
    redirect(
      adminArticlesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  await syncArticleTools(data.id, result.relatedToolIds ?? []);
  revalidateArticlePaths(data.slug);
  await emitArticleEvent(data.id, data.slug, data.status);

  redirect(adminArticlesUrl({ status: "created" }));
}

export async function updateArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const previousSlug = textValue(formData, "previous_slug");
  const result = parseArticleForm(formData);

  if (!articleId) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { data, error } = await supabase
    .from("articles")
    .update(result.payload)
    .eq("id", articleId)
    .select("id,slug,status")
    .single();

  if (error) {
    redirect(
      adminArticlesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  await syncArticleTools(data.id, result.relatedToolIds ?? []);
  revalidateArticlePaths(data.slug, previousSlug);
  await emitArticleEvent(data.id, data.slug, data.status);

  redirect(adminArticlesUrl({ status: "updated" }));
}

export async function archiveArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const slug = textValue(formData, "slug");

  if (!articleId || !slug) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  const { error } = await supabase
    .from("articles")
    .update({
      published_at: null,
      status: "archived",
    })
    .eq("id", articleId);

  if (error) {
    redirect(adminArticlesUrl({ error: "archive_failed" }));
  }

  revalidateArticlePaths(slug);
  redirect(adminArticlesUrl({ status: "archived" }));
}

export async function acceptAiDraft(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const slug = textValue(formData, "slug");

  if (!articleId || !slug) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  const { error } = await supabase
    .from("articles")
    .update({
      human_reviewed: true,
      published_at: null,
      status: "review",
    })
    .eq("id", articleId)
    .eq("ai_assisted", true);

  if (error) {
    redirect(adminArticlesUrl({ error: "accept_failed" }));
  }

  revalidateArticlePaths(slug);
  redirect(adminArticlesUrl({ status: "accepted" }));
}

export async function rejectAiDraft(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const slug = textValue(formData, "slug");
  const feedback = textValue(formData, "feedback");

  if (!articleId || !slug) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  if (!feedback) {
    redirect(adminArticlesUrl({ error: "reject_feedback_required" }));
  }

  const { error } = await supabase
    .from("articles")
    .update({
      human_reviewed: false,
      published_at: null,
      status: "rejected",
    })
    .eq("id", articleId)
    .eq("ai_assisted", true);

  if (error) {
    redirect(adminArticlesUrl({ error: "reject_failed" }));
  }

  const { error: topicError } = await supabase
    .from("topic_queue")
    .update({
      feedback,
      status: "rejected",
    })
    .eq("slug", slug);

  if (topicError) {
    redirect(adminArticlesUrl({ error: "reject_topic_failed" }));
  }

  revalidateArticlePaths(slug);
  revalidatePath("/admin/topics");
  redirect(adminArticlesUrl({ status: "rejected" }));
}
