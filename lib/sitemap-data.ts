import "server-only";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";

type SitemapContentRoute = {
  lastModified: Date;
  path: string;
};

type ToolSitemapRow = {
  noindex: boolean;
  pricing_last_checked: string | null;
  published_at: string | null;
  slug: string;
  updated_at: string;
};

type CategorySitemapRow = {
  created_at: string;
  slug: string;
  updated_at: string;
};

type ArticleSitemapRow = {
  content_type: "comparison" | "guide";
  published_at: string | null;
  slug: string;
  updated_at: string;
};

function latestDate(...values: Array<string | null | undefined>) {
  const timestamps = values
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter((value) => Number.isFinite(value));

  if (!timestamps.length) {
    return new Date();
  }

  return new Date(Math.max(...timestamps));
}

function latestRouteDate(routes: SitemapContentRoute[]) {
  if (!routes.length) {
    return new Date();
  }

  return new Date(
    Math.max(...routes.map((route) => route.lastModified.getTime())),
  );
}

export async function getSitemapContentRoutes() {
  if (!hasSupabaseServerConfig()) {
    return {
      categories: [],
      comparisons: [],
      guides: [],
      latestModified: new Date(),
      tools: [],
    };
  }

  const supabase = createSupabaseServiceRoleClient();

  const [toolsResult, categoriesResult, articlesResult] = await Promise.all([
    supabase
      .from("tools")
      .select("slug,updated_at,published_at,pricing_last_checked,noindex")
      .eq("status", "published")
      .eq("noindex", false)
      .order("slug", { ascending: true }),
    supabase
      .from("categories")
      .select("slug,updated_at,created_at")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    supabase
      .from("articles")
      .select("slug,content_type,updated_at,published_at")
      .eq("status", "published")
      .eq("human_reviewed", true)
      .in("content_type", ["comparison", "guide"])
      .order("slug", { ascending: true }),
  ]);

  const firstError = [
    toolsResult.error,
    categoriesResult.error,
    articlesResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Sitemap content query failed: ${firstError.message}`);
  }

  const tools = ((toolsResult.data ?? []) as ToolSitemapRow[]).map((tool) => ({
    lastModified: latestDate(
      tool.updated_at,
      tool.published_at,
      tool.pricing_last_checked,
    ),
    path: `/tools/${tool.slug}`,
  }));

  const categories = (
    (categoriesResult.data ?? []) as CategorySitemapRow[]
  ).map((category) => ({
    lastModified: latestDate(category.updated_at, category.created_at),
    path: `/categories/${category.slug}`,
  }));

  const articleRoutes = (
    (articlesResult.data ?? []) as ArticleSitemapRow[]
  ).map((article) => ({
    contentType: article.content_type,
    lastModified: latestDate(article.updated_at, article.published_at),
    path:
      article.content_type === "comparison"
        ? `/comparisons/${article.slug}`
        : `/guides/${article.slug}`,
  }));

  const comparisons = articleRoutes.filter(
    (route) => route.contentType === "comparison",
  );
  const guides = articleRoutes.filter((route) => route.contentType === "guide");
  const latestModified = latestRouteDate([
    ...tools,
    ...categories,
    ...comparisons,
    ...guides,
  ]);

  return {
    categories,
    comparisons,
    guides,
    latestModified,
    tools,
  };
}
