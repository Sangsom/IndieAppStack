import type { Metadata } from "next";

import { LandingSection } from "@/components/public/landing-section";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Match your app stage, platform, and monetization model to a practical indie mobile app stack.",
  path: "/stack-finder",
  title: "Stack finder",
});

export default function StackFinderPage() {
  return (
    <LandingSection
      eyebrow="Stack Finder"
      title="Find the right stack"
      body="A guided path for matching your app stage, platform, and monetization model to a practical tool stack."
    />
  );
}
