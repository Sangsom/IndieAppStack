import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { designTokens } from "@/lib/design-tokens";

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
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
    </main>
  );
}
