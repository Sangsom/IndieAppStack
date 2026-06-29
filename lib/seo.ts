import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type SeoMetadataInput = {
  description: string;
  imagePath?: string;
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
  const image = absoluteUrl(imagePath);

  return {
    alternates: {
      canonical: url,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: `${siteConfig.name} preview`,
          height: 630,
          url: image,
          width: 1200,
        },
      ],
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
      images: [image],
      title,
    },
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
