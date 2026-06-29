import Link from "next/link";

import { DisclosureCallout } from "@/components/public/disclosure-callout";
import { ShareResultsButton } from "@/components/public/share-results-button";
import { StackFinderCompletionTracker } from "@/components/public/stack-finder-completion-tracker";
import { StackCard } from "@/components/public/stack-card";
import { Badge } from "@/components/ui/badge";
import { affiliateDisclosureCopy } from "@/lib/compliance";
import {
  getStackFinderAnswerHeading,
  getStackFinderAnswerLabel,
  stackFinderAnswerKeys,
} from "@/lib/stack-finder/answers";
import type {
  StackFinderAnswers,
  StackRecommendation,
} from "@/lib/stack-finder/recommendation-engine";

type StackRecommendationResultsProps = {
  answers: StackFinderAnswers;
  recommendation: StackRecommendation | null;
  resultsPath: string;
};

function AnswerSummary({ answers }: { answers: StackFinderAnswers }) {
  return (
    <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {stackFinderAnswerKeys.map((key) => (
        <div
          className="rounded-card border border-rule bg-surface p-4"
          key={key}
        >
          <dt className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
            {getStackFinderAnswerHeading(key)}
          </dt>
          <dd className="mt-2 font-serif text-xl font-semibold text-ink">
            {getStackFinderAnswerLabel(key, answers[key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EmptyResults() {
  return (
    <section className="rounded-card border border-rule bg-surface p-6 shadow-field">
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
        Stack Finder
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Finish the quiz to generate a shareable stack.
      </h1>
      <p className="mt-4 max-w-2xl text-body-md leading-7 text-muted">
        This results URL is missing one or more valid answers. Complete the quiz
        and the final page will include a stable URL you can revisit or share.
      </p>
      <Link
        className="mt-6 inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-5 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        href="/stack-finder"
      >
        Start quiz
      </Link>
    </section>
  );
}

export function StackRecommendationResults({
  answers,
  recommendation,
  resultsPath,
}: StackRecommendationResultsProps) {
  if (!recommendation) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <EmptyResults />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <StackFinderCompletionTracker
        resultUrl={resultsPath}
        stackSlug={recommendation.slug}
        toolCount={recommendation.tools.length}
      />

      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Stack Finder results
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          {recommendation.name}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {recommendation.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ShareResultsButton path={resultsPath} />
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href="/stack-finder"
          >
            Retake quiz
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <DisclosureCallout title="Affiliate disclosure">
          {affiliateDisclosureCopy}
        </DisclosureCallout>
      </div>

      <div className="mt-8">
        <StackCard
          costNote={recommendation.costNotes}
          description={recommendation.description}
          href="#recommended-tools"
          name={recommendation.name}
          tools={recommendation.tools.map((item) => ({
            name: item.tool.name,
            role: item.role,
          }))}
        />
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-3xl font-semibold text-ink">
          Your inputs
        </h2>
        <div className="mt-4">
          <AnswerSummary answers={answers} />
        </div>
      </section>

      <section className="mt-10" id="recommended-tools">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              Recommended tools
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Why each tool fits
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            Partner links route through IndieAppStack redirects with
            `source=stack-finder` so clicks can be measured separately from
            editorial pages.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {recommendation.tools.map((item) => (
            <article
              className="rounded-card border border-rule bg-surface p-5 shadow-field"
              key={`${item.role}-${item.tool.slug}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant="category">{item.role}</Badge>
                  <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
                    {item.tool.name}
                  </h3>
                  <p className="mt-2 text-body-md leading-7 text-muted">
                    {item.reason}
                  </p>
                </div>
                <Badge variant="pricing">{item.tool.pricing}</Badge>
              </div>

              <div className="mt-4 grid gap-3 border-t border-rule pt-4 md:grid-cols-[1fr_1fr]">
                <div>
                  <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                    Why this role matters
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.tool.tagline}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                    Cost note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.costNote}
                  </p>
                </div>
              </div>

              {item.alternatives.length ? (
                <div className="mt-4">
                  <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                    Alternatives
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.alternatives.map((alternative) => (
                      <Link
                        className="rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        href={alternative.detailsHref}
                        key={alternative.slug}
                      >
                        {alternative.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  href={item.tool.affiliateHref ?? item.tool.officialHref}
                >
                  {item.tool.affiliateHref ? "Open partner link" : "Visit tool"}
                </a>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  href={item.tool.detailsHref}
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>

        {recommendation.missingRoles.length ? (
          <div className="mt-5 rounded-card border border-rule bg-surface p-4">
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
              Gaps
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              No published tool is available yet for{" "}
              {recommendation.missingRoles.join(", ")}. Publish a matching tool
              or adjust the rules config to fill this role.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
