import type { Metadata } from "next";

import stackFinderRules from "@/config/stack-finder-rules.json";
import { NewsletterSignup } from "@/components/public/newsletter-signup";
import { StackFinderQuiz } from "@/components/public/stack-finder-quiz";
import { createSeoMetadata } from "@/lib/seo";
import { getStackFinderTools } from "@/lib/stack-finder/data";
import type { StackFinderRulesConfig } from "@/lib/stack-finder/recommendation-engine";

export const metadata: Metadata = createSeoMetadata({
  description:
    "Match your app stage, platform, and monetization model to a practical indie mobile app stack.",
  path: "/stack-finder",
  title: "Stack finder",
});

export default async function StackFinderPage() {
  const tools = await getStackFinderTools();

  return (
    <div>
      <StackFinderQuiz
        rulesConfig={stackFinderRules as StackFinderRulesConfig}
        tools={tools}
      />
      <section className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        <NewsletterSignup
          ctaLabel="Send my stack notes"
          description="Get the recommended stack notes and follow-up tool checks as the stack finder evolves."
          source="stack-finder:result"
          title="Save the stack finder updates"
        />
      </section>
    </div>
  );
}
