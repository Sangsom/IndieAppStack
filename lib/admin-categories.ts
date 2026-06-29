import "server-only";

import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Tables } from "@/lib/database.types";

export type CategoryStatus = Enums<"category_status">;

export type AdminCategoryListItem = Tables<"categories"> & {
  parentName: string | null;
  toolCount: number;
};

export type AdminCategoryEditor = Tables<"categories">;

export type AdminCategoryOption = Pick<
  Tables<"categories">,
  "id" | "name" | "slug"
>;

type ToolCategoryRow = Pick<Tables<"tool_categories">, "category_id">;

export const categoryStatusOptions: Array<{
  label: string;
  value: CategoryStatus;
}> = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export const defaultPrdCategories = [
  {
    description:
      "Revenue, subscriptions, paywalls, and affiliate-friendly app business tools.",
    name: "Monetization",
    seoTitle: "Mobile App Monetization Tools",
    slug: "monetization",
    sortOrder: 10,
  },
  {
    description: "Paywall builders, subscription screens, and pricing tests.",
    name: "Paywalls",
    seoTitle: "Paywall Tools for Mobile Apps",
    slug: "paywalls",
    sortOrder: 20,
  },
  {
    description:
      "App Store Optimization research, metadata, and launch assets.",
    name: "ASO",
    seoTitle: "ASO Tools for Mobile Apps",
    slug: "aso",
    sortOrder: 30,
  },
  {
    description:
      "Privacy-conscious analytics, event tracking, and product insights.",
    name: "Analytics",
    seoTitle: "Analytics Tools for Mobile Apps",
    slug: "analytics",
    sortOrder: 40,
  },
  {
    description:
      "Crash reporting, diagnostics, and production issue monitoring.",
    name: "Crash Reporting",
    seoTitle: "Crash Reporting Tools for Mobile Apps",
    slug: "crash-reporting",
    sortOrder: 50,
  },
  {
    description:
      "Databases, auth, APIs, storage, and server infrastructure for mobile apps.",
    name: "Backend",
    seoTitle: "Backend Tools for Mobile Apps",
    slug: "backend",
    sortOrder: 60,
  },
  {
    description: "Push notification infrastructure and lifecycle messaging.",
    name: "Push",
    seoTitle: "Push Notification Tools for Mobile Apps",
    slug: "push",
    sortOrder: 70,
  },
  {
    description: "Landing page builders, launch pages, and waitlist sites.",
    name: "Landing Pages",
    seoTitle: "Landing Page Tools for Mobile Apps",
    slug: "landing-pages",
    sortOrder: 80,
  },
  {
    description: "Email capture, waitlists, newsletters, and lifecycle email.",
    name: "Email/Waitlists",
    seoTitle: "Email and Waitlist Tools for Mobile Apps",
    slug: "email-waitlists",
    sortOrder: 90,
  },
  {
    description:
      "App Store screenshots, preview assets, and visual listing tools.",
    name: "Screenshots",
    seoTitle: "App Screenshot Tools for Mobile Apps",
    slug: "screenshots",
    sortOrder: 100,
  },
  {
    description:
      "Developer productivity, release workflow, QA, and automation tools.",
    name: "Dev Productivity",
    seoTitle: "Developer Productivity Tools for Mobile Apps",
    slug: "dev-productivity",
    sortOrder: 110,
  },
] as const;

export async function getAdminCategoryOptions(excludeId?: string) {
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("categories")
    .select("id,name,slug")
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Admin category options query failed: ${error.message}`);
  }

  return (data ?? []) as AdminCategoryOption[];
}

export async function getAdminCategoryList(): Promise<AdminCategoryListItem[]> {
  const { supabase } = await requireAdmin();

  const [categoriesResult, toolCategoriesResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("tool_categories").select("category_id"),
  ]);

  const firstError = [categoriesResult.error, toolCategoriesResult.error].find(
    Boolean,
  );

  if (firstError) {
    throw new Error(`Admin categories query failed: ${firstError.message}`);
  }

  const categories = (categoriesResult.data ?? []) as Tables<"categories">[];
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const toolCountByCategoryId = new Map<string, number>();

  ((toolCategoriesResult.data ?? []) as ToolCategoryRow[]).forEach((row) => {
    toolCountByCategoryId.set(
      row.category_id,
      (toolCountByCategoryId.get(row.category_id) ?? 0) + 1,
    );
  });

  return categories.map((category) => ({
    ...category,
    parentName: category.parent_id
      ? (categoryById.get(category.parent_id)?.name ?? null)
      : null,
    toolCount: toolCountByCategoryId.get(category.id) ?? 0,
  }));
}

export async function getAdminCategoryEditor(
  categoryId: string,
): Promise<AdminCategoryEditor | null> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    throw new Error(`Admin category query failed: ${error.message}`);
  }

  return (data as AdminCategoryEditor | null) ?? null;
}
