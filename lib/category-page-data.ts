import "server-only";

import { cache } from "react";

import type {
  ComparisonColumn,
  ComparisonRow,
} from "@/components/public/comparison-table";
import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type CategoryRow = {
  description: string | null;
  id: string;
  name: string;
  seo_description: string | null;
  seo_title: string | null;
  slug: string;
};

type ToolCategoryRow = {
  sort_order: number;
  tool_id: string;
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

type AffiliateLinkRow = {
  slug: string;
  tool_id: string | null;
};

type ArticleRow = {
  excerpt: string | null;
  id: string;
  published_at: string | null;
  slug: string;
  subtitle: string | null;
  title: string;
};

export type CategoryTool = {
  affiliateHref?: string;
  bestFor: string[];
  category: string;
  detailsHref: string;
  lastChecked: string;
  logoUrl?: string;
  name: string;
  officialHref: string;
  platforms: string[];
  pricing: string;
  pricingModel: string;
  tagline: string;
};

export type CategoryGuide = {
  description: string;
  href: string;
  title: string;
};

export type CategoryFaq = {
  answer: string;
  question: string;
};

export type CategoryPageData = {
  category: {
    description: string;
    id: string;
    metaDescription: string;
    metaTitle: string;
    name: string;
    slug: string;
  };
  comparison: {
    columns: ComparisonColumn[];
    rows: ComparisonRow[];
  };
  faq: CategoryFaq[];
  guides: CategoryGuide[];
  tools: CategoryTool[];
  useCases: {
    whenToUse: string[];
    whoNeedsThis: string[];
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const categoryCopy: Record<
  string,
  {
    faq: CategoryFaq[];
    whenToUse: string[];
    whoNeedsThis: string[];
  }
> = {
  analytics: {
    faq: [
      {
        answer:
          "Start with a small event taxonomy around activation, retention, and monetization before adding broad tracking.",
        question: "What should an indie app track first?",
      },
      {
        answer:
          "Yes, if the tool helps you understand product behavior without collecting unnecessary personal data.",
        question: "Can privacy-friendly analytics still be useful?",
      },
    ],
    whenToUse: [
      "You need to understand onboarding, retention, or feature adoption.",
      "You want product signal without a heavy ad-attribution setup.",
      "You are preparing to compare pricing, conversion, or engagement changes.",
    ],
    whoNeedsThis: [
      "Solo developers shipping a public app.",
      "Subscription apps that need activation and retention signal.",
      "Teams that prefer privacy-conscious measurement.",
    ],
  },
  aso: {
    faq: [
      {
        answer:
          "Start with keyword research, competitor tracking, screenshots, and review monitoring before investing in advanced market-intelligence workflows.",
        question: "Which ASO tools should an indie app use first?",
      },
      {
        answer:
          "Yes. ASO tools help reveal search demand, ranking changes, review patterns, and creative opportunities that are hard to see from App Store Connect alone.",
        question: "Do small apps need ASO software?",
      },
    ],
    whenToUse: [
      "You are preparing a launch, relaunch, or major metadata update.",
      "You need to compare keywords, competitors, rankings, reviews, or store creatives.",
      "You want a repeatable way to improve qualified store traffic over time.",
    ],
    whoNeedsThis: [
      "Indie developers trying to earn organic app store traffic.",
      "Subscription apps that need better keyword and screenshot conversion.",
      "Teams planning regular metadata, review, or competitor audits.",
    ],
  },
  backend: {
    faq: [
      {
        answer:
          "Choose a backend once the app needs accounts, synced data, server validation, or content that should not live only on-device.",
        question: "When does a mobile app need a backend?",
      },
      {
        answer:
          "A relational backend can be easier when your app has structured entities, permissions, and reporting needs.",
        question: "Is Postgres a good default for indie apps?",
      },
    ],
    whenToUse: [
      "You need auth, synced data, APIs, storage, or server-side rules.",
      "You want a portable schema and SQL-friendly reporting.",
      "You are moving beyond a purely local prototype.",
    ],
    whoNeedsThis: [
      "Apps with accounts or shared data.",
      "Builders who need auth and database infrastructure quickly.",
      "Teams that expect the data model to evolve after launch.",
    ],
  },
  launch: {
    faq: [
      {
        answer:
          "A focused launch stack usually includes a landing page, waitlist or newsletter capture, screenshot production, and a lightweight way to publish updates.",
        question: "What tools do I need before launching a mobile app?",
      },
      {
        answer:
          "Yes. A landing page can validate positioning, capture early demand, and give reviewers or potential users a clear place to understand the app.",
        question: "Is a landing page useful before the app is live?",
      },
    ],
    whenToUse: [
      "You are validating positioning before App Store or Google Play release.",
      "You need a waitlist, newsletter, launch page, or screenshot workflow.",
      "You want to coordinate app store assets and marketing pages before a release.",
    ],
    whoNeedsThis: [
      "Solo developers preparing a first public launch.",
      "Apps that need a waitlist, audience, or beta-user pipeline.",
      "Teams refreshing screenshots, landing pages, and messaging for a relaunch.",
    ],
  },
  monetization: {
    faq: [
      {
        answer:
          "Most subscription apps should pick a monetization tool before launch so paywalls, entitlements, and receipt validation are tested early.",
        question: "When should I add monetization tooling?",
      },
      {
        answer:
          "Not always. A focused subscription service is often better when entitlements and cross-platform purchase state matter.",
        question: "Is the app store SDK enough for subscriptions?",
      },
    ],
    whenToUse: [
      "You plan to sell subscriptions, consumables, unlocks, or paid tiers.",
      "You need entitlement state to sync reliably across devices.",
      "You want revenue reporting without building receipt validation from scratch.",
    ],
    whoNeedsThis: [
      "Subscription app builders.",
      "Indie developers validating paid features.",
      "Teams that need paywalls, entitlements, and pricing experiments.",
    ],
  },
};

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

  return model.replaceAll("_", " ");
}

function defaultCopy(category: CategoryRow) {
  return {
    faq: [
      {
        answer: `${category.name} tools are useful when this job becomes important enough to compare tradeoffs, pricing, and workflow fit.`,
        question: `How do I choose a ${category.name.toLowerCase()} tool?`,
      },
    ],
    whenToUse: [
      `Use ${category.name.toLowerCase()} tools when this workflow becomes repeated or business-critical.`,
      "Compare pricing, platform support, and operational fit before committing.",
    ],
    whoNeedsThis: [
      "Solo mobile developers choosing a durable stack.",
      "Teams comparing tools before launch or migration.",
    ],
  };
}

function buildComparison(tools: CategoryTool[]) {
  const columns = tools.slice(0, 4).map((tool) => ({
    key: tool.name,
    label: tool.name,
  }));

  const rows: ComparisonRow[] = [
    {
      cells: Object.fromEntries(
        columns.map((column) => {
          const tool = tools.find((item) => item.name === column.key);

          return [column.key, tool?.pricing ?? ""];
        }),
      ),
      feature: "Pricing",
    },
    {
      cells: Object.fromEntries(
        columns.map((column) => {
          const tool = tools.find((item) => item.name === column.key);

          return [column.key, tool?.platforms.slice(0, 3).join(", ") ?? ""];
        }),
      ),
      feature: "Platforms",
    },
    {
      cells: Object.fromEntries(
        columns.map((column) => {
          const tool = tools.find((item) => item.name === column.key);

          return [column.key, tool?.bestFor[0] ?? ""];
        }),
      ),
      feature: "Best fit",
    },
    {
      cells: Object.fromEntries(
        columns.map((column) => {
          const tool = tools.find((item) => item.name === column.key);

          return [column.key, tool?.lastChecked ?? ""];
        }),
      ),
      feature: "Pricing checked",
    },
  ];

  return { columns, rows };
}

export const getPublishedCategorySlugs = cache(async () => {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const { data, error } = await createSupabaseServiceRoleClient()
    .from("categories")
    .select("slug")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Category slugs query failed: ${error.message}`);
  }

  return (data ?? []).map((category) => category.slug);
});

export const getCategoryPageData = cache(
  async (slug: string): Promise<CategoryPageData | null> => {
    if (!hasSupabaseServerConfig()) {
      return null;
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id,name,slug,description,seo_title,seo_description")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (categoryError) {
      throw new Error(`Category query failed: ${categoryError.message}`);
    }

    if (!category) {
      return null;
    }

    const [assignmentsResult, guidesResult] = await Promise.all([
      supabase
        .from("tool_categories")
        .select("tool_id,sort_order")
        .eq("category_id", category.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("articles")
        .select("id,title,slug,subtitle,excerpt,published_at")
        .eq("primary_category_id", category.id)
        .eq("status", "published")
        .eq("human_reviewed", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(4),
    ]);

    const firstError = [assignmentsResult.error, guidesResult.error].find(
      Boolean,
    );

    if (firstError) {
      throw new Error(`Category related query failed: ${firstError.message}`);
    }

    const assignments = (assignmentsResult.data ?? []) as ToolCategoryRow[];
    const toolIds = assignments.map((assignment) => assignment.tool_id);

    const [toolsResult, linksResult] = await Promise.all([
      toolIds.length
        ? supabase
            .from("tools")
            .select(
              "id,name,slug,tagline,description,website_url,pricing_summary,pricing_model,best_for,platforms,pricing_last_checked,logo_url,app_stages",
            )
            .in("id", toolIds)
            .eq("status", "published")
        : Promise.resolve({ data: [], error: null }),
      toolIds.length
        ? supabase
            .from("affiliate_links")
            .select("tool_id,slug")
            .in("tool_id", toolIds)
            .in("status", ["active", "pending"])
        : Promise.resolve({ data: [], error: null }),
    ]);

    const secondError = [toolsResult.error, linksResult.error].find(Boolean);

    if (secondError) {
      throw new Error(`Category tool query failed: ${secondError.message}`);
    }

    const toolById = new Map(
      ((toolsResult.data ?? []) as ToolRow[]).map((tool) => [tool.id, tool]),
    );
    const affiliateHrefByToolId = new Map<string, string>();

    ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
      if (row.tool_id && !affiliateHrefByToolId.has(row.tool_id)) {
        affiliateHrefByToolId.set(
          row.tool_id,
          getAffiliateRedirectPath(row.slug),
        );
      }
    });

    const tools = assignments
      .map((assignment) => toolById.get(assignment.tool_id))
      .filter((tool): tool is ToolRow => Boolean(tool))
      .map((tool) => ({
        affiliateHref: affiliateHrefByToolId.get(tool.id),
        bestFor: tool.best_for.length
          ? tool.best_for.slice(0, 3)
          : ["Mobile app teams"],
        category: category.name,
        detailsHref: `/tools/${tool.slug}`,
        lastChecked: formatDate(tool.pricing_last_checked),
        logoUrl: tool.logo_url ?? undefined,
        name: tool.name,
        officialHref: tool.website_url ?? `/tools/${tool.slug}`,
        platforms: tool.platforms.length ? tool.platforms : ["Mobile"],
        pricing: formatPricing(tool.pricing_model, tool.pricing_summary),
        pricingModel: tool.pricing_model,
        tagline:
          tool.tagline ??
          tool.description ??
          `A practical ${category.name.toLowerCase()} tool.`,
      }));

    const copy = categoryCopy[category.slug] ?? defaultCopy(category);

    return {
      category: {
        description:
          category.description ??
          `A practical guide to ${category.name.toLowerCase()} tools for mobile apps.`,
        id: category.id,
        metaDescription:
          category.seo_description ??
          category.description ??
          `Compare ${category.name.toLowerCase()} tools for indie mobile apps.`,
        metaTitle:
          category.seo_title ?? `${category.name} tools for indie mobile apps`,
        name: category.name,
        slug: category.slug,
      },
      comparison: buildComparison(tools),
      faq: copy.faq,
      guides: ((guidesResult.data ?? []) as ArticleRow[]).map((guide) => ({
        description:
          guide.excerpt ?? guide.subtitle ?? "A related category guide.",
        href: `/guides/${guide.slug}`,
        title: guide.title,
      })),
      tools,
      useCases: {
        whenToUse: copy.whenToUse,
        whoNeedsThis: copy.whoNeedsThis,
      },
    };
  },
);
