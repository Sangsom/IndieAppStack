export type StackFinderAnswers = {
  appType?: string;
  budget?: string;
  helpWith?: string;
  platform?: string;
  stage?: string;
};

export type StackFinderAnswerKey = keyof StackFinderAnswers;

export type StackFinderTool = {
  affiliateHref?: string;
  appStages: string[];
  description: string;
  detailsHref: string;
  id: string;
  name: string;
  officialHref: string;
  platforms: string[];
  pricing: string;
  pricingModel: string;
  slug: string;
  tagline: string;
};

export type StackFinderRuleRecommendation = {
  alternatives?: string[];
  costNote: string;
  reason: string;
  role: string;
  toolSlug: string;
  weight: number;
};

export type StackFinderRule = {
  id: string;
  recommendations: StackFinderRuleRecommendation[];
  when: Partial<Record<StackFinderAnswerKey, string[]>>;
};

export type StackFinderRulesConfig = {
  defaultCostNotes: string;
  defaultDescription: string;
  roleOrder: string[];
  rules: StackFinderRule[];
  version: number;
};

export type StackRecommendationTool = {
  alternatives: Pick<StackFinderTool, "detailsHref" | "name" | "slug">[];
  costNote: string;
  reason: string;
  role: string;
  sortOrder: number;
  tool: StackFinderTool;
};

export type StackRecommendation = {
  costNotes: string;
  description: string;
  missingRoles: string[];
  name: string;
  quizAnswers: Required<StackFinderAnswers>;
  slug: string;
  tools: StackRecommendationTool[];
};

type Candidate = StackFinderRuleRecommendation & {
  ruleIds: string[];
  score: number;
  sortOrder: number;
};

const answerLabelByValue: Record<
  StackFinderAnswerKey,
  Record<string, string>
> = {
  appType: {
    "b2b-productivity-app": "B2B productivity",
    "consumer-mobile-app": "consumer mobile",
    "content-community-app": "content community",
    "game-entertainment-app": "game and entertainment",
    "internal-client-app": "internal client",
  },
  budget: {
    "50-200": "$50-$200/mo",
    "200-500": "$200-$500/mo",
    "500-plus": "$500+/mo",
    "under-50": "under $50/mo",
    zero: "$0",
  },
  helpWith: {
    "aso-launch": "launch",
    analytics: "analytics",
    backend: "backend",
    monetization: "monetization",
    "quality-release": "quality",
  },
  platform: {
    android: "Android",
    flutter: "Flutter",
    ios: "iOS",
    "react-native": "React Native",
    web: "web",
  },
  stage: {
    idea: "idea",
    launched: "launched",
    mvp: "MVP",
    scaling: "scaling",
  },
};

const requiredAnswerKeys: StackFinderAnswerKey[] = [
  "appType",
  "platform",
  "stage",
  "helpWith",
  "budget",
];

function hasCompleteAnswers(
  answers: StackFinderAnswers,
): answers is Required<StackFinderAnswers> {
  return requiredAnswerKeys.every((key) => Boolean(answers[key]));
}

function matchesRule(
  answers: Required<StackFinderAnswers>,
  rule: StackFinderRule,
) {
  return Object.entries(rule.when).every(([key, acceptedValues]) => {
    const answer = answers[key as StackFinderAnswerKey];

    return !acceptedValues?.length || acceptedValues.includes(answer);
  });
}

function addCandidate(
  candidatesByRole: Map<string, Map<string, Candidate>>,
  recommendation: StackFinderRuleRecommendation,
  ruleId: string,
  sortOrder: number,
) {
  const roleCandidates =
    candidatesByRole.get(recommendation.role) ?? new Map<string, Candidate>();
  const existing = roleCandidates.get(recommendation.toolSlug);

  if (existing) {
    existing.score += recommendation.weight;
    existing.ruleIds.push(ruleId);

    if (recommendation.weight >= existing.weight) {
      existing.reason = recommendation.reason;
      existing.costNote = recommendation.costNote;
      existing.alternatives = recommendation.alternatives;
      existing.weight = recommendation.weight;
    }
  } else {
    roleCandidates.set(recommendation.toolSlug, {
      ...recommendation,
      ruleIds: [ruleId],
      score: recommendation.weight,
      sortOrder,
    });
  }

  candidatesByRole.set(recommendation.role, roleCandidates);
}

