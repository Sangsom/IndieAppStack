import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/public/json-ld";
import { Badge } from "@/components/ui/badge";
import { getComparisonList } from "@/lib/guide-data";
import { createSeoMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Clear side-by-side comparisons for choosing between app tools without losing practical post-launch details.",
  path: "/comparisons",
  title: "Product comparisons",
});

export const revalidate = 3600;

export default async function ComparisonsPage() {
  const comparisons = await getComparisonList();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <JsonLd
        data={itemListJsonLd({
          items: comparisons.map((comparison) => ({
            name: comparison.title,
            url: comparison.href,
          })),
          name: "Product comparisons",
        })}
      />

      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Comparisons
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Side-by-side tool comparisons for mobile app builders.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Clear short answers, recommendation matrices, pricing notes, setup
          complexity, platform support, and related tools for high-intent stack
          decisions.
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        {comparisons.map((comparison) => (
          <Link
            className="rounded-card border border-rule bg-surface p-5 shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={comparison.href}
            key={comparison.href}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{comparison.category}</Badge>
              <p className="font-mono text-label-sm font-semibold uppercase text-muted">
                {comparison.label}
              </p>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">
              {comparison.title}
            </h2>
            <p className="mt-3 text-body-md leading-7 text-muted">
              {comparison.description}
            </p>
            <p className="mt-5 text-sm font-semibold text-pine">
              {comparison.publishedAt}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
