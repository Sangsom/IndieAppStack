import type { Metadata } from "next";
import Link from "next/link";

import { CategoryCard } from "@/components/public/category-card";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { ToolCard } from "@/components/public/tool-card";
import { Badge } from "@/components/ui/badge";
import { affiliateDisclosureCopy } from "@/lib/compliance";
import { getHomepageData, type HomepageArticle } from "@/lib/homepage-data";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Choose the right tools for your mobile app with curated categories, comparisons, guides, and stack recommendations.",
  path: "/",
  title: "Choose the right tools for your mobile app",
});

export const revalidate = 3600;

function SectionHeader({
  ctaHref,
  ctaLabel,
  eyebrow,
  title,
}: {
  ctaHref: string;
  ctaLabel: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      <Link
        className="inline-flex h-10 w-fit items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href={ctaHref}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function ArticleCard({
  article,
  label,
}: {
  article: HomepageArticle;
  label: string;
}) {
  return (
    <article className="rounded-card border border-rule bg-surface p-5 shadow-field">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{article.category}</Badge>
        <p className="font-mono text-label-sm font-semibold uppercase text-muted">
          {label}
        </p>
      </div>
      <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">
        {article.title}
      </h3>
      <p className="mt-3 text-body-md text-muted">{article.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{article.publishedAt}</p>
        <Link
          className="text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          href={article.href}
        >
          Read
        </Link>
      </div>
    </article>
  );
}

export default async function Home() {
  const { categories, comparisons, guides, tools } = await getHomepageData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="grid min-h-[560px] items-center gap-10 py-10 lg:grid-cols-[1fr_420px] lg:py-14">
        <div>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            IndieAppStack Field Guide
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl lg:text-7xl">
            Choose the right tools for your mobile app.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Compare app tools, browse practical categories, and build a lean
            stack for subscriptions, backend, analytics, and growth.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-5 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              href="/tools"
            >
              Explore tools
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-button border border-rule px-5 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              href="/stack-finder"
            >
              Find my stack
            </Link>
          </div>
        </div>

        <aside className="rounded-card border border-rule bg-surface p-5 shadow-field">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Start here
          </p>
          <div className="mt-5 grid gap-3">
            {[
              ["Tools", "/tools"],
              ["Categories", "/categories"],
              ["Comparisons", "/comparisons"],
              ["Guides", "/guides"],
              ["Indie iOS stacks", "/stacks"],
              ["Stack Finder", "/stack-finder"],
            ].map(([label, href]) => (
              <Link
                className="flex items-center justify-between rounded-button border border-rule bg-paper px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-pine hover:text-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                href={href}
                key={href}
              >
                <span>{label}</span>
                <span aria-hidden="true">-&gt;</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="py-12">
        <SectionHeader
          ctaHref="/categories"
          ctaLabel="Browse categories"
          eyebrow="Featured categories"
          title="Pick a decision area"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              description={category.description}
              href={category.href}
              key={category.id}
              name={category.name}
              stat={`${category.toolCount} tools`}
            />
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeader
          ctaHref="/tools"
          ctaLabel="Explore tools"
          eyebrow="Featured tools"
          title="Useful defaults for an indie stack"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeader
            ctaHref="/comparisons"
            ctaLabel="View comparisons"
            eyebrow="Featured comparisons"
            title="Choose with tradeoffs visible"
          />
          <div className="mt-8 grid gap-5">
            {comparisons.map((article) => (
              <ArticleCard
                article={article}
                key={article.href}
                label="Comparison"
              />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            ctaHref="/guides"
            ctaLabel="Read guides"
            eyebrow="Latest guides"
            title="Practical notes for shipping"
          />
          <div className="mt-8 grid gap-5">
            {guides.map((article) => (
              <ArticleCard article={article} key={article.href} label="Guide" />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 py-12 lg:grid-cols-[1fr_360px] lg:items-start">
        <NewsletterSignup
          action="/newsletter"
          description="A calm monthly note on useful app tools, pricing changes, and stack decisions for solo mobile developers."
          source="home"
          title="Get the field guide in your inbox"
        />
        <DisclosureCallout title="Affiliate disclosure">
          {affiliateDisclosureCopy}
        </DisclosureCallout>
      </section>
    </div>
  );
}
