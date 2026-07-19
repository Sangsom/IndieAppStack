import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { StackFinderQuiz } from "@/components/public/stack-finder-quiz";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Match your app stage, platform, and monetization model to a practical indie mobile app stack.",
  path: "/stack-finder",
  title: "Stack finder",
});

export default function StackFinderPage() {
  return (
    <div>
      <StackFinderQuiz />
      <section className="mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-card border border-rule bg-surface p-5 shadow-field">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Prefer a ready-made stack?
          </p>
          <p className="mt-2 max-w-2xl text-body-md leading-7 text-muted">
            Skip the quiz and browse our opinionated, maintained{" "}
            <Link
              className="font-semibold text-pine underline-offset-4 hover:underline"
              href="/stacks"
            >
              indie iOS stacks by app archetype
            </Link>{" "}
            — each one a shareable page with the tools, the reasoning, and how
            they fit together.
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        <NewsletterSignup
          ctaLabel="Send my stack notes"
          description="Get the recommended stack notes and follow-up tool checks as the stack finder evolves."
          source="stack-finder:result"
          title="Save the stack finder updates"
        />
      </section>
    </div>
  );
}