function getRoleSortOrder(role: string, config: StackFinderRulesConfig) {
  const index = config.roleOrder.indexOf(role);

  return index === -1 ? config.roleOrder.length + 1 : index;
}

function getAnswerLabel(key: StackFinderAnswerKey, value: string) {
  return answerLabelByValue[key][value] ?? value.replaceAll("-", " ");
}

function buildStackName(answers: Required<StackFinderAnswers>) {
  return `${getAnswerLabel("platform", answers.platform)} ${getAnswerLabel(
    "stage",
    answers.stage,
  )} ${getAnswerLabel("helpWith", answers.helpWith)} stack`;
}

function buildStackSlug(answers: Required<StackFinderAnswers>) {
  return [
    answers.appType,
    answers.platform,
    answers.stage,
    answers.helpWith,
    answers.budget,
  ].join("--");
}

function buildDescription(
  answers: Required<StackFinderAnswers>,
  config: StackFinderRulesConfig,
) {
  return `${config.defaultDescription} Tuned for a ${getAnswerLabel(
    "appType",
    answers.appType,
  )} app on ${getAnswerLabel("platform", answers.platform)} at the ${getAnswerLabel(
    "stage",
    answers.stage,
  )} stage.`;
}

function getAlternatives(
  selected: Candidate,
  roleCandidates: Candidate[],
  toolBySlug: Map<string, StackFinderTool>,
) {
  const configuredAlternatives = (selected.alternatives ?? [])
    .filter((slug) => slug !== selected.toolSlug)
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is StackFinderTool => Boolean(tool));
  const scoredAlternatives = roleCandidates
    .filter((candidate) => candidate.toolSlug !== selected.toolSlug)
    .sort((first, second) => second.score - first.score)
    .map((candidate) => toolBySlug.get(candidate.toolSlug))
    .filter((tool): tool is StackFinderTool => Boolean(tool));
  const alternatives = [...configuredAlternatives, ...scoredAlternatives];
  const seen = new Set<string>();

  return alternatives
    .filter((tool) => {
      if (seen.has(tool.slug)) {
        return false;
      }

      seen.add(tool.slug);
      return true;
    })
    .slice(0, 3)
    .map((tool) => ({
      detailsHref: tool.detailsHref,
      name: tool.name,
      slug: tool.slug,
    }));
}

export function getStackRecommendation(
  answers: StackFinderAnswers,
  tools: StackFinderTool[],
  config: StackFinderRulesConfig,
): StackRecommendation | null {
  if (!hasCompleteAnswers(answers)) {
    return null;
  }

  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const candidatesByRole = new Map<string, Map<string, Candidate>>();

  config.rules.forEach((rule, ruleIndex) => {
    if (!matchesRule(answers, rule)) {
      return;
    }

    rule.recommendations.forEach((recommendation) => {
      addCandidate(
        candidatesByRole,
        recommendation,
        rule.id,
        getRoleSortOrder(recommendation.role, config) * 100 + ruleIndex,
      );
    });
  });

  const missingRoles: string[] = [];
  const selectedTools = [...candidatesByRole.entries()]
    .map(([role, roleCandidateMap]) => {
      const roleCandidates = [...roleCandidateMap.values()].sort(
        (first, second) =>
          second.score - first.score || first.sortOrder - second.sortOrder,
      );
      const selected = roleCandidates.find((candidate) =>
        toolBySlug.has(candidate.toolSlug),
      );

      if (!selected) {
        missingRoles.push(role);
        return null;
      }

      const tool = toolBySlug.get(selected.toolSlug);

      if (!tool) {
        missingRoles.push(role);
        return null;
      }

      return {
        alternatives: getAlternatives(selected, roleCandidates, toolBySlug),
        costNote: selected.costNote,
        reason: selected.reason,
        role,
        sortOrder: selected.sortOrder,
        tool,
      };
    })
    .filter((tool): tool is StackRecommendationTool => Boolean(tool))
    .sort((first, second) => first.sortOrder - second.sortOrder);

  const costNotes = [
    config.defaultCostNotes,
    ...selectedTools.map((item) => item.costNote),
  ]
    .filter((note, index, notes) => notes.indexOf(note) === index)
    .join(" ");

  return {
    costNotes,
    description: buildDescription(answers, config),
    missingRoles,
    name: buildStackName(answers),
    quizAnswers: answers,
    slug: buildStackSlug(answers),
    tools: selectedTools,
  };
}
