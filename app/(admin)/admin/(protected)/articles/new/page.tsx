import Link from "next/link";

import { createArticle } from "../actions";
import { AdminArticleForm } from "@/components/admin/admin-article-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminArticleOptions } from "@/lib/admin-articles";

export default async function NewAdminArticlePage() {
  const { categories, tools } = await getAdminArticleOptions();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/articles"
        >
          Back to articles
        </Link>
      }
      description="Create a draft article. Publishing is blocked until the content is human-reviewed and explicitly confirmed."
      eyebrow="Article CRUD"
      title="New article"
    >
      <AdminArticleForm
        action={createArticle}
        categories={categories}
        submitLabel="Save article"
        tools={tools}
      />
    </AdminPageShell>
  );
}
