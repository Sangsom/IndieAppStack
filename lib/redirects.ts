import type { NextConfig } from "next";

type RedirectRules = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

export const redirectRules: RedirectRules = [
  // Add moved or renamed public slugs here, for example:
  // { source: "/guides/old-slug", destination: "/guides/new-slug", permanent: true },
];
