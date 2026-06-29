"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emitAdminAnalyticsEvent } from "@/lib/analytics/admin";
import {
  pricingModelOptions,
  toolStatusOptions,
  type PricingModel,
  type ToolStatus,
} from "@/lib/admin-tools";
import { requireAdmin } from "@/lib/auth/admin";
import type { TablesInsert } from "@/lib/database.types";

type ToolFormResult = {
  errors: string[];
  payload?: TablesInsert<"tools">;
  categoryIds?: string[];
  affiliateUrl?: string | null;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function splitList(value: string) {
  return [
    ...new Set(
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function parseUrl(value: string | null, label: string, errors: string[]) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${label} must use http or https.`);
      return null;
    }

    return url.toString();
  } catch {
    errors.push(`${label} must be a valid URL.`);
    return null;
  }
}

function parsePricingModel(value: string, errors: string[]): PricingModel {
  const allowed = pricingModelOptions.map((option) => option.value);

  if (allowed.includes(value as PricingModel)) {
    return value as PricingModel;
  }

  errors.push("Choose a valid pricing model.");
  return "unknown";
}

function parseStatus(value: string, errors: string[]): ToolStatus {
  const allowed = toolStatusOptions.map((option) => option.value);

  if (allowed.includes(value as ToolStatus)) {
    return value as ToolStatus;
  }

  errors.push("Choose a valid status.");
  return "draft";
}

function parseDate(value: string | null, errors: string[]) {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors.push("Last checked date must use YYYY-MM-DD.");
    return null;
  }

  return value;
}

function parseToolForm(formData: FormData): ToolFormResult {
  const errors: string[] = [];
  const name = textValue(formData, "name");
  const slug = textValue(formData, "slug").toLowerCase();
  const websiteUrl = parseUrl(
    nullableText(formData, "website_url"),
    "Website URL",
    errors,
  );
  const logoUrl = parseUrl(
    nullableText(formData, "logo_url"),
    "Logo URL",
    errors,
  );
  const affiliateUrl = parseUrl(
    nullableText(formData, "affiliate_url"),
    "Affiliate URL",
    errors,
  );
  const pricingLastChecked = parseDate(
    nullableText(formData, "pricing_last_checked"),
    errors,
  );
  const status = parseStatus(textValue(formData, "status"), errors);

  if (!name) {
    errors.push("Name is required.");
  }

  if (!slugPattern.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  }

  const payload = {
    alternatives: splitList(textValue(formData, "alternatives")),
    app_stages: splitList(textValue(formData, "app_stages")),
    best_for: splitList(textValue(formData, "best_for")),
    description: nullableText(formData, "description"),
    internal_notes: nullableText(formData, "internal_notes"),
    logo_url: logoUrl,
    name,
    not_good_for: splitList(textValue(formData, "not_good_for")),
    platforms: splitList(textValue(formData, "platforms")),
    pricing_last_checked: pricingLastChecked,
    pricing_model: parsePricingModel(
      textValue(formData, "pricing_model"),
      errors,
    ),
    pricing_summary: nullableText(formData, "pricing_summary"),
    published_at:
      status === "published"
        ? (nullableText(formData, "published_at") ?? new Date().toISOString())
        : null,
    slug,
    status,
    tagline: nullableText(formData, "tagline"),
    website_url: websiteUrl,
  } satisfies TablesInsert<"tools">;

  return {
    affiliateUrl,
    categoryIds: formData
      .getAll("category_ids")
      .filter((value): value is string => typeof value === "string"),
    errors,
    payload,
  };
}

function adminToolsUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/tools?${query.toString()}`;
}

async function syncToolCategories(toolId: string, categoryIds: string[]) {
  const { supabase } = await requireAdmin();

  const { error: deleteError } = await supabase
    .from("tool_categories")
    .delete()
    .eq("tool_id", toolId);

  if (deleteError) {
    throw new Error(`Category sync failed: ${deleteError.message}`);
  }

  if (!categoryIds.length) {
    return;
  }

  const { error: insertError } = await supabase.from("tool_categories").insert(
    categoryIds.map((categoryId, index) => ({
      category_id: categoryId,
      sort_order: (index + 1) * 10,
      tool_id: toolId,
    })),
  );

  if (insertError) {
    throw new Error(`Category assignment failed: ${insertError.message}`);
  }
}

async function syncAffiliateLink(
  toolId: string,
  slug: string,
  affiliateUrl: string | null,
) {
  const { supabase } = await requireAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("affiliate_links")
    .select("id,status")
    .eq("tool_id", toolId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Affiliate link lookup failed: ${existingError.message}`);
  }

  if (!affiliateUrl) {
    if (existing) {
      const { error } = await supabase
        .from("affiliate_links")
        .update({
          status: "inactive",
        })
        .eq("id", existing.id);

      if (error) {
        throw new Error(`Affiliate link archive failed: ${error.message}`);
      }
    }

    return;
  }

  if (existing) {
    const { error } = await supabase
      .from("affiliate_links")
      .update({
        destination_url: affiliateUrl,
        slug,
        status: existing.status === "broken" ? "pending" : existing.status,
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Affiliate link update failed: ${error.message}`);
    }

    return;
  }

  const { error } = await supabase.from("affiliate_links").insert({
    default_rel: "sponsored nofollow",
    destination_url: affiliateUrl,
    disclosure_required: true,
    slug,
    status: "pending",
    tool_id: toolId,
  });

  if (error) {
    throw new Error(`Affiliate link create failed: ${error.message}`);
  }
}

function revalidateToolPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/tools");
  revalidatePath("/tools/[slug]", "page");
  revalidatePath(`/tools/${slug}`);
  revalidatePath("/categories");
  revalidatePath("/categories/[slug]", "page");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/tools/${previousSlug}`);
  }
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("tools_slug_key") || message.includes("duplicate key")
  );
}

export async function createTool(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseToolForm(formData);

  if (result.errors.length || !result.payload) {
    redirect(adminToolsUrl({ error: "invalid_tool" }));
  }

  const { data, error } = await supabase
    .from("tools")
    .insert(result.payload)
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminToolsUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  await syncToolCategories(data.id, result.categoryIds ?? []);
  await syncAffiliateLink(data.id, data.slug, result.affiliateUrl ?? null);
  revalidateToolPaths(data.slug);
  await emitAdminAnalyticsEvent("tool_created", {
    tool_id: data.id,
    tool_slug: data.slug,
  });

  redirect(adminToolsUrl({ status: "created" }));
}

export async function updateTool(formData: FormData) {
  const { supabase } = await requireAdmin();
  const toolId = textValue(formData, "tool_id");
  const previousSlug = textValue(formData, "previous_slug");
  const result = parseToolForm(formData);

  if (!toolId) {
    redirect(adminToolsUrl({ error: "missing_tool" }));
  }

  if (result.errors.length || !result.payload) {
    redirect(adminToolsUrl({ error: "invalid_tool" }));
  }

  const { data, error } = await supabase
    .from("tools")
    .update(result.payload)
    .eq("id", toolId)
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminToolsUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  await syncToolCategories(data.id, result.categoryIds ?? []);
  await syncAffiliateLink(data.id, data.slug, result.affiliateUrl ?? null);
  revalidateToolPaths(data.slug, previousSlug);
  await emitAdminAnalyticsEvent("tool_updated", {
    tool_id: data.id,
    tool_slug: data.slug,
    update_type: "save",
  });

  redirect(adminToolsUrl({ status: "updated" }));
}

export async function archiveTool(formData: FormData) {
  const { supabase } = await requireAdmin();
  const toolId = textValue(formData, "tool_id");
  const slug = textValue(formData, "slug");

  if (!toolId || !slug) {
    redirect(adminToolsUrl({ error: "missing_tool" }));
  }

  const { error } = await supabase
    .from("tools")
    .update({
      published_at: null,
      status: "archived",
    })
    .eq("id", toolId);

  if (error) {
    redirect(adminToolsUrl({ error: "archive_failed" }));
  }

  revalidateToolPaths(slug);
  await emitAdminAnalyticsEvent("tool_updated", {
    tool_id: toolId,
    tool_slug: slug,
    update_type: "archive",
  });

  redirect(adminToolsUrl({ status: "archived" }));
}
