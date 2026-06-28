import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/public/comparison-table";
import { ToolCard } from "@/components/public/tool-card";
import { Callout } from "@/components/ui/callout";
import {
  getCategoryPageData,
  getPublishedCategorySlugs,
  type CategoryFaq,
} from "@/lib/category-page-data";
import { siteConfig } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

function canonicalUrl(slug: string) {
  return new URL(`/categories/${slug}`, siteConfig.url).toString();
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 text-body-md leading-7 text-muted">
      {items.map((item) => (
        <li className="flex gap-2" key={item}>
          <span aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FaqStructuredData({ faq }: { faq: CategoryFaq[] }) {
  if (!faq.length) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}

function BreadcrumbStructuredData({
  categoryName,
  slug,
}: {
  categoryName: string;
  slug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
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
        item: new URL("/categories", siteConfig.url).toString(),
        name: "Categories",
        position: 2,
      },
      {
        "@type": "ListItem",
        item: canonicalUrl(slug),
        name: categoryName,
        position: 3,
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
  const slugs = await getPublishedCategorySlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data) {
    return {
      title: "Category not found",
    };
  }

  return {
    alternates: {
      canonical: canonicalUrl(data.category.slug),
    },
    description: data.category.metaDescription,
    openGraph: {
      description: data.category.metaDescription,
      title: data.category.metaTitle,
      type: "article",
      url: canonicalUrl(data.category.slug),
    },
    title: data.category.metaTitle,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <BreadcrumbStructuredData
        categoryName={data.category.name}
        slug={data.category.slug}
      />
      <FaqStructuredData faq={data.faq} />

      <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-muted">
        <Link className="font-semibold text-pine hover:text-ink" href="/">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          className="font-semibold text-pine hover:text-ink"
          href="/categories"
        >
          Categories
        </Link>
        <span aria-hidden="true">/</span>
        <span>{data.category.name}</span>
      </nav>

      <section className="mt-8 max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Category guide
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          {data.category.name} tools for mobile apps
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {data.category.description}
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <Callout title="Who needs this">
          <BulletList items={data.useCases.whoNeedsThis} />
        </Callout>
        <Callout title="When to use it">
          <BulletList items={data.useCases.whenToUse} />
        </Callout>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              Recommended tools
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Compare tools in this category
            </h2>
          </div>
          <Link
            className="inline-flex h-10 w-fit items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={`/tools?category=${data.category.slug}`}
          >
            Filter directory
          </Link>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {data.tools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>

      {data.comparison.columns.length ? (
        <ComparisonTable
          caption={`${data.category.name} comparison`}
          className="mt-12"
          columns={data.comparison.columns}
          rows={data.comparison.rows}
        />
      ) : null}

      <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Related guides
          </h2>
          {data.guides.length ? (
            <div className="mt-5 grid gap-3">
              {data.guides.map((guide) => (
                <Link
                  className="rounded-card border border-rule bg-paper p-4 transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  href={guide.href}
                  key={guide.title}
                >
                  <h3 className="font-serif text-2xl font-semibold text-ink">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-body-md text-muted">
              No related guides are published yet.
            </p>
          )}
        </div>

        <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
          <h2 className="font-serif text-3xl font-semibold text-ink">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {data.faq.map((item) => (
              <section
                className="border-t border-rule pt-4 first:border-t-0 first:pt-0"
                key={item.question}
              >
                <h3 className="font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.answer}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
