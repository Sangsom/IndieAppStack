import type { Metadata } from "next";

import { LegalPage } from "@/components/public/legal-page";
import { affiliateDisclosureCopy, ownerContactEmail } from "@/lib/compliance";
import { createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createSeoMetadata({
  description:
    "About IndieAppStack, an editorial field guide for choosing mobile app tools and workflows.",
  path: "/about",
  title: "About IndieAppStack",
});

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="About"
      title={`About ${siteConfig.name}`}
      intro="IndieAppStack is a practical field guide for solo mobile developers choosing the tools, systems, and workflows behind durable apps."
      sections={[
        {
          title: "What this site does",
          body: [
            "IndieAppStack organizes mobile app tools by use case, stage, platform, pricing model, and practical fit so builders can make faster stack decisions.",
            "The site includes tool pages, category pages, guides, comparison pages, affiliate redirect management, and analytics for understanding which recommendations readers use.",
          ],
        },
        {
          title: "Editorial approach",
          body: [
            "The goal is to describe when a tool is a good fit, when it is not, and what a builder should verify before adopting it.",
            "Content should avoid fake hands-on claims and invented pricing. Pricing and feature references should include last-checked dates or source links where practical.",
          ],
        },
        {
          title: "Affiliate disclosure",
          body: [
            affiliateDisclosureCopy,
            "Affiliate links help support the site, but they should not decide whether a tool is included or recommended.",
          ],
        },
        {
          title: "Contact",
          body: [
            `Questions, corrections, and deletion requests can be sent to ${ownerContactEmail}.`,
          ],
        },
      ]}
    />
  );
}
