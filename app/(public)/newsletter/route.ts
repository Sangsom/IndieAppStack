import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_BUCKETS = new Map<
  string,
  { count: number; resetAt: number }
>();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textParam(value: FormDataEntryValue | null, maxLength = 160) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
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

function normalizeEmail(value: string) {
  return value.trim().toLowerCase().slice(0, 254);
}

function normalizeSource(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9:_/-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "unknown"
  );
}

function doubleOptInEnabled() {
  return process.env.NEWSLETTER_DOUBLE_OPT_IN === "true";
}

function redirectWithStatus(
  request: NextRequest,
  status: string,
  source: string,
) {
  const referer = headerValue(request, "referer", 1000);
  const fallback = new URL("/", request.url);
  const target = referer ? new URL(referer) : fallback;
  const origin = new URL(request.url).origin;

  if (target.origin !== origin) {
    target.href = fallback.href;
  }

  target.searchParams.set("newsletter", status);
  target.searchParams.set("newsletter_source", source);

  return NextResponse.redirect(target);
}

function emitNewsletterSignupEvent(properties: {
  duplicate: boolean;
  source: string;
  status: "active" | "pending";
}) {
  console.info("[analytics]", "newsletter_signup", properties);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const source = normalizeSource(textParam(formData.get("source")));

  if (checkRateLimit(request)) {
    return redirectWithStatus(request, "rate_limited", source);
  }

  const email = normalizeEmail(textParam(formData.get("email"), 254));

  if (!emailPattern.test(email)) {
    return redirectWithStatus(request, "invalid_email", source);
  }

  const now = new Date().toISOString();
  const requiresDoubleOptIn = doubleOptInEnabled();
  const status = requiresDoubleOptIn ? "pending" : "active";

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: existing, error: existingError } = await supabase
      .from("subscribers")
      .select("id,status,deleted_at,source")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing && !existing.deleted_at) {
      if (existing.status === "unsubscribed") {
        const { error: reactivateError } = await supabase
          .from("subscribers")
          .update({
            consent_at: now,
            double_opt_in: requiresDoubleOptIn,
            source: existing.source ?? source,
            status,
            unsubscribed_at: null,
          })
          .eq("id", existing.id);

        if (reactivateError) {
          throw reactivateError;
        }

        emitNewsletterSignupEvent({
          duplicate: false,
          source,
          status,
        });

        return redirectWithStatus(request, "subscribed", source);
      }

      emitNewsletterSignupEvent({
        duplicate: true,
        source,
        status: existing.status,
      });

      return redirectWithStatus(request, "already_subscribed", source);
    }

    const { error: insertError } = await supabase.from("subscribers").insert({
      consent_at: now,
      double_opt_in: requiresDoubleOptIn,
      email,
      source,
      status,
    });

    if (insertError) {
      throw insertError;
    }

    emitNewsletterSignupEvent({
      duplicate: false,
      source,
      status,
    });

    return redirectWithStatus(request, "subscribed", source);
  } catch (error) {
    console.error("[newsletter_signup_failed]", error);

    return redirectWithStatus(request, "unavailable", source);
  }
}
