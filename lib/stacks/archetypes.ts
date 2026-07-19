import indieIosStacks from "@/config/indie-ios-stacks.json";
import type { StackFinderAnswers } from "@/lib/stack-finder/recommendation-engine";

// A single role in an archetype's opinionated stack. `toolSlug` and each entry
// in `alternatives` reference a tool `slug` in the published catalog; the
// server-only resolver in `lib/stacks/data.ts` swaps them for live tool data.
export type StackArchetypeItem = {
  alternatives?: string[];
  role: string;
  toolSlug: string;
  why: string;
};

// Editorial note on how the chosen tools fit together — the differentiator that
// keeps these pages substantial rather than a thin list of links.
export type StackCompatibilityNote = {
  body: string;
  title: string;
};

export type StackArchetype = {
  budgetBand: string;
  compatibilityNotes: StackCompatibilityNote[];
  eyebrow: string;
  metaDescription: string;
  metaTitle: string;
  name: string;
  // The canonical Stack Finder answer set for this archetype. Bridges each page
  // back to the interactive quiz so a visitor can customize from here.
  quizAnswers: Required<StackFinderAnswers>;
  slug: string;
  stack: StackArchetypeItem[];
  summary: string[];
  tagline: string;
  upgradeNote: string;
  whoItsFor: string[];
};

export type IndieIosStacksConfig = {
  archetypes: StackArchetype[];
  lastReviewed: string;
  version: number;
};

const config = indieIosStacks as IndieIosStacksConfig;

export function getStackArchetypes(): StackArchetype[] {
  return config.archetypes;
}

export function getStackArchetypeSlugs(): string[] {
  return config.archetypes.map((archetype) => archetype.slug);
}

export function getStackArchetype(slug: string): StackArchetype | null {
  return config.archetypes.find((archetype) => archetype.slug === slug) ?? null;
}

export function getStacksLastReviewedIso(): string {
  return config.lastReviewed;
}
