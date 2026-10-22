import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getSitemapContentRoutes } from "@/lib/sitemap-data";
import {
  getStackArchetypeSlugs,
  getStacksLastReviewedIso,
} from "@/lib/stacks/archetypes";
import generatedLastmod from "@/lib/static-page-lastmod.generated.json";
import { staticPageLastmodMap } from "@/lib/static-page-lastmod";

type ContentRoute = {
  lastModified: Date;
  path: string;
};

type SitemapEntryInput = {
  lastModified: Date;
  path: string;
  priority: number;
};

// Source pages have no database row. lastmod is the commit date of the page
// source file. CI checks out with fetch-depth: 0, and the production build
// unshallows before writing lib/static-page-lastmod.generated.json into the
// bundle (a reseed re-renders the sitemap where .git is gone). The hand list
// in lib/static-page-lastmod.mjs covers a shallow clone or a missing repo.
// Checkout mtimes are not used: they reset on every deploy.

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

  return new Date(
    Math.max(...routes.map((route) => route.lastModified.getTime())),
  );
}

function staticDate(
  pageLastmod: Record<string, string>,
  path: string,
  fallback: Date,
): Date {
  const value = pageLastmod[path];

  return value ? new Date(value) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, comparisons, guides, latestModified, tools } =
    await getSitemapContentRoutes();
  const pageLastmod = staticPageLastmodMap({
    generated: generatedLastmod,
  });

  const stacksLastModified = new Date(getStacksLastReviewedIso());

  // The homepage surfaces the whole catalog, so its freshness is the later of
  // its own copy edits and the newest piece of content it links to.
  const homeModified = maxDate(
    staticDate(pageLastmod, "/", latestModified),
    latestModified,
  );

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
      lastModified: staticDate(pageLastmod, "/about", latestModified),
      path: "/about",
      priority: 0.4,
    }),
    entry({
      lastModified: staticDate(
        pageLastmod,
        "/editorial-policy",
        latestModified,
      ),
      path: "/editorial-policy",
      priority: 0.5,
    }),
    entry({
      lastModified: staticDate(
        pageLastmod,
        "/affiliate-disclosure",
        latestModified,
      ),
      path: "/affiliate-disclosure",
      priority: 0.3,
    }),
    entry({
      lastModified: staticDate(pageLastmod, "/privacy-policy", latestModified),
      path: "/privacy-policy",
      priority: 0.3,
    }),
    entry({
      lastModified: staticDate(pageLastmod, "/terms", latestModified),
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
