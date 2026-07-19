import "server-only";

import { cache } from "react";

import {
  getStackArchetype,
  getStackArchetypes,
  getStacksLastReviewedIso,
  type StackArchetype,
} from "@/lib/stacks/archetypes";
import { getStackFinderTools } from "@/lib/stack-finder/data";
import type { StackFinderTool } from "@/lib/stack-finder/recommendation-engine";

export type ResolvedStackAlternative = {
  detailsHref: string;
  name: string;
  slug: string;
};

export type ResolvedStackItem = {
  alternatives: ResolvedStackAlternative[];
  role: string;
  tool: StackFinderTool;
  why: string;
};

export type ResolvedStackArchetype = {
  archetype: StackArchetype;
  lastReviewedIso: string;
  lastReviewedLabel: string;
  // Configured tool slugs with no matching published tool. Surfaced so a stale
  // reference is visible during review rather than silently dropped.
  missingToolSlugs: string[];
  tools: ResolvedStackItem[];
};

export type StackListEntry = {
  budgetBand: string;
  eyebrow: string;
  href: string;
  name: string;
  slug: string;
  tagline: string;
  toolNames: string[];
};

// Date-only ISO strings (e.g. "2026-07-19") format in UTC so the "reviewed"
// label is deterministic across build/runtime server timezones.
const lastReviewedFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function formatLastReviewed(iso: string) {
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }

  return lastReviewedFormatter.format(parsed);
}

export function getStacksLastReviewedLabel() {
  return formatLastReviewed(getStacksLastReviewedIso());
}

function resolveArchetype(
  archetype: StackArchetype,
  toolBySlug: Map<string, StackFinderTool>,
): ResolvedStackArchetype {
  const missingToolSlugs: string[] = [];

  const tools = archetype.stack
    .map((item): ResolvedStackItem | null => {
      const tool = toolBySlug.get(item.toolSlug);

      if (!tool) {
        missingToolSlugs.push(item.toolSlug);
        return null;
      }

      const seen = new Set<string>([tool.slug]);
      const alternatives = (item.alternatives ?? [])
        .map((slug) => toolBySlug.get(slug))
        .filter((alternative): alternative is StackFinderTool => {
          if (!alternative || seen.has(alternative.slug)) {
            return false;
          }

          seen.add(alternative.slug);
          return true;
        })
        .map((alternative) => ({
          detailsHref: alternative.detailsHref,
          name: alternative.name,
          slug: alternative.slug,
        }));

      return {
        alternatives,
        role: item.role,
        tool,
        why: item.why,
      };
    })
    .filter((item): item is ResolvedStackItem => Boolean(item));

  const lastReviewedIso = getStacksLastReviewedIso();

  return {
    archetype,
    lastReviewedIso,
    lastReviewedLabel: formatLastReviewed(lastReviewedIso),
    missingToolSlugs,
    tools,
  };
}

export const getIndieStackDetail = cache(
  async (slug: string): Promise<ResolvedStackArchetype | null> => {
    const archetype = getStackArchetype(slug);

    if (!archetype) {
      return null;
    }

    const tools = await getStackFinderTools();
    const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

    return resolveArchetype(archetype, toolBySlug);
  },
);

export const getIndieStackList = cache(async (): Promise<StackListEntry[]> => {
  const tools = await getStackFinderTools();
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

  return getStackArchetypes().map((archetype) => ({
    budgetBand: archetype.budgetBand,
    eyebrow: archetype.eyebrow,
    href: `/stacks/${archetype.slug}`,
    name: archetype.name,
    slug: archetype.slug,
    tagline: archetype.tagline,
    toolNames: archetype.stack
      .map((item) => toolBySlug.get(item.toolSlug)?.name)
      .filter((name): name is string => Boolean(name)),
  }));
});
