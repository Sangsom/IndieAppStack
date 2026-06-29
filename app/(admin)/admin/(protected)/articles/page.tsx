import Link from "next/link";

import { archiveArticle } from "./actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import { formatArticleType, getAdminArticleList } from "@/lib/admin-articles";

type AdminArticlesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  archive_failed: {
    tone: "error",
    text: "The article could not be archived.",
  },
  archived: {
    tone: "info",
    text: "Article archived and public pages revalidated.",
  },
  create_failed: {
    tone: "error",
    text: "The article could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Article saved and public pages revalidated.",
  },
  duplicate_slug: {
    tone: "error",
    text: "That slug is already used by another article.",
  },
  invalid_article: {
    tone: "error",
    text: "Check the article fields and try again.",
  },
  invalid_json: {
    tone: "error",
    text: "Affiliate CTA blocks must be valid JSON.",
  },
  missing_article: {
    tone: "error",
    text: "The selected article could not be found.",
  },
  publish_requires_confirmation: {
    tone: "error",
    text: "Publishing requires checking the explicit publish confirmation box.",
  },
  publish_requires_review: {
    tone: "error",
    text: "Publishing requires the human-reviewed flag.",
  },
  update_failed: {
    tone: "error",
    text: "The article could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Article updated and public pages revalidated.",
  },
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-ink">
      {status}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminArticlesPage({
  searchParams,
}: AdminArticlesPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const articles = await getAdminArticleList();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          href="/admin/articles/new"
        >
          New article
        </Link>
      }
      description="Create, edit, preview, publish, and archive editorial content with a hard human-review publish gate."
      eyebrow="Admin section"
      title="Articles"
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <AdminTable
        caption="Admin articles"
        columns={[
          {
            key: "article",
            label: "Article",
          },
          {
            key: "type",
            label: "Type",
          },
          {
            key: "review",
            label: "Review",
          },
          {
            key: "published",
            label: "Published",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Create the first article draft to start the editorial workflow."
        emptyTitle="No articles yet"
        rows={articles.map((article) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/articles/${article.id}/preview`}
              >
                Preview
              </Link>
              {article.status === "published" ? (
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                  href={`/guides/${article.slug}`}
                >
                  Public
                </Link>
              ) : null}
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/articles/${article.id}/edit`}
              >
                Edit
              </Link>
              <form action={archiveArticle}>
                <input name="article_id" type="hidden" value={article.id} />
                <input name="slug" type="hidden" value={article.slug} />
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-danger transition-colors hover:border-danger hover:bg-surface"
                  type="submit"
                >
                  Archive
                </button>
              </form>
            </div>
          ),
          article: (
            <div>
              <p className="font-semibold text-ink">{article.title}</p>
              <p className="mt-1 text-sm text-muted">/{article.slug}</p>
              <p className="mt-2 text-sm text-muted">
                {article.categoryName ?? "No category"} ·{" "}
                {article.relatedToolCount} related tools
              </p>
            </div>
          ),
          published: formatDate(article.published_at),
          review: (
            <div className="grid gap-1">
              <span>
                {article.human_reviewed ? "Reviewed" : "Needs review"}
              </span>
              {article.ai_assisted ? (
                <span className="text-sm text-muted">AI assisted</span>
              ) : null}
            </div>
          ),
          type: (
            <div className="grid gap-2">
              <StatusBadge status={article.status} />
              <span className="text-sm text-muted">
                {formatArticleType(article.content_type)}
              </span>
            </div>
          ),
        }))}
      />
    </AdminPageShell>
  );
}
