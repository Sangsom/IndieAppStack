import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/public/article-body";
import { ArticleToc } from "@/components/public/article-toc";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { ToolCard } from "@/components/public/tool-card";
import { Badge } from "@/components/ui/badge";
import { getTocItems, parseArticleMarkdown } from "@/lib/article-markdown";
import { affiliateDisclosureCopy } from "@/lib/compliance";
import {
  getComparisonDetail,
  getPublishedComparisonSlugs,
  type GuideDetail,
} from "@/lib/guide-data";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type ComparisonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

function canonicalUrl(slug: string) {
  return new URL(`/comparisons/${slug}`, siteConfig.url).toString();
}

function ComparisonStructuredData({ comparison }: { comparison: GuideDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        author: {
          "@type": "Organization",
          name: comparison.author,
        },
        dateModified: comparison.updatedAtIso,
        datePublished: comparison.publishedAtIso ?? comparison.updatedAtIso,
        description: comparison.description,
        headline: comparison.title,
        image: absoluteUrl(`/comparisons/${comparison.slug}/opengraph-image`),
        mainEntityOfPage: canonicalUrl(comparison.slug),
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            item: siteConfig.url,
            name: "Home",
            position: 1,
          },
          {
            "@type": "ListItem",
            item: new URL("/comparisons", siteConfig.url).toString(),
            name: "Comparisons",
            position: 2,
          },
          {
            "@type": "ListItem",
            item: canonicalUrl(comparison.slug),
            name: comparison.title,
            position: 3,
          },
        ],
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}

export async function generateStaticParams() {
  const slugs = await getPublishedComparisonSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonDetail(slug);

  if (!comparison) {
    return {
      robots: {
        follow: false,
        index: false,
      },
      title: "Comparison not found",
    };
  }

  return createSeoMetadata({
    description: comparison.metaDescription,
    // null → use the colocated per-article opengraph-image route
    imagePath: null,
    path: `/comparisons/${comparison.slug}`,
    title: comparison.metaTitle,
    type: "article",
  });
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const comparison = await getComparisonDetail(slug);

  if (!comparison) {
    notFound();
  }

  const blocks = parseArticleMarkdown(comparison.bodyMarkdown);
  const tocItems = getTocItems(blocks);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <ComparisonStructuredData comparison={comparison} />

      <Link
        className="inline-flex text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href="/comparisons"
      >
        Back to comparisons
      </Link>

      <article className="mt-8">
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{comparison.category}</Badge>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {comparison.label}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            {comparison.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {comparison.subtitle}
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <div>
              <dt className="font-semibold text-ink">Published</dt>
              <dd>{comparison.publishedAt}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Last checked</dt>
              <dd>{comparison.updatedAt}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Author</dt>
              <dd>{comparison.author}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <ArticleBody blocks={blocks} />
          </main>

          <aside className="grid gap-5">
            {tocItems.length ? <ArticleToc items={tocItems} /> : null}
          </aside>
        </div>
      </article>

      <section className="mt-12">
        <NewsletterSignup
          ctaLabel="Get comparisons"
          description="Get new head-to-head tool comparisons, pricing checks, and stack decision notes."
          source={`article-footer:${comparison.slug}`}
          title="Get the next comparison"
        />
      </section>

      {comparison.relatedTools.length ? (
        <section className="mt-12">
          <div>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              Compared tools
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Tools in this comparison
            </h2>
          </div>
          {comparison.hasAffiliateDisclosure ? (
            <DisclosureCallout className="mt-6" title="Affiliate disclosure">
              {affiliateDisclosureCopy}
            </DisclosureCallout>
          ) : null}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {comparison.relatedTools.map((tool) => (
              <ToolCard key={tool.name} {...tool} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
