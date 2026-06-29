import type {
  StackFinderAnswerKey,
  StackFinderAnswers,
} from "@/lib/stack-finder/recommendation-engine";

type StackFinderSearchParams = Record<string, string | string[] | undefined>;

export const stackFinderAnswerKeys: StackFinderAnswerKey[] = [
  "appType",
  "platform",
  "stage",
  "helpWith",
  "budget",
];

const answerLabelByValue: Record<
  StackFinderAnswerKey,
  Record<string, string>
> = {
  appType: {
    "b2b-productivity-app": "B2B productivity app",
    "consumer-mobile-app": "Consumer mobile app",
    "content-community-app": "Content or community app",
    "game-entertainment-app": "Game or entertainment app",
    "internal-client-app": "Internal or client app",
  },
  budget: {
    "50-200": "$50-$200/mo",
    "200-500": "$200-$500/mo",
    "500-plus": "$500+/mo",
    "under-50": "Under $50/mo",
    zero: "$0",
  },
  helpWith: {
    "aso-launch": "ASO and launch",
    analytics: "Analytics",
    backend: "Backend",
    monetization: "Monetization",
    "quality-release": "Quality and release",
  },
  platform: {
    android: "Android",
    flutter: "Flutter",
    ios: "iOS",
    "react-native": "React Native",
    web: "Web",
  },
  stage: {
    idea: "Idea",
    launched: "Launched",
    mvp: "MVP",
    scaling: "Scaling",
  },
};

const answerHeadingByKey: Record<StackFinderAnswerKey, string> = {
  appType: "What are you building?",
  budget: "Monthly budget",
  helpWith: "Biggest need",
  platform: "Platform",
  stage: "Stage",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function getStackFinderAnswerLabel(
  key: StackFinderAnswerKey,
  value?: string,
) {
  if (!value) {
    return "Not answered";
  }

  return answerLabelByValue[key][value] ?? value.replaceAll("-", " ");
}

export function getStackFinderAnswerHeading(key: StackFinderAnswerKey) {
  return answerHeadingByKey[key];
}

export function parseStackFinderAnswers(
  searchParams: StackFinderSearchParams,
): StackFinderAnswers {
  return Object.fromEntries(
    stackFinderAnswerKeys
      .map((key) => {
        const value = firstValue(searchParams[key]);

        if (!value || !answerLabelByValue[key][value]) {
          return null;
        }

        return [key, value] as const;
      })
      .filter((entry): entry is readonly [StackFinderAnswerKey, string] =>
        Boolean(entry),
      ),
  );
}

export function isCompleteStackFinderAnswers(
  answers: StackFinderAnswers,
): answers is Required<StackFinderAnswers> {
  return stackFinderAnswerKeys.every((key) => Boolean(answers[key]));
}

export function createStackFinderResultsPath(answers: StackFinderAnswers) {
  const searchParams = new URLSearchParams();

  stackFinderAnswerKeys.forEach((key) => {
    const value = answers[key];

    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `/stack-finder/results?${query}` : "/stack-finder/results";
}
