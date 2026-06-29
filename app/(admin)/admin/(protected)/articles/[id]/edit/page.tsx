import Link from "next/link";
import { notFound } from "next/navigation";

import {
  acceptAiDraft,
  archiveArticle,
  rejectAiDraft,
  updateArticle,
} from "../../actions";
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

      {article.ai_assisted && article.status !== "published" ? (
        <section className="rounded-card border border-gold bg-surface p-5 shadow-field">
          <div className="border-b border-rule pb-4">
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              AI review workflow
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              Accept or reject draft
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Accepting marks the draft human-reviewed for continued editorial
              work. Publishing still requires the full checklist and explicit
              publish confirmation. Rejections store feedback on the matching
              topic queue entry.
            </p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <form action={acceptAiDraft}>
              <input name="article_id" type="hidden" value={article.id} />
              <input name="slug" type="hidden" value={article.slug} />
              <button
                className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
                type="submit"
              >
                Accept AI draft
              </button>
            </form>

            <form action={rejectAiDraft} className="grid gap-3">
              <input name="article_id" type="hidden" value={article.id} />
              <input name="slug" type="hidden" value={article.slug} />
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Rejection feedback
                <textarea
                  className="min-h-24 rounded-button border border-rule bg-paper px-3 py-3 text-base text-ink outline-none transition-colors focus:border-pine"
                  name="feedback"
                  required
                />
              </label>
              <button
                className="inline-flex h-10 items-center justify-center rounded-button border border-danger px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-surface"
                type="submit"
              >
                Reject AI draft
              </button>
            </form>
          </div>
        </section>
      ) : null}

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
