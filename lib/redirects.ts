import type { NextConfig } from "next";

// Relative import (not the "@/" alias): this module is pulled into
// next.config.ts, which is compiled by Next's config loader where the
// tsconfig path alias is not guaranteed to resolve.
import { siteConfig } from "./site";

type RedirectRules = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

const apexHost = new URL(siteConfig.url).host; // e.g. "indieappstack.com"
const wwwHost = `www.${apexHost}`;

export const redirectRules: RedirectRules = [
  // Canonicalize the www subdomain to the apex host with a permanent 301.
  // The host `has` condition scopes this to www requests only, so it can't
  // loop (the apex destination no longer matches). `:path*` plus automatic
  // query pass-through preserves the full URL. statusCode 301 is used
  // instead of `permanent: true` (which would emit a 308) per the task.
  {
    source: "/:path*",
    has: [{ type: "host", value: wwwHost }],
    destination: `${siteConfig.url}/:path*`,
    statusCode: 301,
  },

  // Add moved or renamed public slugs here, for example:
  // { source: "/guides/old-slug", destination: "/guides/new-slug", permanent: true },
];
