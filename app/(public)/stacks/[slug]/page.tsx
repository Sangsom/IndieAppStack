import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateCta } from "@/components/public/affiliate-cta";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { JsonLd } from "@/components/public/json-ld";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { ShareResultsButton } from "@/components/public/share-results-button";
import { Badge } from "@/components/ui/badge";
import { affiliateDisclosureCopy } from "@/lib/compliance";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { createStackFinderResultsPath } from "@/lib/stack-finder/answers";
import {
  getStackArchetype,
  getStackArchetypeSlugs,
} from "@/lib/stacks/archetypes";
import {
  getIndieStackDetail,
  type ResolvedStackArchetype,
} from "@/lib/stacks/data";

type StackPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

const ANALYTICS_LOCATION = "stacks";

function canonicalUrl(slug: string) {
  return new URL(`/stacks/${slug}`, siteConfig.url).toString();
}

function StackStructuredData({ stack }: { stack: ResolvedStackArchetype }) {
  const { archetype } = stack;
  const url = canonicalUrl(archetype.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        author: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        dateModified: stack.lastReviewedIso,
        datePublished: stack.lastReviewedIso,
        description: archetype.metaDescription,
        headline: archetype.metaTitle,
        image: absoluteUrl(`/stacks/${archetype.slug}/opengraph-image`),
        mainEntityOfPage: url,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "ItemList",
        itemListElement: stack.tools.map((item, index) => ({
          "@type": "ListItem",
          name: item.tool.name,
          position: index + 1,
          url: absoluteUrl(item.tool.detailsHref),
        })),
        name: `${archetype.name} stack`,
        numberOfItems: stack.tools.length,
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
            item: new URL("/stacks", siteConfig.url).toString(),
            name: "Indie iOS stacks",
            position: 2,
          },
          {
            "@type": "ListItem",
            item: url,
            name: archetype.name,
            position: 3,
          },
        ],
      },
    ],
  };

  return <JsonLd data={jsonLd} />;
}

export function generateStaticParams() {
  return getStackArchetypeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const archetype = getStackArchetype(slug);

  if (!archetype) {
    return {
      robots: {
        follow: false,
        index: false,
      },
      title: "Stack not found",
    };
  }

  return createSeoMetadata({
    description: archetype.metaDescription,
    // null → use the colocated per-archetype opengraph-image route
    imagePath: null,
    path: `/stacks/${archetype.slug}`,
    title: archetype.metaTitle,
    type: "article",
  });
}

