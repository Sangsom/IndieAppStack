import "server-only";

import { cache } from "react";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type ToolRow = {
  alternatives: string[];
  app_stages: string[];
  best_for: string[];
  body_markdown: string | null;
  cons: string[];
  created_at: string;
  description: string | null;
  id: string;
  logo_url: string | null;
  name: string;
  noindex: boolean;
  not_good_for: string[];
  platforms: string[];
  pricing_last_checked: string | null;
  pricing_model: string;
  pricing_summary: string | null;
  pros: string[];
  published_at: string | null;
  slug: string;
  tagline: string | null;
  updated_at: string;
  website_url: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type AffiliateLinkRow = {
  disclosure_required: boolean;
  slug: string;
  status: string;
};

type ArticleToolRow = {
  article_id: string;
  relationship: string;
  sort_order: number;
};

type ArticleRow = {
  content_type: string;
  excerpt: string | null;
  id: string;
  published_at: string | null;
  slug: string;
  subtitle: string | null;
  title: string;
};

type AlternativeToolRow = {
  name: string;
  slug: string;
};

export type ToolDetailArticle = {
  description: string;
  href: string;
  label: string;
  title: string;
};

export type ToolDetailAlternative = {
  href?: string;
  name: string;
};

export type ToolDetail = {
  affiliateLink?: {
    disclosureRequired: boolean;
    href: string;
    slug: string;
  };
  alternatives: ToolDetailAlternative[];
  appStages: string[];
  bestFor: string[];
  bodyMarkdown: string | null;
  categories: CategoryRow[];
  cons: string[];
  description: string;
  id: string;
  lastChecked: string;
  logoUrl?: string;
  name: string;
  noindex: boolean;
  notGoodFor: string[];
  officialHref: string;
  platforms: string[];
  pricing: string;
  pricingModel: string;
  pros: string[];
  publishedAt: string;
  relatedComparisons: ToolDetailArticle[];
  relatedGuides: ToolDetailArticle[];
  slug: string;
  tagline: string;
  updatedAt: string;
  websiteUrl?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) {
    return "Not checked yet";
  }

  return dateFormatter.format(new Date(value));
}

function formatPricing(model: string, summary: string | null) {
  if (summary) {
    return summary;
  }

  const labels: Record<string, string> = {
    custom: "Custom pricing",
    free: "Free",
    freemium: "Free tier available",
    open_source: "Open source",
    paid: "Paid",
    unknown: "Pricing unknown",
    usage_based: "Usage-based pricing",
  };

  return labels[model] ?? model.replaceAll("_", " ");
}

function formatArticle(article: ArticleRow): ToolDetailArticle {
  return {
    description:
      article.excerpt ?? article.subtitle ?? "A related field guide entry.",
    href:
      article.content_type === "comparison"
        ? `/comparisons/${article.slug}`
        : `/guides/${article.slug}`,
    label: article.content_type.replaceAll("_", " "),
    title: article.title,
  };
}

