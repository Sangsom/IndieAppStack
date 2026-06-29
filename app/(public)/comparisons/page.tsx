import type { Metadata } from "next";

import { LandingSection } from "@/components/public/landing-section";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Clear side-by-side comparisons for choosing between app tools without losing practical post-launch details.",
  path: "/comparisons",
  title: "Product comparisons",
});

export default function ComparisonsPage() {
  return (
    <LandingSection
      eyebrow="Comparisons"
      title="Product comparisons"
      body="Clear side-by-side guides for choosing between tools without losing the practical details that matter after launch."
    />
  );
}
