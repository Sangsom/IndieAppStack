import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getSitemapContentRoutes } from "@/lib/sitemap-data";

type SitemapEntryInput = {
  lastModified: Date;
  path: string;
  priority: number;
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, comparisons, guides, latestModified, tools } =
    await getSitemapContentRoutes();

  return [
    entry({ lastModified: latestModified, path: "/", priority: 1 }),
    entry({ lastModified: latestModified, path: "/tools", priority: 0.9 }),
    entry({
      lastModified: latestModified,
      path: "/categories",
      priority: 0.8,
    }),
    entry({ lastModified: latestModified, path: "/guides", priority: 0.8 }),
    entry({
      lastModified: latestModified,
      path: "/comparisons",
      priority: 0.7,
    }),
    entry({
      lastModified: latestModified,
      path: "/stack-finder",
      priority: 0.7,
    }),
    entry({ lastModified: latestModified, path: "/about", priority: 0.4 }),
    entry({
      lastModified: latestModified,
      path: "/affiliate-disclosure",
      priority: 0.3,
    }),
    entry({
      lastModified: latestModified,
      path: "/privacy-policy",
      priority: 0.3,
    }),
    entry({ lastModified: latestModified, path: "/terms", priority: 0.3 }),
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
