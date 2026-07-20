import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getSitemapContentRoutes } from "@/lib/sitemap-data";
import {
  getStackArchetypeSlugs,
  getStacksLastReviewedIso,
} from "@/lib/stacks/archetypes";

type ContentRoute = {
  lastModified: Date;
  path: string;
};

type SitemapEntryInput = {
  lastModified: Date;
  path: string;
  priority: number;
};

// Source-code-driven pages have no database row to date them, so their real
// "last content change" is the last time we edited the page's copy. We record
// that here explicitly instead of reading git history or file mtimes at build:
// Vercel's shallow clone makes per-file git dates non-deterministic, and checkout
// mtimes reset on every deploy — either would reintroduce the "every page shares
// one bulk-regeneration timestamp" problem this sitemap is meant to avoid.
// Bump the date (YYYY-MM-DD) whenever you meaningfully revise that page.
const STATIC_PAGE_LASTMOD: Record<string, string> = {
  "/": "2026-07-19",
  "/about": "2026-07-19",
  "/affiliate-disclosure": "2026-07-19",
  "/privacy-policy": "2026-06-29",
  "/terms": "2026-06-29",
};

function entry({
  lastModified,
  path,
  priority,
}: SitemapEntryInput): MetadataRoute.Sitemap[number] {
  return {
    changeFrequency: "weekly",
    lastModified,
    priority,
    url: absoluteUrl(path),
  };
}

function maxDate(...dates: Date[]): Date {
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

// A section hub (e.g. /tools) is only as fresh as the newest item it lists, so
// its lastmod tracks that item rather than the whole site's most-recent change.
function latestOf(routes: ContentRoute[], fallback: Date): Date {
  if (!routes.length) {
    return fallback;
  }

  return new Date(Math.max(...routes.map((route) => route.lastModified.getTime())));
}

function staticDate(path: string, fallback: Date): Date {
  const value = STATIC_PAGE_LASTMOD[path];

  return value ? new Date(value) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, comparisons, guides, latestModified, tools } =
    await getSitemapContentRoutes();

  const stacksLastModified = new Date(getStacksLastReviewedIso());

  // The homepage surfaces the whole catalog, so its freshness is the later of
  // its own copy edits and the newest piece of content it links to.
  const homeModified = maxDate(staticDate("/", latestModified), latestModified);

  return [
    entry({ lastModified: homeModified, path: "/", priority: 1 }),
    entry({
      lastModified: latestOf(tools, latestModified),
      path: "/tools",
      priority: 0.9,
    }),
    entry({
      lastModified: latestOf(categories, latestModified),
      path: "/categories",
      priority: 0.8,
    }),
    entry({
      lastModified: latestOf(guides, latestModified),
      path: "/guides",
      priority: 0.8,
    }),
    entry({
      lastModified: latestOf(comparisons, latestModified),
      path: "/comparisons",
      priority: 0.7,
    }),
    entry({
      lastModified: stacksLastModified,
      path: "/stack-finder",
      priority: 0.7,
    }),
    entry({
      lastModified: stacksLastModified,
      path: "/stacks",
      priority: 0.8,
    }),
    ...getStackArchetypeSlugs().map((slug) =>
      entry({
        lastModified: stacksLastModified,
        path: `/stacks/${slug}`,
        priority: 0.75,
      }),
    ),
    entry({
      lastModified: staticDate("/about", latestModified),
      path: "/about",
      priority: 0.4,
    }),
    entry({
      lastModified: staticDate("/affiliate-disclosure", latestModified),
      path: "/affiliate-disclosure",
      priority: 0.3,
    }),
    entry({
      lastModified: staticDate("/privacy-policy", latestModified),
      path: "/privacy-policy",
      priority: 0.3,
    }),
    entry({
      lastModified: staticDate("/terms", latestModified),
      path: "/terms",
      priority: 0.3,
    }),
    ...tools.map((tool) =>
      entry({
        lastModified: tool.lastModified,
        path: tool.path,
        priority: 0.8,
      }),
    ),
    ...categories.map((category) =>
      entry({
        lastModified: category.lastModified,
        path: category.path,
        priority: 0.75,
      }),
    ),
    ...guides.map((guide) =>
      entry({
        lastModified: guide.lastModified,
        path: guide.path,
        priority: 0.75,
      }),
    ),
    ...comparisons.map((comparison) =>
      entry({
        lastModified: comparison.lastModified,
        path: comparison.path,
        priority: 0.75,
      }),
    ),
  ];
}
