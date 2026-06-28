import type { Metadata } from "next";

import { CategoryCard } from "@/components/public/category-card";
import { getHomepageData } from "@/lib/homepage-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: new URL("/categories", siteConfig.url).toString(),
  },
  description:
    "Browse IndieAppStack categories for monetization, backend, analytics, and other mobile app tool decisions.",
  title: "Tool categories",
};

export const revalidate = 3600;

export default async function CategoriesPage() {
  const { categories } = await getHomepageData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Categories
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Browse the stack by decision area.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Start with the job you need your app stack to do, then compare tools
          with platform fit, pricing notes, and practical tradeoffs in view.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            description={category.description}
            href={category.href}
            key={category.id}
            name={category.name}
            stat={`${category.toolCount} tools`}
          />
        ))}
      </section>
    </div>
  );
}
