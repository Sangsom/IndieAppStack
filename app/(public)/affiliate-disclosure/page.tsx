import type { Metadata } from "next";

import { LegalPage } from "@/components/public/legal-page";
import { affiliateDisclosureCopy, ownerContactEmail } from "@/lib/compliance";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "How IndieAppStack uses affiliate links while keeping editorial recommendations independent.",
  path: "/affiliate-disclosure",
  title: "Affiliate disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Disclosure"
      title="Affiliate disclosure"
      intro={affiliateDisclosureCopy}
      sections={[
        {
          title: "How affiliate links work",
          body: [
            "Some outbound links may route through IndieAppStack affiliate redirects. If you buy or sign up through one of those links, IndieAppStack may receive a commission or partner credit at no extra cost to you.",
            "Affiliate links are marked with sponsored nofollow link attributes where they are rendered as affiliate calls to action.",
          ],
        },
        {
          title: "Editorial independence",
          body: [
            "Recommendations are based on practical fit for solo mobile developers, not on commission rates. A tool can appear in the directory, guides, or comparisons without an affiliate relationship.",
            "Sponsored content, if introduced later, will be clearly labeled as sponsored so readers can distinguish it from independent editorial recommendations.",
          ],
        },
        {
          title: "Where disclosures appear",
          body: [
            "A site-wide disclosure snippet appears in the footer. Pages with affiliate CTAs also include a nearby disclosure callout so the relationship is visible before readers click.",
            `Questions about affiliate relationships can be sent to ${ownerContactEmail}.`,
          ],
        },
      ]}
    />
  );
}
