import type { Metadata } from "next";

import { LandingSection } from "@/components/public/landing-section";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "IndieAppStack privacy policy for lightweight measurement and reader-submitted information.",
  path: "/privacy",
  title: "Privacy policy",
});

export default function PrivacyPage() {
  return (
    <LandingSection
      eyebrow="Privacy"
      title="Privacy policy"
      body="IndieAppStack keeps measurement lightweight and avoids collecting personal information unless a reader intentionally submits it."
    />
  );
}
