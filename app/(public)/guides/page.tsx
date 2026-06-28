import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getGuideList } from "@/lib/guide-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: new URL("/guides", siteConfig.url).toString(),
  },
  description:
    "Practical guides, comparisons, and operating notes for indie mobile app builders choosing tools and workflows.",
  title: "Guides and articles",
};

export const revalidate = 3600;

export default async function GuidesPage() {
  const guides = await getGuideList();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Guides
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Field guides for choosing and operating your app stack.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Practical articles for solo mobile developers: what to set up, what to
          skip, and what to revisit as your app grows.
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            className="rounded-card border border-rule bg-surface p-5 shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={guide.href}
            key={guide.href}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{guide.category}</Badge>
              <p className="font-mono text-label-sm font-semibold uppercase text-muted">
                {guide.label}
              </p>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">
              {guide.title}
            </h2>
            <p className="mt-3 text-body-md leading-7 text-muted">
              {guide.description}
            </p>
            <p className="mt-5 text-sm font-semibold text-pine">
              {guide.publishedAt}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
