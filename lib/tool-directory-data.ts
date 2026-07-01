import "server-only";

import { cache } from "react";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type ToolDirectorySearchParams = Record<string, string | string[] | undefined>;

type CategoryRow = {
  description: string | null;
  id: string;
  name: string;
  slug: string;
};

type ToolRow = {
  app_stages: string[];
  best_for: string[];
  description: string | null;
  id: string;
  logo_url: string | null;
  name: string;
  platforms: string[];
  pricing_last_checked: string | null;
  pricing_model: string;
  pricing_summary: string | null;
  slug: string;
  tagline: string | null;
  website_url: string | null;
};

type ToolCategoryRow = {
  category_id: string;
  sort_order: number;
  tool_id: string;
};

type AffiliateLinkRow = {
  slug: string;
  status: string;
  tool_id: string | null;
};

export type FilterKey = "category" | "platform" | "pricing" | "stage" | "type";

export type FilterOption = {
  count: number;
  label: string;
  value: string;
};

export type FilterGroup = {
  key: FilterKey;
  label: string;
  options: FilterOption[];
};

export type ToolDirectoryFilters = Record<FilterKey, string[]>;

export type DirectoryTool = {
  affiliateHref?: string;
  appStages: string[];
  bestFor: string[];
  category: string;
  categorySlugs: string[];
  description: string;
  detailsHref: string;
  lastChecked: string;
  logoUrl?: string;
  name: string;
  officialHref: string;
  platforms: string[];
  pricing: string;
  pricingModel: string;
  tagline: string;
  toolTypes: string[];
};

export type ToolDirectoryData = {
  filterGroups: FilterGroup[];
  filters: ToolDirectoryFilters;
  resultCount: number;
  totalCount: number;
  tools: DirectoryTool[];
};

const emptyFilters: ToolDirectoryFilters = {
  category: [],
  platform: [],
  pricing: [],
  stage: [],
  type: [],
};

const emptyDirectoryData: ToolDirectoryData = {
  filterGroups: [],
  filters: emptyFilters,
  resultCount: 0,
  totalCount: 0,
  tools: [],
};

const platformOptions = ["iOS", "Android", "Flutter", "React Native", "Web"];

const pricingOptions = [
  { label: "Free", value: "free" },
  { label: "Free tier", value: "freemium" },
  { label: "Paid", value: "paid" },
  { label: "Usage-based", value: "usage_based" },
  { label: "Enterprise", value: "custom" },
];

const stageOptions = [
  { label: "Idea", matches: ["Idea", "Prototype"], value: "idea" },
  { label: "MVP", matches: ["MVP"], value: "mvp" },
  { label: "Launched", matches: ["Launched", "Growth"], value: "launched" },
  { label: "Scaling", matches: ["Scaling", "Scale"], value: "scaling" },
];

const typeOptions = [
  { label: "Build", value: "build" },
  { label: "Launch", value: "launch" },
  { label: "Monetize", value: "monetize" },
  { label: "Grow", value: "grow" },
  { label: "Operate", value: "operate" },
];

