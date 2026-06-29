import type { Metadata } from "next";

import { LegalPage } from "@/components/public/legal-page";
import { ownerContactEmail } from "@/lib/compliance";
import { createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Terms for using IndieAppStack, including editorial limitations, affiliate links, and acceptable use.",
  path: "/terms",
  title: "Terms of use",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use"
      intro={`These terms describe the baseline rules for using ${siteConfig.name}, its directory, guides, comparison pages, and affiliate redirects.`}
      sections={[
        {
          title: "Use of the site",
          body: [
            "IndieAppStack provides editorial information about tools and workflows for indie mobile app builders. You are responsible for checking whether a tool, price, feature, or legal requirement fits your own project.",
            "Do not misuse the site, attempt to disrupt it, scrape it in a way that harms availability, or use affiliate redirects for fraudulent, automated, or misleading activity.",
          ],
        },
        {
          title: "No professional advice",
          body: [
            "The site is not legal, financial, tax, security, or compliance advice. Content is for general product and editorial research only.",
            "Before making important business, legal, or purchasing decisions, verify details with the official provider and qualified professionals where needed.",
          ],
        },
        {
          title: "Affiliate links and sponsorship",
          body: [
            "Some links may be affiliate links. IndieAppStack may earn a commission if you buy or sign up through those links, at no extra cost to you.",
            "Sponsored content, if added later, must be clearly labeled. Affiliate relationships do not guarantee a positive recommendation.",
          ],
        },
        {
          title: "Accuracy and availability",
          body: [
            "Tool pricing, features, policies, and availability can change. IndieAppStack includes last-checked dates where pricing or feature claims appear, but you should confirm details on official provider pages.",
            "The site may change, remove, or update content at any time.",
          ],
        },
        {
          title: "Contact",
          body: [
            `Questions about these terms can be sent to ${ownerContactEmail}.`,
          ],
        },
      ]}
    />
  );
}
