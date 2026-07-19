import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/public/json-ld";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { Badge } from "@/components/ui/badge";
import { createSeoMetadata, itemListJsonLd } from "@/lib/seo";
import {
  getIndieStackList,
  getStacksLastReviewedLabel,
} from "@/lib/stacks/data";

export const revalidate = 3600;

export const metadata: Metadata = createSeoMetadata({
  description:
    "Opinionated, maintained tool stacks for indie iOS apps — one per app archetype, from subscription apps to pre-launch waitlists. Each stack is a shareable, sourced starting point.",
  path: "/stacks",
  title: "Indie iOS app stacks by archetype",
});

export default async function StacksPage() {
  const stacks = await getIndieStackList();
  const lastReviewed = getStacksLastReviewedLabel();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <JsonLd
        data={itemListJsonLd({
          items: stacks.map((stack) => ({
            name: stack.name,
            url: stack.href,
          })),
          name: "Indie iOS app stacks by archetype",
        })}
      />

      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Indie iOS stacks
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          The stack we&rsquo;d pick for each kind of iOS app.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Every archetype below is a hand-picked, maintained stack of tools that
          work well together for that kind of app — with the reasoning and the
          compatibility notes that a random list of &ldquo;best tools&rdquo;
          leaves out. Pick the one that matches what you&rsquo;re building, or{" "}
          <Link
            className="font-semibold text-pine underline-offset-4 hover:underline"
            href="/stack-finder"
          >
            answer five questions in the Stack Finder
          </Link>{" "}
          to tune one to your exact app.
        </p>
        <p className="mt-4 font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Reviewed {lastReviewed}
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        {stacks.map((stack) => (
          <Link
            className="flex flex-col rounded-card border border-rule bg-surface p-6 shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={stack.href}
            key={stack.slug}
          >
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-gold">
              {stack.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              {stack.name}
            </h2>
            <p className="mt-3 text-body-md leading-7 text-muted">
              {stack.tagline}
            </p>
            {stack.toolNames.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {stack.toolNames.map((toolName) => (
                  <Badge key={toolName} variant="platform">
                    {toolName}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
              <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {stack.budgetBand}
              </p>
              <span className="text-sm font-semibold text-pine">
                View stack
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <NewsletterSignup
          ctaLabel="Send me stack updates"
          description="Get new indie iOS stacks and pricing rechecks in your inbox as tools and prices change."
          source="stacks:index"
          title="Follow the stacks as they change"
        />
      </section>
    </div>
  );
}
