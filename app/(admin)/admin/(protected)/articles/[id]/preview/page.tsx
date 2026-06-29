import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ArticleBody } from "@/components/public/article-body";
import { ArticleToc } from "@/components/public/article-toc";
import { Badge } from "@/components/ui/badge";
import { getTocItems, parseArticleMarkdown } from "@/lib/article-markdown";
import {
  formatArticleType,
  getAdminArticlePreview,
} from "@/lib/admin-articles";

type PreviewAdminArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Article preview",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function PreviewAdminArticlePage({
  params,
}: PreviewAdminArticlePageProps) {
  const { id } = await params;
  const article = await getAdminArticlePreview(id);

  if (!article) {
    notFound();
  }

  const blocks = parseArticleMarkdown(
    article.body_markdown ??
      `## Draft body\n${article.excerpt ?? article.subtitle ?? article.title}`,
  );
  const tocItems = getTocItems(blocks);

  return (
    <AdminPageShell
      actions={
        <>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href={`/admin/articles/${article.id}/edit`}
          >
            Edit
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/articles"
          >
            Back to articles
          </Link>
        </>
      }
      description="Protected draft preview. This route is admin-only and marked noindex."
      eyebrow="Draft preview"
      title={article.title}
    >
      <article className="rounded-card border border-rule bg-surface p-5 shadow-field">
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{article.categoryName ?? "Uncategorized"}</Badge>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {formatArticleType(article.content_type)}
            </p>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-gold">
              {article.status}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            {article.title}
          </h1>
          {article.subtitle ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {article.subtitle}
            </p>
          ) : null}
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <div>
              <dt className="font-semibold text-ink">Published</dt>
              <dd>{formatDate(article.published_at)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Author</dt>
              <dd>{article.author ?? "IndieAppStack"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Review gate</dt>
              <dd>{article.human_reviewed ? "Reviewed" : "Needs review"}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <main className="rounded-card border border-rule bg-paper p-5">
            <ArticleBody blocks={blocks} />
          </main>

          <aside className="grid gap-5">
            {tocItems.length ? <ArticleToc items={tocItems} /> : null}
            {article.relatedTools.length ? (
              <section className="rounded-card border border-rule bg-paper p-4">
                <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
                  Related tools
                </p>
                <div className="mt-3 grid gap-2">
                  {article.relatedTools.map((tool) => (
                    <Link
                      className="text-sm font-semibold text-pine hover:text-ink"
                      href={`/tools/${tool.slug}`}
                      key={tool.id}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </article>
    </AdminPageShell>
  );
}
