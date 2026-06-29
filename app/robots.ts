import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.url,
    rules: [
      {
        allow: "/",
        disallow: ["/admin", "/go", "/styleguide"],
        userAgent: "*",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
