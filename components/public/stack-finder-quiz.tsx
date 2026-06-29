"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { QuizStep, type QuizOption } from "@/components/public/quiz-step";
import { Badge } from "@/components/ui/badge";
import { analytics } from "@/lib/analytics/client";
import {
  createStackFinderResultsPath,
  isCompleteStackFinderAnswers,
} from "@/lib/stack-finder/answers";
import { type StackFinderAnswers } from "@/lib/stack-finder/recommendation-engine";

type QuizStepDefinition = {
  description: string;
  legend: string;
  name: keyof StackFinderAnswers;
  options: QuizOption[];
};

const steps: QuizStepDefinition[] = [
  {
    description:
      "Choose the closest shape. The recommendation engine can refine edge cases later.",
    legend: "What are you building?",
    name: "appType",
    options: [
      {
        description: "A utility, habit, productivity, health, or consumer app.",
        label: "Consumer mobile app",
        value: "consumer-mobile-app",
      },
      {
        description: "A workflow app for teams, clients, operators, or pros.",
        label: "B2B or productivity app",
        value: "b2b-productivity-app",
      },
      {
        description: "A content, course, creator, or community-driven app.",
        label: "Content or community app",
        value: "content-community-app",
      },
      {
        description: "A game, playful experience, or entertainment app.",
        label: "Game or entertainment app",
        value: "game-entertainment-app",
      },
      {
        description: "A private app, client app, dashboard, or internal tool.",
        label: "Internal or client app",
        value: "internal-client-app",
      },
    ],
  },
  {
    description:
      "Pick the platform you are shipping first, even if the roadmap is broader.",
    legend: "Platform",
    name: "platform",
    options: [
      {
        description: "Native iPhone or iPad app first.",
        label: "iOS",
        value: "ios",
      },
      {
        description: "Native Android app first.",
        label: "Android",
        value: "android",
      },
      {
        description: "Shared codebase using React Native.",
        label: "React Native",
        value: "react-native",
      },
      {
        description: "Shared codebase using Flutter.",
        label: "Flutter",
        value: "flutter",
      },
      {
        description: "Web, PWA, or marketing-first web product.",
        label: "Web",
        value: "web",
      },
    ],
  },
  {
    description:
      "The right stack changes when you move from idea validation to scale.",
    legend: "Stage",
    name: "stage",
    options: [
      {
        description: "Still validating the idea, audience, or promise.",
        label: "Idea",
        value: "idea",
      },
      {
        description: "Building or shipping the first usable version.",
        label: "MVP",
        value: "mvp",
      },
      {
        description: "Live app with real users, reviews, or revenue signal.",
        label: "Launched",
        value: "launched",
      },
      {
        description: "Growing traffic, revenue, experiments, or operations.",
        label: "Scaling",
        value: "scaling",
      },
    ],
  },
  {
    description:
      "Choose the biggest constraint right now. The result can still include supporting tools.",
    legend: "What do you need help with most?",
    name: "helpWith",
    options: [
      {
        description: "Subscriptions, paywalls, pricing, and entitlements.",
        label: "Monetization",
        value: "monetization",
      },
      {
        description: "Auth, database, storage, APIs, and app data.",
        label: "Backend",
        value: "backend",
      },
      {
        description: "Events, retention, funnels, and product decisions.",
        label: "Analytics",
        value: "analytics",
      },
      {
        description: "Store listing, screenshots, launch page, and waitlist.",
        label: "ASO and launch",
        value: "aso-launch",
      },
      {
        description: "Crashes, builds, releases, and production quality.",
        label: "Quality and release",
        value: "quality-release",
      },
    ],
  },
  {
    description:
      "Use a realistic monthly software budget. Free tiers count as budget constraints.",
    legend: "Monthly budget",
    name: "budget",
    options: [
      {
        description: "Prefer free and open-source tools for now.",
        label: "$0",
        value: "zero",
      },
      {
        description: "A small starter budget for one or two paid tools.",
        label: "Under $50/mo",
        value: "under-50",
      },
      {
        description: "Room for a focused stack once the app is moving.",
        label: "$50-$200/mo",
        value: "50-200",
      },
      {
        description: "Budget for growth, experiments, and operations.",
        label: "$200-$500/mo",
        value: "200-500",
      },
      {
        description: "Scale budget where time savings matter more than cost.",
        label: "$500+/mo",
        value: "500-plus",
      },
    ],
  },
];

