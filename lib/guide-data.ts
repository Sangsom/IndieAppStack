import "server-only";

import { cache } from "react";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type ArticleRow = {
  author: string | null;
  body_markdown: string | null;
  content_type: string;
  excerpt: string | null;
  id: string;
  primary_category_id: string | null;
  published_at: string | null;
  seo_description: string | null;
  seo_title: string | null;
  slug: string;
  subtitle: string | null;
  title: string;
  updated_at: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type ArticleToolRow = {
  article_id: string;
  relationship: string;
  sort_order: number;
  tool_id: string;
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

export type GuideListItem = {
  category: string;
  description: string;
  href: string;
  label: string;
  publishedAt: string;
  title: string;
};

export type GuideTool = {
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

export type GuideDetail = {
  author: string;
  bodyMarkdown: string;
  category: string;
  description: string;
  hasAffiliateDisclosure: boolean;
  id: string;
  label: string;
  metaDescription: string;
  metaTitle: string;
  publishedAt: string;
  publishedAtIso: string | null;
  relatedTools: GuideTool[];
  slug: string;
  subtitle: string;
  title: string;
  updatedAt: string;
  updatedAtIso: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) {
    return "Unpublished";
  }

  return dateFormatter.format(new Date(value));
}

function formatShortDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatType(value: string) {
  return value.replaceAll("_", " ");
}

function formatPricing(model: string, summary: string | null) {
  if (summary) {
    return summary;
  }

  return model.replaceAll("_", " ");
}

function listItem(article: ArticleRow, categoryById: Map<string, CategoryRow>) {
  const category = article.primary_category_id
    ? categoryById.get(article.primary_category_id)?.name
    : undefined;

  return {
    category: category ?? formatType(article.content_type),
    description:
      article.excerpt ?? article.subtitle ?? "A practical field guide article.",
    href: `/guides/${article.slug}`,
    label: formatType(article.content_type),
    publishedAt: formatShortDate(article.published_at),
    title: article.title,
  };
}

export const getGuideList = cache(async (): Promise<GuideListItem[]> => {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const supabase = createSupabaseServiceRoleClient();

  const [articlesResult, categoriesResult] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "id,title,slug,subtitle,excerpt,content_type,primary_category_id,published_at,seo_title,seo_description,author,body_markdown,updated_at",
      )
      .eq("status", "published")
      .eq("human_reviewed", true)
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase
      .from("categories")
      .select("id,name,slug")
      .eq("status", "published"),
  ]);

  const firstError = [articlesResult.error, categoriesResult.error].find(
    Boolean,
  );

  if (firstError) {
    throw new Error(`Guide listing query failed: ${firstError.message}`);
  }

  const categories = new Map(
    ((categoriesResult.data ?? []) as CategoryRow[]).map((category) => [
      category.id,
      category,
    ]),
  );

  return ((articlesResult.data ?? []) as ArticleRow[]).map((article) =>
    listItem(article, categories),
  );
});

export const getPublishedGuideSlugs = cache(async () => {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const { data, error } = await createSupabaseServiceRoleClient()
    .from("articles")
    .select("slug")
    .eq("status", "published")
    .eq("human_reviewed", true)
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Guide slugs query failed: ${error.message}`);
  }

  return (data ?? []).map((article) => article.slug);
});

export const getGuideDetail = cache(
  async (slug: string): Promise<GuideDetail | null> => {
    if (!hasSupabaseServerConfig()) {
      return null;
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select(
        "id,title,slug,subtitle,excerpt,body_markdown,author,content_type,primary_category_id,published_at,updated_at,seo_title,seo_description",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .eq("human_reviewed", true)
      .maybeSingle();

    if (articleError) {
      throw new Error(`Guide detail query failed: ${articleError.message}`);
    }

    if (!article) {
      return null;
    }

    const [categoriesResult, articleToolsResult] = await Promise.all([
      article.primary_category_id
        ? supabase
            .from("categories")
            .select("id,name,slug")
            .eq("id", article.primary_category_id)
            .eq("status", "published")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("article_tools")
        .select("article_id,tool_id,relationship,sort_order")
        .eq("article_id", article.id)
        .order("sort_order", { ascending: true }),
    ]);

    const firstError = [categoriesResult.error, articleToolsResult.error].find(
      Boolean,
    );

    if (firstError) {
      throw new Error(`Guide related query failed: ${firstError.message}`);
    }

    const articleToolRows = (articleToolsResult.data ?? []) as ArticleToolRow[];
    const toolIds = articleToolRows.map((row) => row.tool_id);

    const [toolsResult, linksResult] = await Promise.all([
      toolIds.length
        ? supabase
            .from("tools")
            .select(
              "id,name,slug,tagline,website_url,pricing_summary,pricing_model,best_for,platforms,pricing_last_checked,logo_url",
            )
            .in("id", toolIds)
            .eq("status", "published")
        : Promise.resolve({ data: [], error: null }),
      toolIds.length
        ? supabase
            .from("affiliate_links")
            .select("tool_id,slug")
            .in("tool_id", toolIds)
            .in("status", ["active", "pending"])
        : Promise.resolve({ data: [], error: null }),
    ]);

    const secondError = [toolsResult.error, linksResult.error].find(Boolean);

    if (secondError) {
      throw new Error(`Guide tools query failed: ${secondError.message}`);
    }

    const toolById = new Map(
      ((toolsResult.data ?? []) as ToolRow[]).map((tool) => [tool.id, tool]),
    );
    const affiliateHrefByToolId = new Map<string, string>();

    ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
      if (row.tool_id && !affiliateHrefByToolId.has(row.tool_id)) {
        affiliateHrefByToolId.set(
          row.tool_id,
          getAffiliateRedirectPath(row.slug),
        );
      }
    });

    const typedArticle = article as ArticleRow;
    const category = categoriesResult.data as CategoryRow | null;
    const relatedTools = articleToolRows
      .map((row) => toolById.get(row.tool_id))
      .filter((tool): tool is ToolRow => Boolean(tool))
      .map((tool) => ({
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
        platforms: tool.platforms.length ? tool.platforms : ["Mobile"],
        pricing: formatPricing(tool.pricing_model, tool.pricing_summary),
        tagline: tool.tagline ?? `${tool.name} for mobile app teams.`,
      }));

    return {
      author: typedArticle.author ?? "IndieAppStack",
      bodyMarkdown:
        typedArticle.body_markdown ??
        `## Summary\n${typedArticle.excerpt ?? typedArticle.subtitle ?? typedArticle.title}`,
      category: category?.name ?? formatType(typedArticle.content_type),
      description:
        typedArticle.excerpt ??
        typedArticle.subtitle ??
        "A practical IndieAppStack field guide.",
      hasAffiliateDisclosure: relatedTools.some((tool) => tool.affiliateHref),
      id: typedArticle.id,
      label: formatType(typedArticle.content_type),
      metaDescription:
        typedArticle.seo_description ??
        typedArticle.excerpt ??
        typedArticle.subtitle ??
        "A practical IndieAppStack field guide.",
      metaTitle: typedArticle.seo_title ?? typedArticle.title,
      publishedAt: formatDate(typedArticle.published_at),
      publishedAtIso: typedArticle.published_at,
      relatedTools,
      slug: typedArticle.slug,
      subtitle: typedArticle.subtitle ?? typedArticle.excerpt ?? "",
      title: typedArticle.title,
      updatedAt: formatDate(typedArticle.updated_at),
      updatedAtIso: typedArticle.updated_at,
    };
  },
);
