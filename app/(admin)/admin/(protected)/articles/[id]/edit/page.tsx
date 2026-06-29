import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveArticle, updateArticle } from "../../actions";
import { AdminArticleForm } from "@/components/admin/admin-article-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import {
  getAdminArticleEditor,
  getAdminArticleOptions,
} from "@/lib/admin-articles";

type EditAdminArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminArticlePage({
  params,
}: EditAdminArticlePageProps) {
  const { id } = await params;
  const [article, options] = await Promise.all([
    getAdminArticleEditor(id),
    getAdminArticleOptions(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <AdminPageShell
      actions={
        <>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href={`/admin/articles/${article.id}/preview`}
          >
            Preview
          </Link>
          {article.status === "published" ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              href={`/guides/${article.slug}`}
            >
              View public page
            </Link>
          ) : null}
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/articles"
          >
            Back to articles
          </Link>
        </>
      }
      description="Edit draft, review, and publishing fields. Published status requires both the human-reviewed flag and confirm publish checkbox."
      eyebrow="Article CRUD"
      title={`Edit ${article.title}`}
    >
      <AdminArticleForm
        action={updateArticle}
        article={article}
        categories={options.categories}
        submitLabel="Save article"
        tools={options.tools}
      />

      <form
        action={archiveArticle}
        className="rounded-card border border-danger bg-surface p-5 shadow-field"
      >
        <input name="article_id" type="hidden" value={article.id} />
        <input name="slug" type="hidden" value={article.slug} />
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Archive article
        </h2>
        <p className="mt-2 max-w-2xl text-body-md text-muted">
          Archived articles disappear from public article lists, sitemap, and
          detail pages. The record remains available for admin recovery.
        </p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-button border border-danger px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-surface"
          type="submit"
        >
          Archive article
        </button>
      </form>
    </AdminPageShell>
  );
}
