import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AffiliateCta } from "@/components/public/affiliate-cta";
import { ArticleToc } from "@/components/public/article-toc";
import { CategoryCard } from "@/components/public/category-card";
import { ComparisonTable } from "@/components/public/comparison-table";
import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { FitList } from "@/components/public/fit-list";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { ProsCons } from "@/components/public/pros-cons";
import { QuizStep } from "@/components/public/quiz-step";
import { StackCard } from "@/components/public/stack-card";
import { ToolCard } from "@/components/public/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { designTokens } from "@/lib/design-tokens";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description: "Development-only IndieAppStack design system reference.",
  noindex: true,
  path: "/styleguide",
  title: "Design system",
});

const comparisonColumns = [
  { key: "solo", label: "Solo app" },
  { key: "growth", label: "Growing app" },
  { key: "team", label: "Small team" },
];

const comparisonRows = [
  {
    feature: "Setup speed",
    cells: {
      solo: { value: "Same day", winner: true },
      growth: "1-2 days",
      team: "Planned rollout",
    },
  },
  {
    feature: "Best fit",
    cells: {
      solo: { value: "Lean MVP", winner: true },
      growth: "Paid acquisition",
      team: "Shared operations",
    },
  },
  {
    feature: "Maintenance",
    cells: {
      solo: "Low",
      growth: { value: "Medium", winner: true },
      team: "High",
    },
  },
];

const tocItems = [
  { href: "#overview", label: "Overview" },
  { href: "#pricing", label: "Pricing notes" },
  { href: "#alternatives", label: "Alternatives" },
];

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-rule pb-8">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-pine">
          Field Guide
        </p>
        <h1 className="mt-3 font-serif text-display-lg font-semibold text-ink">
          Design system
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-muted">
          The base palette, type scale, radii, shadows, and primitives used by
          IndieAppStack.
        </p>
      </header>

      <section className="py-10">
        <h2 className="font-serif text-display-md font-semibold text-ink">
          Palette
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designTokens.colors.map((color) => (
            <div
              className="rounded-card border border-rule bg-surface p-4 shadow-field"
              key={color.token}
            >
              <div
                className={`h-16 rounded-button border border-rule ${color.className}`}
              />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ink">{color.name}</h3>
                  <p className="mt-1 text-sm text-muted">{color.use}</p>
                </div>
                <code className="font-mono text-label-sm text-muted">
                  {color.value}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-rule py-10">
        <h2 className="font-serif text-display-md font-semibold text-ink">
          Type Scale
        </h2>
        <div className="mt-6 divide-y divide-rule border-y border-rule">
          {designTokens.typeScale.map((type) => (
            <div
              className="grid gap-4 py-5 md:grid-cols-[160px_1fr]"
              key={type.name}
            >
              <p className="font-mono text-label-sm font-semibold uppercase text-muted">
                {type.name}
              </p>
              <p
                className={`${type.className} ${
                  type.name.startsWith("Display") ? "font-serif" : ""
                } text-ink`}
              >
                {type.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-rule py-10">
        <h2 className="font-serif text-display-md font-semibold text-ink">
          Primitives
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <h3 className="font-semibold text-ink">Button</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <h3 className="font-semibold text-ink">Badge</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="category">Monetization</Badge>
              <Badge variant="platform">iOS</Badge>
              <Badge variant="pricing">Freemium</Badge>
            </div>
          </div>

          <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
            <h3 className="font-semibold text-ink">Callout</h3>
            <div className="mt-5 grid gap-3">
              <Callout title="Info">
                Use official links by default and affiliate links only where
                they are tracked.
              </Callout>
              <Callout title="Disclosure" variant="disclosure">
                Some links may be sponsored; recommendations stay editorial.
              </Callout>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rule py-10">
        <h2 className="font-serif text-display-md font-semibold text-ink">
          Content Components
        </h2>
        <div className="mt-6 grid gap-6">
          <ToolCard
            affiliateHref="https://example.com/partner"
            bestFor={[
              "Solo iOS founders validating a subscription app",
              "Teams that need event tracking without a consent popup",
            ]}
            category="Analytics"
            detailsHref="/tools/telemetrydeck"
            lastChecked="June 2026"
            name="TelemetryDeck"
            officialHref="https://example.com"
            platforms={["iOS", "Web"]}
            pricing="Freemium"
            tagline="Privacy-friendly app analytics with enough product signal for indie teams."
          />

          <ComparisonTable
            caption="Stack fit comparison"
            columns={comparisonColumns}
            rows={comparisonRows}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ProsCons
              pros={[
                "Fast to wire into a first release",
                "Clear docs for mobile app events",
                "Good fit for privacy-sensitive products",
              ]}
              cons={[
                "Less flexible than a warehouse-first stack",
                "Advanced attribution may need another tool",
              ]}
            />
            <div className="grid gap-4">
              <FitList
                items={["Bootstrapped apps", "Privacy-first analytics"]}
                title="Best for"
                tone="best"
              />
              <FitList
                items={["Enterprise data teams", "Complex ad attribution"]}
                title="Not good for"
                tone="not-good"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DisclosureCallout>
              Some links may be affiliate links. Recommendations stay editorial
              and are chosen for practical fit.
            </DisclosureCallout>
            <div className="rounded-card border border-rule bg-surface p-4 shadow-field">
              <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                Affiliate CTA
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <AffiliateCta
                  href="https://example.com/partner"
                  kind="affiliate"
                  label="Try partner offer"
                />
                <AffiliateCta
                  href="https://example.com"
                  kind="official"
                  label="Official site"
                />
              </div>
            </div>
          </div>

          <NewsletterSignup
            description="A calm monthly note on useful tools, pricing changes, and operating lessons for solo app builders."
            title="Get the field notes"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <StackCard
              costNote="Estimated starter cost: $29-79/mo"
              description="A compact stack for validating a subscription app without overbuilding backend operations."
              href="/stack-finder/ios-subscription"
              name="Lean iOS subscription stack"
              tools={[
                { role: "Subscriptions", name: "RevenueCat" },
                { role: "Analytics", name: "TelemetryDeck" },
                { role: "Backend", name: "Supabase" },
              ]}
            />
            <CategoryCard
              description="Tools for measuring activation, retention, and subscription quality without drowning in dashboards."
              href="/categories/analytics"
              name="Analytics"
              stat="12 tools"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="platform">iOS</Badge>
                <Badge variant="platform">Web</Badge>
                <Badge variant="pricing">Freemium</Badge>
              </div>
            </CategoryCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <QuizStep
              description="Choose the stage that best matches your current app so the stack recommendation stays practical."
              legend="Where is the app today?"
              name="app-stage"
              options={[
                {
                  label: "Pre-launch",
                  value: "prelaunch",
                  description: "Prototype, TestFlight, or first public build.",
                },
                {
                  label: "Launched",
                  value: "launched",
                  description:
                    "Live product with early customers or subscribers.",
                },
                {
                  label: "Scaling",
                  value: "scaling",
                  description:
                    "Repeatable acquisition and operational overhead.",
                },
              ]}
            />
            <ArticleToc items={tocItems} />
          </div>
        </div>
      </section>

      <section className="border-t border-rule py-10">
        <h2 className="font-serif text-display-md font-semibold text-ink">
          Shape
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {designTokens.radii.map((radius) => (
            <div
              className="border border-rule bg-surface p-4 shadow-field"
              key={radius.token}
              style={{ borderRadius: radius.value }}
            >
              <p className="font-semibold text-ink">{radius.name}</p>
              <p className="mt-1 font-mono text-label-sm text-muted">
                {radius.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
