import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/public/legal-page";
import { affiliateDisclosureCopy, ownerContactEmail } from "@/lib/compliance";
import { createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createSeoMetadata({
  description:
    "About IndieAppStack, an editorial field guide for choosing mobile app tools and workflows.",
  path: "/about",
  title: "About",
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
            <>
              It&apos;s built by the team behind{" "}
              <a
                className="font-semibold text-pine underline-offset-2 hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                href="https://mrgripper.com"
                rel="noreferrer"
                target="_blank"
              >
                MrGripper
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-pine underline-offset-2 hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                href="https://getmantis.app"
                rel="noreferrer"
                target="_blank"
              >
                Mantis trading journal
              </a>
              .
            </>,
          ],
        },
        {
          title: "Editorial approach",
          body: [
            "The goal is to describe when a tool is a good fit, when it is not, and what a builder should verify before adopting it.",
            "Content should avoid fake hands-on claims and invented pricing. Pricing and feature references should include last-checked dates or source links where practical.",
            <>
              The price check, the source rule, and the correction log are on{" "}
              <Link
                className="font-semibold text-pine underline-offset-2 hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                href="/editorial-policy"
              >
                how we check prices
              </Link>
              .
            </>,
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
