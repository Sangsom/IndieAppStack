import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateCta } from "@/components/public/affiliate-cta";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { FitList } from "@/components/public/fit-list";
import { ProsCons } from "@/components/public/pros-cons";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  getPublishedToolSlugs,
  getToolDetail,
  type ToolDetail,
  type ToolDetailArticle,
} from "@/lib/tool-detail-data";

type ToolDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

function canonicalUrl(slug: string) {
  return new URL(`/tools/${slug}`, siteConfig.url).toString();
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-card border border-rule bg-surface p-5 shadow-field">
      <h2 className="font-serif text-3xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 text-body-md text-muted">
      {items.map((item) => (
        <li className="flex gap-2" key={item}>
          <span aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RelatedArticles({
  articles,
  emptyLabel,
}: {
  articles: ToolDetailArticle[];
  emptyLabel: string;
}) {
  if (!articles.length) {
    return <p className="text-body-md text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-3">
      {articles.map((article) => (
        <Link
          className="rounded-card border border-rule bg-paper p-4 transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          href={article.href}
          key={`${article.href}-${article.title}`}
        >
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            {article.label}
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
  );
}

function StructuredData({ tool }: { tool: ToolDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        applicationCategory:
          tool.categories[0]?.name ?? "Mobile app development tool",
        description: tool.description,
        name: tool.name,
        operatingSystem: tool.platforms.join(", "),
        url: tool.websiteUrl ?? canonicalUrl(tool.slug),
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
            item: new URL("/tools", siteConfig.url).toString(),
            name: "Tools",
            position: 2,
          },
          {
            "@type": "ListItem",
            item: canonicalUrl(tool.slug),
            name: tool.name,
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
  const slugs = await getPublishedToolSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolDetail(slug);

  if (!tool) {
    return {
      title: "Tool not found",
    };
  }

  const description = `${tool.tagline} Pricing checked ${tool.lastChecked}.`;

  return createSeoMetadata({
    description,
    path: `/tools/${tool.slug}`,
    title: `${tool.name} review, pricing, alternatives, and fit`,
    type: "article",
  });
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getToolDetail(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <StructuredData tool={tool} />

      <Link
        className="inline-flex text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href="/tools"
      >
        Back to tools
      </Link>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            {tool.categories.map((category) => (
              <Badge key={category.slug}>{category.name}</Badge>
            ))}
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            {tool.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {tool.tagline}
          </p>
        </div>

        <aside className="rounded-card border border-rule bg-surface p-5 shadow-field">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Decision snapshot
          </p>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">Pricing</dt>
              <dd className="mt-1 text-muted">{tool.pricing}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Last checked</dt>
              <dd className="mt-1 text-muted">{tool.lastChecked}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Platforms</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {tool.platforms.map((platform) => (
                  <Badge key={platform} variant="platform">
                    {platform}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-5 grid gap-3">
            {tool.affiliateLink ? (
              <AffiliateCta
                href={tool.affiliateLink.href}
                kind="affiliate"
                label="Try partner offer"
              />
            ) : null}
            <AffiliateCta
              href={tool.officialHref}
              kind="official"
              label="Official site"
            />
          </div>
        </aside>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <main className="grid gap-6">
          <Section title="Summary">
            <p className="text-body-md leading-7 text-muted">
              {tool.description}
            </p>
          </Section>

          <div className="grid gap-4 md:grid-cols-2">
            <FitList items={tool.bestFor} title="Best for" tone="best" />
            <FitList
              items={
                tool.notGoodFor.length
                  ? tool.notGoodFor
                  : ["Teams that need a different workflow fit"]
              }
              title="Not good for"
              tone="not-good"
            />
          </div>

          <Section title="Core features">
            <BulletList items={tool.coreFeatures} />
          </Section>

          <Section title="Pricing summary">
            <p className="text-body-md leading-7 text-muted">{tool.pricing}</p>
            <p className="mt-3 text-sm text-muted">
              Last checked {tool.lastChecked}.
            </p>
          </Section>

          {tool.affiliateLink?.disclosureRequired ? (
            <DisclosureCallout title="Affiliate disclosure">
              This page may include a sponsored partner link for {tool.name}.
              The recommendation remains editorial, and the affiliate CTA uses
              sponsored nofollow link attributes.
            </DisclosureCallout>
          ) : null}

          <Section title="Pros and cons">
            <ProsCons
              cons={
                tool.notGoodFor.length
                  ? tool.notGoodFor
                  : ["May not fit every app stage or team workflow"]
              }
              pros={
                tool.bestFor.length
                  ? tool.bestFor
                  : ["Useful for solo mobile developers"]
              }
            />
          </Section>

          <Section title="Alternatives">
            {tool.alternatives.length ? (
              <div className="flex flex-wrap gap-3">
                {tool.alternatives.map((alternative) =>
                  alternative.href ? (
                    <Link
                      className="inline-flex h-10 items-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      href={alternative.href}
                      key={alternative.name}
                    >
                      {alternative.name}
                    </Link>
                  ) : (
                    <span
                      className="inline-flex h-10 items-center rounded-button border border-rule bg-paper px-4 text-sm font-semibold text-ink"
                      key={alternative.name}
                    >
                      {alternative.name}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-body-md text-muted">
                No reviewed alternatives are attached yet.
              </p>
            )}
          </Section>

          <Section title="Related comparisons">
            <RelatedArticles
              articles={tool.relatedComparisons}
              emptyLabel="No related comparisons are published yet."
            />
          </Section>

          <Section title="Related guides">
            <RelatedArticles
              articles={tool.relatedGuides}
              emptyLabel="No related guides are published yet."
            />
          </Section>
        </main>

        <aside className="grid gap-5 lg:sticky lg:top-24">
          <Callout title="Update note">
            This profile was last updated {tool.updatedAt}. Pricing was last
            checked {tool.lastChecked}.
          </Callout>
          <section className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Supported platforms
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.platforms.map((platform) => (
                <Badge key={platform} variant="platform">
                  {platform}
                </Badge>
              ))}
            </div>
            <h3 className="mt-6 font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              App stages
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.appStages.map((stage) => (
                <Badge key={stage} variant="pricing">
                  {stage}
                </Badge>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
