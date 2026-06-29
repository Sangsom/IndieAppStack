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
      "Compare subscription, paywall, purchase, and revenue tooling for mobile apps that need to charge confidently from the first release.",
    name: "Monetization",
    seoDescription:
      "Compare mobile app monetization tools for subscriptions, paywalls, entitlements, revenue analytics, and pricing experiments.",
    seoTitle: "Mobile App Monetization Tools",
    slug: "monetization",
    sortOrder: 10,
  },
  {
    description:
      "Pick paywall builders and testing tools for mobile subscription flows, remote configuration, and pricing experiments.",
    name: "Paywalls",
    seoDescription:
      "Compare mobile paywall tools for subscription screens, remote config, A/B testing, and conversion analytics.",
    seoTitle: "Paywall Tools for Mobile Apps",
    slug: "paywalls",
    sortOrder: 20,
  },
  {
    description:
      "Research keywords, competitors, reviews, rankings, and creative assets that help mobile apps earn qualified store traffic.",
    name: "ASO",
    seoDescription:
      "Compare ASO tools for app keyword research, rankings, reviews, competitor tracking, and store listing optimization.",
    seoTitle: "ASO Tools for Mobile Apps",
    slug: "aso",
    sortOrder: 30,
  },
  {
    description:
      "Choose analytics tools that explain onboarding, retention, feature adoption, and revenue without burying indie teams in noise.",
    name: "Analytics",
    seoDescription:
      "Compare mobile analytics tools for event tracking, funnels, retention, privacy-friendly dashboards, and product decisions.",
    seoTitle: "Analytics Tools for Mobile Apps",
    slug: "analytics",
    sortOrder: 40,
  },
  {
    description:
      "Monitor crashes, errors, regressions, and production quality so releases stay trustworthy after app store approval.",
    name: "Crash Reporting",
    seoDescription:
      "Compare crash reporting and error monitoring tools for mobile apps, production diagnostics, alerts, and release quality.",
    seoTitle: "Crash Reporting Tools for Mobile Apps",
    slug: "crash-reporting",
    sortOrder: 50,
  },
  {
    description:
      "Find backend platforms for auth, databases, APIs, storage, server-side logic, and app data that needs to sync across devices.",
    name: "Backend",
    seoDescription:
      "Compare backend tools for mobile apps, including auth, databases, APIs, storage, serverless functions, and realtime data.",
    seoTitle: "Backend Tools for Mobile Apps",
    slug: "backend",
    sortOrder: 60,
  },
  {
    description:
      "Send push notifications and lifecycle messages that bring users back without turning your app into a notification machine.",
    name: "Push",
    seoDescription:
      "Compare push notification tools for mobile apps, lifecycle messaging, segmentation, in-app messages, and campaigns.",
    seoTitle: "Push Notification Tools for Mobile Apps",
    slug: "push",
    sortOrder: 70,
  },
  {
    description:
      "Plan launch pages, waitlists, newsletters, screenshots, and early distribution channels before and after app store release.",
    name: "Launch",
    seoDescription:
      "Compare launch tools for mobile apps, including landing pages, waitlists, newsletters, screenshots, and early marketing workflows.",
    seoTitle: "Mobile App Launch Tools",
    slug: "launch",
    sortOrder: 75,
  },
  {
    description:
      "Build launch pages, product websites, CMS pages, and waitlist funnels that explain the app before someone installs it.",
    name: "Landing Pages",
    seoDescription:
      "Compare landing page tools for mobile app launch pages, product sites, waitlists, forms, and CMS-backed marketing pages.",
    seoTitle: "Landing Page Tools for Mobile Apps",
    slug: "landing-pages",
    sortOrder: 80,
  },
  {
    description:
      "Capture early demand, send launch updates, and keep users warm with waitlists, newsletters, and simple lifecycle email.",
    name: "Email/Waitlists",
    seoDescription:
      "Compare email and waitlist tools for mobile app launches, newsletters, automations, signup forms, and audience growth.",
    seoTitle: "Email and Waitlist Tools for Mobile Apps",
    slug: "email-waitlists",
    sortOrder: 90,
  },
  {
    description:
      "Create app store screenshots, preview assets, localized captions, and visual listing updates that support ASO and launches.",
    name: "Screenshots",
    seoDescription:
      "Compare screenshot tools for App Store and Google Play images, device frames, localization, captions, and export workflows.",
    seoTitle: "App Screenshot Tools for Mobile Apps",
    slug: "screenshots",
    sortOrder: 100,
  },
  {
    description:
      "Automate mobile builds, releases, QA, performance checks, screenshots, and repetitive launch work as your app matures.",
    name: "Dev Productivity",
    seoDescription:
      "Compare developer productivity tools for mobile CI/CD, release automation, QA, app performance, and build workflows.",
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
