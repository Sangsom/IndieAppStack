"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  affiliateLinkStatusOptions,
  type AffiliateLinkStatus,
} from "@/lib/admin-affiliate-links";
import { emitAdminAnalyticsEvent } from "@/lib/analytics/admin";
import { requireAdmin } from "@/lib/auth/admin";
import type { TablesInsert } from "@/lib/database.types";

type AffiliateLinkFormResult = {
  errors: string[];
  payload?: Omit<TablesInsert<"affiliate_links">, "slug"> & {
    slug: string | null;
  };
};

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

function parseUrl(value: string, errors: string[]) {
  if (!value) {
    errors.push("Destination URL is required.");
    return "";
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push("Destination URL must use http or https.");
      return "";
    }

    return url.toString();
  } catch {
    errors.push("Destination URL must be a valid URL.");
    return "";
  }
}

function parseStatus(value: string, errors: string[]): AffiliateLinkStatus {
  const allowed = affiliateLinkStatusOptions.map((option) => option.value);

  if (allowed.includes(value as AffiliateLinkStatus)) {
    return value as AffiliateLinkStatus;
  }

  errors.push("Choose a valid affiliate link status.");
  return "pending";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeSlug(value: string, errors: string[]) {
  const slug = slugify(value);

  if (!slug) {
    return null;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
    return null;
  }

  return slug;
}

function parseAffiliateLinkForm(formData: FormData): AffiliateLinkFormResult {
  const errors: string[] = [];
  const destinationUrl = parseUrl(
    textValue(formData, "destination_url"),
    errors,
  );
  const defaultRel = textValue(formData, "default_rel");

  if (!defaultRel) {
    errors.push("Default rel is required.");
  }

  const payload = {
    affiliate_program_id: nullableText(formData, "affiliate_program_id"),
    default_rel: defaultRel || "sponsored nofollow",
    destination_url: destinationUrl,
    disclosure_required: formData.get("disclosure_required") === "true",
    notes: nullableText(formData, "notes"),
    slug: normalizeSlug(textValue(formData, "slug"), errors),
    status: parseStatus(textValue(formData, "status"), errors),
    tool_id: nullableText(formData, "tool_id"),
  } satisfies Omit<TablesInsert<"affiliate_links">, "slug"> & {
    slug: string | null;
  };

  return { errors, payload };
}

function adminLinksUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/links?${query.toString()}`;
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("affiliate_links_slug_key") ||
    message.includes("duplicate key")
  );
}

function redirectForValidation(errors: string[]): never {
  if (errors.some((error) => error.includes("URL"))) {
    redirect(adminLinksUrl({ error: "invalid_url" }));
  }

  if (errors.some((error) => error.includes("Slug"))) {
    redirect(adminLinksUrl({ error: "invalid_slug" }));
  }

  redirect(adminLinksUrl({ error: "invalid_link" }));
}

async function buildGeneratedSlugBase(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  payload: NonNullable<AffiliateLinkFormResult["payload"]>,
) {
  if (payload.tool_id) {
    const { data } = await supabase
      .from("tools")
      .select("slug")
      .eq("id", payload.tool_id)
      .maybeSingle();

    if (data?.slug) {
      return data.slug;
    }
  }

  if (payload.affiliate_program_id) {
    const { data } = await supabase
      .from("affiliate_programs")
      .select("name")
      .eq("id", payload.affiliate_program_id)
      .maybeSingle();

    if (data?.name) {
      return data.name;
    }
  }

  return new URL(payload.destination_url).hostname.replace(/^www\./, "");
}

async function getUniqueGeneratedSlug(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  payload: NonNullable<AffiliateLinkFormResult["payload"]>,
) {
  const base = slugify(await buildGeneratedSlugBase(supabase, payload));

  if (!base) {
    return null;
  }

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`;
    const { data, error } = await supabase
      .from("affiliate_links")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(`Affiliate link slug lookup failed: ${error.message}`);
    }

    if (!data) {
      return candidate;
    }
  }

  return null;
}

function revalidateAffiliateSurfaces() {
  [
    "/",
    "/tools",
    "/categories",
    "/guides",
    "/admin/links",
    "/sitemap.xml",
  ].forEach((path) => revalidatePath(path));
}

export async function createAffiliateLink(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseAffiliateLinkForm(formData);

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const slug =
    result.payload.slug ??
    (await getUniqueGeneratedSlug(supabase, result.payload));

  if (!slug) {
    redirect(adminLinksUrl({ error: "invalid_slug" }));
  }

  const { data, error } = await supabase
    .from("affiliate_links")
    .insert({ ...result.payload, slug })
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminLinksUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  await emitAdminAnalyticsEvent("affiliate_link_created", {
    affiliate_link_id: data.id,
    affiliate_link_slug: data.slug,
  });

  revalidateAffiliateSurfaces();
  redirect(adminLinksUrl({ status: "created" }));
}

export async function updateAffiliateLink(formData: FormData) {
  const { supabase } = await requireAdmin();
  const linkId = textValue(formData, "link_id");
  const result = parseAffiliateLinkForm(formData);

  if (!linkId) {
    redirect(adminLinksUrl({ error: "missing_link" }));
  }

  if (result.errors.length || !result.payload || !result.payload.slug) {
    redirectForValidation(
      result.errors.length ? result.errors : ["Slug is required."],
    );
  }

  const { error } = await supabase
    .from("affiliate_links")
    .update({ ...result.payload, slug: result.payload.slug })
    .eq("id", linkId);

  if (error) {
    redirect(
      adminLinksUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  revalidateAffiliateSurfaces();
  redirect(adminLinksUrl({ status: "updated" }));
}
