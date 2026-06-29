import type { MetadataRoute } from "next";

import { getPublishedCategorySlugs } from "@/lib/category-page-data";
import {
  getPublishedComparisonSlugs,
  getPublishedGuideSlugs,
} from "@/lib/guide-data";
import { absoluteUrl } from "@/lib/seo";
import { getPublishedToolSlugs } from "@/lib/tool-detail-data";

type SitemapEntryInput = {
  path: string;
  priority: number;
};

function entry({
  path,
  priority,
}: SitemapEntryInput): MetadataRoute.Sitemap[number] {
  return {
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority,
    url: absoluteUrl(path),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorySlugs, comparisonSlugs, guideSlugs, toolSlugs] =
    await Promise.all([
      getPublishedCategorySlugs(),
      getPublishedComparisonSlugs(),
      getPublishedGuideSlugs(),
      getPublishedToolSlugs(),
    ]);

  return [
    entry({ path: "/", priority: 1 }),
    entry({ path: "/tools", priority: 0.9 }),
    entry({ path: "/categories", priority: 0.8 }),
    entry({ path: "/guides", priority: 0.8 }),
    entry({ path: "/comparisons", priority: 0.7 }),
    entry({ path: "/stack-finder", priority: 0.7 }),
    entry({ path: "/affiliate-disclosure", priority: 0.3 }),
    entry({ path: "/privacy", priority: 0.3 }),
    ...toolSlugs.map((slug) =>
      entry({ path: `/tools/${slug}`, priority: 0.8 }),
    ),
    ...categorySlugs.map((slug) =>
      entry({ path: `/categories/${slug}`, priority: 0.75 }),
    ),
    ...guideSlugs.map((slug) =>
      entry({ path: `/guides/${slug}`, priority: 0.75 }),
    ),
    ...comparisonSlugs.map((slug) =>
      entry({ path: `/comparisons/${slug}`, priority: 0.75 }),
    ),
  ];
}