export const getPublishedToolSlugs = cache(async () => {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const { data, error } = await createSupabaseServiceRoleClient()
    .from("tools")
    .select("slug")
    .eq("status", "published")
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Tool slugs query failed: ${error.message}`);
  }

  return (data ?? []).map((tool) => tool.slug);
});

export const getToolDetail = cache(
  async (slug: string): Promise<ToolDetail | null> => {
    if (!hasSupabaseServerConfig()) {
      return null;
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: tool, error: toolError } = await supabase
      .from("tools")
      .select(
        "id,name,slug,tagline,description,website_url,pricing_summary,pricing_model,best_for,not_good_for,platforms,app_stages,alternatives,pricing_last_checked,logo_url,published_at,created_at,updated_at,body_markdown,pros,cons,noindex",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (toolError) {
      throw new Error(`Tool detail query failed: ${toolError.message}`);
    }

    if (!tool) {
      return null;
    }

    const [
      toolCategoriesResult,
      affiliateLinksResult,
      articleToolsResult,
      alternativeToolsResult,
    ] = await Promise.all([
      supabase
        .from("tool_categories")
        .select("category_id,sort_order")
        .eq("tool_id", tool.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("affiliate_links")
        .select("slug,status,disclosure_required")
        .eq("tool_id", tool.id)
        .eq("status", "active")
        .limit(1),
      supabase
        .from("article_tools")
        .select("article_id,relationship,sort_order")
        .eq("tool_id", tool.id)
        .order("sort_order", { ascending: true }),
      tool.alternatives.length
        ? supabase
            .from("tools")
            .select("name,slug")
            .in("name", tool.alternatives)
            .eq("status", "published")
        : Promise.resolve({ data: [], error: null }),
    ]);

    const firstError = [
      toolCategoriesResult.error,
      affiliateLinksResult.error,
      articleToolsResult.error,
      alternativeToolsResult.error,
    ].find(Boolean);

    if (firstError) {
      throw new Error(
        `Tool detail related query failed: ${firstError.message}`,
      );
    }

    const categoryIds = (toolCategoriesResult.data ?? []).map(
      (row) => row.category_id,
    );
    const articleToolRows = (articleToolsResult.data ?? []) as ArticleToolRow[];
    const articleIds = articleToolRows.map((row) => row.article_id);

    const [categoriesResult, articlesResult] = await Promise.all([
      categoryIds.length
        ? supabase
            .from("categories")
            .select("id,name,slug")
            .in("id", categoryIds)
            .eq("status", "published")
        : Promise.resolve({ data: [], error: null }),
      articleIds.length
        ? supabase
            .from("articles")
            .select("id,title,slug,subtitle,excerpt,content_type,published_at")
            .in("id", articleIds)
            .eq("status", "published")
            .eq("human_reviewed", true)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const secondError = [categoriesResult.error, articlesResult.error].find(
      Boolean,
    );

    if (secondError) {
      throw new Error(
        `Tool detail content query failed: ${secondError.message}`,
      );
    }

    const categoriesById = new Map(
      ((categoriesResult.data ?? []) as CategoryRow[]).map((category) => [
        category.id,
        category,
      ]),
    );
    const categories = categoryIds
      .map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is CategoryRow => Boolean(category));
    const articlesById = new Map(
      ((articlesResult.data ?? []) as ArticleRow[]).map((article) => [
        article.id,
        article,
      ]),
    );
    const articles = articleToolRows
      .map((row) => articlesById.get(row.article_id))
      .filter((article): article is ArticleRow => Boolean(article));
    const alternativeToolByName = new Map(
      ((alternativeToolsResult.data ?? []) as AlternativeToolRow[]).map(
        (alternative) => [alternative.name, alternative],
      ),
    );
    const affiliateLink = (affiliateLinksResult.data ?? [])[0] as
      AffiliateLinkRow | undefined;

    const typedTool = tool as ToolRow;

    return {
      affiliateLink: affiliateLink
        ? {
            disclosureRequired: affiliateLink.disclosure_required,
            href: getAffiliateRedirectPath(affiliateLink.slug),
            slug: affiliateLink.slug,
          }
        : undefined,
      alternatives: typedTool.alternatives.map((name) => {
        const linkedTool = alternativeToolByName.get(name);

        return {
          href: linkedTool ? `/tools/${linkedTool.slug}` : undefined,
          name,
        };
      }),
      appStages: typedTool.app_stages,
      bestFor: typedTool.best_for,
      bodyMarkdown: typedTool.body_markdown,
      categories,
      cons: typedTool.cons,
      description:
        typedTool.description ??
        typedTool.tagline ??
        `${typedTool.name} is a tool for mobile app teams.`,
      id: typedTool.id,
      lastChecked: formatDate(typedTool.pricing_last_checked),
      logoUrl: typedTool.logo_url ?? undefined,
      name: typedTool.name,
      noindex: typedTool.noindex,
      notGoodFor: typedTool.not_good_for,
      officialHref: typedTool.website_url ?? "#",
      platforms: typedTool.platforms,
      pricing: formatPricing(
        typedTool.pricing_model,
        typedTool.pricing_summary,
      ),
      pricingModel: typedTool.pricing_model,
      pros: typedTool.pros,
      publishedAt: formatDate(typedTool.published_at),
      relatedComparisons: articles
        .filter((article) => article.content_type === "comparison")
        .map(formatArticle),
      relatedGuides: articles
        .filter((article) => article.content_type !== "comparison")
        .map(formatArticle),
      slug: typedTool.slug,
      tagline:
        typedTool.tagline ??
        typedTool.description ??
        `${typedTool.name} for mobile app teams.`,
      updatedAt: formatDate(typedTool.updated_at),
      websiteUrl: typedTool.website_url ?? undefined,
    };
  },
);