export default async function StackPage({ params }: StackPageProps) {
  const { slug } = await params;
  const stack = await getIndieStackDetail(slug);

  if (!stack) {
    notFound();
  }

  const { archetype } = stack;
  const stackPath = `/stacks/${archetype.slug}`;
  const finderPath = createStackFinderResultsPath(archetype.quizAnswers);
  const relatedStacks = getStackArchetypeSlugs()
    .filter((relatedSlug) => relatedSlug !== archetype.slug)
    .map((relatedSlug) => getStackArchetype(relatedSlug))
    .filter((related): related is NonNullable<typeof related> =>
      Boolean(related),
    );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <StackStructuredData stack={stack} />

      <Link
        className="inline-flex text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href="/stacks"
      >
        Back to indie iOS stacks
      </Link>

      <article className="mt-8">
        <header className="max-w-4xl">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            {archetype.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            {archetype.name} stack
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {archetype.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <div>
              <span className="font-semibold text-ink">Budget</span>{" "}
              {archetype.budgetBand}
            </div>
            <div>
              <span className="font-semibold text-ink">Reviewed</span>{" "}
              {stack.lastReviewedLabel}
            </div>
            <div>
              <span className="font-semibold text-ink">Tools</span>{" "}
              {stack.tools.length}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ShareResultsButton
              copiedLabel="Copied stack URL"
              label="Copy stack URL"
              path={stackPath}
            />
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              href={finderPath}
            >
              Customize in Stack Finder
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="max-w-3xl">
            {archetype.summary.map((paragraph) => (
              <p
                className="mt-4 text-body-md leading-7 text-muted first:mt-0"
                key={paragraph.slice(0, 48)}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
              Who this stack is for
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {archetype.whoItsFor.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <div className="mt-8">
          <DisclosureCallout title="Affiliate disclosure">
            {affiliateDisclosureCopy}
          </DisclosureCallout>
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                The stack
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                What we&rsquo;d run, and why
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Partner links route through IndieAppStack redirects so clicks can
              be measured, and every recommendation stays editorial.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {stack.tools.map((item) => (
              <article
                className="rounded-card border border-rule bg-surface p-5 shadow-field"
                key={`${item.role}-${item.tool.slug}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge variant="category">{item.role}</Badge>
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
                      {item.tool.name}
                    </h3>
                    <p className="mt-2 text-body-md leading-7 text-muted">
                      {item.why}
                    </p>
                  </div>
                  <Badge variant="pricing">{item.tool.pricing}</Badge>
                </div>

                {item.alternatives.length ? (
                  <div className="mt-4 border-t border-rule pt-4">
                    <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                      Alternatives
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.alternatives.map((alternative) => (
                        <Link
                          className="rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          href={alternative.detailsHref}
                          key={alternative.slug}
                        >
                          {alternative.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  {item.tool.affiliateHref ? (
                    <AffiliateCta
                      analyticsLocation={ANALYTICS_LOCATION}
                      href={item.tool.affiliateHref}
                      kind="affiliate"
                      label="Open partner link"
                      toolSlug={item.tool.slug}
                    />
                  ) : (
                    <AffiliateCta
                      analyticsLocation={ANALYTICS_LOCATION}
                      href={item.tool.officialHref}
                      kind="official"
                      label="Visit tool"
                      toolSlug={item.tool.slug}
                    />
                  )}
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    href={item.tool.detailsHref}
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {stack.missingToolSlugs.length ? (
            <div className="mt-5 rounded-card border border-rule bg-surface p-4">
              <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                Gaps
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                No published tool is available yet for{" "}
                {stack.missingToolSlugs.join(", ")}. Publish a matching tool or
                update the stack config to fill this role.
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Compatibility notes
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            How these tools fit together
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {archetype.compatibilityNotes.map((note) => (
              <article
                className="rounded-card border border-rule bg-surface p-5 shadow-field"
                key={note.title}
              >
                <h3 className="font-serif text-xl font-semibold text-ink">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-card border border-rule bg-accent-soft p-5">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            When to upgrade
          </p>
          <p className="mt-2 max-w-3xl text-body-md leading-7 text-ink">
            {archetype.upgradeNote}
          </p>
        </section>

        <section className="mt-10 rounded-card border border-rule bg-surface p-6 shadow-field">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Not quite your app?
          </h2>
          <p className="mt-3 max-w-2xl text-body-md leading-7 text-muted">
            The Stack Finder starts from this archetype&rsquo;s answers and lets
            you change platform, stage, budget, and focus to generate a stack
            tuned to your exact app.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              href={finderPath}
            >
              Open this in the Stack Finder
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              href="/stack-finder"
            >
              Start the quiz from scratch
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <NewsletterSignup
            ctaLabel="Send this stack"
            description="Get this stack and the rest of the indie iOS stacks in your inbox, with a note whenever prices or picks change."
            source={`stacks:${archetype.slug}`}
            title="Save this stack for later"
          />
        </section>

        <section className="mt-12">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Other stacks
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            Browse another archetype
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedStacks.map((related) => (
              <Link
                className="rounded-card border border-rule bg-surface p-5 shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                href={`/stacks/${related.slug}`}
                key={related.slug}
              >
                <h3 className="font-serif text-xl font-semibold text-ink">
                  {related.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {related.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
