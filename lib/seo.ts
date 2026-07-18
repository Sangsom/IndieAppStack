import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type SeoMetadataInput = {
  description: string;
  // A path to an image, or `null` to defer to a colocated opengraph-image
  // file convention (e.g. a per-article generated card).
  imagePath?: string | null;
  noindex?: boolean;
  path: string;
  title: string;
  type?: "article" | "website";
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function createSeoMetadata({
  description,
  imagePath = "/opengraph-image",
  noindex = false,
  path,
  title,
  type = "website",
}: SeoMetadataInput): Metadata {
  const url = absoluteUrl(path);
  // When imagePath is null, omit explicit images so a colocated
  // opengraph-image route populates og:image (Twitter falls back to it).
  const image = imagePath === null ? null : absoluteUrl(imagePath);

  return {
    alternates: {
      canonical: url,
    },
    description,
    openGraph: {
      description,
      ...(image
        ? {
            images: [
              {
                alt: `${siteConfig.name} preview`,
                height: 630,
                url: image,
                width: 1200,
              },
            ],
          }
        : {}),
      siteName: siteConfig.name,
      title,
      type,
      url,
    },
    robots: noindex
      ? {
          follow: false,
          index: false,
        }
      : undefined,
    title,
    twitter: {
      card: "summary_large_image",
      description,
      ...(image ? { images: [image] } : {}),
      title,
    },
  };
}

type ItemListEntry = {
  name: string;
  // A relative path (e.g. `/tools/foo`) or an absolute URL.
  url: string;
};

// Builds ItemList structured data for a listing page so search engines can
// surface list/carousel rich results and understand the directory structure.
// Returns null for an empty list so callers can render nothing.
export function itemListJsonLd({
  items,
  name,
}: {
  items: ItemListEntry[];
  name: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      name: item.name,
      position: index + 1,
      url: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
    name,
    numberOfItems: items.length,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        description: siteConfig.description,
        name: siteConfig.name,
        url: siteConfig.url,
      },
      {
        "@type": "WebSite",
        description: siteConfig.description,
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],
  };
}
