import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/public/article-body";
import { ArticleToc } from "@/components/public/article-toc";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { ToolCard } from "@/components/public/tool-card";
import { Badge } from "@/components/ui/badge";
import { getTocItems, parseArticleMarkdown } from "@/lib/article-markdown";
import {
  getGuideDetail,
  getPublishedGuideSlugs,
  type GuideDetail,
} from "@/lib/guide-data";
import { siteConfig } from "@/lib/site";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

function canonicalUrl(slug: string) {
  return new URL(`/guides/${slug}`, siteConfig.url).toString();
}

function ArticleStructuredData({ guide }: { guide: GuideDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    dateModified: guide.updatedAt,
    datePublished: guide.publishedAt,
    description: guide.description,
    headline: guide.title,
    mainEntityOfPage: canonicalUrl(guide.slug),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}

export async function generateStaticParams() {
  const slugs = await getPublishedGuideSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideDetail(slug);

  if (!guide) {
    return {
      robots: {
        follow: false,
        index: false,
      },
      title: "Guide not found",
    };
  }

  return {
    alternates: {
      canonical: canonicalUrl(guide.slug),
    },
    description: guide.metaDescription,
    openGraph: {
      description: guide.metaDescription,
      title: guide.metaTitle,
      type: "article",
      url: canonicalUrl(guide.slug),
    },
    title: guide.metaTitle,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideDetail(slug);

  if (!guide) {
    notFound();
  }

  const blocks = parseArticleMarkdown(guide.bodyMarkdown);
  const tocItems = getTocItems(blocks);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <ArticleStructuredData guide={guide} />

      <Link
        className="inline-flex text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href="/guides"
      >
        Back to guides
      </Link>

      <article className="mt-8">
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{guide.category}</Badge>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {guide.label}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {guide.subtitle}
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <div>
              <dt className="font-semibold text-ink">Published</dt>
              <dd>{guide.publishedAt}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Last checked</dt>
              <dd>{guide.updatedAt}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Author</dt>
              <dd>{guide.author}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <ArticleBody blocks={blocks} />
          </main>

          <aside className="grid gap-5">
            {tocItems.length ? <ArticleToc items={tocItems} /> : null}
            {guide.hasAffiliateDisclosure ? (
              <DisclosureCallout title="Affiliate disclosure">
                This article includes tools that may have sponsored partner
                links. Editorial recommendations remain independent.
              </DisclosureCallout>
            ) : null}
          </aside>
        </div>
      </article>

      {guide.relatedTools.length ? (
        <section className="mt-12">
          <div>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              Related tools
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Tools mentioned in this article
            </h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {guide.relatedTools.map((tool) => (
              <ToolCard key={tool.name} {...tool} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
