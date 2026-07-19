import "server-only";

import { cache } from "react";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";
import { singularizeNoun } from "@/lib/utils";

type CategoryRow = {
  description: string | null;
  id: string;
  name: string;
  slug: string;
};

type ToolRow = {
  best_for: string[];
  id: string;
  logo_url: string | null;
  name: string;
  platforms: string[];
  pricing_last_checked: string | null;
  pricing_model: string;
  pricing_summary: string | null;
  slug: string;
  tagline: string | null;
  website_url: string | null;
};

type AffiliateLinkRow = {
  slug: string;
  tool_id: string | null;
};

type ArticleRow = {
  content_type: string;
  excerpt: string | null;
  id: string;
  primary_category_id: string | null;
  published_at: string | null;
  slug: string;
  subtitle: string | null;
  title: string;
};

export type HomepageCategory = {
  description: string;
  href: string;
  id: string;
  name: string;
  toolCount: number;
};

export type HomepageTool = {
  affiliateHref?: string;
  bestFor: string[];
  category: string;
  detailsHref: string;
  lastChecked: string;
  logoUrl?: string;
  name: string;
  officialHref: string;
  platforms: string[];
  pricing: string;
  tagline: string;
};

export type HomepageArticle = {
  category: string;
  description: string;
  href: string;
  publishedAt: string;
  title: string;
};

export type HomepageData = {
  categories: HomepageCategory[];
  comparisons: HomepageArticle[];
  guides: HomepageArticle[];
  tools: HomepageTool[];
};

const emptyHomepageData: HomepageData = {
  categories: [],
  comparisons: [],
  guides: [],
  tools: [],
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) {
    return "recently";
  }

  return dateFormatter.format(new Date(value));
}

function formatPricing(
  row: Pick<ToolRow, "pricing_model" | "pricing_summary">,
) {
  if (row.pricing_summary) {
    return row.pricing_summary;
  }

  return row.pricing_model.replaceAll("_", " ");
}

function formatArticle(
  row: ArticleRow,
  categoryById: Map<string, CategoryRow>,
): HomepageArticle {
  const category = row.primary_category_id
    ? categoryById.get(row.primary_category_id)?.name
    : undefined;

  return {
    category: category ?? row.content_type.replaceAll("_", " "),
    description: row.excerpt ?? row.subtitle ?? "A practical field guide note.",
    href:
      row.content_type === "comparison"
        ? `/comparisons/${row.slug}`
        : `/guides/${row.slug}`,
    publishedAt: formatDate(row.published_at),
    title: row.title,
  };
}

export const getHomepageData = cache(async (): Promise<HomepageData> => {
  if (!hasSupabaseServerConfig()) {
    return emptyHomepageData;
  }

  const supabase = createSupabaseServiceRoleClient();

  const [
    categoriesResult,
    toolsResult,
    toolCategoriesResult,
    affiliateLinksResult,
    guidesResult,
    comparisonsResult,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug,description")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(4),
    supabase
      .from("tools")
      .select(
        "id,name,slug,tagline,website_url,pricing_summary,pricing_model,best_for,platforms,pricing_last_checked,logo_url",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3),
    supabase
      .from("tool_categories")
      .select("tool_id,category_id,sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("affiliate_links")
      .select("tool_id,slug")
      .eq("status", "active"),
    supabase
      .from("articles")
      .select(
        "id,title,slug,subtitle,excerpt,content_type,primary_category_id,published_at",
      )
      .eq("status", "published")
      .eq("human_reviewed", true)
      .eq("content_type", "guide")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3),
    supabase
      .from("articles")
      .select(
        "id,title,slug,subtitle,excerpt,content_type,primary_category_id,published_at",
      )
      .eq("status", "published")
      .eq("human_reviewed", true)
      .eq("content_type", "comparison")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3),
  ]);

  const firstError = [
    categoriesResult.error,
    toolsResult.error,
    toolCategoriesResult.error,
    affiliateLinksResult.error,
    guidesResult.error,
    comparisonsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Homepage data query failed: ${firstError.message}`);
  }

  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const toolCategoryRows = toolCategoriesResult.data ?? [];

  const toolCountByCategoryId = new Map<string, number>();
  const categoryIdByToolId = new Map<string, string>();
  const affiliateHrefByToolId = new Map<string, string>();

  toolCategoryRows.forEach((row) => {
    toolCountByCategoryId.set(
      row.category_id,
      (toolCountByCategoryId.get(row.category_id) ?? 0) + 1,
    );

    if (!categoryIdByToolId.has(row.tool_id)) {
      categoryIdByToolId.set(row.tool_id, row.category_id);
    }
  });

  ((affiliateLinksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
    if (row.tool_id && !affiliateHrefByToolId.has(row.tool_id)) {
      affiliateHrefByToolId.set(
        row.tool_id,
        getAffiliateRedirectPath(row.slug),
      );
    }
  });

  return {
    categories: categories.map((category) => ({
      description:
        category.description ??
        "Practical recommendations for choosing better app tools.",
      href: `/categories/${category.slug}`,
      id: category.id,
      name: category.name,
      toolCount: toolCountByCategoryId.get(category.id) ?? 0,
    })),
    comparisons: ((comparisonsResult.data ?? []) as ArticleRow[]).map((row) =>
      formatArticle(row, categoryById),
    ),
    guides: ((guidesResult.data ?? []) as ArticleRow[]).map((row) =>
      formatArticle(row, categoryById),
    ),
    tools: ((toolsResult.data ?? []) as ToolRow[]).map((tool) => {
      const categoryId = categoryIdByToolId.get(tool.id);
      const category = categoryId ? categoryById.get(categoryId) : undefined;
      const monetization = categoryBySlug.get("monetization");

      return {
        affiliateHref: affiliateHrefByToolId.get(tool.id),
        bestFor: tool.best_for.length
          ? tool.best_for.slice(0, 3)
          : ["Mobile app teams"],
        category: category?.name ?? "App tool",
        detailsHref: `/tools/${tool.slug}`,
        lastChecked: formatDate(tool.pricing_last_checked),
        logoUrl: tool.logo_url ?? undefined,
        name: tool.name,
        officialHref: tool.website_url ?? `/tools/${tool.slug}`,
        platforms: tool.platforms.length
          ? tool.platforms.slice(0, 4)
          : ["Mobile"],
        pricing: formatPricing(tool),
        tagline:
          tool.tagline ??
          `A practical ${singularizeNoun(
            category?.name ?? monetization?.name ?? "mobile app",
          ).toLowerCase()} tool.`,
      };
    }),
  };
});