const categoryTypeBySlug: Record<string, string> = {
  analytics: "grow",
  backend: "build",
  monetization: "monetize",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function toArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function clean(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function parseToolDirectoryFilters(
  searchParams: ToolDirectorySearchParams,
): ToolDirectoryFilters {
  return {
    category: clean(toArray(searchParams.category)),
    platform: clean(toArray(searchParams.platform)),
    pricing: clean(toArray(searchParams.pricing)),
    stage: clean(toArray(searchParams.stage)),
    type: clean(toArray(searchParams.type)),
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "recently";
  }

  return dateFormatter.format(new Date(value));
}

function formatPricing(model: string, summary: string | null) {
  if (summary) {
    return summary;
  }

  return (
    pricingOptions.find((option) => option.value === model)?.label ??
    model.replaceAll("_", " ")
  );
}

function normalizeStages(appStages: string[]) {
  return stageOptions
    .filter((option) =>
      option.matches.some((stage) => appStages.includes(stage)),
    )
    .map((option) => option.value);
}

function getToolTypes(categories: CategoryRow[]) {
  return clean(
    categories.map(
      (category) => categoryTypeBySlug[category.slug] ?? "operate",
    ),
  );
}

function hasIntersection(values: string[], selected: string[]) {
  return (
    selected.length === 0 || selected.some((value) => values.includes(value))
  );
}

function countMatching(
  tools: DirectoryTool[],
  predicate: (tool: DirectoryTool) => boolean,
) {
  return tools.filter(predicate).length;
}

function buildFilterGroups(
  categories: CategoryRow[],
  tools: DirectoryTool[],
): FilterGroup[] {
  return [
    {
      key: "category",
      label: "Category",
      options: categories.map((category) => ({
        count: countMatching(tools, (tool) =>
          tool.categorySlugs.includes(category.slug),
        ),
        label: category.name,
        value: category.slug,
      })),
    },
    {
      key: "platform",
      label: "Platform",
      options: platformOptions.map((platform) => ({
        count: countMatching(tools, (tool) =>
          tool.platforms.includes(platform),
        ),
        label: platform,
        value: platform,
      })),
    },
    {
      key: "pricing",
      label: "Pricing model",
      options: pricingOptions.map((option) => ({
        count: countMatching(
          tools,
          (tool) => tool.pricingModel === option.value,
        ),
        ...option,
      })),
    },
    {
      key: "stage",
      label: "App stage",
      options: stageOptions.map((option) => ({
        count: countMatching(tools, (tool) =>
          tool.appStages.includes(option.value),
        ),
        label: option.label,
        value: option.value,
      })),
    },
    {
      key: "type",
      label: "Tool type",
      options: typeOptions.map((option) => ({
        count: countMatching(tools, (tool) =>
          tool.toolTypes.includes(option.value),
        ),
        ...option,
      })),
    },
  ];
}

function matchesFilters(tool: DirectoryTool, filters: ToolDirectoryFilters) {
  return (
    hasIntersection(tool.categorySlugs, filters.category) &&
    hasIntersection(tool.platforms, filters.platform) &&
    hasIntersection([tool.pricingModel], filters.pricing) &&
    hasIntersection(tool.appStages, filters.stage) &&
    hasIntersection(tool.toolTypes, filters.type)
  );
}

export const getToolDirectoryData = cache(
  async (filters: ToolDirectoryFilters): Promise<ToolDirectoryData> => {
    if (!hasSupabaseServerConfig()) {
      return { ...emptyDirectoryData, filters };
    }

    const supabase = createSupabaseServiceRoleClient();

    const [categoriesResult, toolsResult, toolCategoriesResult, linksResult] =
      await Promise.all([
        supabase
          .from("categories")
          .select("id,name,slug,description")
          .eq("status", "published")
          .order("sort_order", { ascending: true }),
        supabase
          .from("tools")
          .select(
            "id,name,slug,tagline,description,website_url,pricing_summary,pricing_model,best_for,platforms,app_stages,pricing_last_checked,logo_url",
          )
          .eq("status", "published")
          .order("name", { ascending: true }),
        supabase
          .from("tool_categories")
          .select("tool_id,category_id,sort_order")
          .order("sort_order", { ascending: true }),
        supabase
          .from("affiliate_links")
          .select("tool_id,slug,status")
          .eq("status", "active"),
      ]);

    const firstError = [
      categoriesResult.error,
      toolsResult.error,
      toolCategoriesResult.error,
      linksResult.error,
    ].find(Boolean);

    if (firstError) {
      throw new Error(`Tool directory query failed: ${firstError.message}`);
    }

    const categories = (categoriesResult.data ?? []) as CategoryRow[];
    const categoryById = new Map(
      categories.map((category) => [category.id, category]),
    );
    const categoryIdsByToolId = new Map<string, string[]>();
    const affiliateHrefByToolId = new Map<string, string>();

    ((toolCategoriesResult.data ?? []) as ToolCategoryRow[]).forEach((row) => {
      const categoryIds = categoryIdsByToolId.get(row.tool_id) ?? [];
      categoryIds.push(row.category_id);
      categoryIdsByToolId.set(row.tool_id, categoryIds);
    });

    ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
      if (row.tool_id && !affiliateHrefByToolId.has(row.tool_id)) {
        affiliateHrefByToolId.set(
          row.tool_id,
          getAffiliateRedirectPath(row.slug),
        );
      }
    });

    const tools = ((toolsResult.data ?? []) as ToolRow[]).map((tool) => {
      const toolCategories = (categoryIdsByToolId.get(tool.id) ?? [])
        .map((categoryId) => categoryById.get(categoryId))
        .filter((category): category is CategoryRow => Boolean(category));
      const primaryCategory = toolCategories[0];

      return {
        affiliateHref: affiliateHrefByToolId.get(tool.id),
        appStages: normalizeStages(tool.app_stages),
        bestFor: tool.best_for.length
          ? tool.best_for.slice(0, 3)
          : ["Mobile app teams"],
        category: primaryCategory?.name ?? "App tool",
        categorySlugs: toolCategories.map((category) => category.slug),
        description:
          tool.description ??
          tool.tagline ??
          "A practical app tool for solo mobile developers.",
        detailsHref: `/tools/${tool.slug}`,
        lastChecked: formatDate(tool.pricing_last_checked),
        logoUrl: tool.logo_url ?? undefined,
        name: tool.name,
        officialHref: tool.website_url ?? `/tools/${tool.slug}`,
        platforms: tool.platforms,
        pricing: formatPricing(tool.pricing_model, tool.pricing_summary),
        pricingModel: tool.pricing_model,
        tagline:
          tool.tagline ??
          tool.description ??
          "A practical app tool for solo mobile developers.",
        toolTypes: getToolTypes(toolCategories),
      };
    });

    const filteredTools = tools.filter((tool) => matchesFilters(tool, filters));

    return {
      filterGroups: buildFilterGroups(categories, tools),
      filters,
      resultCount: filteredTools.length,
      totalCount: tools.length,
      tools: filteredTools,
    };
  },
);
