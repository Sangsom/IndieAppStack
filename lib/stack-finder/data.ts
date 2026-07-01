import "server-only";

import { cache } from "react";

import { getAffiliateRedirectPath } from "@/lib/affiliate-links";
import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import type { StackFinderTool } from "@/lib/stack-finder/recommendation-engine";

type ToolRow = {
  app_stages: string[];
  description: string | null;
  id: string;
  name: string;
  platforms: string[];
  pricing_model: string;
  pricing_summary: string | null;
  slug: string;
  tagline: string | null;
  website_url: string | null;
};

type AffiliateLinkRow = {
  slug: string;
  tool_id: string | null;
};

function formatPricing(model: string, summary: string | null) {
  if (summary) {
    return summary;
  }

  return model.replaceAll("_", " ");
}

export const getStackFinderTools = cache(
  async (): Promise<StackFinderTool[]> => {
    if (!hasSupabaseServerConfig()) {
      return [];
    }

    const supabase = createSupabaseServiceRoleClient();
    const [toolsResult, linksResult] = await Promise.all([
      supabase
        .from("tools")
        .select(
          "id,name,slug,tagline,description,website_url,pricing_summary,pricing_model,platforms,app_stages",
        )
        .eq("status", "published")
        .order("name", { ascending: true }),
      supabase
        .from("affiliate_links")
        .select("tool_id,slug")
        .eq("status", "active"),
    ]);

    const firstError = [toolsResult.error, linksResult.error].find(Boolean);

    if (firstError) {
      throw new Error(`Stack finder data query failed: ${firstError.message}`);
    }

    const affiliateHrefByToolId = new Map<string, string>();

    ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
      if (!row.tool_id || affiliateHrefByToolId.has(row.tool_id)) {
        return;
      }

      affiliateHrefByToolId.set(
        row.tool_id,
        getAffiliateRedirectPath(row.slug, "stack-finder"),
      );
    });

    return ((toolsResult.data ?? []) as ToolRow[]).map((tool) => ({
      affiliateHref: affiliateHrefByToolId.get(tool.id),
      appStages: tool.app_stages,
      description:
        tool.description ??
        tool.tagline ??
        "A practical app tool for solo mobile developers.",
      detailsHref: `/tools/${tool.slug}`,
      id: tool.id,
      name: tool.name,
      officialHref: tool.website_url ?? `/tools/${tool.slug}`,
      platforms: tool.platforms,
      pricing: formatPricing(tool.pricing_model, tool.pricing_summary),
      pricingModel: tool.pricing_model,
      slug: tool.slug,
      tagline: tool.tagline ?? "A practical tool for indie app stacks.",
    }));
  },
);
