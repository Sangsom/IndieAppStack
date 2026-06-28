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
          pricing_last_checked: "2026-06-28",
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
          pricing_last_checked: "2026-06-28",
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
          pricing_last_checked: "2026-06-28",
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
          body_markdown: `## Start with the revenue workflow
RevenueCat, Supabase, and TelemetryDeck make a strong first stack for subscription apps because each tool owns a clear job.

> [!NOTE] Editorial note
> Choose the smallest stack that lets you validate payment, entitlement, and retention signals.

## Recommended stack
- RevenueCat for subscriptions and entitlement sync.
- Supabase for auth, Postgres, and app data.
- TelemetryDeck for privacy-friendly product analytics.

:::comparison Monetization starter comparison
| Decision | RevenueCat | Supabase | TelemetryDeck |
| --- | --- | --- | --- |
| Primary job | Subscriptions | Backend | Analytics |
| Best stage | MVP to scale | Prototype to growth | MVP to growth |
| Pricing shape | Free tier, usage-based | Free tier, project-based | Free tier, event-volume |
:::

## Implementation note
\`\`\`ts
const stack = ["RevenueCat", "Supabase", "TelemetryDeck"];
\`\`\`

## What to revisit later
Revisit paywall testing, lifecycle email, and attribution once the app has real subscription traffic.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("monetization").id,
          seo_title: "Best monetization tools for solo mobile developers",
          seo_description:
            "A practical starter stack for mobile app monetization with subscriptions, backend, and analytics tools.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Supabase vs Firebase for indie mobile apps",
          slug: "supabase-vs-firebase-indie-mobile-apps",
          subtitle:
            "A practical comparison for solo builders choosing their first backend.",
          excerpt:
            "How to compare portability, auth, database fit, and launch speed when picking a mobile backend.",
          body_markdown: `## The short version
Supabase and Firebase can both launch mobile apps quickly, but the better default depends on data shape, portability needs, and team habits.

## Comparison table
| Decision | Supabase | Firebase |
| --- | --- | --- |
| Data model | Relational Postgres | Document-first NoSQL |
| Auth | Built in | Built in |
| Portability | Strong SQL portability | Strong Google ecosystem fit |

## When Supabase wins
- Your app data is relational.
- You want SQL reporting and direct database access.
- You prefer an open-source backend path.

## When Firebase wins
- You already rely heavily on Google services.
- Your app fits document-style syncing.
- Your team knows Firebase deeply.

> [!NOTE] Backend choice
> Pick the backend your future debugging self can understand quickly.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("backend").id,
          seo_title: "Supabase vs Firebase for indie mobile apps",
          seo_description:
            "A practical Supabase versus Firebase comparison for solo mobile app builders.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "A privacy-friendly analytics starter stack",
          slug: "privacy-friendly-analytics-starter-stack",
          subtitle:
            "Useful defaults for measuring product behavior without heavy tracking.",
          excerpt:
            "A lightweight analytics approach for mobile apps that need signal without invasive data collection.",
          body_markdown: `## Start with fewer events
TelemetryDeck is a strong starting point for privacy-conscious app analytics, especially when paired with a small event taxonomy.

## Starter taxonomy
| Event | Why it matters |
| --- | --- |
| onboarding_completed | Activation |
| paywall_viewed | Monetization intent |
| subscription_started | Revenue conversion |

## Example naming
\`\`\`json
{
  "event": "paywall_viewed",
  "source": "settings"
}
\`\`\`

> [!NOTE] Keep it small
> A clear five-event taxonomy is better than a noisy dashboard nobody trusts.

## Review cadence
Review events monthly and remove anything that does not change product decisions.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("analytics").id,
          seo_title: "Privacy-friendly analytics starter stack",
          seo_description:
            "A lightweight analytics setup for mobile apps that need useful product signal without invasive tracking.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Draft guide that should stay private",
          slug: "draft-guide-private",
          subtitle: "This seed record proves drafts stay out of public routes.",
          excerpt: "A non-public draft article.",
          body_markdown: "## Draft\nThis should not be public.",
          author: "IndieAppStack",
          status: "draft",
          content_type: "guide",
          primary_category_id: categories.get("backend").id,
          human_reviewed: false,
          ai_assisted: false,
          published_at: null,
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
      {
        article_id: articles.get("supabase-vs-firebase-indie-mobile-apps").id,
        tool_id: tools.get("supabase").id,
        relationship: "featured",
        sort_order: 10,
      },
      {
        article_id: articles.get("privacy-friendly-analytics-starter-stack").id,
        tool_id: tools.get("telemetrydeck").id,
        relationship: "recommended",
        sort_order: 10,
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
