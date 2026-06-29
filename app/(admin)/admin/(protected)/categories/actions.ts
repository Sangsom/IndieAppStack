"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  categoryStatusOptions,
  defaultPrdCategories,
  type CategoryStatus,
} from "@/lib/admin-categories";
import { requireAdmin } from "@/lib/auth/admin";
import type { TablesInsert } from "@/lib/database.types";

type CategoryFormResult = {
  errors: string[];
  payload?: TablesInsert<"categories">;
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

function parseStatus(value: string, errors: string[]): CategoryStatus {
  const allowed = categoryStatusOptions.map((option) => option.value);

  if (allowed.includes(value as CategoryStatus)) {
    return value as CategoryStatus;
  }

  errors.push("Choose a valid status.");
  return "draft";
}

function parseSortOrder(value: string, errors: string[]) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    errors.push("Sort order must be a number.");
    return 0;
  }

  return parsed;
}

function parseCategoryForm(formData: FormData): CategoryFormResult {
  const errors: string[] = [];
  const name = textValue(formData, "name");
  const slug = textValue(formData, "slug").toLowerCase();
  const parentId = nullableText(formData, "parent_id");

  if (!name) {
    errors.push("Name is required.");
  }

  if (!slugPattern.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  }

  const payload = {
    description: nullableText(formData, "description"),
    name,
    parent_id: parentId,
    seo_description: nullableText(formData, "seo_description"),
    seo_title: nullableText(formData, "seo_title"),
    slug,
    sort_order: parseSortOrder(textValue(formData, "sort_order"), errors),
    status: parseStatus(textValue(formData, "status"), errors),
  } satisfies TablesInsert<"categories">;

  return {
    errors,
    payload,
  };
}

function adminCategoriesUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/categories?${query.toString()}`;
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("categories_slug_key") || message.includes("duplicate key")
  );
}

function revalidateCategoryPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/categories");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath(`/categories/${slug}`);
  revalidatePath("/tools");
  revalidatePath("/tools/[slug]", "page");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/categories/${previousSlug}`);
  }
}

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseCategoryForm(formData);

  if (result.errors.length || !result.payload) {
    redirect(adminCategoriesUrl({ error: "invalid_category" }));
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(result.payload)
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminCategoriesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  revalidateCategoryPaths(data.slug);
  redirect(adminCategoriesUrl({ status: "created" }));
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const categoryId = textValue(formData, "category_id");
  const previousSlug = textValue(formData, "previous_slug");
  const result = parseCategoryForm(formData);

  if (!categoryId) {
    redirect(adminCategoriesUrl({ error: "missing_category" }));
  }

  if (result.payload?.parent_id === categoryId) {
    redirect(adminCategoriesUrl({ error: "invalid_parent" }));
  }

  if (result.errors.length || !result.payload) {
    redirect(adminCategoriesUrl({ error: "invalid_category" }));
  }

  const { data, error } = await supabase
    .from("categories")
    .update(result.payload)
    .eq("id", categoryId)
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminCategoriesUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  revalidateCategoryPaths(data.slug, previousSlug);
  redirect(adminCategoriesUrl({ status: "updated" }));
}

export async function archiveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const categoryId = textValue(formData, "category_id");
  const slug = textValue(formData, "slug");

  if (!categoryId || !slug) {
    redirect(adminCategoriesUrl({ error: "missing_category" }));
  }

  const { error } = await supabase
    .from("categories")
    .update({
      status: "archived",
    })
    .eq("id", categoryId);

  if (error) {
    redirect(adminCategoriesUrl({ error: "archive_failed" }));
  }

  revalidateCategoryPaths(slug);
  redirect(adminCategoriesUrl({ status: "archived" }));
}

export async function ensureDefaultCategories() {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("categories").upsert(
    defaultPrdCategories.map((category) => ({
      description: category.description,
      name: category.name,
      seo_description: category.seoDescription,
      seo_title: category.seoTitle,
      slug: category.slug,
      sort_order: category.sortOrder,
      status: "published" as CategoryStatus,
    })),
    {
      onConflict: "slug",
    },
  );

  if (error) {
    redirect(adminCategoriesUrl({ error: "seed_failed" }));
  }

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/categories");
  revalidatePath("/tools");
  redirect(adminCategoriesUrl({ status: "defaults_seeded" }));
}