function optionLabel(step: QuizStepDefinition, value?: string) {
  return step.options.find((option) => option.value === value)?.label ?? "";
}

export function StackFinderQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<StackFinderAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const hasStartedRef = useRef(false);

  const activeStep = steps[stepIndex];
  const activeAnswer = answers[activeStep.name];
  const answeredCount = steps.filter((step) => answers[step.name]).length;
  const progressPercent = Math.round((answeredCount / steps.length) * 100);

  const answerSummary = useMemo(
    () =>
      steps.map((step) => ({
        label: step.legend,
        value: optionLabel(step, answers[step.name]) || "Not answered",
      })),
    [answers],
  );

  function trackStart() {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    analytics.track("stack_finder_start", {
      first_step: steps[0].name,
    });
  }

  function setAnswer(value: string) {
    trackStart();
    setAnswers((current) => ({
      ...current,
      [activeStep.name]: value,
    }));
  }

  function goNext() {
    if (!activeAnswer) {
      return;
    }

    if (stepIndex === steps.length - 1) {
      if (isCompleteStackFinderAnswers(answers)) {
        router.push(createStackFinderResultsPath(answers));
      }

      return;
    }

    setStepIndex((current) => current + 1);
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  return (
    <section
      aria-labelledby="stack-finder-heading"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
        <aside className="rounded-card border border-rule bg-surface p-5 shadow-field lg:sticky lg:top-24">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Stack Finder
          </p>
          <h1
            className="mt-2 font-serif text-4xl font-semibold leading-tight text-ink"
            id="stack-finder-heading"
          >
            Find the right app stack.
          </h1>
          <p className="mt-3 text-body-md leading-7 text-muted">
            Five quick choices. No account required. Your answers stay in this
            browser and produce a rules-based recommendation from the published
            tool catalog.
          </p>

          <div className="mt-6" aria-label="Quiz progress">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-muted">
              <span>{`Step ${stepIndex + 1} of ${steps.length}`}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-rule">
              <div
                className="h-full rounded-full bg-pine transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <ol className="mt-6 grid gap-2" aria-label="Quiz steps">
            {steps.map((step, index) => {
              const isCurrent = index === stepIndex;
              const isAnswered = Boolean(answers[step.name]);

              return (
                <li key={step.name}>
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    className="flex w-full items-center justify-between gap-3 rounded-button border border-rule bg-paper px-3 py-2 text-left text-sm transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface aria-[current=step]:border-pine aria-[current=step]:bg-accent-soft"
                    onClick={() => {
                      setStepIndex(index);
                    }}
                    type="button"
                  >
                    <span className="font-semibold text-ink">
                      {index + 1}. {step.legend}
                    </span>
                    {isAnswered ? <Badge variant="pricing">Saved</Badge> : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="grid gap-5">
          <QuizStep
            description={activeStep.description}
            legend={activeStep.legend}
            name={activeStep.name}
            onChange={setAnswer}
            options={activeStep.options}
            required
            value={activeAnswer}
          />

          {answeredCount ? (
            <section className="rounded-card border border-rule bg-surface p-4 shadow-field">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Saved answers
              </h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {answerSummary.map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="inline-flex h-11 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              disabled={stepIndex === 0}
              onClick={goBack}
              type="button"
            >
              Back
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-5 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                disabled={!activeAnswer}
                onClick={goNext}
                type="button"
              >
                {stepIndex === steps.length - 1 ? "Finish quiz" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
