import Link from "next/link";

import type { RelatedArticle } from "@/lib/guide-data";

export function RelatedReading({
  articles,
  eyebrow = "Keep reading",
  title = "Related guides and comparisons",
}: {
  articles: RelatedArticle[];
  eyebrow?: string;
  title?: string;
}) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div>
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
          {title}
        </h2>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {articles.map((article) => (
          <Link
            className="rounded-card border border-rule bg-surface p-5 shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={article.href}
            key={article.href}
          >
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              {article.label} · {article.category}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">
              {article.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
