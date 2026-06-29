import type { Metadata } from "next";

import stackFinderRules from "@/config/stack-finder-rules.json";
import { StackRecommendationResults } from "@/components/public/stack-recommendation-results";
import { createSeoMetadata } from "@/lib/seo";
import {
  createStackFinderResultsPath,
  isCompleteStackFinderAnswers,
  parseStackFinderAnswers,
} from "@/lib/stack-finder/answers";
import { getStackFinderTools } from "@/lib/stack-finder/data";
import {
  getStackRecommendation,
  type StackFinderRulesConfig,
} from "@/lib/stack-finder/recommendation-engine";

type StackFinderResultsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

export const metadata: Metadata = createSeoMetadata({
  description:
    "A shareable Stack Finder result with recommended mobile app tools, reasons, alternatives, cost notes, and affiliate disclosure.",
  path: "/stack-finder/results",
  title: "Stack Finder results",
});

export default async function StackFinderResultsPage({
  searchParams,
}: StackFinderResultsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const answers = parseStackFinderAnswers(resolvedSearchParams);
  const tools = await getStackFinderTools();
  const recommendation = isCompleteStackFinderAnswers(answers)
    ? getStackRecommendation(
        answers,
        tools,
        stackFinderRules as StackFinderRulesConfig,
      )
    : null;

  return (
    <StackRecommendationResults
      answers={answers}
      recommendation={recommendation}
      resultsPath={createStackFinderResultsPath(answers)}
    />
  );
}
