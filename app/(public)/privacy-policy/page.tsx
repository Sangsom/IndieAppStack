import type { Metadata } from "next";

import { LegalPage } from "@/components/public/legal-page";
import { ownerContactEmail } from "@/lib/compliance";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  description:
    "IndieAppStack privacy policy covering email use, analytics, cookies, and deletion requests.",
  path: "/privacy-policy",
  title: "Privacy policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      intro="IndieAppStack keeps data collection limited to what helps operate the site, understand useful content, and respond to reader requests."
      sections={[
        {
          title: "Information we collect",
          body: [
            "We may collect information you intentionally submit, such as an email address for a newsletter, waitlist, feedback form, or direct message.",
            "We may also process basic technical information such as pages viewed, referral source, device type, browser, rough location derived from network data, and affiliate redirect click metadata.",
          ],
        },
        {
          title: "Email use",
          body: [
            "If you submit your email, we use it to send the content, updates, or replies you requested. We do not sell email addresses.",
            "You can unsubscribe from marketing emails when an unsubscribe link is provided, or request removal by contacting the owner.",
          ],
        },
        {
          title: "Analytics and cookies",
          body: [
            "IndieAppStack may use privacy-conscious analytics to understand aggregate traffic, popular pages, referral sources, and product interest. Analytics should be used for product and content decisions, not invasive tracking.",
            "The site may use cookies or similar storage for basic functionality, analytics, security, affiliate attribution, and hosting behavior. Browser controls can limit or delete cookies.",
          ],
        },
        {
          title: "Affiliate clicks",
          body: [
            "Affiliate redirect clicks may be logged with source page, placement, device type, referrer, and campaign parameters so the site can understand which recommendations readers use.",
            "Affiliate destinations are operated by third parties. Their own privacy policies apply once you leave IndieAppStack.",
          ],
        },
        {
          title: "Your rights and deletion requests",
          body: [
            `If you are in the EU or another region with privacy rights, you may request access, correction, deletion, restriction, or objection where those rights apply. Send requests to ${ownerContactEmail}.`,
            "We will make a reasonable effort to verify and respond to deletion requests for personal data we control. Some records may be retained if needed for security, legal, abuse prevention, or legitimate operational reasons.",
          ],
        },
        {
          title: "Processors and hosting",
          body: [
            "The site may rely on service providers for hosting, database storage, authentication, analytics, email, and affiliate redirects. Those providers process data only as needed to provide their services.",
            "Data may be processed outside your country depending on the service provider and infrastructure used.",
          ],
        },
      ]}
    />
  );
}
