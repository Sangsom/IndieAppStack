import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveCategory, updateCategory } from "../../actions";
import { AdminCategoryForm } from "@/components/admin/admin-category-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import {
  getAdminCategoryEditor,
  getAdminCategoryOptions,
} from "@/lib/admin-categories";

type EditAdminCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminCategoryPage({
  params,
}: EditAdminCategoryPageProps) {
  const { id } = await params;
  const [category, parentOptions] = await Promise.all([
    getAdminCategoryEditor(id),
    getAdminCategoryOptions(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <AdminPageShell
      actions={
        <>
          {category.status === "published" ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              href={`/categories/${category.slug}`}
            >
              View public page
            </Link>
          ) : null}
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/categories"
          >
            Back to categories
          </Link>
        </>
      }
      description="Edit the taxonomy fields that control public category pages, filter labels, and sitemap entries."
      eyebrow="Category CRUD"
      title={`Edit ${category.name}`}
    >
      <AdminCategoryForm
        action={updateCategory}
        category={category}
        parentOptions={parentOptions}
        submitLabel="Save category"
      />

      <form
        action={archiveCategory}
        className="rounded-card border border-danger bg-surface p-5 shadow-field"
      >
        <input name="category_id" type="hidden" value={category.id} />
        <input name="slug" type="hidden" value={category.slug} />
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Archive category
        </h2>
        <p className="mt-2 max-w-2xl text-body-md text-muted">
          Archived categories disappear from public category pages and filters.
          Tool assignments remain available for admin recovery.
        </p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-button border border-danger px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-surface"
          type="submit"
        >
          Archive category
        </button>
      </form>
    </AdminPageShell>
  );
}
