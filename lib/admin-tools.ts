import "server-only";

import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Tables } from "@/lib/database.types";

export type ToolStatus = Enums<"tool_status">;
export type PricingModel = Enums<"pricing_model">;

export type AdminToolCategory = Pick<
  Tables<"categories">,
  "id" | "name" | "slug"
>;

export type AdminToolListItem = Pick<
  Tables<"tools">,
  | "id"
  | "name"
  | "slug"
  | "status"
  | "tagline"
  | "pricing_model"
  | "pricing_last_checked"
  | "updated_at"
> & {
  affiliateUrl: string | null;
  categories: AdminToolCategory[];
};

export type AdminToolEditor = Tables<"tools"> & {
  affiliateLinkId: string | null;
  affiliateUrl: string | null;
  categoryIds: string[];
};

type ToolCategoryRow = Pick<
  Tables<"tool_categories">,
  "category_id" | "sort_order" | "tool_id"
>;

type AffiliateLinkRow = Pick<
  Tables<"affiliate_links">,
  "destination_url" | "id" | "tool_id"
>;

export const pricingModelOptions: Array<{
  label: string;
  value: PricingModel;
}> = [
  { label: "Free", value: "free" },
  { label: "Freemium", value: "freemium" },
  { label: "Paid", value: "paid" },
  { label: "Usage-based", value: "usage_based" },
  { label: "Open source", value: "open_source" },
  { label: "Custom", value: "custom" },
  { label: "Unknown", value: "unknown" },
];

export const toolStatusOptions: Array<{ label: string; value: ToolStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export async function getAdminToolOptions() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Admin category options query failed: ${error.message}`);
  }

  return {
    categories: (data ?? []) as AdminToolCategory[],
  };
}

export async function getAdminToolList(): Promise<AdminToolListItem[]> {
  const { supabase } = await requireAdmin();

  const [toolsResult, categoriesResult, toolCategoriesResult, linksResult] =
    await Promise.all([
      supabase
        .from("tools")
        .select(
          "id,name,slug,status,tagline,pricing_model,pricing_last_checked,updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabase
        .from("categories")
        .select("id,name,slug")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("tool_categories")
        .select("tool_id,category_id,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("affiliate_links")
        .select("id,tool_id,destination_url")
        .not("tool_id", "is", null)
        .order("updated_at", { ascending: false }),
    ]);

  const firstError = [
    toolsResult.error,
    categoriesResult.error,
    toolCategoriesResult.error,
    linksResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Admin tools query failed: ${firstError.message}`);
  }

  const categoriesById = new Map(
    ((categoriesResult.data ?? []) as AdminToolCategory[]).map((category) => [
      category.id,
      category,
    ]),
  );
  const categoryIdsByToolId = new Map<string, string[]>();
  const affiliateUrlByToolId = new Map<string, string>();

  ((toolCategoriesResult.data ?? []) as ToolCategoryRow[]).forEach((row) => {
    const categoryIds = categoryIdsByToolId.get(row.tool_id) ?? [];
    categoryIds.push(row.category_id);
    categoryIdsByToolId.set(row.tool_id, categoryIds);
  });

  ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
    if (row.tool_id && !affiliateUrlByToolId.has(row.tool_id)) {
      affiliateUrlByToolId.set(row.tool_id, row.destination_url);
    }
  });

  return ((toolsResult.data ?? []) as Tables<"tools">[]).map((tool) => ({
    ...tool,
    affiliateUrl: affiliateUrlByToolId.get(tool.id) ?? null,
    categories: (categoryIdsByToolId.get(tool.id) ?? [])
      .map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is AdminToolCategory => Boolean(category)),
  }));
}

export async function getAdminToolEditor(
  toolId: string,
): Promise<AdminToolEditor | null> {
  const { supabase } = await requireAdmin();

  const { data: tool, error: toolError } = await supabase
    .from("tools")
    .select("*")
    .eq("id", toolId)
    .maybeSingle();

  if (toolError) {
    throw new Error(`Admin tool query failed: ${toolError.message}`);
  }

  if (!tool) {
    return null;
  }

  const [toolCategoriesResult, affiliateLinksResult] = await Promise.all([
    supabase
      .from("tool_categories")
      .select("tool_id,category_id,sort_order")
      .eq("tool_id", tool.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("affiliate_links")
      .select("id,tool_id,destination_url")
      .eq("tool_id", tool.id)
      .order("updated_at", { ascending: false })
      .limit(1),
  ]);

  const firstError = [
    toolCategoriesResult.error,
    affiliateLinksResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Admin tool related query failed: ${firstError.message}`);
  }

  const affiliateLink = (affiliateLinksResult.data ?? [])[0] as
    AffiliateLinkRow | undefined;

  return {
    ...(tool as Tables<"tools">),
    affiliateLinkId: affiliateLink?.id ?? null,
    affiliateUrl: affiliateLink?.destination_url ?? null,
    categoryIds: ((toolCategoriesResult.data ?? []) as ToolCategoryRow[]).map(
      (row) => row.category_id,
    ),
  };
}
