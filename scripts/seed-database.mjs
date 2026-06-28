import fs from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";

import { createClient } from "@supabase/supabase-js";

function readEnvLocal() {
  const envPath = path.join(cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...valueParts] = line.split("=");
        return [key, valueParts.join("=")];
      }),
  );
}

const envLocal = readEnvLocal();
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? envLocal.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? envLocal.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
  exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});

async function upsert(table, rows, options) {
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, options)
    .select();

  if (error) {
    throw new Error(`${table} seed failed: ${error.message}`);
  }

  return data;
}

function bySlug(rows) {
  return new Map(rows.map((row) => [row.slug, row]));
}

try {
  const categories = bySlug(
    await upsert(
      "categories",
      [
        {
          name: "Monetization",
          slug: "monetization",
          description:
            "Revenue, subscriptions, paywalls, and affiliate-friendly app business tools.",
          sort_order: 10,
          status: "published",
          seo_title: "Mobile App Monetization Tools",
        },
        {
          name: "Backend",
          slug: "backend",
          description:
            "Databases, auth, APIs, storage, and server infrastructure for mobile apps.",
          sort_order: 20,
          status: "published",
          seo_title: "Backend Tools for Mobile Apps",
        },
        {
          name: "Analytics",
          slug: "analytics",
          description:
            "Privacy-conscious analytics, event tracking, and product insights.",
          sort_order: 30,
          status: "published",
          seo_title: "Analytics Tools for Mobile Apps",
        },
      ],
      { onConflict: "slug" },
    ),
  );

  const tools = bySlug(
    await upsert(
      "tools",
      [
        {
          name: "RevenueCat",
          slug: "revenuecat",
          tagline:
            "Subscriptions and in-app purchase infrastructure for mobile apps.",
          description:
            "RevenueCat helps solo developers ship reliable subscriptions without building receipt validation from scratch.",
          website_url: "https://www.revenuecat.com/",
          pricing_summary: "Free starter tier, then usage-based pricing.",
          pricing_model: "freemium",
          best_for: [
            "Subscriptions",
            "In-app purchases",
            "Cross-platform entitlement sync",
          ],
          not_good_for: ["One-time web checkout only"],
          platforms: ["iOS", "Android", "React Native", "Flutter", "Web"],
          app_stages: ["MVP", "Growth", "Scale"],
          alternatives: ["Adapty", "Superwall", "Glassfy"],
          status: "published",
          published_at: new Date().toISOString(),
        },
        {
          name: "Supabase",
          slug: "supabase",
          tagline:
            "Open-source backend platform with Postgres, Auth, Storage, and Edge Functions.",
          description:
            "Supabase is a pragmatic backend default for indie apps that need relational data and auth quickly.",
          website_url: "https://supabase.com/",
          pricing_summary: "Free tier, then project-based paid plans.",
          pricing_model: "freemium",
          best_for: ["Auth", "Postgres", "Rapid backend setup"],
          not_good_for: [
            "Teams that require fully managed enterprise Oracle or SQL Server",
          ],
          platforms: ["iOS", "Android", "Web", "React Native", "Flutter"],
          app_stages: ["Prototype", "MVP", "Growth"],
          alternatives: ["Firebase", "Appwrite", "Xano"],
          status: "published",
          published_at: new Date().toISOString(),
        },
        {
          name: "TelemetryDeck",
          slug: "telemetrydeck",
          tagline: "Privacy-friendly analytics for apps.",
          description:
            "TelemetryDeck gives app developers useful product analytics without invasive tracking.",
          website_url: "https://telemetrydeck.com/",
          pricing_summary: "Free tier, then event-volume pricing.",
          pricing_model: "freemium",
          best_for: [
            "Privacy-friendly analytics",
            "iOS analytics",
            "Lightweight dashboards",
          ],
          not_good_for: ["Ad attribution-heavy growth teams"],
          platforms: ["iOS", "Android", "Web"],
          app_stages: ["MVP", "Growth"],
          alternatives: ["PostHog", "Amplitude", "Firebase Analytics"],
          status: "published",
          published_at: new Date().toISOString(),
        },
      ],
      { onConflict: "slug" },
    ),
  );

  await upsert(
    "tool_categories",
    [
      {
        tool_id: tools.get("revenuecat").id,
        category_id: categories.get("monetization").id,
        sort_order: 10,
      },
      {
        tool_id: tools.get("supabase").id,
        category_id: categories.get("backend").id,
        sort_order: 10,
      },
      {
        tool_id: tools.get("telemetrydeck").id,
        category_id: categories.get("analytics").id,
        sort_order: 10,
      },
    ],
    { onConflict: "tool_id,category_id" },
  );

  const programs = new Map(
    (
      await upsert(
        "affiliate_programs",
        [
          {
            name: "RevenueCat Partner Program",
            network: "direct",
            status: "not_applied",
            application_url: "https://www.revenuecat.com/",
            commission_notes:
              "Research affiliate availability before public promotion.",
            cookie_notes: "TBD",
            allowed_promotion_notes:
              "Use honest editorial recommendations only.",
          },
        ],
        { onConflict: "name" },
      )
    ).map((row) => [row.name, row]),
  );

  await upsert(
    "affiliate_links",
    [
      {
        tool_id: tools.get("revenuecat").id,
        affiliate_program_id: programs.get("RevenueCat Partner Program").id,
        destination_url: "https://www.revenuecat.com/",
        slug: "revenuecat",
        status: "pending",
        default_rel: "sponsored nofollow",
        disclosure_required: true,
      },
    ],
    { onConflict: "slug" },
  );

  const articles = bySlug(
    await upsert(
      "articles",
      [
        {
          title: "Best monetization tools for solo mobile developers",
          slug: "best-monetization-tools-solo-mobile-developers",
          subtitle:
            "A starter guide for choosing subscriptions, paywalls, and analytics tools.",
          excerpt:
            "A practical starting stack for indie mobile developers who need revenue infrastructure.",
          body_markdown:
            "RevenueCat, Supabase, and TelemetryDeck make a strong first stack for subscription apps.",
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("monetization").id,
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
      ],
      { onConflict: "slug" },
    ),
  );

  await upsert(
    "article_tools",
    [
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("revenuecat").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("supabase").id,
        relationship: "supporting",
        sort_order: 20,
      },
    ],
    { onConflict: "article_id,tool_id" },
  );

  const stacks = bySlug(
    await upsert(
      "stack_recommendations",
      [
        {
          name: "Subscription MVP Stack",
          slug: "subscription-mvp-stack",
          description:
            "A lean stack for an iOS subscription app with backend and analytics.",
          quiz_answers: {
            platform: "ios",
            stage: "mvp",
            monetization: "subscriptions",
            budget: "under-50",
          },
          status: "published",
          cost_notes: "Starts on free tiers; paid plans scale with usage.",
          published_at: new Date().toISOString(),
        },
      ],
      { onConflict: "slug" },
    ),
  );

  await upsert(
    "stack_tools",
    [
      {
        stack_recommendation_id: stacks.get("subscription-mvp-stack").id,
        tool_id: tools.get("revenuecat").id,
        role: "Subscriptions",
        reason:
          "Handles entitlements and receipt validation without custom backend work.",
        alternatives: ["Adapty", "Superwall"],
        sort_order: 10,
      },
      {
        stack_recommendation_id: stacks.get("subscription-mvp-stack").id,
        tool_id: tools.get("supabase").id,
        role: "Backend",
        reason:
          "Gives the app Postgres and Auth while keeping the schema portable.",
        alternatives: ["Firebase", "Appwrite"],
        sort_order: 20,
      },
    ],
    { onConflict: "stack_recommendation_id,tool_id,role" },
  );

  await upsert(
    "subscribers",
    [
      {
        email: "seed@example.com",
        status: "pending",
        source: "seed",
        double_opt_in: true,
      },
    ],
    { onConflict: "email" },
  );

  await upsert(
    "topic_queue",
    [
      {
        title: "Best paywall tools for iOS apps",
        slug: "best-paywall-tools-ios-apps",
        target_keyword: "best paywall tools for iOS apps",
        search_intent: "commercial investigation",
        target_category_id: categories.get("monetization").id,
        related_tool_ids: [tools.get("revenuecat").id],
        priority: 10,
        status: "briefed",
        notes: "Seed topic for the future AI draft workflow.",
      },
    ],
    { onConflict: "slug" },
  );

  console.log("Seed completed idempotently.");
} catch (error) {
  console.error(error.message);
  exit(1);
}
