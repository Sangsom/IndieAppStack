import type { Metadata } from "next";

import { LandingSection } from "@/components/public/landing-section";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
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
      <LandingSection
        eyebrow="Stack Finder"
        title="Find the right stack"
        body="A guided path for matching your app stage, platform, and monetization model to a practical tool stack."
      />
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
