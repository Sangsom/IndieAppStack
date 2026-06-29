import Link from "next/link";

import { createCategory } from "../actions";
import { AdminCategoryForm } from "@/components/admin/admin-category-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminCategoryOptions } from "@/lib/admin-categories";

export default async function NewAdminCategoryPage() {
  const parentOptions = await getAdminCategoryOptions();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/categories"
        >
          Back to categories
        </Link>
      }
      description="Create a taxonomy entry for public category pages and tool directory filters."
      eyebrow="Category CRUD"
      title="New category"
    >
      <AdminCategoryForm
        action={createCategory}
        parentOptions={parentOptions}
        submitLabel="Create category"
      />
    </AdminPageShell>
  );
}
