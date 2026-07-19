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
            "Most outbound links on IndieAppStack are plain editorial links that point straight to a tool's own website. IndieAppStack earns nothing when you use them.",
            "A small number of tools have an affiliate or referral relationship. Those calls to action are labeled as partner links and route through an IndieAppStack redirect that records the click and forwards you to the partner. If you buy or sign up through one, IndieAppStack may receive a commission or partner credit at no extra cost to you.",
            "Affiliate calls to action carry sponsored nofollow link attributes, and the redirect paths are excluded from search engine indexing, so they never pass search ranking credit.",
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
