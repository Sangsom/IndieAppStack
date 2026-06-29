"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emitAdminAnalyticsEvent } from "@/lib/analytics/admin";
import {
  articleContentTypeOptions,
  articleStatusOptions,
  type ArticleContentType,
  type ArticleStatus,
} from "@/lib/admin-articles";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json, TablesInsert } from "@/lib/database.types";

type ArticleFormResult = {
  errors: string[];
  payload?: TablesInsert<"articles">;
  relatedToolIds?: string[];
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

function isChecked(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function parseStatus(value: string, errors: string[]): ArticleStatus {
  const allowed = articleStatusOptions.map((option) => option.value);

  if (allowed.includes(value as ArticleStatus)) {
    return value as ArticleStatus;
  }

  errors.push("Choose a valid article status.");
  return "draft";
}

function parseContentType(value: string, errors: string[]): ArticleContentType {
  const allowed = articleContentTypeOptions.map((option) => option.value);

  if (allowed.includes(value as ArticleContentType)) {
    return value as ArticleContentType;
  }

  errors.push("Choose a valid content type.");
  return "guide";
}

function parseJson(value: string, errors: string[]): Json {
  if (!value.trim()) {
    return [];
  }

  try {
    return JSON.parse(value) as Json;
  } catch {
    errors.push("Affiliate CTA blocks must be valid JSON.");
    return [];
  }
}

function parseArticleForm(formData: FormData): ArticleFormResult {
  const errors: string[] = [];
  const title = textValue(formData, "title");
  const slug = textValue(formData, "slug").toLowerCase();
  const status = parseStatus(textValue(formData, "status"), errors);
  const humanReviewed = isChecked(formData, "human_reviewed");
  const confirmPublish = isChecked(formData, "confirm_publish");
  const existingPublishedAt = nullableText(formData, "published_at");

  if (!title) {
    errors.push("Title is required.");
  }

  if (!slugPattern.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  }

  if (status === "published" && !humanReviewed) {
    errors.push("Publishing requires the human-reviewed flag.");
  }

  if (status === "published" && !confirmPublish) {
    errors.push("Publishing requires explicit confirmation.");
  }

  const payload = {
    affiliate_cta_blocks: parseJson(
      textValue(formData, "affiliate_cta_blocks"),
      errors,
    ),
    ai_assisted: isChecked(formData, "ai_assisted"),
    author: nullableText(formData, "author"),
    body_markdown: nullableText(formData, "body_markdown"),
    content_type: parseContentType(textValue(formData, "content_type"), errors),
    excerpt: nullableText(formData, "excerpt"),
    human_reviewed: humanReviewed,
    primary_category_id: nullableText(formData, "primary_category_id"),
    published_at:
      status === "published"
        ? (existingPublishedAt ?? new Date().toISOString())
        : null,
    seo_description: nullableText(formData, "seo_description"),
    seo_title: nullableText(formData, "seo_title"),
    slug,
    status,
    subtitle: nullableText(formData, "subtitle"),
    title,
  } satisfies TablesInsert<"articles">;

  return {
    errors,
    payload,
    relatedToolIds: [
      ...new Set(
        formData
          .getAll("related_tool_ids")
          .filter((value): value is string => typeof value === "string"),
      ),
    ],
  };
}

function adminArticlesUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/articles?${query.toString()}`;
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("articles_slug_key") || message.includes("duplicate key")
  );
}

async function syncArticleTools(articleId: string, toolIds: string[]) {
  const { supabase } = await requireAdmin();

  const { error: deleteError } = await supabase
    .from("article_tools")
    .delete()
    .eq("article_id", articleId);

  if (deleteError) {
    throw new Error(`Article tool sync failed: ${deleteError.message}`);
  }

  if (!toolIds.length) {
    return;
  }

  const { error: insertError } = await supabase.from("article_tools").insert(
    toolIds.map((toolId, index) => ({
      article_id: articleId,
      relationship: "related",
      sort_order: (index + 1) * 10,
      tool_id: toolId,
    })),
  );

  if (insertError) {
    throw new Error(`Article tool assignment failed: ${insertError.message}`);
  }
}

function revalidateArticlePaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/guides");
  revalidatePath("/guides/[slug]", "page");
  revalidatePath(`/guides/${slug}`);
  revalidatePath("/categories");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath("/tools");
  revalidatePath("/tools/[slug]", "page");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/guides/${previousSlug}`);
  }
}

function redirectForValidation(errors: string[]): never {
  if (errors.some((error) => error.includes("human-reviewed"))) {
    redirect(adminArticlesUrl({ error: "publish_requires_review" }));
  }

  if (errors.some((error) => error.includes("explicit confirmation"))) {
    redirect(adminArticlesUrl({ error: "publish_requires_confirmation" }));
  }

  if (errors.some((error) => error.includes("valid JSON"))) {
    redirect(adminArticlesUrl({ error: "invalid_json" }));
  }

  redirect(adminArticlesUrl({ error: "invalid_article" }));
}

async function emitArticleEvent(
  articleId: string,
  articleSlug: string,
  status: ArticleStatus,
) {
  if (status === "published") {
    await emitAdminAnalyticsEvent("article_published", {
      article_id: articleId,
      article_slug: articleSlug,
    });
    return;
  }

  await emitAdminAnalyticsEvent("article_drafted", {
    article_id: articleId,
    article_slug: articleSlug,
  });
}

export async function createArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseArticleForm(formData);

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(result.payload)
    .select("id,slug,status")
    .single();

  if (error) {
    redirect(
      adminArticlesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  await syncArticleTools(data.id, result.relatedToolIds ?? []);
  revalidateArticlePaths(data.slug);
  await emitArticleEvent(data.id, data.slug, data.status);

  redirect(adminArticlesUrl({ status: "created" }));
}

export async function updateArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const previousSlug = textValue(formData, "previous_slug");
  const result = parseArticleForm(formData);

  if (!articleId) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { data, error } = await supabase
    .from("articles")
    .update(result.payload)
    .eq("id", articleId)
    .select("id,slug,status")
    .single();

  if (error) {
    redirect(
      adminArticlesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  await syncArticleTools(data.id, result.relatedToolIds ?? []);
  revalidateArticlePaths(data.slug, previousSlug);
  await emitArticleEvent(data.id, data.slug, data.status);

  redirect(adminArticlesUrl({ status: "updated" }));
}

export async function archiveArticle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const articleId = textValue(formData, "article_id");
  const slug = textValue(formData, "slug");

  if (!articleId || !slug) {
    redirect(adminArticlesUrl({ error: "missing_article" }));
  }

  const { error } = await supabase
    .from("articles")
    .update({
      published_at: null,
      status: "archived",
    })
    .eq("id", articleId);

  if (error) {
    redirect(adminArticlesUrl({ error: "archive_failed" }));
  }

  revalidateArticlePaths(slug);
  redirect(adminArticlesUrl({ status: "archived" }));
}
