import Link from "next/link";

import { lastUpdatedLabel } from "@/lib/compliance";

type LegalSection = {
  body: string[];
  title: string;
};

type LegalPageProps = {
  eyebrow: string;
  intro: string;
  sections: LegalSection[];
  title: string;
};

export function LegalPage({ eyebrow, intro, sections, title }: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="max-w-3xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>
        <p className="mt-4 font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
          {lastUpdatedLabel}
        </p>
      </section>

      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <section
            className="rounded-card border border-rule bg-surface p-5 shadow-field"
            key={section.title}
          >
            <h2 className="font-serif text-3xl font-semibold text-ink">
              {section.title}
            </h2>
            <div className="mt-4 grid gap-3">
              {section.body.map((paragraph) => (
                <p
                  className="text-body-md leading-8 text-muted"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm leading-6 text-muted">
        This page is a practical website baseline, not legal advice. Review it
        with qualified counsel before relying on it for a regulated launch.
      </p>

      <Link
        className="mt-6 inline-flex text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}
