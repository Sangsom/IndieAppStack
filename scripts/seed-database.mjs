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

const pricingLastChecked = "2026-06-29";
const publishedAt = new Date().toISOString();

const seedTools = [
  {
    name: "RevenueCat",
    slug: "revenuecat",
    tagline:
      "Subscriptions and in-app purchase infrastructure for mobile apps.",
    description:
      "RevenueCat helps solo developers ship reliable subscriptions, receipt validation, entitlements, paywalls, and revenue analytics without building purchase infrastructure from scratch.",
    website_url: "https://www.revenuecat.com/",
    pricing_summary:
      "Starts free up to a tracked-revenue threshold, then takes a percentage of tracked revenue; enterprise pricing is custom.",
    pricing_model: "usage_based",
    best_for: ["Subscriptions", "In-app purchases", "Entitlement sync"],
    not_good_for: ["Apps that only need one-time web checkout"],
    platforms: ["iOS", "Android", "React Native", "Flutter", "Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Adapty", "Superwall", "Qonversion"],
    categorySlugs: ["monetization", "paywalls"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.revenuecat.com/pricing/",
  },
  {
    name: "Adapty",
    slug: "adapty",
    tagline:
      "Subscription infrastructure, paywalls, experiments, and revenue analytics.",
    description:
      "Adapty combines purchase infrastructure with no-code paywalls, A/B testing, subscription analytics, and integrations for apps optimizing recurring revenue.",
    website_url: "https://adapty.io/",
    pricing_summary:
      "Free while under a monthly revenue threshold, then percentage-of-revenue pricing; enterprise is custom.",
    pricing_model: "usage_based",
    best_for: ["Paywall testing", "Subscription analytics", "No-code paywalls"],
    not_good_for: ["Teams that only need a minimal receipt validator"],
    platforms: ["iOS", "Android", "React Native", "Flutter", "Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["RevenueCat", "Superwall", "Qonversion"],
    categorySlugs: ["monetization", "paywalls"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://adapty.io/pricing/",
  },
  {
    name: "Superwall",
    slug: "superwall",
    tagline:
      "Remotely configurable paywalls and experimentation for subscription apps.",
    description:
      "Superwall helps teams design, target, and test native paywalls without app releases, with analytics for conversion experiments.",
    website_url: "https://superwall.com/",
    pricing_summary:
      "Paid plans with a startup path and sales-led options; check current pricing page before purchase.",
    pricing_model: "paid",
    best_for: [
      "Remote paywalls",
      "Paywall A/B tests",
      "Subscription conversion",
    ],
    not_good_for: ["Apps needing a full backend database"],
    platforms: ["iOS", "Android", "React Native", "Flutter"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["RevenueCat", "Adapty", "Qonversion"],
    categorySlugs: ["paywalls", "monetization"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://superwall.com/pricing",
  },
  {
    name: "Qonversion",
    slug: "qonversion",
    tagline: "Subscription analytics, paywalls, and purchase infrastructure.",
    description:
      "Qonversion gives subscription apps SDKs, customer data, revenue analytics, experiments, and no-code paywall tools.",
    website_url: "https://qonversion.io/",
    pricing_summary:
      "Free up to a monthly tracked-revenue threshold, then percentage-of-revenue paid plans; enterprise is custom.",
    pricing_model: "usage_based",
    best_for: ["Subscription SDKs", "Revenue analytics", "Paywall experiments"],
    not_good_for: ["Non-subscription apps with no purchase flow"],
    platforms: ["iOS", "Android", "React Native", "Flutter", "Web"],
    app_stages: ["MVP", "Growth"],
    alternatives: ["RevenueCat", "Adapty", "Superwall"],
    categorySlugs: ["monetization", "paywalls"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://qonversion.io/pricing",
  },
  {
    name: "Supabase",
    slug: "supabase",
    tagline:
      "Open-source backend platform with Postgres, Auth, Storage, and Edge Functions.",
    description:
      "Supabase is a pragmatic backend default for indie apps that need relational data, auth, storage, APIs, and serverless functions quickly.",
    website_url: "https://supabase.com/",
    pricing_summary:
      "Free tier, then project-based paid plans and usage add-ons.",
    pricing_model: "freemium",
    best_for: ["Auth", "Postgres", "Rapid backend setup"],
    not_good_for: ["Teams that require fully managed Oracle or SQL Server"],
    platforms: ["iOS", "Android", "Web", "React Native", "Flutter"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["Firebase", "Appwrite", "Xano"],
    categorySlugs: ["backend"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://supabase.com/pricing",
  },
  {
    name: "Firebase",
    slug: "firebase",
    tagline:
      "Google-backed backend, analytics, crash reporting, and messaging suite.",
    description:
      "Firebase is a broad app platform covering auth, databases, storage, analytics, Crashlytics, Remote Config, Cloud Messaging, and hosting.",
    website_url: "https://firebase.google.com/",
    pricing_summary:
      "Spark free plan plus Blaze pay-as-you-go pricing across Firebase and Google Cloud usage.",
    pricing_model: "usage_based",
    best_for: ["Google ecosystem apps", "Realtime app backends", "Crashlytics"],
    not_good_for: ["Teams that require a relational-first data model"],
    platforms: ["iOS", "Android", "Web", "Unity", "Flutter"],
    app_stages: ["Prototype", "MVP", "Growth", "Scale"],
    alternatives: ["Supabase", "Appwrite", "AWS Amplify"],
    categorySlugs: ["backend", "analytics", "crash-reporting", "push"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://firebase.google.com/pricing",
  },
  {
    name: "Appwrite",
    slug: "appwrite",
    tagline:
      "Open-source backend platform for auth, databases, functions, and storage.",
    description:
      "Appwrite gives app teams a backend API for user auth, databases, file storage, functions, messaging, and self-hosted or cloud deployment paths.",
    website_url: "https://appwrite.io/",
    pricing_summary:
      "Free cloud tier plus paid plans; self-hosting is available for teams that want more control.",
    pricing_model: "freemium",
    best_for: [
      "Open-source backend",
      "Self-hosting option",
      "Auth and storage",
    ],
    not_good_for: ["Teams that need Postgres-specific SQL workflows"],
    platforms: ["iOS", "Android", "Web", "React Native", "Flutter"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["Supabase", "Firebase", "PocketBase"],
    categorySlugs: ["backend"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://appwrite.io/pricing",
  },
  {
    name: "TelemetryDeck",
    slug: "telemetrydeck",
    tagline: "Privacy-friendly analytics for apps.",
    description:
      "TelemetryDeck gives app developers product analytics and lightweight dashboards without invasive cross-site tracking.",
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
    categorySlugs: ["analytics"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://telemetrydeck.com/pricing/",
  },
  {
    name: "PostHog",
    slug: "posthog",
    tagline:
      "Product analytics, feature flags, replay, experiments, and surveys.",
    description:
      "PostHog is an open-source product analytics platform with event analytics, web analytics, session replay, feature flags, experimentation, and error tracking.",
    website_url: "https://posthog.com/",
    pricing_summary:
      "Generous free tier, then usage-based pricing by product once free limits are exceeded.",
    pricing_model: "usage_based",
    best_for: ["Product analytics", "Feature flags", "Session replay"],
    not_good_for: [
      "Teams that only need simple privacy-first aggregate metrics",
    ],
    platforms: ["iOS", "Android", "Web", "React Native", "Backend"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Amplitude", "Mixpanel", "TelemetryDeck"],
    categorySlugs: ["analytics"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://posthog.com/pricing",
  },
  {
    name: "Amplitude",
    slug: "amplitude",
    tagline:
      "Digital analytics for funnels, cohorts, retention, and experiments.",
    description:
      "Amplitude helps product teams analyze customer behavior, activation, retention, cohorts, journeys, and experiment performance.",
    website_url: "https://amplitude.com/",
    pricing_summary:
      "Free starter plan with paid growth and enterprise plans; check event and MTU limits before committing.",
    pricing_model: "freemium",
    best_for: ["Product analytics", "Funnels", "Retention analysis"],
    not_good_for: ["Tiny apps that only need a few aggregate counters"],
    platforms: ["iOS", "Android", "Web", "React Native", "Backend"],
    app_stages: ["Growth", "Scale"],
    alternatives: ["Mixpanel", "PostHog", "Firebase Analytics"],
    categorySlugs: ["analytics"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://amplitude.com/pricing",
  },
  {
    name: "Mixpanel",
    slug: "mixpanel",
    tagline:
      "Event analytics for funnels, retention, cohorts, and product usage.",
    description:
      "Mixpanel gives product teams event analytics, funnel analysis, retention views, cohorts, and dashboards for understanding user behavior.",
    website_url: "https://mixpanel.com/",
    pricing_summary:
      "Free plan with paid growth and enterprise plans based on usage and advanced needs.",
    pricing_model: "freemium",
    best_for: ["Event analytics", "Retention", "Funnels"],
    not_good_for: ["Apps that cannot maintain a clean event taxonomy"],
    platforms: ["iOS", "Android", "Web", "React Native", "Backend"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Amplitude", "PostHog", "Firebase Analytics"],
    categorySlugs: ["analytics"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://mixpanel.com/pricing/",
  },
  {
    name: "Sentry",
    slug: "sentry",
    tagline: "Error monitoring, performance tracing, logs, and session replay.",
    description:
      "Sentry helps developers detect, triage, and fix production errors with stack traces, release tracking, performance context, and alerts.",
    website_url: "https://sentry.io/",
    pricing_summary:
      "Free developer plan, paid team and business plans, and custom enterprise pricing.",
    pricing_model: "freemium",
    best_for: ["Crash reporting", "Error monitoring", "Performance tracing"],
    not_good_for: ["Teams that only need app-store review monitoring"],
    platforms: ["iOS", "Android", "React Native", "Flutter", "Web", "Backend"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Bugsnag", "Firebase Crashlytics", "Instabug"],
    categorySlugs: ["crash-reporting", "dev-productivity"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://sentry.io/pricing/",
  },
  {
    name: "OneSignal",
    slug: "onesignal",
    tagline: "Push notifications, in-app messaging, email, and SMS journeys.",
    description:
      "OneSignal gives app teams messaging infrastructure for push notifications, in-app messages, email, SMS, journeys, and segmentation.",
    website_url: "https://onesignal.com/",
    pricing_summary:
      "Free plan plus paid plans for larger audiences, more channels, and advanced messaging features.",
    pricing_model: "freemium",
    best_for: ["Push notifications", "Lifecycle messaging", "In-app messages"],
    not_good_for: ["Teams that already run all messaging through a CDP suite"],
    platforms: ["iOS", "Android", "Web", "React Native", "Flutter"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Firebase Cloud Messaging", "Braze", "Customer.io"],
    categorySlugs: ["push", "email-waitlists"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://onesignal.com/pricing",
  },
  {
    name: "Braze",
    slug: "braze",
    tagline:
      "Enterprise customer engagement across push, email, SMS, and in-app messaging.",
    description:
      "Braze is a customer engagement platform for cross-channel campaigns, journeys, personalization, segmentation, and lifecycle messaging at scale.",
    website_url: "https://www.braze.com/",
    pricing_summary:
      "Sales-led platform editions with pricing that scales by monthly active users and messaging needs.",
    pricing_model: "custom",
    best_for: [
      "Lifecycle campaigns",
      "Enterprise messaging",
      "Cross-channel personalization",
    ],
    not_good_for: ["Early indie apps that only need basic push notifications"],
    platforms: ["iOS", "Android", "Web", "React Native"],
    app_stages: ["Growth", "Scale"],
    alternatives: ["OneSignal", "Customer.io", "Iterable"],
    categorySlugs: ["push", "email-waitlists"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.braze.com/pricing",
  },
  {
    name: "Appfigures",
    slug: "appfigures",
    tagline: "App intelligence, ASO, reviews, rankings, and store analytics.",
    description:
      "Appfigures helps app teams monitor downloads, revenue, reviews, rankings, ASO keywords, app intelligence, and store performance.",
    website_url: "https://appfigures.com/",
    pricing_summary:
      "Paid plans start with app analytics and scale into ASO and market-intelligence bundles.",
    pricing_model: "paid",
    best_for: ["ASO tracking", "App intelligence", "Review monitoring"],
    not_good_for: ["Teams that need only screenshot design"],
    platforms: ["iOS", "Android", "Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["AppTweak", "AppFollow", "Sensor Tower"],
    categorySlugs: ["aso", "analytics"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://appfigures.com/platform/pricing",
  },
  {
    name: "AppTweak",
    slug: "apptweak",
    tagline: "ASO intelligence, keyword research, and app store growth tools.",
    description:
      "AppTweak helps teams research keywords, benchmark competitors, audit app listings, track rankings, and improve app store visibility.",
    website_url: "https://www.apptweak.com/",
    pricing_summary:
      "Paid plans for ASO and app intelligence, with higher tiers for larger teams and advanced research.",
    pricing_model: "paid",
    best_for: ["Keyword research", "ASO audits", "Competitor tracking"],
    not_good_for: ["Teams looking for backend infrastructure"],
    platforms: ["iOS", "Android", "Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Appfigures", "AppFollow", "Sensor Tower"],
    categorySlugs: ["aso"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.apptweak.com/en/pricing",
  },
  {
    name: "AppFollow",
    slug: "appfollow",
    tagline: "Review management, ASO monitoring, and app reputation workflows.",
    description:
      "AppFollow helps mobile teams monitor reviews, respond to ratings, track app store performance, and manage customer feedback workflows.",
    website_url: "https://appfollow.io/",
    pricing_summary:
      "Paid plans for review management and app monitoring; check current tiers for review and integration limits.",
    pricing_model: "paid",
    best_for: ["Review monitoring", "Support workflows", "ASO reporting"],
    not_good_for: ["Teams that need paywall infrastructure"],
    platforms: ["iOS", "Android", "Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Appfigures", "AppTweak", "Sensor Tower"],
    categorySlugs: ["aso"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://appfollow.io/pricing",
  },
  {
    name: "Framer",
    slug: "framer",
    tagline: "Visual website builder for landing pages and launch sites.",
    description:
      "Framer helps founders design and publish responsive marketing sites with visual editing, CMS content, animations, hosting, and localization options.",
    website_url: "https://www.framer.com/",
    pricing_summary:
      "Free plan plus paid site plans and workspace/team add-ons.",
    pricing_model: "freemium",
    best_for: ["Launch pages", "Visual design", "Marketing sites"],
    not_good_for: ["Teams that need native mobile app UI"],
    platforms: ["Web"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["Webflow", "Carrd", "Typedream"],
    categorySlugs: ["landing-pages"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.framer.com/pricing",
  },
  {
    name: "Webflow",
    slug: "webflow",
    tagline:
      "Visual website builder, CMS, hosting, and marketing site platform.",
    description:
      "Webflow lets teams build polished websites with visual design tools, CMS collections, hosting, forms, localization, and collaboration workflows.",
    website_url: "https://webflow.com/",
    pricing_summary:
      "Free starter option, paid site plans, ecommerce plans, workspace plans, and enterprise options.",
    pricing_model: "freemium",
    best_for: ["Marketing websites", "CMS pages", "No-code launch sites"],
    not_good_for: ["Native mobile app builds"],
    platforms: ["Web"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Framer", "WordPress", "Squarespace"],
    categorySlugs: ["landing-pages"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://webflow.com/pricing",
  },
  {
    name: "beehiiv",
    slug: "beehiiv",
    tagline:
      "Newsletter platform for publishing, audience growth, and monetization.",
    description:
      "beehiiv helps teams launch newsletters, capture subscribers, publish posts, grow audiences, and monetize with ads or paid subscriptions.",
    website_url: "https://www.beehiiv.com/",
    pricing_summary:
      "Free launch plan plus paid plans for growth, monetization, automation, and scale.",
    pricing_model: "freemium",
    best_for: ["Newsletters", "Audience growth", "Content distribution"],
    not_good_for: ["Transactional app email only"],
    platforms: ["Web"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["Kit", "Substack", "Mailchimp"],
    categorySlugs: ["email-waitlists"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.beehiiv.com/pricing",
  },
  {
    name: "Kit",
    slug: "kit",
    tagline:
      "Creator email marketing, forms, automations, and digital product sales.",
    description:
      "Kit gives creators and small teams email capture, landing pages, newsletters, automations, segmentation, and monetization tools.",
    website_url: "https://kit.com/",
    pricing_summary:
      "Free newsletter plan with paid plans based on subscriber count and advanced automation needs.",
    pricing_model: "freemium",
    best_for: ["Email lists", "Waitlists", "Creator newsletters"],
    not_good_for: ["High-volume transactional email infrastructure"],
    platforms: ["Web"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["beehiiv", "Mailchimp", "ConvertKit"],
    categorySlugs: ["email-waitlists", "landing-pages"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://kit.com/pricing",
  },
  {
    name: "AppScreens",
    slug: "appscreens",
    tagline:
      "App Store and Google Play screenshot generator with localization workflows.",
    description:
      "AppScreens helps app teams create store screenshots, localize captions, export store-ready sizes, and manage screenshot projects for releases.",
    website_url: "https://appscreens.com/",
    pricing_summary:
      "Free basic plan, then paid Pro and Scale plans for more projects, localizations, templates, and uploads.",
    pricing_model: "freemium",
    best_for: ["Store screenshots", "Localization", "ASO creative updates"],
    not_good_for: ["Full product analytics or backend work"],
    platforms: ["iOS", "Android", "Web"],
    app_stages: ["MVP", "Growth"],
    alternatives: ["Screenshots Pro", "AppLaunchpad", "Previewed"],
    categorySlugs: ["screenshots", "aso"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://appscreens.com/pricing",
  },
  {
    name: "Screenshots Pro",
    slug: "screenshots-pro",
    tagline: "Fast app screenshot generator for store listing assets.",
    description:
      "Screenshots Pro helps developers create polished App Store screenshots with templates, device frames, captions, and export workflows.",
    website_url: "https://screenshots.pro/",
    pricing_summary:
      "Paid screenshot generation plans; verify current export and template limits before purchase.",
    pricing_model: "paid",
    best_for: ["Screenshot mockups", "Store listing visuals", "Fast exports"],
    not_good_for: ["ASO keyword tracking"],
    platforms: ["iOS", "Android", "Web"],
    app_stages: ["MVP", "Growth"],
    alternatives: ["AppScreens", "Previewed", "AppLaunchpad"],
    categorySlugs: ["screenshots"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://screenshots.pro/pricing",
  },
  {
    name: "Codemagic",
    slug: "codemagic",
    tagline: "CI/CD for Flutter, React Native, native iOS, Android, and more.",
    description:
      "Codemagic provides hosted CI/CD, macOS build machines, code signing workflows, app store publishing, and mobile-focused build automation.",
    website_url: "https://codemagic.io/",
    pricing_summary:
      "Free individual build minutes, pay-as-you-go build minutes, fixed-price annual plans, and enterprise options.",
    pricing_model: "usage_based",
    best_for: ["Mobile CI/CD", "Flutter builds", "App Store deployment"],
    not_good_for: ["Teams that only deploy static websites"],
    platforms: ["iOS", "Android", "Flutter", "React Native", "Unity"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Bitrise", "GitHub Actions", "fastlane"],
    categorySlugs: ["dev-productivity"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://codemagic.io/pricing/",
  },
  {
    name: "Bitrise",
    slug: "bitrise",
    tagline: "Mobile CI/CD platform for build, test, and release workflows.",
    description:
      "Bitrise helps mobile teams automate builds, tests, code signing, app distribution, and release workflows with mobile-specific steps.",
    website_url: "https://bitrise.io/",
    pricing_summary:
      "Free/starter options and paid plans for more build minutes, concurrency, teams, and enterprise needs.",
    pricing_model: "freemium",
    best_for: ["Mobile CI/CD", "Release automation", "Code signing workflows"],
    not_good_for: [
      "Simple apps that can run entirely on local release scripts",
    ],
    platforms: ["iOS", "Android", "React Native", "Flutter"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Codemagic", "GitHub Actions", "fastlane"],
    categorySlugs: ["dev-productivity"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://bitrise.io/pricing",
  },
  {
    name: "Emerge Tools",
    slug: "emerge-tools",
    tagline: "Mobile app performance, size, and regression monitoring.",
    description:
      "Emerge Tools helps mobile teams monitor app size, performance, startup time, binary diffs, snapshots, and release regressions.",
    website_url: "https://www.emergetools.com/",
    pricing_summary:
      "Paid and sales-led plans for mobile performance monitoring; verify current plan limits before purchase.",
    pricing_model: "paid",
    best_for: [
      "App size monitoring",
      "Performance regression detection",
      "Release quality",
    ],
    not_good_for: ["Teams looking for backend hosting"],
    platforms: ["iOS", "Android"],
    app_stages: ["Growth", "Scale"],
    alternatives: ["Sentry", "Firebase Performance", "Xcode Organizer"],
    categorySlugs: ["dev-productivity"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://www.emergetools.com/pricing",
  },
  {
    name: "fastlane",
    slug: "fastlane",
    tagline:
      "Open-source automation for screenshots, beta distribution, and app releases.",
    description:
      "fastlane automates common mobile release work such as screenshots, certificates, metadata, TestFlight, Google Play, and deployment lanes.",
    website_url: "https://fastlane.tools/",
    pricing_summary:
      "Open-source tool; infrastructure costs depend on where automations run.",
    pricing_model: "open_source",
    best_for: ["Release automation", "Screenshots", "App Store deployment"],
    not_good_for: ["Teams that want a fully hosted CI dashboard by default"],
    platforms: ["iOS", "Android"],
    app_stages: ["MVP", "Growth", "Scale"],
    alternatives: ["Codemagic", "Bitrise", "GitHub Actions"],
    categorySlugs: ["dev-productivity", "screenshots"],
    internal_notes:
      "Pricing/features checked 2026-06-29 from https://fastlane.tools/",
  },
];

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
          name: "Paywalls",
          slug: "paywalls",
          description:
            "Paywall builders, subscription screens, and pricing tests.",
          sort_order: 20,
          status: "published",
          seo_title: "Paywall Tools for Mobile Apps",
        },
        {
          name: "ASO",
          slug: "aso",
          description:
            "App Store Optimization research, metadata, and launch assets.",
          sort_order: 30,
          status: "published",
          seo_title: "ASO Tools for Mobile Apps",
        },
        {
          name: "Analytics",
          slug: "analytics",
          description:
            "Privacy-conscious analytics, event tracking, and product insights.",
          sort_order: 40,
          status: "published",
          seo_title: "Analytics Tools for Mobile Apps",
        },
        {
          name: "Crash Reporting",
          slug: "crash-reporting",
          description:
            "Crash reporting, diagnostics, and production issue monitoring.",
          sort_order: 50,
          status: "published",
          seo_title: "Crash Reporting Tools for Mobile Apps",
        },
        {
          name: "Backend",
          slug: "backend",
          description:
            "Databases, auth, APIs, storage, and server infrastructure for mobile apps.",
          sort_order: 60,
          status: "published",
          seo_title: "Backend Tools for Mobile Apps",
        },
        {
          name: "Push",
          slug: "push",
          description:
            "Push notification infrastructure and lifecycle messaging.",
          sort_order: 70,
          status: "published",
          seo_title: "Push Notification Tools for Mobile Apps",
        },
        {
          name: "Landing Pages",
          slug: "landing-pages",
          description:
            "Landing page builders, launch pages, and waitlist sites.",
          sort_order: 80,
          status: "published",
          seo_title: "Landing Page Tools for Mobile Apps",
        },
        {
          name: "Email/Waitlists",
          slug: "email-waitlists",
          description:
            "Email capture, waitlists, newsletters, and lifecycle email.",
          sort_order: 90,
          status: "published",
          seo_title: "Email and Waitlist Tools for Mobile Apps",
        },
        {
          name: "Screenshots",
          slug: "screenshots",
          description:
            "App Store screenshots, preview assets, and visual listing tools.",
          sort_order: 100,
          status: "published",
          seo_title: "App Screenshot Tools for Mobile Apps",
        },
        {
          name: "Dev Productivity",
          slug: "dev-productivity",
          description:
            "Developer productivity, release workflow, QA, and automation tools.",
          sort_order: 110,
          status: "published",
          seo_title: "Developer Productivity Tools for Mobile Apps",
        },
      ],
      { onConflict: "slug" },
    ),
  );

  const tools = bySlug(
    await upsert(
      "tools",
      seedTools.map((tool) => {
        const row = { ...tool };
        delete row.categorySlugs;

        return {
          ...row,
          pricing_last_checked: pricingLastChecked,
          published_at: publishedAt,
          status: "published",
        };
      }),
      { onConflict: "slug" },
    ),
  );

  await upsert(
    "tool_categories",
    seedTools.flatMap((tool) =>
      tool.categorySlugs.map((categorySlug, index) => ({
        category_id: categories.get(categorySlug).id,
        sort_order: (index + 1) * 10,
        tool_id: tools.get(tool.slug).id,
      })),
    ),
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
