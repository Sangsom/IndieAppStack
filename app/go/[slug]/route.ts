import { NextResponse, type NextRequest } from "next/server";

import type { Json, TablesInsert } from "@/lib/database.types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_BUCKETS = new Map<
  string,
  { count: number; resetAt: number }
>();

const sourceTypes = new Set([
  "article",
  "tool",
  "category",
  "comparison",
  "quiz",
  "newsletter",
]);

type AffiliateRedirectRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function textParam(value: string | null, maxLength = 120) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function headerValue(request: NextRequest, name: string, maxLength = 500) {
  return textParam(request.headers.get(name), maxLength);
}

function getClientIp(request: NextRequest) {
  const forwardedFor = headerValue(request, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headerValue(request, "x-real-ip") ?? "unknown";
}

function checkRateLimit(request: NextRequest, slug: string) {
  const now = Date.now();
  const key = `${getClientIp(request)}:${slug}`;
  const bucket = RATE_LIMIT_BUCKETS.get(key);

  if (!bucket || bucket.resetAt <= now) {
    RATE_LIMIT_BUCKETS.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return null;
  }

  bucket.count += 1;

  if (bucket.count <= RATE_LIMIT_MAX_REQUESTS) {
    return null;
  }

  return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

function parseDeviceType(userAgent: string | null) {
  if (!userAgent) {
    return "unknown";
  }

  if (/bot|crawler|spider|crawling/i.test(userAgent)) {
    return "bot";
  }

  if (/mobile|iphone|android/i.test(userAgent)) {
    return "mobile";
  }

  if (/ipad|tablet/i.test(userAgent)) {
    return "tablet";
  }

  return "desktop";
}

function buildClickMetadata(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAgent = headerValue(request, "user-agent");
  const sourceType = textParam(
    searchParams.get("source_type") ?? searchParams.get("type"),
  );

  return {
    device_type: parseDeviceType(userAgent),
    placement: textParam(searchParams.get("placement")),
    source_page: textParam(searchParams.get("page"), 240),
    source_type: sourceType && sourceTypes.has(sourceType) ? sourceType : null,
    utm_campaign: textParam(searchParams.get("utm_campaign")),
    utm_content: textParam(searchParams.get("utm_content")),
    utm_medium: textParam(searchParams.get("utm_medium")),
    utm_source: textParam(searchParams.get("utm_source")),
    utm_term: textParam(searchParams.get("utm_term")),
  } satisfies Json;
}

async function logClickEvent(
  request: NextRequest,
  link: {
    id: string;
    tool_id: string | null;
  },
) {
  const supabase = createSupabaseServiceRoleClient();
  const searchParams = request.nextUrl.searchParams;
  const userAgent = headerValue(request, "user-agent");

  const payload = {
    affiliate_link_id: link.id,
    metadata: buildClickMetadata(request),
    referrer: headerValue(request, "referer", 1_000),
    source: textParam(
      searchParams.get("source") ?? searchParams.get("utm_source"),
    ),
    tool_id: link.tool_id,
    user_agent: userAgent,
  } satisfies TablesInsert<"click_events">;

  const { error } = await supabase.from("click_events").insert(payload);

  if (error) {
    console.warn("[affiliate_click_logging_failed]", error.message);
  }
}

export async function GET(
  request: NextRequest,
  { params }: AffiliateRedirectRouteContext,
) {
  const { slug } = await params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return new Response("Affiliate link not found.", { status: 404 });
  }

  const retryAfterSeconds = checkRateLimit(request, slug);

  if (retryAfterSeconds) {
    return new Response("Too many redirect requests.", {
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
      status: 429,
    });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: link, error } = await supabase
    .from("affiliate_links")
    .select("id,destination_url,status,tool_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !link || link.status !== "active") {
    return new Response("Affiliate link not found.", { status: 404 });
  }

  await logClickEvent(request, link);

  return NextResponse.redirect(link.destination_url, 302);
}
