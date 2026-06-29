import type { Metadata } from "next";

import { LandingSection } from "@/components/public/landing-section";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "How IndieAppStack uses affiliate links while keeping editorial recommendations independent.",
  path: "/affiliate-disclosure",
  title: "Affiliate disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <LandingSection
      eyebrow="Disclosure"
      title="Affiliate disclosure"
      body="IndieAppStack may earn a commission when readers buy through some links. Recommendations remain editorial and are based on fit for solo mobile developers."
    />
  );
}
