import "server-only";

import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Json, Tables } from "@/lib/database.types";

export type ArticleStatus = Enums<"article_status">;
export type ArticleContentType = Enums<"article_content_type">;

export type AdminArticleCategory = Pick<
  Tables<"categories">,
  "id" | "name" | "slug"
>;

export type AdminArticleTool = Pick<Tables<"tools">, "id" | "name" | "slug">;

export type AdminArticleListItem = Pick<
  Tables<"articles">,
  | "ai_assisted"
  | "content_type"
  | "human_reviewed"
  | "id"
  | "published_at"
  | "slug"
  | "status"
  | "title"
  | "updated_at"
> & {
  categoryName: string | null;
  relatedToolCount: number;
};

export type AdminArticleEditor = Tables<"articles"> & {
  relatedToolIds: string[];
};

export type AdminArticlePreview = Tables<"articles"> & {
  categoryName: string | null;
  relatedTools: AdminArticleTool[];
};

type ArticleToolRow = Pick<Tables<"article_tools">, "article_id" | "tool_id">;

export const articleStatusOptions: Array<{
  label: string;
  value: ArticleStatus;
}> = [
  { label: "Idea", value: "idea" },
  { label: "Draft", value: "draft" },
  { label: "Review", value: "review" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
  { label: "Rejected", value: "rejected" },
];

export const articleContentTypeOptions: Array<{
  label: string;
  value: ArticleContentType;
}> = [
  { label: "Guide", value: "guide" },
  { label: "Comparison", value: "comparison" },
  { label: "Tool review", value: "tool_review" },
  { label: "Category page", value: "category_page" },
  { label: "Stack finder", value: "stack_finder" },
  { label: "News", value: "news" },
];

export function formatArticleType(value: string) {
  return value.replaceAll("_", " ");
}

export function formatJsonForTextarea(value: Json) {
  return JSON.stringify(value, null, 2);
}

export async function getAdminArticleOptions() {
  const { supabase } = await requireAdmin();

  const [categoriesResult, toolsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug")
      .neq("status", "archived")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("tools")
      .select("id,name,slug")
      .neq("status", "archived")
      .order("name", { ascending: true }),
  ]);

  const firstError = [categoriesResult.error, toolsResult.error].find(Boolean);

  if (firstError) {
    throw new Error(
      `Admin article options query failed: ${firstError.message}`,
    );
  }

  return {
    categories: (categoriesResult.data ?? []) as AdminArticleCategory[],
    tools: (toolsResult.data ?? []) as AdminArticleTool[],
  };
}

export async function getAdminArticleList(): Promise<AdminArticleListItem[]> {
  const { supabase } = await requireAdmin();

  const [articlesResult, categoriesResult, articleToolsResult] =
    await Promise.all([
      supabase
        .from("articles")
        .select(
          "id,title,slug,status,content_type,primary_category_id,human_reviewed,ai_assisted,published_at,updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabase.from("categories").select("id,name,slug"),
      supabase.from("article_tools").select("article_id,tool_id"),
    ]);

  const firstError = [
    articlesResult.error,
    categoriesResult.error,
    articleToolsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Admin articles query failed: ${firstError.message}`);
  }

  const categoryById = new Map(
    ((categoriesResult.data ?? []) as AdminArticleCategory[]).map(
      (category) => [category.id, category],
    ),
  );
  const toolCountByArticleId = new Map<string, number>();

  ((articleToolsResult.data ?? []) as ArticleToolRow[]).forEach((row) => {
    toolCountByArticleId.set(
      row.article_id,
      (toolCountByArticleId.get(row.article_id) ?? 0) + 1,
    );
  });

  return ((articlesResult.data ?? []) as Tables<"articles">[]).map(
    (article) => ({
      ...article,
      categoryName: article.primary_category_id
        ? (categoryById.get(article.primary_category_id)?.name ?? null)
        : null,
      relatedToolCount: toolCountByArticleId.get(article.id) ?? 0,
    }),
  );
}

export async function getAdminArticleEditor(
  articleId: string,
): Promise<AdminArticleEditor | null> {
  const { supabase } = await requireAdmin();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .maybeSingle();

  if (articleError) {
    throw new Error(`Admin article query failed: ${articleError.message}`);
  }

  if (!article) {
    return null;
  }

  const { data: articleTools, error: articleToolsError } = await supabase
    .from("article_tools")
    .select("article_id,tool_id")
    .eq("article_id", article.id)
    .order("sort_order", { ascending: true });

  if (articleToolsError) {
    throw new Error(
      `Admin article tools query failed: ${articleToolsError.message}`,
    );
  }

  return {
    ...(article as Tables<"articles">),
    relatedToolIds: ((articleTools ?? []) as ArticleToolRow[]).map(
      (row) => row.tool_id,
    ),
  };
}

export async function getAdminArticlePreview(
  articleId: string,
): Promise<AdminArticlePreview | null> {
  const { supabase } = await requireAdmin();

  const article = await getAdminArticleEditor(articleId);

  if (!article) {
    return null;
  }

  const [categoryResult, toolsResult] = await Promise.all([
    article.primary_category_id
      ? supabase
          .from("categories")
          .select("id,name,slug")
          .eq("id", article.primary_category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    article.relatedToolIds.length
      ? supabase
          .from("tools")
          .select("id,name,slug")
          .in("id", article.relatedToolIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const firstError = [categoryResult.error, toolsResult.error].find(Boolean);

  if (firstError) {
    throw new Error(
      `Admin article preview query failed: ${firstError.message}`,
    );
  }

  const toolById = new Map(
    ((toolsResult.data ?? []) as AdminArticleTool[]).map((tool) => [
      tool.id,
      tool,
    ]),
  );

  return {
    ...article,
    categoryName:
      (categoryResult.data as AdminArticleCategory | null)?.name ?? null,
    relatedTools: article.relatedToolIds
      .map((toolId) => toolById.get(toolId))
      .filter((tool): tool is AdminArticleTool => Boolean(tool)),
  };
}
