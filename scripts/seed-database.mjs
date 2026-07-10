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
    pricing_last_checked: "2026-07-01",
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
      "Pricing/features checked 2026-07-01 from https://www.revenuecat.com/pricing/ and https://www.revenuecat.com/docs/",
  },
  {
    name: "Adapty",
    slug: "adapty",
    tagline:
      "Subscription infrastructure, paywalls, experiments, and revenue analytics.",
    description:
      "Adapty combines purchase infrastructure with no-code paywalls, A/B testing, subscription analytics, and integrations for apps optimizing recurring revenue.",
    website_url: "https://adapty.io/",
    pricing_last_checked: "2026-07-01",
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
      "Pricing/features checked 2026-07-01 from https://adapty.io/pricing/ and https://adapty.io/docs/",
  },
  {
    name: "Superwall",
    slug: "superwall",
    tagline:
      "Remotely configurable paywalls and experimentation for subscription apps.",
    description:
      "Superwall helps teams design, target, and test native paywalls without app releases, with analytics for conversion experiments.",
    website_url: "https://superwall.com/",
    pricing_last_checked: "2026-07-01",
    pricing_summary:
      "Free and paid tiers based on monthly attributed revenue, plus custom enterprise pricing.",
    pricing_model: "usage_based",
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
      "Pricing/features checked 2026-07-01 from https://superwall.com/pricing and https://docs.superwall.com/",
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
    categorySlugs: ["launch", "landing-pages"],
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
    categorySlugs: ["launch", "landing-pages"],
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
    categorySlugs: ["launch", "email-waitlists"],
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
    categorySlugs: ["launch", "email-waitlists", "landing-pages"],
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
    categorySlugs: ["launch", "screenshots", "aso"],
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
    categorySlugs: ["launch", "screenshots"],
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
            "Compare subscription, paywall, purchase, and revenue tooling for mobile apps that need to charge confidently from the first release.",
          sort_order: 10,
          status: "published",
          seo_description:
            "Compare mobile app monetization tools for subscriptions, paywalls, entitlements, revenue analytics, and pricing experiments.",
          seo_title: "Mobile App Monetization Tools",
        },
        {
          name: "Paywalls",
          slug: "paywalls",
          description:
            "Pick paywall builders and testing tools for mobile subscription flows, remote configuration, and pricing experiments.",
          sort_order: 20,
          status: "published",
          seo_description:
            "Compare mobile paywall tools for subscription screens, remote config, A/B testing, and conversion analytics.",
          seo_title: "Paywall Tools for Mobile Apps",
        },
        {
          name: "ASO",
          slug: "aso",
          description:
            "Research keywords, competitors, reviews, rankings, and creative assets that help mobile apps earn qualified store traffic.",
          sort_order: 30,
          status: "published",
          seo_description:
            "Compare ASO tools for app keyword research, rankings, reviews, competitor tracking, and store listing optimization.",
          seo_title: "ASO Tools for Mobile Apps",
        },
        {
          name: "Analytics",
          slug: "analytics",
          description:
            "Choose analytics tools that explain onboarding, retention, feature adoption, and revenue without burying indie teams in noise.",
          sort_order: 40,
          status: "published",
          seo_description:
            "Compare mobile analytics tools for event tracking, funnels, retention, privacy-friendly dashboards, and product decisions.",
          seo_title: "Analytics Tools for Mobile Apps",
        },
        {
          name: "Crash Reporting",
          slug: "crash-reporting",
          description:
            "Monitor crashes, errors, regressions, and production quality so releases stay trustworthy after app store approval.",
          sort_order: 50,
          status: "published",
          seo_description:
            "Compare crash reporting and error monitoring tools for mobile apps, production diagnostics, alerts, and release quality.",
          seo_title: "Crash Reporting Tools for Mobile Apps",
        },
        {
          name: "Backend",
          slug: "backend",
          description:
            "Find backend platforms for auth, databases, APIs, storage, server-side logic, and app data that needs to sync across devices.",
          sort_order: 60,
          status: "published",
          seo_description:
            "Compare backend tools for mobile apps, including auth, databases, APIs, storage, serverless functions, and realtime data.",
          seo_title: "Backend Tools for Mobile Apps",
        },
        {
          name: "Push",
          slug: "push",
          description:
            "Send push notifications and lifecycle messages that bring users back without turning your app into a notification machine.",
          sort_order: 70,
          status: "published",
          seo_description:
            "Compare push notification tools for mobile apps, lifecycle messaging, segmentation, in-app messages, and campaigns.",
          seo_title: "Push Notification Tools for Mobile Apps",
        },
        {
          name: "Launch",
          slug: "launch",
          description:
            "Plan launch pages, waitlists, newsletters, screenshots, and early distribution channels before and after app store release.",
          sort_order: 75,
          status: "published",
          seo_description:
            "Compare launch tools for mobile apps, including landing pages, waitlists, newsletters, screenshots, and early marketing workflows.",
          seo_title: "Mobile App Launch Tools",
        },
        {
          name: "Landing Pages",
          slug: "landing-pages",
          description:
            "Build launch pages, product websites, CMS pages, and waitlist funnels that explain the app before someone installs it.",
          sort_order: 80,
          status: "published",
          seo_description:
            "Compare landing page tools for mobile app launch pages, product sites, waitlists, forms, and CMS-backed marketing pages.",
          seo_title: "Landing Page Tools for Mobile Apps",
        },
        {
          name: "Email/Waitlists",
          slug: "email-waitlists",
          description:
            "Capture early demand, send launch updates, and keep users warm with waitlists, newsletters, and simple lifecycle email.",
          sort_order: 90,
          status: "published",
          seo_description:
            "Compare email and waitlist tools for mobile app launches, newsletters, automations, signup forms, and audience growth.",
          seo_title: "Email and Waitlist Tools for Mobile Apps",
        },
        {
          name: "Screenshots",
          slug: "screenshots",
          description:
            "Create app store screenshots, preview assets, localized captions, and visual listing updates that support ASO and launches.",
          sort_order: 100,
          status: "published",
          seo_description:
            "Compare screenshot tools for App Store and Google Play images, device frames, localization, captions, and export workflows.",
          seo_title: "App Screenshot Tools for Mobile Apps",
        },
        {
          name: "Dev Productivity",
          slug: "dev-productivity",
          description:
            "Automate mobile builds, releases, QA, performance checks, screenshots, and repetitive launch work as your app matures.",
          sort_order: 110,
          status: "published",
          seo_description:
            "Compare developer productivity tools for mobile CI/CD, release automation, QA, app performance, and build workflows.",
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
          pricing_last_checked: row.pricing_last_checked ?? pricingLastChecked,
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
            application_url: "https://www.revenuecat.com/partners/",
            commission_notes:
              "Program type: partner. Official page mentions referral revenue and various referral incentives, but exact commission terms are not public.",
            cookie_notes:
              "No public cookie window found on the official partner page checked 2026-07-01.",
            allowed_promotion_notes:
              "Apply as a subscription-app content partner. Use direct editorial links only until approval, terms, and disclosure requirements are recorded.",
            internal_notes:
              "Checked 2026-07-01. Strongest fit for subscription MVP stack, monetization tools, paywall tools, and RevenueCat vs Adapty vs Superwall pages. Outreach angle: IndieAppStack is a source-checked field guide for solo mobile builders choosing subscription infrastructure.",
          },
          {
            name: "Framer Creator Program",
            network: "direct",
            status: "not_applied",
            application_url: "https://www.framer.com/creators",
            commission_notes:
              "Program type: affiliate/creator. Official page says creators can refer users and get up to 50% commission; it also says 50% of a referred user's subscription is paid for 12 months when they upgrade.",
            cookie_notes:
              "No public cookie window found on the official creator page checked 2026-07-01.",
            allowed_promotion_notes:
              "Best fit for landing page builder, launch page, template, and no-code marketing site content. Use direct editorial links only until approval and terms are recorded.",
            internal_notes:
              "Checked 2026-07-01. Application should emphasize Framer content for solo app landing pages, web-to-app launches, template workflows, and polished marketing sites.",
          },
          {
            name: "Appwrite Partner Program",
            network: "direct",
            status: "not_applied",
            application_url: "https://appwrite.io/partners",
            commission_notes:
              "Program type: partner. Official page describes partner tiers, experts, integrations, co-marketing style benefits, and application review; no public affiliate commission was found.",
            cookie_notes:
              "No public cookie window found on the official partner page checked 2026-07-01.",
            allowed_promotion_notes:
              "Treat as partner/outreach, not a content affiliate program. Use direct editorial links only unless Appwrite approves a monetized partner path and terms are recorded.",
            internal_notes:
              "Checked 2026-07-01. Best fit after backend comparison content gains credibility. Outreach angle: Appwrite is represented as the open-source/self-hosting backend option for indie mobile builders.",
          },
          {
            name: "Webflow Affiliate Program",
            network: "partnerstack",
            status: "not_applied",
            application_url: "https://webflow.com/solutions/affiliates",
            commission_notes:
              "Program type: affiliate. Official page says affiliates earn commission on a new customer's first eligible subscription for up to 12 months; exact rate and qualifications require program terms/dashboard.",
            cookie_notes:
              "Official page lists first-touch attribution and a 90-day cookie window.",
            allowed_promotion_notes:
              "Apply only for relevant content channels with sample content and traffic context. Client implementation work belongs in Webflow's Certified Partner Program, not the affiliate program.",
            internal_notes:
              "Checked 2026-07-01. Official source now verified. Keep status not_applied until application is submitted; do not claim approval or use Webflow monetized links before acceptance.",
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
            "A practical decision guide for choosing subscription, paywall, backend, and analytics tools without overbuilding.",
          excerpt:
            "A source-checked guide to choosing the smallest useful monetization stack for a solo mobile app.",
          body_markdown: `## Short answer
If you are launching a solo mobile app, start with the smallest stack that can safely sell, unlock, and measure the product. For most subscription apps, that means [RevenueCat](/tools/revenuecat) for purchases and entitlements, one analytics layer such as [TelemetryDeck](/tools/telemetrydeck) or [PostHog](/tools/posthog), crash reporting before public launch, and [Supabase](/tools/supabase) only if the app needs accounts, synced data, or server-owned records.

Do not add paywall experimentation, attribution, CRM, or a data warehouse before the app has enough traffic for those tools to change decisions.

> [!NOTE] How to read this guide
> Treat this as a decision framework, not a universal ranking. Start with the job your app needs done, then verify current pricing and docs before committing.

## Use the visual first
The decision tree for this guide is available at [Monetization tool decision tree](/content-visuals/articles/monetization-tools-decision-tree.svg). It routes the choice by revenue model, paywall iteration needs, backend needs, and analytics maturity.

Alt text: Decision tree routing solo mobile developers from revenue model to subscription stack, paywall tools, backend, and analytics choices.

## The decision framework
Before choosing tools, answer these four questions in order:

- What takes payment: subscriptions, one-time purchases, ads, leads, or a mixed model?
- What must unlock immediately after payment: premium screens, credits, synced data, or server-side access?
- What decision will analytics change this month?
- What can wait until there is real traffic?

If a tool does not answer one of those questions, it is probably a later-stage tool.

:::comparison Monetization stack decisions
| Decision | Best first move | Add later when |
| --- | --- | --- |
| Selling subscriptions | RevenueCat for purchases, receipt validation, and entitlements | Paywall tests need a dedicated workflow |
| Improving paywalls | Keep copy and price tests manual at first | You have enough paywall traffic to learn from experiments |
| Storing user data | Skip a backend unless accounts or synced data are needed | Server-owned records, teams, history, or cross-device sync matter |
| Reading product signal | Track a small event set | Funnels, cohorts, and experiments change weekly decisions |
| Growing acquisition | Use simple source notes and App Store data | Paid acquisition or attribution spend becomes meaningful |
:::

## Tool-by-tool fit
### RevenueCat
Use [RevenueCat](/tools/revenuecat) when subscriptions, receipt validation, entitlement state, and cross-platform customer data are the core job. It is the cleanest default for a solo subscription MVP because it keeps purchase infrastructure separate from the rest of the app.

Delay deeper growth tooling until the first purchase path, restore flow, entitlement checks, and refund edge cases are boring.

### Adapty
Use [Adapty](/tools/adapty) when the operating problem is not just selling subscriptions, but changing paywalls, watching subscription analytics, and running experiments from a marketing or growth workflow.

For a brand-new solo app, Adapty is worth evaluating if paywall iteration is central from day one. If the first goal is simply durable purchase infrastructure, it may be more tool than the first sprint needs.

### Superwall
Use [Superwall](/tools/superwall) when remote paywall presentation and fast creative iteration are the main bottleneck. It fits teams that expect to change paywall layouts, targeting, and tests without waiting on app releases.

For a low-traffic MVP, keep paywall assumptions simple first. Add a dedicated paywall workflow when experiments have enough volume to teach you something.

### Qonversion
Use [Qonversion](/tools/qonversion) when you want subscription SDKs, paywalls, customer data, analytics, and integrations in one subscription-focused operating surface. It is most interesting as an alternative to compare against RevenueCat, Adapty, and Superwall when you want a bundled workflow.

Check the current Qonversion pricing page before committing because its public pricing and included features can change.

### Supabase
Use [Supabase](/tools/supabase) only when monetization depends on account-backed data: saved projects, team access, server-owned credits, cross-device history, or a customer portal backed by your own records.

If the app can unlock premium features locally after a verified entitlement, Supabase can wait. A backend adds power, but it also adds migrations, privacy decisions, and failure modes.

### Analytics tools
Use [TelemetryDeck](/tools/telemetrydeck) when you want a lightweight, privacy-friendly app analytics layer. Use [PostHog](/tools/posthog) when the app or web funnel needs product analytics, funnels, feature flags, experiments, or session replay in one broader system. Use Firebase Analytics when the app is already deeply in the Firebase ecosystem.

The first analytics plan should be tiny: activation, paywall view, purchase started, purchase completed, restore attempted, key feature used, and churn-risk signals the developer can actually act on.

## Starter stacks by stage
:::comparison Starter stacks
| Stage | Stack | Why |
| --- | --- | --- |
| Validate willingness to pay | Manual landing page, waitlist, App Store pricing research | Learn the offer before installing a growth stack |
| First subscription MVP | RevenueCat, crash reporting, small analytics taxonomy | Sell and unlock reliably before optimizing |
| Account-backed subscription app | RevenueCat, Supabase, analytics, crash reporting | Add backend only when user data must persist or sync |
| Paywall optimization | RevenueCat or Adapty plus Superwall or native experiments | Add tests when traffic can support decisions |
| Growth stage | Analytics, attribution, lifecycle email, reporting | Add complexity once acquisition and retention loops exist |
:::

## What to revisit later
Revisit these after the app has real subscription traffic:

- Paywall A/B testing and remote targeting.
- Lifecycle email and winback flows.
- Attribution and paid acquisition reporting.
- Data warehouse exports.
- CRM and customer support automation.
- Pricing localization and advanced segmentation.

## Internal links
- Start with the [monetization tools category](/categories/monetization) for the full tool list.
- Use the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) when the app is subscription-first.
- Compare [RevenueCat vs Adapty vs Superwall](/comparisons/revenuecat-vs-adapty-ios-subscriptions) before adding paywall experiments.
- Browse the broader [paywall tools category](/categories/paywalls) when you need more options.
- Pair this with the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack).
- Use the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps) before public launch.
- Review [backend tools](/categories/backend) before adding synced data.

## Source checks
Pricing and feature claims were checked on 2026-07-01 against official sources:

- RevenueCat pricing and docs: https://www.revenuecat.com/pricing/ and https://www.revenuecat.com/docs/
- Adapty pricing and docs: https://adapty.io/pricing/ and https://adapty.io/docs/
- Superwall pricing and docs: https://superwall.com/pricing and https://docs.superwall.com/
- Qonversion pricing: https://qonversion.io/pricing
- Supabase pricing and docs: https://supabase.com/pricing and https://supabase.com/docs
- TelemetryDeck docs and plans: https://telemetrydeck.com/docs/ and https://dashboard.telemetrydeck.com/plans
- PostHog pricing and docs: https://posthog.com/pricing and https://posthog.com/docs

No hands-on testing claims are made in this article. Screenshots are not used. The visual is a generated conceptual decision tree.

Last checked: 2026-07-01.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("monetization").id,
          seo_title: "Best monetization tools for solo mobile developers",
          seo_description:
            "Choose mobile app monetization tools for subscriptions, paywalls, backend, and analytics without overbuilding your solo developer stack.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Subscription MVP stack for a solo iOS app",
          slug: "subscription-mvp-stack-solo-ios-app",
          subtitle:
            "The smallest useful stack for purchases, entitlements, backend, analytics, crashes, and launch basics without building a platform too early.",
          excerpt:
            "A practical stack map for solo iOS developers launching a subscription MVP with source-checked tool choices.",
          body_markdown: `## Short answer
For a solo iOS subscription MVP, keep the stack boring: App Store Connect owns the subscription products, [RevenueCat](/tools/revenuecat) owns purchase and entitlement truth, the app owns the paywall and unlock decision, crash reporting catches release regressions, and analytics tracks only the few events you will act on this month.

Add a backend only when paid value depends on account-backed data, synced history, credits, teams, or server-owned records. If the first version can unlock premium features from a verified entitlement, postpone the backend until the product proves it needs one.

> [!NOTE] Solo builder scope
> This guide is for a solo builder shipping a real subscription MVP, not a mature growth team. The goal is fewer moving parts, clearer failure modes, and enough measurement to make the next release smarter.

## Stack map
![Subscription MVP stack map showing iOS app, RevenueCat, entitlement decision, optional Supabase backend, TelemetryDeck analytics, Sentry crash reporting, and delayed growth tools.](/content-visuals/articles/subscription-mvp-stack-map.svg "Each block has one job. Add tools only when they protect launch quality or answer a decision.")

## The smallest useful stack
:::comparison Subscription MVP responsibilities
| Responsibility | Default choice | What it should do |
| --- | --- | --- |
| Subscription products | App Store Connect | Define subscription group, products, prices, trials, review notes, and store metadata |
| Purchase and entitlement truth | RevenueCat | Handle SDK purchase flow, receipt validation, restore purchases, customer state, and entitlement checks |
| Paywall and unlock logic | Your iOS app | Explain the paid promise, show products, call purchase or restore, and unlock only from entitlement state |
| Backend | Supabase only if needed | Store accounts, synced data, server-owned records, credits, or customer portal data |
| Analytics | TelemetryDeck, Firebase Analytics, or a tiny event layer | Track activation, paywall, purchase, restore, and core feature signals |
| Crash reporting | Sentry or Firebase Crashlytics | Catch crashes before and after launch, connect crashes to releases, and triage regressions |
| Launch basics | App Store Connect plus a checklist | Prepare privacy labels, support URL, review notes, TestFlight feedback, and post-launch monitoring |
:::

## What each layer owns
### Payments
Apple still controls the App Store purchase surface for normal in-app subscriptions. Treat App Store Connect setup as part of product design, not admin work: subscription group, product names, display copy, trial or intro offer decisions, review notes, and restore behavior all affect whether the first purchase path feels trustworthy.

Do not start by building a custom purchase backend. The first job is to make the official in-app purchase path reliable.

### Entitlements
Use [RevenueCat](/tools/revenuecat) when the app needs a clean source of truth for active subscriptions, restored purchases, customer IDs, and entitlement checks. The entitlement should answer one boring question: should this user see the paid experience right now?

Keep entitlement names product-agnostic. For example, use a durable entitlement such as Pro access instead of tying app logic to one monthly product. That gives you room to add annual plans, trials, or migrated products later.

### Backend
Skip the backend if the paid feature is local and RevenueCat entitlement state is enough. Add [Supabase](/tools/supabase), [Firebase](/tools/firebase), or [Appwrite](/tools/appwrite) when the subscription unlocks data that must live outside the device.

:::comparison Backend choice
| Need | Use this direction | Why |
| --- | --- | --- |
| Relational user data, SQL reporting, server-owned records | Supabase | Postgres is easier to inspect and model when data has relationships |
| Google-first mobile stack, Firestore, Crashlytics, Analytics nearby | Firebase | Useful when the app already benefits from the Firebase mobile ecosystem |
| Open-source backend preference or self-hosting path | Appwrite | Useful when ownership and a broader open-source backend surface matter |
| No synced data yet | No backend | The lowest-risk backend is the one you do not operate yet |
:::

### Analytics
Start with a tiny event taxonomy. For most MVPs, you need activation, paywall viewed, purchase started, purchase completed, restore attempted, subscription status changed if available, and one or two core paid-feature events.

Use [TelemetryDeck](/tools/telemetrydeck) when privacy-friendly app analytics is the main job. Use Firebase Analytics when the app already depends on Firebase. Do not install a heavyweight product analytics workflow until there is enough traffic to support weekly decisions.

### Crash reporting
Install crash reporting before a public launch, not after the first angry review. [Sentry](/tools/sentry) is a strong standalone crash and error monitoring choice. Firebase Crashlytics is a good fit when Firebase is already in the app.

Crash tooling only helps if you triage it. Before launch, decide who checks crashes, what severity blocks release, and how release versions are named.

### Launch basics
The stack is not publishable until the purchase path is reviewable and recoverable. Before sending the app to review, check:

- Products and subscription group are configured in App Store Connect.
- Paywall copy explains what the subscription unlocks.
- Restore purchases is visible and tested.
- Privacy labels match analytics and crash SDK behavior.
- Support URL and contact path work.
- TestFlight testers can buy in sandbox or verify the purchase flow.
- Crash reporting is connected to release versions.
- App Store review notes explain where to find the paywall and how to test access.

## Setup sequence
:::comparison Build order
| Order | Step | Acceptance check |
| --- | --- | --- |
| 1 | Define the paid promise | One sentence explains what becomes better after subscribing |
| 2 | Configure App Store Connect | Subscription group, products, display names, prices, and review notes exist |
| 3 | Add RevenueCat | The app can fetch offerings, buy, restore, and read entitlement state |
| 4 | Build the paywall | Paywall copy, product display, purchase state, errors, and restore are handled |
| 5 | Add crash reporting | Test crash or non-fatal signal appears with app version context |
| 6 | Add analytics | A small event list answers activation, paywall, purchase, restore, and paid-feature use |
| 7 | Add backend only if needed | Account-backed or synced data has a real product reason |
| 8 | Prepare launch | Privacy labels, support URL, screenshots, review notes, and post-launch triage are ready |
:::

## What to postpone
Postpone anything that needs traffic, operational discipline, or team bandwidth you do not have yet:

- Paywall A/B testing tools before meaningful paywall volume.
- Attribution platforms before paid acquisition.
- Data warehouse exports before recurring reporting pain.
- CRM and lifecycle automation before clear lifecycle messages.
- Custom subscription backend work before purchase reliability is proven.
- Complex account systems before synced data is part of the paid promise.
- BI dashboards before one simple analytics view changes release decisions.

## Failure modes to design around
- Purchase succeeds but the app does not unlock. Add clear loading, retry, and entitlement refresh behavior.
- User reinstalls and cannot restore. Make restore purchases visible and test it.
- Backend is down and blocks paid access. Avoid server dependency unless the paid feature truly needs server data.
- Analytics says everything, but nothing changes. Keep events tied to decisions.
- Crash alerts arrive with no release context. Attach versions and triage ownership before launch.
- App Review cannot find or test the subscription. Add review notes and a deterministic path to the paywall.

## Best for
- Solo iOS developers launching their first serious subscription app.
- Apps where the paid promise is simple enough to validate before building a large backend.
- Builders deciding between [RevenueCat](/tools/revenuecat), backend tools, analytics, and crash reporting before TestFlight or launch.

## Not good for
- Apps that need complex server-side collaboration, teams, or billing from day one.
- Apps monetized only with ads, one-time web purchases, or enterprise contracts.
- Teams that already have a mature backend, analytics stack, and release process.

## Internal links
- Start with the [best monetization tools guide](/guides/best-monetization-tools-solo-mobile-developers) for the broader landscape.
- Compare subscription infrastructure in [RevenueCat vs Adapty vs Superwall](/comparisons/revenuecat-vs-adapty-ios-subscriptions).
- Review the [monetization category](/categories/monetization) and [paywall tools](/categories/paywalls).
- Compare backend choices in [Supabase vs Firebase vs Appwrite for mobile backends](/comparisons/supabase-vs-firebase-indie-mobile-apps) and the [backend category](/categories/backend).
- Add measurement with the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack) and the [analytics category](/categories/analytics).
- Install crash monitoring with the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps) and the [crash reporting category](/categories/crash-reporting).
- Use the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist) before submitting.

## Source checks
Pricing, product, and platform claims were checked on 2026-07-01 against official sources:

- Apple App Store Connect subscription docs: https://developer.apple.com/help/app-store-connect/manage-subscriptions/
- RevenueCat pricing and docs: https://www.revenuecat.com/pricing/ and https://www.revenuecat.com/docs/
- Supabase pricing and docs: https://supabase.com/pricing and https://supabase.com/docs
- Firebase pricing and docs: https://firebase.google.com/pricing and https://firebase.google.com/docs
- Appwrite pricing and docs: https://appwrite.io/pricing and https://appwrite.io/docs
- TelemetryDeck docs and plans: https://telemetrydeck.com/docs/ and https://dashboard.telemetrydeck.com/plans
- Sentry pricing and Apple SDK docs: https://sentry.io/pricing/ and https://docs.sentry.io/platforms/apple/

No hands-on testing claims are made in this article. No screenshots are used. The stack map is an owned conceptual visual created for IndieAppStack.

Last checked: 2026-07-01. Pricing thresholds are summarized at a high level; check official pages before committing.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("monetization").id,
          seo_title: "Subscription MVP stack for a solo iOS app",
          seo_description:
            "Build the smallest useful subscription MVP stack for a solo iOS app with payments, entitlements, backend, analytics, crash reporting, and launch basics.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Supabase vs Firebase vs Appwrite for mobile app backends",
          slug: "supabase-vs-firebase-indie-mobile-apps",
          subtitle:
            "A practical comparison for solo builders choosing their first auth, data, storage, and functions stack.",
          excerpt:
            "How to choose between Postgres-first Supabase, Google-native Firebase, and open-source Appwrite for an indie mobile app backend.",
          body_markdown: `## Short answer
Choose [Supabase](/tools/supabase) when the app needs relational data, SQL visibility, Postgres portability, and a backend that can grow into a normal database-backed product. Choose [Firebase](/tools/firebase) when the app fits Google's mobile platform, document sync, Analytics, Crashlytics, Remote Config, and Cloud Messaging. Choose [Appwrite](/tools/appwrite) when ownership, open-source infrastructure, self-hosting optionality, or one backend surface for Auth, Databases, Storage, Functions, Realtime, Messaging, and Sites matters more.

The wrong choice is usually not one of these tools. It is adding a backend before the paid feature, account model, or synced data actually needs one.

## Architecture map
![Backend choice architecture map comparing Supabase, Firebase, and Appwrite responsibilities for mobile app backend decisions.](/content-visuals/articles/backend-choice-architecture-map.svg "Pick the backend by the responsibility it should own: relational app data, Google app services, or open-source backend surface.")

## Comparison table
:::comparison Backend fit for solo mobile apps
| Decision | Supabase | Firebase | Appwrite |
| --- | --- | --- | --- |
| Core mental model | Postgres-backed app backend | Google mobile app platform | Open-source app backend surface |
| Data model | Relational SQL tables | Firestore or Realtime Database documents | Appwrite Databases collections and documents |
| Auth | Supabase Auth with Postgres/RLS nearby | Firebase Authentication with Google services nearby | Appwrite Auth with cloud or self-hosted deployment |
| Storage and files | Supabase Storage with database-backed policies | Cloud Storage for Firebase | Appwrite Storage |
| Server-side logic | Edge Functions and database APIs | Cloud Functions and broader Google Cloud paths | Appwrite Functions |
| Best fit | Structured app data, SQL reporting, portability | Google-native mobile stack, realtime document sync, app operations | Ownership-minded builders who want cloud or self-hosted backend primitives |
| Watch-out | You still need database design discipline | Usage is spread across many Google/Firebase products | Smaller ecosystem than Firebase and more platform ownership than a managed-only choice |
:::

## Tool-by-tool breakdown
### Supabase fit
[Supabase](/tools/supabase) is the clean default when the mobile app has structured entities: users, projects, purchases, teams, permissions, saved objects, audit rows, or anything you expect to query with joins later. The official docs present it around Postgres, Auth, Storage, Realtime, Edge Functions, and APIs, which makes it feel close to a conventional product backend without starting from blank infrastructure.

:::comparison Supabase fit guide
| Fit signal | Good fit for Supabase | Poor fit for Supabase |
| --- | --- | --- |
| Data shape | Your app data is relational or will need reporting later. | Your product naturally thinks in client-synced document trees. |
| Operating need | You want SQL, migrations, row-level security, and clearer portability. | You want Firebase Analytics, Crashlytics, FCM, Remote Config, and Test Lab in the same operating surface. |
| Readiness | You expect a web admin surface, customer portal, or server-owned records later. | You do not want to think about schema design yet. |
:::

### Firebase fit
[Firebase](/tools/firebase) is strongest when the app already wants Google's mobile operating stack. The docs group Firebase around Authentication, Firestore, Realtime Database, Storage, Hosting, Cloud Functions, Analytics, Crashlytics, Remote Config, Cloud Messaging, and more. That breadth is useful when a solo builder wants app infrastructure and app operations in one familiar console.

:::comparison Firebase fit guide
| Fit signal | Good fit for Firebase | Poor fit for Firebase |
| --- | --- | --- |
| Data shape | Your app data is document-shaped and benefits from realtime sync. | You want SQL-first reporting and relational data modeling. |
| Operating need | You already want Crashlytics, Analytics, Remote Config, Cloud Messaging, or Test Lab. | You want to keep the backend portable away from Google services. |
| Readiness | Your app is Android-heavy or already close to Google Cloud patterns. | You dislike pricing spread across many product-specific usage meters. |
:::

### Appwrite fit
[Appwrite](/tools/appwrite) is the strongest fit when ownership and backend breadth matter. Its docs describe an open-source backend with Auth, Databases, Storage, Functions, Realtime, Messaging, and Sites, available through Appwrite Cloud or self-hosting. For a solo mobile developer, Appwrite is most interesting when the app needs common backend primitives but the builder does not want to commit to a Google-first or Postgres-only mental model.

:::comparison Appwrite fit guide
| Fit signal | Good fit for Appwrite | Poor fit for Appwrite |
| --- | --- | --- |
| Ownership | You care about open-source infrastructure and self-hosting optionality. | You specifically need Postgres and SQL as the center of the app. |
| Operating need | You want one backend surface for auth, files, functions, realtime, messaging, and hosting. | You already rely on Firebase's mobile analytics, crash, messaging, and config tools. |
| Readiness | You prefer a productized backend platform over assembling separate services early. | You want the largest possible ecosystem of tutorials, examples, and third-party integrations. |
:::

## Data model fit
:::comparison Pick by the shape of your app data
| Reader job | Best default | Why |
| --- | --- | --- |
| Account-backed records with relations | Supabase | Tables, joins, RLS, and SQL reporting stay understandable |
| Realtime document sync | Firebase | Firestore and Realtime Database are built around document or tree-style sync |
| Open-source backend ownership | Appwrite | Cloud or self-hosted deployment keeps more ownership paths open |
| Mobile ops near backend | Firebase | Crashlytics, Analytics, Remote Config, FCM, and Test Lab are nearby |
| Customer portal or admin reporting later | Supabase | SQL and Postgres tooling make later operational views easier |
| One broad backend API surface | Appwrite | Auth, Databases, Storage, Functions, Realtime, Messaging, and Sites sit together |
| No account-backed data yet | No backend | If the first paid value is local-only, delay backend work until the product needs it |
:::

## Recommendation matrix
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Relational app data | Supabase | Postgres keeps joins, reporting, and migrations familiar |
| Google-first mobile stack | Firebase | Firebase keeps auth, analytics, messaging, and Crashlytics close together |
| Open-source or self-hosting preference | Appwrite | Appwrite keeps cloud and ownership paths closer together |
| SQL reporting and admin views | Supabase | Direct SQL access is easier to reason about |
| Document sync mental model | Firebase | Firestore and Realtime Database are designed around document or tree-style sync |
| Broad backend primitives without Google lock-in | Appwrite | Auth, Databases, Storage, Functions, Realtime, Messaging, and Sites cover common needs |
| Firebase app already in production | Firebase | Staying inside the existing stack is often lower risk than migrating too early |
:::

## Pricing comparison
Pricing and product scope were checked on 2026-07-01 from official pages. Do not pick from plan names alone:

- Supabase publishes plan-based pricing with usage limits and add-ons around database, storage, bandwidth, functions, and project resources.
- Firebase publishes Spark and Blaze paths, with many product-specific quotas and usage meters across Authentication, Firestore, Realtime Database, Storage, Cloud Functions, Hosting, and other Firebase/Google Cloud products.
- Appwrite publishes Free, Pro, and Enterprise paths, with resource limits for bandwidth, storage, executions, users, projects, backups, and support.

Before committing, estimate five things: monthly active users, database storage, read/write or query volume, file storage and bandwidth, and function executions. A backend that looks cheap for prototypes can become hard to reason about if your main cost driver is hidden in storage egress, document reads, or serverless execution.

## Setup complexity
Supabase setup complexity is mostly schema design, auth policies, migrations, API shape, and deciding how much logic belongs in the database versus functions.

Firebase setup complexity is spread across product choices: Authentication, Firestore or Realtime Database, Security Rules, Storage, Cloud Functions, Analytics, Crashlytics, Remote Config, and Cloud Messaging. It can be fast when you follow Firebase defaults, but it is not one small product.

Appwrite setup complexity is choosing whether Appwrite Cloud or self-hosting is the right path, then modeling Auth, Databases, Storage, Functions, Realtime, Messaging, and permissions inside one platform.

## Platform support
All three can support mobile app backends. The practical decision is not "does it support iOS or Android?" It is whether the future product logic is easiest as SQL tables, Firebase documents and app services, or Appwrite's open-source backend primitives.

## Recommendation
For most solo mobile apps with structured, account-backed data, start by evaluating Supabase. Choose Firebase when the app benefits from staying inside Firebase's mobile product suite. Choose Appwrite when open-source ownership, self-hosting optionality, or a single broad backend surface is a meaningful product requirement.

If the app does not yet need accounts, synced records, server-owned credits, file storage, or shared state, wait. The simplest backend decision is still no backend until the app's paid promise requires one.

## Source checks
Pricing and product claims were checked on 2026-07-01 against official sources:

- Supabase pricing and docs: https://supabase.com/pricing and https://supabase.com/docs
- Firebase pricing and docs: https://firebase.google.com/pricing and https://firebase.google.com/docs
- Appwrite pricing and docs: https://appwrite.io/pricing and https://appwrite.io/docs

No hands-on testing claims are made in this article. The architecture map is an owned conceptual visual created for IndieAppStack.

## Related tools and guides
- Compare [Supabase](/tools/supabase), [Firebase](/tools/firebase), and [Appwrite](/tools/appwrite).
- Review the [backend category](/categories/backend).
- Start earlier with the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Use the [monetization tools hub](/guides/best-monetization-tools-solo-mobile-developers) if the backend is part of a paid-app stack decision.
- Pair this with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("backend").id,
          seo_title: "Supabase vs Firebase vs Appwrite for mobile app backends",
          seo_description:
            "Compare Supabase, Firebase, and Appwrite for auth, databases, storage, functions, pricing model fit, and indie mobile app backend decisions.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "RevenueCat vs Adapty vs Superwall for subscription apps",
          slug: "revenuecat-vs-adapty-ios-subscriptions",
          subtitle:
            "Choose subscription infrastructure, paywall analytics, or remote paywall iteration based on the job your app needs done.",
          excerpt:
            "Compare RevenueCat, Adapty, and Superwall before choosing a subscription and paywall stack for an iOS app.",
          body_markdown: `## Short answer
Choose [RevenueCat](/tools/revenuecat) when purchase infrastructure, receipt validation, entitlements, and subscription data are the core risk. Choose [Adapty](/tools/adapty) when the operating problem is paywall workflow plus subscription analytics. Choose [Superwall](/tools/superwall) when the team mainly needs remote paywall presentation, campaigns, and fast creative iteration.

There is no universal winner here. The right first choice depends on which part of the subscription system must be dependable before the next release: the purchase truth, the paywall improvement loop, or the remote presentation layer.

![RevenueCat, Adapty, and Superwall comparison graphic showing each tool's strongest decision job.](/content-visuals/articles/revenuecat-adapty-superwall-comparison.svg "Choose by the job: purchase truth, paywall analytics, or remote paywall iteration.")

## Decision table
:::comparison RevenueCat vs Adapty vs Superwall
| Decision | RevenueCat | Adapty | Superwall |
| --- | --- | --- | --- |
| Choose it when... | Purchase infrastructure and entitlements need to be reliable first | Paywall workflow, subscription analytics, and experiments are one operating loop | Remote paywall presentation and creative iteration are the bottleneck |
| Primary job | In-app purchase infrastructure, entitlement state, customer data, revenue reporting | Subscription infrastructure, paywall builder, experiments, analytics, predictions | Paywall editor, campaigns, audiences, experiments, analytics, integrations |
| Strongest solo-builder fit | First subscription MVP or migration away from custom receipt work | App with meaningful paywall traffic and a need to improve conversion over time | App that wants frequent paywall changes without waiting on app releases |
| Watch-outs | It can be more infrastructure-centered than a pure paywall design tool | It may be more system than needed if you only need entitlement checks | It is not a full backend database or generic analytics warehouse |
| Pricing model to verify | Tracked-revenue based pricing plus enterprise path | Revenue-based pricing and enterprise path | Monthly attributed revenue model plus listed tiers and enterprise path |
| Official sources | [Pricing](https://www.revenuecat.com/pricing/) and [docs](https://www.revenuecat.com/docs/) | [Pricing](https://adapty.io/pricing/) and [docs](https://adapty.io/docs/) | [Pricing](https://superwall.com/pricing) and [docs](https://docs.superwall.com/) |
:::

## Choose RevenueCat when purchase truth is the job
[RevenueCat](/tools/revenuecat) is the strongest default when the app needs a dependable subscription layer before it needs a sophisticated paywall operating system. That usually means product configuration, SDK integration, receipt validation, restore purchases, entitlement checks, customer state, webhooks, integrations, and revenue reporting.

For a solo iOS app, RevenueCat is especially attractive when you want the purchase path to be boring and trustworthy. The app can focus on the paywall promise and paid experience while RevenueCat owns the subscription state you should not improvise.

### Not good for
- A team that only wants a browser-based visual paywall builder and already has purchase infrastructure.
- A content site or web product that does not need App Store or Google Play in-app purchase handling.
- A builder looking for a generic backend database, authentication layer, or full product analytics warehouse.

## Choose Adapty when paywall analytics are the job
[Adapty](/tools/adapty) is a better fit when the question is not just "can users buy?" but "which paywall, offer, onboarding flow, and segment should we show?" Its public materials emphasize subscription infrastructure, revenue analytics, a browser-based paywall and onboarding builder, experiments, segmentation, predictions, and integrations.

Adapty is worth evaluating when your app has enough traffic or launch confidence that paywall iteration is part of the core workflow. It can be too much if all you need this week is a reliable entitlement check.

### Not good for
- A tiny MVP where every extra dashboard and workflow creates more decisions than value.
- A team that already has a dedicated analytics and experimentation setup and only wants receipt validation.
- A builder who cannot yet define a paid promise, upgrade moment, or success metric for a paywall test.

## Choose Superwall when remote paywall iteration is the job
[Superwall](/tools/superwall) fits teams that want to change paywalls, campaigns, audiences, and upgrade prompts without shipping a new app version each time. Its pricing page frames billing around monthly attributed revenue through Superwall paywalls, while the docs surface paywalls, campaigns, charts, subscriptions, localization, web checkout, and SDKs.

For a solo developer, Superwall is most compelling after the paid product is clear but paywall presentation is still changing. If your biggest bottleneck is "I need to try a new paywall screen, audience, or campaign quickly," it deserves a serious look.

### Not good for
- Apps that have not validated why anyone should pay.
- Teams that need a full purchase infrastructure decision before paywall presentation.
- Builders who want one general analytics tool for product behavior beyond paywall and revenue flows.

## Decision matrix
:::comparison Best choice by use case
| Use case | Choose | Why |
| --- | --- | --- |
| Subscription backend first | RevenueCat | Entitlements and purchase infrastructure are the center |
| First paid iOS MVP | RevenueCat | The riskiest early job is usually reliable purchase and restore behavior |
| Paywall analytics plus experiments | Adapty | The tool is shaped around paywalls, subscription metrics, tests, predictions, and segments |
| Frequent remote paywall changes | Superwall | The workflow is centered on paywall presentation, campaigns, audiences, and iteration |
| Growth team optimizing offers | Adapty or Superwall | Choose Adapty if analytics and subscription workflow matter more; choose Superwall if remote presentation and campaigns matter more |
| App with existing RevenueCat setup | Superwall or Adapty | Evaluate whether the missing job is paywall presentation or a broader paywall analytics loop |
| App with no clear paid promise | None yet | Define the paid promise and activation path before adding a paywall tool |
:::

## Setup complexity
RevenueCat setup complexity is usually product mapping, SDK integration, entitlement modeling, customer identity, restores, and deciding which downstream tools receive purchase events.

Adapty setup starts in similar subscription territory, then adds the operating surface for paywalls, onboarding flows, analytics, experiments, segments, and integrations. That is useful if those workflows are part of the growth loop, and distracting if they are not.

Superwall setup should be judged by how much paywall presentation you want to control remotely: paywall editor, campaigns, audiences, SDK calls, charts, web checkout, and integrations. It can make iteration faster, but only if your team is ready to run that loop.

## Pricing comparison
Pricing was source-checked on 2026-07-01 from official pages. Do not choose from copied plan names alone:

- RevenueCat publishes tracked-revenue based pricing and an enterprise path.
- Adapty publishes revenue-based pricing and an enterprise path.
- Superwall publishes monthly attributed revenue based pricing, listed plan tiers, and an enterprise path.

Before implementing, open the official pricing pages and check the current thresholds, included features, and whether your app's revenue model matches how the vendor measures revenue.

## What to verify before switching
- Whether your current purchase identifiers, subscription groups, and entitlement names can map cleanly.
- Whether restore purchase, grace period, refunds, cancellations, and account deletion flows are covered.
- Whether the tool integrates with the analytics, attribution, customer messaging, or backend systems you already use.
- Whether exported data and webhooks are enough for your reporting needs.
- Whether the paywall workflow requires a new app release for the changes you care about.

## Recommendation
Start with RevenueCat if the app is subscription-first and you need purchase truth before growth tooling. Evaluate Adapty if your next bottleneck is understanding and improving the whole paywall and subscription analytics loop. Evaluate Superwall if your next bottleneck is changing paywall presentation, campaigns, and audiences quickly.

## Source checks
Pricing and product claims were checked on 2026-07-01 against official sources:

- RevenueCat pricing and docs: https://www.revenuecat.com/pricing/ and https://www.revenuecat.com/docs/
- Adapty pricing and docs: https://adapty.io/pricing/ and https://adapty.io/docs/
- Superwall pricing and docs: https://superwall.com/pricing and https://docs.superwall.com/

No hands-on testing claims are made in this article. The comparison graphic is an owned conceptual visual created for IndieAppStack.

## Related tools and guides
- Compare [RevenueCat](/tools/revenuecat), [Adapty](/tools/adapty), and [Superwall](/tools/superwall).
- Review the [paywalls category](/categories/paywalls) and [monetization category](/categories/monetization).
- Read [Best paywall tools for iOS apps](/guides/best-paywall-tools-ios-apps).
- Start earlier with the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Use the [monetization tools hub](/guides/best-monetization-tools-solo-mobile-developers) if you are still deciding the broader stack.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("paywalls").id,
          seo_title: "RevenueCat vs Adapty vs Superwall",
          seo_description:
            "Compare RevenueCat, Adapty, and Superwall for subscriptions, paywalls, entitlements, experiments, pricing model checks, and best use cases.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Appfigures vs AppTweak for ASO research",
          slug: "appfigures-vs-apptweak-aso-tools",
          subtitle:
            "How to choose between app intelligence, review monitoring, and keyword research workflows.",
          excerpt:
            "Compare Appfigures and AppTweak for indie app store optimization and competitor research.",
          body_markdown: `## Short answer
Both [Appfigures](/tools/appfigures) and [AppTweak](/tools/apptweak) help you understand and improve an app store listing, but they lead with different jobs. Choose [AppTweak](/tools/apptweak) when keyword research, metadata optimization, and competitor ASO are the center of the work. Choose [Appfigures](/tools/appfigures) when downloads, revenue, rankings, and review monitoring across one or more apps are the bigger need. Many teams keep one as the primary tool and treat the other as optional.

![Two-column comparison of Appfigures and AppTweak, showing that Appfigures leads with analytics and monitoring while AppTweak leads with ASO research.](/content-visuals/articles/appfigures-vs-apptweak-comparison.svg "Appfigures leads with analytics and monitoring; AppTweak leads with keyword and metadata optimization.")

## What each tool is really for
### Appfigures
[Appfigures](/tools/appfigures) is analytics-first. It brings downloads, revenue, subscription metrics, ad performance, rankings, reviews, and keyword tracking into one reporting surface across iOS and Android. It is strongest as an ongoing monitoring habit, especially if you track more than one app. It offers a free trial, and paid tiers scale by tracked apps, keyword counts, and update frequency.

### AppTweak
[AppTweak](/tools/apptweak) is ASO-first. It is built around keyword research, metadata optimization, competitor and creative analysis, and Apple Ads support across many countries. It is strongest when the next task is choosing keywords and rewriting the listing around search intent. It offers a free trial, and paid tiers scale mainly by tracked keywords, historical data range, and seats.

## Decision table
:::comparison Appfigures vs AppTweak
| Decision | Appfigures | AppTweak |
| --- | --- | --- |
| Leads with | Analytics and monitoring | ASO research and optimization |
| Strongest fit | Rankings, downloads, revenue, reviews | Keywords, metadata, competitor ASO |
| Portfolio view | Strong across multiple apps | Focused on ASO depth per app |
| Creative analysis | Lighter | Deeper creative and competitor analysis |
| Free entry | Free trial | Free trial |
| Scales by | Apps, keywords, update frequency | Keywords, history range, seats |
:::

## Best choice by use case
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Keyword research sprint | AppTweak | ASO planning is the center of the workflow |
| Ongoing rank and review monitoring | Appfigures | Broader app intelligence is the core job |
| Metadata refresh before launch | AppTweak | Better fit for search intent and competitor metadata |
| Portfolio-level store tracking | Appfigures | Better fit for monitoring multiple apps over time |
| Downloads and revenue reporting | Appfigures | Analytics reporting is its native strength |
:::

## Pricing model
Both use tiered subscriptions with a free trial rather than a permanent free tier. Costs scale on different axes: Appfigures by tracked apps, keywords, and update frequency; AppTweak by keywords, historical data range, and seats. Confirm current pricing on [Appfigures pricing](https://appfigures.com/pricing) and [AppTweak pricing](https://www.apptweak.com/en/pricing) before buying, especially if you need multiple apps, countries, keywords, or seats.

## Setup and effort
Neither is hard to adopt; both are dashboards, not SDKs. The real setup cost is deciding which apps, countries, keywords, and competitors to track so the dashboard stays signal, not noise. Start narrow and expand.

## Platform support
Both cover App Store and Google Play research. Confirm current country, keyword, and store coverage on the official product pages before committing, since coverage and limits change.

## Recommendation
Pick AppTweak when you are actively rewriting a listing around keywords and competitor ASO. Pick Appfigures when you want an ongoing monitoring habit around rankings, reviews, downloads, and revenue, especially across multiple apps. If budget allows only one and your immediate job is launch metadata, start with AppTweak; if it is understanding performance over time, start with Appfigures.

## Internal links
- Start with [best ASO tools for indie developers](/guides/best-aso-tools-for-indie-developers).
- Work the listing with the [ASO starter checklist](/guides/aso-starter-checklist-indie-mobile-apps).
- Open the [Appfigures](/tools/appfigures) and [AppTweak](/tools/apptweak) tool pages.
- Browse the [ASO category](/categories/aso) and the [screenshots category](/categories/screenshots).
- Connect launch timing with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

## Source checks
Pricing and product claims were checked against official sources on 2026-07-09:

- Appfigures pricing: https://appfigures.com/pricing
- AppTweak pricing: https://www.apptweak.com/en/pricing

Exact tier numbers change, so pricing is summarized at a high level. No hands-on testing claims are made in this comparison. The comparison visual is an owned conceptual graphic created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("aso").id,
          seo_title: "Appfigures vs AppTweak for ASO research",
          seo_description:
            "Compare Appfigures and AppTweak for ASO research, rankings, reviews, keyword workflows, setup complexity, pricing checks, and best use cases.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Sentry vs Firebase Crashlytics for mobile apps",
          slug: "sentry-vs-firebase-crashlytics-mobile-apps",
          subtitle:
            "A practical crash reporting comparison for indie iOS and Android teams.",
          excerpt:
            "Compare Sentry and Firebase Crashlytics for crash reporting, errors, setup complexity, and release monitoring.",
          body_markdown: `## Short answer
Both catch crashes and make them fixable; they differ in scope and where they live. Choose [Sentry](/tools/sentry) when you want one error-monitoring workflow that can span the mobile app, backend, and web, with releases, tracing, and alerts. Choose [Firebase](/tools/firebase) Crashlytics when the app already uses Firebase and you want lightweight, mobile-first crash reporting in the same console as Analytics and Remote Config.

For a first solo launch, either is a fine choice. Pick one, install it before the first external build, and do not run both without a specific reason.

![Two-column comparison of Sentry and Firebase Crashlytics, showing Sentry spanning mobile, backend, and web while Crashlytics focuses on mobile crashes inside Firebase.](/content-visuals/articles/sentry-vs-crashlytics-comparison.svg "Sentry spans mobile, backend, and web errors; Crashlytics is mobile-first inside the Firebase console.")

## What each tool is really for
### Sentry
[Sentry](/tools/sentry) is an error- and performance-monitoring platform that spans iOS, Android, React Native, Flutter, web, and backend code. Beyond crashes it captures handled errors, releases and release health, tracing, and session replay. It has a free Developer tier for a single user, and paid tiers add unlimited users and scale by event volume across error, span, and replay quotas. Choose it when errors cross app boundaries or you expect to monitor more than the mobile app.

### Firebase Crashlytics
[Firebase](/tools/firebase) Crashlytics is a lightweight, realtime mobile crash reporter for Apple, Android, Flutter, and Unity, grouped by impact and sitting beside Firebase Analytics, Remote Config, and the rest of that console. Firebase lists Crashlytics as a no-cost product. Choose it when Firebase is already the center of the app stack and you want crash reporting without adding another vendor.

## Decision table
:::comparison Sentry vs Firebase Crashlytics
| Decision | Sentry | Firebase Crashlytics |
| --- | --- | --- |
| Center of gravity | Errors across mobile, backend, and web | Mobile crash reporting inside Firebase |
| Beyond crashes | Handled errors, tracing, session replay | Crash-focused, with logs, keys, non-fatals |
| Release monitoring | Releases and release health across services | Crash-free users and velocity in Firebase |
| Pricing | Free Developer tier; paid scales by users and event volume | Listed as a no-cost Firebase product |
| Ecosystem | Vendor-neutral across platforms | Tightly integrated with Firebase and Google |
| Watch out for | Keep sampling, PII, and alert noise intentional | Adopting Firebase only for Crashlytics pulls in a Google-centered stack |
:::

## Best choice by use case
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Firebase app already in production | Firebase Crashlytics | Keeps crash reporting in the same operational stack |
| Mobile plus backend or web monitoring | Sentry | One error workflow can span surfaces |
| First lightweight mobile crash setup | Firebase Crashlytics | Especially simple if Firebase is already installed |
| Release regression analysis across services | Sentry | Stronger when errors cross app boundaries |
| Avoiding a Google-centered stack | Sentry | Vendor-neutral across platforms |
| Cost-sensitive and mobile-only | Firebase Crashlytics | Listed as a no-cost product |
:::

## Pricing model
Confirm current terms before deciding, because both change. Sentry offers a free Developer tier for one user, then Team and Business tiers that add unlimited users and scale by event volume across errors, spans, and replays. Firebase lists Crashlytics as a no-cost product, though other Firebase services you add can carry their own pricing. See [Sentry pricing](https://sentry.io/pricing/) and [Firebase pricing](https://firebase.google.com/pricing).

## Setup and effort
Crashlytics is usually simplest when Firebase is already in the app: add the SDK, drop in the config files, and verify a test crash. Sentry is also straightforward with its wizard, but the real decision is scoping the project: which platforms, releases, environments, and alerts belong together. Either way, upload debug symbols, meaning dSYMs for iOS, mapping files for Android, and source maps for React Native or web, so stack traces are readable.

The detailed, step-by-step setup for both lives in the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps).

## Platform support
Both cover the major mobile platforms. Sentry additionally covers backend and web surfaces in the same workflow, while Crashlytics is centered on Firebase's mobile app model. Confirm current platform and framework support on the official docs before committing.

## Recommendation
Use Firebase Crashlytics if Firebase is already the center of the app stack, or if you want the simplest, no-cost mobile crash reporting for a first launch. Use Sentry if you want error monitoring that can grow beyond mobile crashes into backend, web, and tracing, or if you want to stay vendor-neutral. Whichever you choose, install it before the first external build and wire it to release names so a crash points at a specific version.

## Internal links
- Follow the step-by-step [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps).
- Open the [Sentry](/tools/sentry) and [Firebase](/tools/firebase) tool pages.
- Browse the [crash reporting category](/categories/crash-reporting).
- Fit crash reporting into the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Wire it in during the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

## Source checks
Pricing and product claims were checked against official sources. Sentry pricing was re-checked on 2026-07-09:

- Sentry pricing: https://sentry.io/pricing/
- Sentry Apple SDK docs: https://docs.sentry.io/platforms/apple/guides/ios/
- Firebase Crashlytics product page: https://firebase.google.com/products/crashlytics
- Firebase Crashlytics docs: https://firebase.google.com/docs/crashlytics
- Firebase pricing: https://firebase.google.com/pricing

Pricing details and quotas change, so they are summarized at a high level. No hands-on testing claims are made in this comparison. The comparison visual is an owned conceptual graphic created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("crash-reporting").id,
          seo_title: "Sentry vs Firebase Crashlytics for mobile apps",
          seo_description:
            "Compare Sentry and Firebase Crashlytics for mobile crash reporting, setup complexity, platform support, pricing checks, and best use cases.",
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
          body_markdown: `## Short answer
Start with a tiny event taxonomy and one privacy-first analytics tool, not a data platform. For an Apple-first indie app, [TelemetryDeck](/tools/telemetrydeck) is a strong default because it is built around anonymized, aggregate signals and keeps the App Store privacy story clean. Reach for [PostHog](/tools/posthog) when you genuinely need funnels, feature flags, experiments, or session replay in one broader system. Use Firebase Analytics only when the app already lives in Firebase.

The tool matters less than the discipline: measure a handful of events tied to decisions you will actually make, keep the names consistent, and delete anything that never changes a choice.

> [!NOTE] Solo builder scope
> This guide is for a solo builder who wants product signal without invasive tracking. Privacy-friendly here means anonymized and aggregate by default, minimal personal data, and App Store privacy labels that stay simple.

![Analytics starter event map showing a small taxonomy from activation through paywall view, purchase, and retention signals.](/content-visuals/articles/analytics-starter-event-map.svg "A small, decision-linked event set beats a noisy dashboard nobody trusts.")

## Why privacy-first is the practical default
Privacy-friendly analytics is not only an ethics choice; it is the lower-friction path for a solo app:

- App Store privacy labels and the tracking prompt are simpler when you do not collect identifiers or track across apps.
- Anonymized, aggregate metrics still answer the early questions that matter: are people activating, viewing the paywall, and converting?
- Less personal data means less to secure, disclose, and worry about.

You can always add deeper analysis later. It is much harder to walk back a data model that quietly collected everything.

## Start with fewer events
A clear five-to-eight event taxonomy beats a noisy dashboard nobody trusts. For most subscription MVPs, start here:

:::comparison Starter event taxonomy
| Event | Why it matters |
| --- | --- |
| onboarding_completed | Activation: did the user reach first value? |
| core_feature_used | Engagement: did they do the main job? |
| paywall_viewed | Monetization intent: did they reach the offer? |
| purchase_started | Funnel: did they begin checkout? |
| purchase_completed | Revenue conversion |
| restore_attempted | Support and reinstall friction |
| subscription_status_changed | Retention and churn signal, where available |
:::

Keep names lowercase and stable, and prefer a few well-defined properties over free-form blobs:

\`\`\`json
{
  "event": "paywall_viewed",
  "properties": { "source": "onboarding", "offering": "annual_default" }
}
\`\`\`

## Choosing the tool
:::comparison Analytics tool fit
| Decision | TelemetryDeck | PostHog | Firebase Analytics |
| --- | --- | --- | --- |
| Best fit | Privacy-first Apple app analytics | Broad product analytics in one system | Apps already inside Firebase |
| Data model | Anonymized, aggregate signals | Events, funnels, flags, replay | Events tied to the Firebase console |
| Strengths | Simple, privacy-friendly, SwiftUI-friendly | Funnels, feature flags, experiments, session replay | Sits beside Crashlytics and Remote Config |
| Watch out for | Less deep for complex funnels | More surface area than an MVP needs | Ties analytics to the Google ecosystem |
:::

- Use [TelemetryDeck](/tools/telemetrydeck) when you want privacy-friendly signal fast, especially on Apple platforms.
- Use [PostHog](/tools/posthog) when funnels, flags, experiments, or replay will change weekly decisions; it has a generous free tier and usage-based pricing.
- Use Firebase Analytics when the app is already in Firebase and you want analytics beside crash reporting.
- Consider [Mixpanel](/tools/mixpanel) or [Amplitude](/tools/amplitude) only when product analytics is a core, ongoing workflow rather than a launch need.

## What to skip early
- Cross-app tracking and advertising identifiers before you run paid acquisition.
- Attribution platforms before there is spend to attribute.
- Session replay and heatmaps before there is enough traffic to look at.
- A data warehouse or BI dashboards before one simple view changes a release decision.

## Keep the taxonomy honest
Re-read the event list monthly. If an event has not changed a single decision, remove it. A small, trusted set of metrics you actually act on is the goal, not coverage.

## Best for
- Apps that need activation, engagement, and conversion signal without heavy tracking.
- Builders choosing between [TelemetryDeck](/tools/telemetrydeck), [PostHog](/tools/posthog), and Firebase Analytics.
- Teams that want App Store privacy labels to stay simple.

## Not good for
- Apps that require paid-acquisition attribution before product analytics.
- Teams that cannot keep event names consistent across releases.

## Internal links
- Browse more [analytics tools](/categories/analytics).
- Connect measurement to [monetization decisions](/categories/monetization) and the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Instrument the paywall funnel from [best paywall tools for iOS apps](/guides/best-paywall-tools-ios-apps).
- Add reliability signal with the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps).
- Wire analytics in during the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

## Source checks
Product and pricing claims were checked against official sources. PostHog pricing was re-checked on 2026-07-09:

- PostHog pricing and docs: https://posthog.com/pricing and https://posthog.com/docs
- TelemetryDeck docs: https://telemetrydeck.com/docs/
- Firebase Analytics docs: https://firebase.google.com/docs/analytics

TelemetryDeck plan details were last confirmed on 2026-07-01; check the current plans on the TelemetryDeck site before committing. Pricing thresholds are summarized at a high level. No hands-on testing claims are made in this guide. The event map is an owned conceptual visual created for IndieAppStack.

Last checked: 2026-07-09.`,
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
          title: "ASO starter checklist for indie mobile apps",
          slug: "aso-starter-checklist-indie-mobile-apps",
          subtitle:
            "A practical first pass for keywords, screenshots, reviews, and competitor monitoring.",
          excerpt:
            "Use this ASO checklist to tighten an app store listing before launch or the next metadata update.",
          body_markdown: `## Short answer
A first ASO pass is not a growth-hacking project. It is four jobs done honestly before you submit: turn the app's promise into keywords, tighten the metadata the stores index, make the first screenshots explain the app, and set a habit of watching reviews and rankings. Do these before spending on acquisition, because paid traffic magnifies a weak listing instead of fixing it.

> [!NOTE] Solo builder scope
> This checklist is for a solo builder preparing a first listing or a metadata refresh. You can complete the first pass with the free trials of the tools mentioned; a paid plan is only worth it once you have a listing to optimize.

![ASO starter workflow moving from keyword research to metadata, then store creative, then ongoing monitoring.](/content-visuals/articles/aso-starter-workflow.svg "Four jobs in order: research keywords, tighten metadata, make screenshots explain the app, then monitor.")

## Step 1: Turn the promise into keywords
Start from a specific promise. "A running app" is not searchable; "interval running coach for beginners" becomes keywords, screenshot captions, and comparison copy.

- List the words a target user would actually type.
- Separate primary terms, high intent and realistic to rank, from secondary terms.
- Use [AppTweak](/tools/apptweak) or [Appfigures](/tools/appfigures) to check volume and difficulty before committing.

## Step 2: Tighten the metadata the stores index
The store fields do most of the ranking work. Get them right:

:::comparison Store metadata that matters
| Field | Job | Watch out for |
| --- | --- | --- |
| App name or title | Highest-weight keywords plus brand | Keyword stuffing that hurts readability |
| Subtitle (iOS) or short description (Android) | Secondary keywords and the promise | Repeating the title verbatim |
| Keyword field (iOS) | Extra terms not in the name or subtitle | Wasting space on duplicates or spaces |
| Description | Conversion and clarity; Google Play indexes it | Burying the value below the fold |
:::

Confirm the current field rules on the official App Store Connect and Google Play Console help pages, since limits and indexing differ by store.

## Step 3: Make the first screenshots explain the app
Most installs are decided on the first two screenshots. Lead with the core value, then show detail.

- Frames one and two: what the app does and who it is for, in words plus a visual.
- Later frames: proof, key features, and differentiation.
- Produce and localize them with [AppScreens](/tools/appscreens) or the [screenshots category](/categories/screenshots).

## Step 4: Watch reviews, ratings, and rankings
Set a light monitoring habit so you notice movement without living in a dashboard.

- Track a handful of primary keywords and your rank on them.
- Read new reviews for recurring complaints and the words users use.
- Respond to reviews where the store allows it; [AppFollow](/tools/appfollow) or [Appfigures](/tools/appfigures) help here.

## Scan three competitors by hand
Pick three direct competitors and read, by hand, their title, subtitle, first screenshots, and top reviews. You are looking for the words they own, the promises they make, and the complaints you can beat.

## Cadence
Re-check keywords, screenshots, and review language monthly while the app is still learning what converts. Change one variable at a time so you can tell what moved the metric.

## Best for
- Teams preparing metadata, screenshots, and keyword updates before or after launch.
- Indie developers who want a repeatable, low-cost store-listing routine.
- Apps that have a clear promise to turn into keywords.

## Not good for
- Products that have not clarified their target user or positioning.
- Teams expecting ASO software to replace better copy and creative.

## Internal links
- Choose tools with [best ASO tools for indie developers](/guides/best-aso-tools-for-indie-developers).
- Compare the two research tools in [Appfigures vs AppTweak for ASO research](/comparisons/appfigures-vs-apptweak-aso-tools).
- Produce creative via the [screenshots category](/categories/screenshots).
- Fit ASO into launch timing with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).
- Browse the full [ASO category](/categories/aso).

## Source checks
Product claims were checked against official sources on 2026-07-09:

- AppTweak: https://www.apptweak.com/en/pricing
- Appfigures: https://appfigures.com/pricing
- AppFollow: https://appfollow.io/pricing

Store metadata field rules should be confirmed on the official App Store Connect and Google Play Console help pages, since they change and differ by store. No hands-on testing claims are made in this guide. The workflow visual is an owned conceptual graphic created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("aso").id,
          seo_title: "ASO starter checklist for indie mobile apps",
          seo_description:
            "A practical ASO checklist for indie mobile apps covering keywords, competitors, reviews, screenshots, and store listing updates.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Mobile app launch stack checklist",
          slug: "mobile-app-launch-stack-checklist",
          subtitle:
            "A lean launch workflow for landing pages, waitlists, screenshots, and audience capture.",
          excerpt:
            "Plan the first public launch with a focused stack for product pages, email capture, screenshots, and follow-up.",
          body_markdown: `## Short answer
A first mobile app launch does not need a big marketing stack. It needs a page that explains the app, a way to capture interest before release, credible store creative, crash and basic analytics coverage so launch day is observable, and one channel to keep early users updated. Everything else can wait until you know which source actually drives installs and paying users.

Treat the launch stack as five jobs, each owned by one tool you can set up in a day, not a platform you have to learn for a week.

> [!NOTE] Solo builder scope
> This checklist is for a solo developer shipping a first or early public launch. The goal is a lean, observable launch, not a growth-team playbook. Add channels only after the first launch shows you where attention comes from.

![Mobile app launch stack timeline moving from pre-launch page and waitlist, through store creative, to launch-week monitoring and post-launch iteration.](/content-visuals/articles/mobile-app-launch-stack-timeline.svg "Five launch jobs across four phases: explain, capture, look credible, stay observable, and keep early users close.")

## The five launch jobs
:::comparison Launch stack by job
| Job | Owns | Default choice | Can wait |
| --- | --- | --- | --- |
| Explain the app | Landing or launch page | Framer or Webflow | A multi-page marketing site |
| Capture interest | Waitlist and email list | Kit or beehiiv | Lifecycle and CRM automation |
| Look credible in the store | Screenshots and listing creative | AppScreens plus ASO basics | Localized creative for every market |
| Stay observable | Crash reporting and light analytics | Sentry plus TelemetryDeck | Full product analytics and attribution |
| Keep early users close | One update channel | Email, or push with OneSignal | Multi-channel messaging |
:::

## Job 1: Explain the app
Build one page that names the target user, the problem, and what changes after they use the app. Use [Framer](/tools/framer) for a fast, design-led page, or [Webflow](/tools/webflow) if the page will grow into a real marketing site. The full comparison is in [best landing page builders for mobile apps](/guides/best-landing-page-builders-mobile-apps) and the [landing pages category](/categories/landing-pages).

Keep the page honest: one promise, a short demo or hero visual, a few benefit points tied to real jobs, and one primary call to action.

## Job 2: Capture interest before launch
Start collecting emails before release so launch day begins with a warm list instead of silence. Use [Kit](/tools/kit) or [beehiiv](/tools/beehiiv), or browse the [email and waitlist category](/categories/email-waitlists). A small, engaged list you can message on launch day is worth more than a large cold audience you cannot reach.

## Job 3: Look credible in the store
Store creative decides whether the traffic you send actually converts. Prepare screenshots that show the core value in the first two frames, then get more specific. Use [AppScreens](/tools/appscreens) or another tool in the [screenshots category](/categories/screenshots). Pair the creative with basic store optimization: a title, subtitle, and keywords that match how people actually search. Work through the [ASO starter checklist](/guides/aso-starter-checklist-indie-mobile-apps) before you submit.

## Job 4: Stay observable on launch day
A launch you cannot observe is a launch you cannot fix. Install [crash reporting](/tools/sentry) before the first external build and a tiny analytics layer such as [TelemetryDeck](/tools/telemetrydeck) for activation and a few key events. Follow the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps) and the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack) so launch day has a signal, not a guess.

## Job 5: Keep early users close
Pick one channel to talk to early users: the email list you already started, or push with [OneSignal](/tools/onesignal) if in-app moments are the point. Skip multi-channel messaging until you actually have people to message and something worth saying.

## Phased checklist
:::comparison Launch phases
| Phase | Do this | Done when |
| --- | --- | --- |
| 3 to 4 weeks out | Landing page live, waitlist capturing emails, positioning drafted | A stranger understands the app in ten seconds |
| 1 to 2 weeks out | Store screenshots, title, subtitle, keywords, crash and analytics wired, beta feedback gathered | The purchase or core flow works and is observable |
| Launch week | Announce to the list, check crashes daily, watch activation and store conversion | New crashes are triaged and no trust-blocking bug is live |
| Weeks 2 to 4 | Compare which source drove installs and paying users, then double down on one | You know your best channel and your next bottleneck |
:::

## What to postpone
- Paid acquisition and attribution before you know your organic conversion rate.
- Multi-channel lifecycle messaging before one channel reliably works.
- A large marketing site before a single page converts.
- CI and release automation with [Codemagic](/tools/codemagic) or [Bitrise](/tools/bitrise) before release friction is real. Automate once it hurts, not before.
- Localized store creative before one market converts.

## Best for
- Solo developers planning a first App Store or Google Play release.
- Apps that need a page, a list, credible store creative, and launch-day observability.
- Builders who want a lean, sequenced launch instead of a big-bang marketing push.

## Not good for
- Teams that already run a mature marketing site, CRM, and release pipeline.
- Apps that require enterprise campaign orchestration or heavy paid acquisition from day one.

## Internal links
- Choose the page builder in [best landing page builders for mobile apps](/guides/best-landing-page-builders-mobile-apps).
- Prepare store creative via the [screenshots category](/categories/screenshots) and the [ASO starter checklist](/guides/aso-starter-checklist-indie-mobile-apps).
- Wire launch-day observability with the [crash reporting setup guide](/guides/crash-reporting-setup-indie-mobile-apps) and the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack).
- Grow the list through the [email and waitlist category](/categories/email-waitlists).
- If the app is subscription-first, pair this with the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Browse more [launch tools](/categories/launch).

## Source checks
Tool facts were checked against official pages. Landing page and email tools were re-checked on 2026-07-09:

- Framer pricing: https://www.framer.com/pricing/
- Webflow pricing and 2026 plan changes: https://webflow.com/pricing
- Kit pricing: https://kit.com/pricing
- Apple App Store Connect: https://developer.apple.com/help/app-store-connect/

Per-tool pricing and feature details for crash, analytics, ASO, and push tools live in the linked guides and categories, each carrying its own review date. No hands-on testing claims are made in this guide. The launch timeline is an owned conceptual visual created for IndieAppStack.

Last checked: 2026-07-09. Pricing thresholds are summarized at a high level; check official pages before committing.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("launch").id,
          seo_title: "Mobile app launch stack checklist",
          seo_description:
            "A mobile app launch checklist for landing pages, waitlists, newsletters, screenshots, and early distribution workflows.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Best paywall tools for iOS apps",
          slug: "best-paywall-tools-ios-apps",
          subtitle:
            "How to choose a paywall stack for subscriptions, experiments, and entitlement handling.",
          excerpt:
            "Compare practical paywall tools for iOS subscription apps without pretending one option fits every business model.",
          body_markdown: `## Short answer
A modern "paywall tool" now does two jobs at once: it owns purchase and entitlement infrastructure, and it renders and tests the paywall itself. [RevenueCat](/tools/revenuecat), [Superwall](/tools/superwall), and [Adapty](/tools/adapty) all cover both jobs today, so choose by where your product's center of gravity is:

- Choose [RevenueCat](/tools/revenuecat) when durable purchase infrastructure and entitlement truth are the priority, and remote paywall testing is a bonus.
- Choose [Superwall](/tools/superwall) when remote paywall presentation and fast creative iteration are the main bottleneck.
- Choose [Adapty](/tools/adapty) when paywall building sits next to subscription analytics and experiments in a daily workflow.

For the simplest apps, a native StoreKit paywall with no third-party tool is still a valid launch choice. Add a paywall platform when you will actually iterate on paywalls, not just to have one.

> [!NOTE] Solo builder scope
> This guide is for a solo builder choosing a paywall stack for an iOS subscription app. The goal is to sell and unlock reliably first, then iterate on the paywall once there is enough traffic to learn from.

![Decision guide for choosing an iOS paywall stack, routing by whether purchase infrastructure, remote paywall iteration, or paywall analytics is the bottleneck.](/content-visuals/articles/paywall-tools-decision.svg "Choose by your bottleneck: infrastructure first, iteration first, or analytics first.")

## A paywall tool is really two jobs
"Paywall tool" used to mean the screen that sells the subscription. The category has since converged, and each major option can now:

- Own purchase infrastructure: StoreKit handling, receipt validation, restore, and cross-platform customer state.
- Own the entitlement decision: should this user see paid features right now?
- Render the paywall remotely: change layout, copy, price display, and targeting without an app release.
- Run experiments: A/B/n test paywalls and read conversion.

Because they overlap so much, the real question is not "which tool has paywalls," but "which job is my bottleneck, and how does the pricing meter match my revenue?"

## How they price, and why it matters
A useful modern detail for a solo budget: the leading tools mostly charge a small percentage of the revenue they touch, above a free threshold, instead of a flat monthly fee. That keeps the entry cost near zero for a new app and scales only as you earn.

- RevenueCat has a free tier up to a monthly tracked-revenue threshold, then charges a small percentage of tracked revenue; its growth tools such as paywalls can also be used with pay-per-conversion pricing.
- Superwall keeps its infrastructure layer free at any scale and charges a small percentage of revenue attributed specifically to Superwall-rendered paywalls, above a free threshold.
- Adapty offers a free tier under a monthly revenue threshold, then charges a small percentage of revenue above it.

Confirm the current thresholds and percentages on each official pricing page before committing, because these numbers change.

## Decision table
:::comparison Paywall stack fit
| Decision | RevenueCat | Superwall | Adapty |
| --- | --- | --- | --- |
| Center of gravity | Purchase and entitlement infrastructure | Remote paywall presentation and iteration | Paywall building plus subscription analytics |
| Paywall experiments | Built in, plus growth tools | Core strength, fast iteration | Core strength, tied to analytics |
| Best when | You want durable infrastructure first | You will change paywalls often without releases | You run paywall and pricing tests as a habit |
| Pricing meter | Percent of tracked revenue above a free tier | Percent of paywall-attributed revenue above a free tier | Percent of revenue above a free tier |
| Watch out for | Decide which growth tools you actually need | Attribute only paywall-driven revenue | Confirm which features are in the free tier |
:::

## Tool-by-tool fit
### RevenueCat
Choose [RevenueCat](/tools/revenuecat) when the priority is durable purchase infrastructure: StoreKit handling, receipt validation, restore, entitlement state, and cross-platform customer data. It renders and tests paywalls too, but the reason to start here is that the purchase layer stays reliable and vendor-neutral. Pick it when you want the subscription plumbing to be boring before you optimize the paywall.

### Superwall
Choose [Superwall](/tools/superwall) when remote paywall presentation and fast creative iteration are the bottleneck. You can change paywall layout, copy, targeting, and tests without shipping an app release, and its meter only charges on revenue its paywalls drive. Pick it when the paywall is something you plan to change often and you want that iteration decoupled from the App Store review cycle.

### Adapty
Choose [Adapty](/tools/adapty) when paywall building sits beside subscription analytics and experiments in one workflow. It combines a paywall and onboarding builder with A/B testing and revenue analytics such as MRR, LTV, and churn. Pick it when a growth or marketing workflow, not just engineering, will run paywall and pricing experiments regularly.

### Qonversion
[Qonversion](/tools/qonversion) bundles subscription SDKs, paywalls, customer data, and analytics into one subscription-focused surface. It is most interesting as an alternative to compare against the three above when you want a single bundled workflow. Check its current pricing and included features before committing.

### Native StoreKit, no third-party tool
For the simplest apps, one product and one paywall with no plans to experiment, a native StoreKit 2 paywall is a legitimate launch choice. You trade remote iteration and cross-platform customer state for fewer dependencies. Add a paywall platform when you can name the experiment you actually want to run.

## When you do not need a paywall platform yet
A paywall experimentation tool earns its place when there is enough paywall traffic to learn from a test. Before that point:

- Ship one clear paywall and make the purchase and restore paths reliable.
- Keep pricing and copy decisions manual and deliberate.
- Instrument the funnel with a few events, using the analytics starter stack below.
- Add remote paywall testing when weekly traffic can move a metric you trust.

## Best for
- iOS subscription apps choosing purchase infrastructure and a paywall workflow together.
- Builders who want to sell and unlock reliably before optimizing the paywall.
- Teams deciding between infrastructure-first, iteration-first, or analytics-first tools.

## Not good for
- Apps that only sell one-time web products or run on ads alone.
- Teams that cannot yet state the subscription promise or the upgrade moment.

## Internal links
- Read the deep, head-to-head [RevenueCat vs Adapty vs Superwall comparison](/comparisons/revenuecat-vs-adapty-ios-subscriptions).
- Fit the paywall into the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- Start broad with [best monetization tools for solo mobile developers](/guides/best-monetization-tools-solo-mobile-developers).
- Browse the [paywalls category](/categories/paywalls) and the [monetization category](/categories/monetization).
- Instrument conversion with the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack).

## Source checks
Pricing and product claims were checked against official sources on 2026-07-09:

- RevenueCat pricing and docs: https://www.revenuecat.com/pricing/ and https://www.revenuecat.com/docs/
- Superwall pricing and docs: https://superwall.com/pricing and https://docs.superwall.com/
- Adapty pricing and docs: https://adapty.io/pricing/ and https://adapty.io/docs/

Qonversion pricing was last confirmed on 2026-07-01: https://qonversion.io/pricing. Pricing meters and free thresholds change often, so exact percentages and thresholds are summarized at a high level here. The detailed head-to-head lives in the RevenueCat vs Adapty vs Superwall comparison. No hands-on testing claims are made in this guide. The decision visual is an owned conceptual graphic created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("paywalls").id,
          seo_title: "Best paywall tools for iOS apps",
          seo_description:
            "Compare paywall tools for iOS apps including RevenueCat, Adapty, and Superwall for subscriptions, experiments, and entitlements.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Best ASO tools for indie developers",
          slug: "best-aso-tools-for-indie-developers",
          subtitle:
            "A practical shortlist for keywords, rankings, reviews, and screenshot workflows.",
          excerpt:
            "Choose ASO tools based on the part of the store listing you can improve this month.",
          body_markdown: `## Short answer
Do not buy a large app-intelligence stack before launch. Choose one ASO tool for the job you can improve this month, then add others only when the work demands it. For most indie developers:

- Choose [AppTweak](/tools/apptweak) when keyword research, metadata, and competitor ASO are the main work.
- Choose [Appfigures](/tools/appfigures) when rankings, reviews, downloads, and revenue monitoring across a portfolio are the bigger need.
- Choose [AppFollow](/tools/appfollow) when replying to reviews and protecting store reputation is the daily job.
- Use [AppScreens](/tools/appscreens) for the creative side: screenshots, captions, exports, and localization.

ASO tools inform decisions; they do not make installs happen. The listing copy, the screenshots, and the app's promise do most of the work. Buy the tool that sharpens the specific decision you are stuck on.

> [!NOTE] Solo builder scope
> This guide is for a solo or small indie team optimizing an App Store or Google Play listing, not an agency running many clients. Start with the free trials and one clear job before committing to a paid tier.

![Map of the four main ASO jobs, keyword research, rank and market monitoring, reviews and reputation, and store creative, matched to tools.](/content-visuals/articles/best-aso-tools-map.svg "Match the tool to the ASO job you need done this month, not to the brand.")

## The four ASO jobs
Most ASO work falls into four jobs. Match the tool to the job, not the brand:

:::comparison ASO jobs and tools
| Job | What it answers | Reach for |
| --- | --- | --- |
| Keyword research | Which terms can this app realistically rank and convert for? | AppTweak, Appfigures |
| Rank and market monitoring | Are rankings, downloads, and revenue moving, and why? | Appfigures |
| Reviews and reputation | What are users saying, and are we responding? | AppFollow, Appfigures |
| Store creative | Do the screenshots and captions explain the app fast? | AppScreens |
:::

## Tool-by-tool fit
### AppTweak
[AppTweak](/tools/apptweak) is an ASO and app-intelligence platform built around keyword research, metadata optimization, competitor monitoring, and creative analysis across many countries. It is the strongest fit when the next task is picking keywords and rewriting the listing around search intent. It offers a free trial, and paid tiers scale mainly by tracked keywords, historical data range, and seats.

### Appfigures
[Appfigures](/tools/appfigures) is analytics-first and also does ASO: downloads and revenue, rankings, review monitoring, and keyword tracking across iOS and Android. It is the better fit when you want an ongoing read on store performance, especially across more than one app. It offers a free trial, and paid tiers scale by tracked apps, keyword counts, and update frequency.

### AppFollow
[AppFollow](/tools/appfollow) centers on review management and reputation: monitoring ratings, replying to reviews, and routing feedback, with ASO features alongside. Choose it when responding to reviews and protecting store reputation is a recurring job. Its pricing is quote-based, so confirm current terms directly.

### AppScreens
[AppScreens](/tools/appscreens) is a creative tool for producing store screenshots, captions, device frames, exports, and localized variants. It does not do keyword research; it makes the listing look credible once the positioning is set. See the [screenshots category](/categories/screenshots) for alternatives.

## When you do not need a paid ASO tool yet
If the app has not launched or the positioning is still moving, a paid ASO subscription is premature. Before paying:

- Write a specific promise you can turn into keywords.
- Read competitor titles, subtitles, and top reviews by hand.
- Draft screenshots that explain the app in the first two frames.
- Use the free trials to sanity-check keyword ideas.

Add a paid plan when you have a listing to optimize and a decision the tool will actually change.

## Best for
- Apps preparing a launch, relaunch, or metadata refresh.
- Builders who want store insight and creative production to work together.
- Teams choosing one ASO job to improve this month.

## Not good for
- Apps that have not settled the target user or positioning.
- Teams expecting ASO tools to guarantee installs without better copy and creative.

## Internal links
- Work through the [ASO starter checklist](/guides/aso-starter-checklist-indie-mobile-apps) first.
- Compare the two research tools head-to-head in [Appfigures vs AppTweak for ASO research](/comparisons/appfigures-vs-apptweak-aso-tools).
- Prepare creative with the [screenshots category](/categories/screenshots) and [AppScreens](/tools/appscreens).
- Browse the full [ASO category](/categories/aso).
- Connect launch timing through the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

## Source checks
Product and pricing claims were checked against official sources on 2026-07-09:

- AppTweak pricing: https://www.apptweak.com/en/pricing
- Appfigures pricing: https://appfigures.com/pricing
- AppFollow pricing: https://appfollow.io/pricing

Pricing tiers and limits change often, so exact numbers are summarized at a high level. No hands-on testing claims are made in this guide. The ASO tools map is an owned conceptual visual created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("aso").id,
          seo_title: "Best ASO tools for indie developers",
          seo_description:
            "Compare ASO tools for indie developers, including keyword research, rankings, reviews, screenshots, and app store listing workflows.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Best landing page builders for mobile apps",
          slug: "best-landing-page-builders-mobile-apps",
          subtitle:
            "Pick a launch page builder based on speed, CMS needs, and audience capture.",
          excerpt:
            "Compare Framer, Webflow, and email-first options for mobile app landing pages.",
          body_markdown: `## Short answer
For a mobile app landing page, match the builder to the page's real job. Choose [Framer](/tools/framer) when you want a fast, visually polished launch or waitlist page and design speed matters more than a large content system. Choose [Webflow](/tools/webflow) when the page will grow into a structured, CMS-backed marketing site with many pages and regular publishing. Choose [Kit](/tools/kit) when the page mainly exists to collect emails and warm up a launch list, and the design can stay simple.

If you are unsure, start with the smallest page that clearly explains the app and captures interest. A launch page rarely fails because of the builder. It fails when the promise, the target user, and the call to action are vague.

> [!NOTE] Solo builder scope
> This guide is for a solo developer shipping an app landing page, waitlist, or beta signup page, not a marketing team running a large content operation. Optimize for time-to-live and clarity first, then upgrade the tooling if the page earns it.

![Decision guide for choosing a mobile app landing page builder, routing from the page's main job to Framer, Webflow, or Kit.](/content-visuals/articles/best-landing-page-builders-decision.svg "Route the choice by the page's real job: a design-led launch page, a growing marketing site, or an email-first waitlist.")

## Decide what the page is for
Before comparing builders, answer three questions in order:

- Is this a single launch or waitlist page, or the first step of a multi-page marketing site?
- Will you publish new content, such as posts, a changelog, or comparison pages, on a schedule?
- Is the page's main job to look great and explain the app, or to grow an email list you will message later?

If the honest answer is "one page, no regular content, just explain the app and capture interest," you do not need a heavy platform. If the answer is "this becomes our marketing site," lean toward a real CMS. If the answer is "the list is the point," lead with an email-first tool.

## The three main options
:::comparison Landing page builder fit
| Decision | Framer | Webflow | Kit |
| --- | --- | --- | --- |
| Best fit | Fast, design-led launch or waitlist page | Structured, CMS-backed marketing site | Email-first waitlist and launch sequence |
| Content system | Built-in CMS collections on paid plans | Strong CMS with collections and dynamic content | Broadcasts, sequences, and simple pages |
| Ongoing publishing | Fine for occasional pages | Best when publishing regularly | Best when the output is email, not pages |
| Learning curve | Low to moderate | Moderate to high | Low |
| Audience capture | Forms plus your email tool | Forms plus your email tool | Native list, tagging, and automations |
| Watch out for | Plan limits on bandwidth and CMS collections | Separate workspace and per-site plans to budget | Design flexibility is intentionally limited |
:::

### Framer
Choose [Framer](/tools/framer) when you want a launch page live quickly with strong visual polish. It has a free starter tier on a Framer subdomain, and paid tiers add a custom domain plus more CMS collections and bandwidth as the site grows. Higher tiers add options such as staging, preview branches, and A/B testing.

It is the fastest path to a credible page for most solo launches. The main thing to watch is plan limits: bandwidth and CMS collection counts scale with the paid tier, so check the current plan against how much traffic and content you expect.

### Webflow
Choose [Webflow](/tools/webflow) when the launch page is step one of a real marketing site with a blog, changelog, docs, or many landing pages. It is closer to a full web design and CMS platform than a single-page builder.

Webflow separates account or workspace plans from per-site plans, and in 2026 it simplified its site-plan lineup: a permanently free Starter tier on a webflow.io subdomain, then paid site plans that scale CMS items, collections, and bandwidth, plus a higher team tier. That flexibility is powerful, but it also means more plan decisions and a steeper learning curve than a single-page tool. Pick it when that power will actually be used.

### Kit
Choose [Kit](/tools/kit), formerly ConvertKit, when the launch is really an audience-building play: collect emails now, launch to a warm list later. Kit is a creator-focused email platform with landing pages, forms, sequences, and automations. It has a free newsletter tier, and paid tiers unlock unlimited automations, sequences, and deeper subscriber tooling.

Its pages are simpler than Framer or Webflow by design. That is the tradeoff: less visual control, but a much stronger email, tagging, and automation workflow once someone subscribes.

## The landing page is not the store listing
A web landing page and the App Store or Google Play listing are different surfaces with different rules. Keep the positioning aligned, but do not treat one as the other. Prepare store creative with [AppScreens](/tools/appscreens) or another tool in the [screenshots category](/categories/screenshots), and reuse the same hero message and target-user language across both so the funnel feels consistent.

## A minimal launch page that converts
Whatever builder you choose, the page needs the same core:

- A one-sentence promise: who it is for and what changes after they use the app.
- A hero visual or short demo that shows the app in use.
- Three to five benefit points tied to real jobs, not feature lists.
- One primary call to action: download, join the waitlist, or start.
- Honest social proof if you have it, and none if you do not.
- Working email capture connected to the tool you will actually send from.

## Best for
- Solo developers who need a launch, waitlist, or beta signup page quickly.
- Apps validating positioning before spending on acquisition.
- Builders choosing between design-led pages, a growing marketing site, or an email-first list.

## Not good for
- Teams that already run a mature marketing site and CRM and just need another page inside it.
- Native in-app UI prototyping, which belongs in your app and design tools, not a web builder.

## Internal links
- Put the page to work with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).
- Compare list-building options in the [email and waitlist category](/categories/email-waitlists).
- Browse more [landing page tools](/categories/landing-pages) and [launch tools](/categories/launch).
- Prepare store creative via the [screenshots category](/categories/screenshots) and [AppScreens](/tools/appscreens).
- If the app sells subscriptions, connect the page to the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).

## Source checks
Pricing and product claims were checked against official sources on 2026-07-09:

- Framer pricing: https://www.framer.com/pricing/
- Webflow pricing and 2026 plan changes: https://webflow.com/pricing
- Kit pricing: https://kit.com/pricing

Pricing tiers and limits change often, so exact thresholds are summarized at a high level here. No hands-on testing claims are made in this guide. The decision visual is an owned conceptual graphic created for IndieAppStack.

Last checked: 2026-07-09.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("landing-pages").id,
          seo_title: "Best landing page builders for mobile apps",
          seo_description:
            "Compare landing page builders for mobile apps, including Framer, Webflow, and email-first waitlist workflows.",
          human_reviewed: true,
          ai_assisted: false,
          published_at: new Date().toISOString(),
        },
        {
          title: "Crash reporting setup for a solo app launch",
          slug: "crash-reporting-setup-indie-mobile-apps",
          subtitle:
            "A practical pre-launch recipe for crashes, releases, alerts, and first-week triage.",
          excerpt:
            "Set up crash reporting before launch with a minimum metadata checklist, release monitoring flow, and Sentry vs Firebase Crashlytics decision path.",
          body_markdown: `## Short answer
Set up crash reporting before the first external build, not after the first public crash review. For a solo app launch, the minimum useful system is one crash tool, one release naming convention, uploaded symbols or source maps, one alert route, and a short weekly triage habit.

[Sentry](/tools/sentry) is the better default when you want crash and error monitoring that can grow across iOS, Android, React Native, Flutter, web, and backend surfaces. [Firebase](/tools/firebase) Crashlytics is the better default when the app already uses Firebase and you want mobile crash reporting close to Firebase Analytics, Remote Config, and the rest of that console.

![Crash reporting release monitoring flow for a solo app launch, from pre-launch setup through first-week triage.](/content-visuals/articles/crash-reporting-launch-flow.svg "Install crash reporting before launch, tag every release, upload symbols, route alerts, then triage crashes by impact.")

## What to install before launch
Do not start with a large observability stack. Start with the failure paths that can ruin a launch:

- Fatal crashes, app hangs, and watchdog terminations where the SDK supports them.
- Non-fatal errors for purchase, login, sync, onboarding, and data-loss paths.
- Release and environment tags so crashes can be tied to a specific build.
- Readable stack traces, which usually means dSYMs for iOS, mapping files for Android, and source maps for React Native or web code.
- One alert route you will actually see during launch week.

This is enough to answer the first serious operating question: did the latest build create a new problem for real users?

:::comparison Setup path for a solo launch
| Decision | Sentry | Firebase Crashlytics |
| --- | --- | --- |
| Best first fit | Cross-platform app, backend errors, web errors, or broader release monitoring | Firebase-first mobile app that wants crash reporting in the same console |
| Setup focus | SDK install, DSN, release naming, debug symbols or source maps, alerts | Firebase app setup, Crashlytics SDK, Google config files, build scripts, alerts |
| Strong operating habit | Review new issues and regressions by release | Review crash-free users, issue impact, velocity alerts, and Firebase context |
| Watch out for | Keep sampling, PII, projects, and alert noise intentional | Do not add Firebase only for Crashlytics if you want to avoid a Google-centered stack |
| Current pricing check | Free Developer plan is available for one user; paid plans expand usage and users | Firebase pricing lists Crashlytics as no-cost |
:::

## Minimum metadata to configure
Crash reports become valuable when they carry enough context to make a decision without guessing. For a solo launch, configure this minimum set:

| Metadata | Why it matters |
| --- | --- |
| Release name | Tells you whether a crash was introduced by the current build. Use a stable pattern such as bundle id, app version, and build number. |
| Environment | Separates development, TestFlight or beta, and production events. |
| Platform and OS version | Helps isolate iOS-only, Android-only, or OS-specific failures. |
| App version and build number | Makes support replies and hotfix decisions concrete. |
| Device model | Useful when crashes cluster around memory, camera, media, or low-end devices. |
| User id or anonymous install id | Helps count affected users without exposing personal data. |
| Critical feature tags | Mark purchase, onboarding, sync, recording, export, or other core flows. |
| Breadcrumbs or logs | Shows the path before the crash, but keep private data out. |

For Sentry, releases and release health connect errors to deployed code and can show regressions introduced in a new release. For Firebase Crashlytics, logs, keys, non-fatal events, and analytics context can make a crash easier to understand.

## Pre-launch setup checklist
- Pick one owner: Sentry or Firebase Crashlytics. Do not install both unless there is a specific reason.
- Create separate projects or environments for development, beta, and production if the tool workflow supports it cleanly.
- Add the SDK and verify a test error reaches the dashboard.
- Verify a real crash without a debugger attached where the platform requires that.
- Confirm dSYMs, Android mapping files, or source maps upload from local release builds and CI.
- Set release naming to include app version and build number.
- Add custom metadata for paywall, auth, onboarding, sync, media, export, or any feature that can block the user.
- Turn on one urgent alert for new high-impact crashes or regressions.
- Write a tiny triage rule: fix crashes that affect onboarding, payment, data loss, or more than a small cluster of users before adding new features.

## Release monitoring flow
Use the crash tool as a launch loop, not a passive dashboard.

1. Before submitting the build, check that the new release appears in the dashboard.
2. Upload symbols or source maps as part of the release build.
3. Run a smoke test and confirm the event carries release, environment, app version, and build number.
4. During the first 24 hours, check new issues twice: once after the first real users arrive and once after the daily usage peak.
5. During days 2-7, review new, regressed, and high-user-impact issues once per day.
6. After week one, keep a weekly review unless a release goes out, an alert fires, or support reports a pattern.

The decision is not "did any crash happen?" A small app can survive some low-impact crashes. The better question is "did this release introduce a crash that blocks activation, payment, core usage, or trust?"

## Sentry setup path
Choose [Sentry](/tools/sentry) when your app is likely to need one error workflow across the mobile app, backend jobs, web landing pages, API routes, or React Native/Flutter layers. For iOS, Sentry's Apple SDK docs cover automatic error and crash reporting, app hangs, watchdog terminations, setup through the Sentry Wizard, and debug symbol upload. Its release documentation explains how release names help connect issues and regressions to deployed code.

The solo-builder path is:

- Create one Sentry project per platform or app surface that needs separate ownership.
- Install the SDK for iOS, React Native, Flutter, Android, or the relevant platform.
- Add the DSN at runtime and keep auth tokens only in local secrets or CI secrets.
- Configure release name, environment, and the minimum metadata above.
- Upload debug symbols or source maps for release builds.
- Add an alert for new high-impact crashes or regressions.
- Keep tracing, profiling, replay, and logs conservative until the crash workflow is stable.

## Firebase Crashlytics setup path
Choose [Firebase](/tools/firebase) Crashlytics when Firebase is already part of the app stack or when you want a mobile-first crash dashboard inside the Firebase console. Firebase describes Crashlytics as a lightweight realtime crash reporter for Apple, Android, Flutter, and Unity, with grouping, impact context, alerts, logs, keys, non-fatal events, and custom events.

The solo-builder path is:

- Add the app to Firebase and install the Firebase SDK pieces required for Crashlytics.
- Add Crashlytics to iOS, Android, Flutter, or Unity using the current Firebase docs.
- Verify a test crash and confirm it appears under the expected app and release.
- Add custom keys for critical app state, such as entitlement status, onboarding step, sync mode, or export format.
- Confirm dSYM or mapping file upload in the release build process.
- Use Firebase alerts for new, regressed, or increasing issues.
- Keep analytics context useful, but avoid logging private user content.

## After the first week
Once launch stability is under control, decide what to add next:

- If crashes are readable but performance is unclear, evaluate tracing or performance monitoring.
- If binary size, startup time, or build regressions are hurting releases, review [Emerge Tools](/tools/emerge-tools).
- If release mistakes are frequent, connect crash reporting to CI with [Codemagic](/tools/codemagic), [Bitrise](/tools/bitrise), or the build system you already use.
- If you are still choosing a crash tool, compare [Sentry vs Firebase Crashlytics for mobile apps](/comparisons/sentry-vs-firebase-crashlytics-mobile-apps).

## Source checks
Tool facts in this guide were checked against official pages on 2026-07-01:

- Sentry pricing: https://sentry.io/pricing/
- Sentry iOS SDK docs: https://docs.sentry.io/platforms/apple/guides/ios/
- Sentry release health docs: https://docs.sentry.io/platforms/apple/guides/ios/configuration/releases/
- Firebase Crashlytics docs: https://firebase.google.com/docs/crashlytics
- Firebase Crashlytics product page: https://firebase.google.com/products/crashlytics
- Firebase pricing: https://firebase.google.com/pricing

## Related IndieAppStack pages
- Browse the [crash reporting category](/categories/crash-reporting).
- Compare [Sentry](/tools/sentry) and [Firebase](/tools/firebase).
- Use the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist) before public launch.
- Pair this with the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) if the launch depends on paid subscriptions.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("crash-reporting").id,
          seo_title: "Crash reporting setup for a solo app launch",
          seo_description:
            "Set up crash reporting before launch with a Sentry vs Firebase Crashlytics decision path, release metadata checklist, alerts, and first-week triage flow.",
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
        tool_id: tools.get("adapty").id,
        relationship: "supporting",
        sort_order: 20,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("superwall").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("qonversion").id,
        relationship: "supporting",
        sort_order: 40,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("supabase").id,
        relationship: "supporting",
        sort_order: 50,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("telemetrydeck").id,
        relationship: "supporting",
        sort_order: 60,
      },
      {
        article_id: articles.get(
          "best-monetization-tools-solo-mobile-developers",
        ).id,
        tool_id: tools.get("posthog").id,
        relationship: "supporting",
        sort_order: 70,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("revenuecat").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("supabase").id,
        relationship: "supporting",
        sort_order: 20,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("firebase").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("appwrite").id,
        relationship: "supporting",
        sort_order: 40,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("telemetrydeck").id,
        relationship: "supporting",
        sort_order: 50,
      },
      {
        article_id: articles.get("subscription-mvp-stack-solo-ios-app").id,
        tool_id: tools.get("sentry").id,
        relationship: "supporting",
        sort_order: 60,
      },
      {
        article_id: articles.get("supabase-vs-firebase-indie-mobile-apps").id,
        tool_id: tools.get("supabase").id,
        relationship: "featured",
        sort_order: 10,
      },
      {
        article_id: articles.get("supabase-vs-firebase-indie-mobile-apps").id,
        tool_id: tools.get("firebase").id,
        relationship: "featured",
        sort_order: 20,
      },
      {
        article_id: articles.get("supabase-vs-firebase-indie-mobile-apps").id,
        tool_id: tools.get("appwrite").id,
        relationship: "featured",
        sort_order: 30,
      },
      {
        article_id: articles.get("revenuecat-vs-adapty-ios-subscriptions").id,
        tool_id: tools.get("revenuecat").id,
        relationship: "featured",
        sort_order: 10,
      },
      {
        article_id: articles.get("revenuecat-vs-adapty-ios-subscriptions").id,
        tool_id: tools.get("adapty").id,
        relationship: "featured",
        sort_order: 20,
      },
      {
        article_id: articles.get("revenuecat-vs-adapty-ios-subscriptions").id,
        tool_id: tools.get("superwall").id,
        relationship: "featured",
        sort_order: 30,
      },
      {
        article_id: articles.get("appfigures-vs-apptweak-aso-tools").id,
        tool_id: tools.get("appfigures").id,
        relationship: "featured",
        sort_order: 10,
      },
      {
        article_id: articles.get("appfigures-vs-apptweak-aso-tools").id,
        tool_id: tools.get("apptweak").id,
        relationship: "featured",
        sort_order: 20,
      },
      {
        article_id: articles.get("sentry-vs-firebase-crashlytics-mobile-apps")
          .id,
        tool_id: tools.get("sentry").id,
        relationship: "featured",
        sort_order: 10,
      },
      {
        article_id: articles.get("sentry-vs-firebase-crashlytics-mobile-apps")
          .id,
        tool_id: tools.get("firebase").id,
        relationship: "featured",
        sort_order: 20,
      },
      {
        article_id: articles.get("privacy-friendly-analytics-starter-stack").id,
        tool_id: tools.get("telemetrydeck").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("aso-starter-checklist-indie-mobile-apps").id,
        tool_id: tools.get("apptweak").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("aso-starter-checklist-indie-mobile-apps").id,
        tool_id: tools.get("appfigures").id,
        relationship: "supporting",
        sort_order: 20,
      },
      {
        article_id: articles.get("aso-starter-checklist-indie-mobile-apps").id,
        tool_id: tools.get("appscreens").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get("mobile-app-launch-stack-checklist").id,
        tool_id: tools.get("framer").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("mobile-app-launch-stack-checklist").id,
        tool_id: tools.get("beehiiv").id,
        relationship: "supporting",
        sort_order: 20,
      },
      {
        article_id: articles.get("mobile-app-launch-stack-checklist").id,
        tool_id: tools.get("appscreens").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get("best-paywall-tools-ios-apps").id,
        tool_id: tools.get("revenuecat").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("best-paywall-tools-ios-apps").id,
        tool_id: tools.get("adapty").id,
        relationship: "recommended",
        sort_order: 20,
      },
      {
        article_id: articles.get("best-paywall-tools-ios-apps").id,
        tool_id: tools.get("superwall").id,
        relationship: "recommended",
        sort_order: 30,
      },
      {
        article_id: articles.get("best-aso-tools-for-indie-developers").id,
        tool_id: tools.get("apptweak").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("best-aso-tools-for-indie-developers").id,
        tool_id: tools.get("appfigures").id,
        relationship: "recommended",
        sort_order: 20,
      },
      {
        article_id: articles.get("best-aso-tools-for-indie-developers").id,
        tool_id: tools.get("appfollow").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get("best-aso-tools-for-indie-developers").id,
        tool_id: tools.get("appscreens").id,
        relationship: "supporting",
        sort_order: 40,
      },
      {
        article_id: articles.get("best-landing-page-builders-mobile-apps").id,
        tool_id: tools.get("framer").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("best-landing-page-builders-mobile-apps").id,
        tool_id: tools.get("webflow").id,
        relationship: "recommended",
        sort_order: 20,
      },
      {
        article_id: articles.get("best-landing-page-builders-mobile-apps").id,
        tool_id: tools.get("kit").id,
        relationship: "supporting",
        sort_order: 30,
      },
      {
        article_id: articles.get("crash-reporting-setup-indie-mobile-apps").id,
        tool_id: tools.get("sentry").id,
        relationship: "recommended",
        sort_order: 10,
      },
      {
        article_id: articles.get("crash-reporting-setup-indie-mobile-apps").id,
        tool_id: tools.get("firebase").id,
        relationship: "supporting",
        sort_order: 20,
      },
      {
        article_id: articles.get("crash-reporting-setup-indie-mobile-apps").id,
        tool_id: tools.get("emerge-tools").id,
        relationship: "supporting",
        sort_order: 30,
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
        target_category_id: categories.get("paywalls").id,
        related_tool_ids: [
          tools.get("revenuecat").id,
          tools.get("superwall").id,
          tools.get("adapty").id,
        ],
        priority: 10,
        status: "published",
        notes:
          "Upgraded and published during the Days 1-30 trust reset sprint.",
      },
      {
        title: "Framer vs Webflow for mobile app landing pages",
        slug: "framer-vs-webflow-mobile-app-landing-pages",
        target_keyword: "Framer vs Webflow landing page",
        search_intent: "commercial investigation",
        target_category_id: categories.get("landing-pages").id,
        related_tool_ids: [tools.get("framer").id, tools.get("webflow").id],
        priority: 100,
        status: "briefed",
        notes:
          "Next 30 days. Head-to-head to complete the landing-page cluster and support landing-page tool evaluation.",
      },
      {
        title: "Email and waitlist stack for a mobile app launch",
        slug: "email-waitlist-stack-mobile-app-launch",
        target_keyword: "email waitlist stack app launch",
        search_intent: "practical investigation",
        target_category_id: categories.get("email-waitlists").id,
        related_tool_ids: [tools.get("kit").id, tools.get("beehiiv").id],
        priority: 95,
        status: "briefed",
        notes:
          "Next 30 days. Fills the thin email-and-waitlist category and pairs with the launch checklist.",
      },
      {
        title: "App screenshots workflow for non-designers",
        slug: "app-screenshots-workflow-non-designers",
        target_keyword: "app store screenshots workflow",
        search_intent: "practical investigation",
        target_category_id: categories.get("screenshots").id,
        related_tool_ids: [
          tools.get("appscreens").id,
          tools.get("screenshots-pro").id,
        ],
        priority: 90,
        status: "briefed",
        notes:
          "Next 30 days. Store-creative recipe that the ASO and launch content links into.",
      },
      {
        title: "Push notification starter stack for indie apps",
        slug: "push-notification-starter-stack-indie-apps",
        target_keyword: "push notification tools indie apps",
        search_intent: "practical investigation",
        target_category_id: categories.get("push").id,
        related_tool_ids: [tools.get("onesignal").id],
        priority: 80,
        status: "briefed",
        notes:
          "Next 30 days. Covers the thin push category with a lean, opt-in-friendly setup.",
      },
      {
        title:
          "CI/CD for solo mobile developers: Codemagic vs Bitrise vs fastlane",
        slug: "cicd-for-solo-mobile-developers",
        target_keyword: "mobile CI CD for solo developers",
        search_intent: "commercial investigation",
        target_category_id: categories.get("dev-productivity").id,
        related_tool_ids: [
          tools.get("codemagic").id,
          tools.get("bitrise").id,
          tools.get("fastlane").id,
        ],
        priority: 75,
        status: "briefed",
        notes:
          "Next 30 days. Release automation comparison; links from the launch checklist postpone list.",
      },
      {
        title: "TelemetryDeck vs PostHog for indie app analytics",
        slug: "telemetrydeck-vs-posthog-indie-analytics",
        target_keyword: "TelemetryDeck vs PostHog",
        search_intent: "commercial investigation",
        target_category_id: categories.get("analytics").id,
        related_tool_ids: [
          tools.get("telemetrydeck").id,
          tools.get("posthog").id,
        ],
        priority: 70,
        status: "briefed",
        notes:
          "Next 30 days. Deep head-to-head that the analytics starter stack links into.",
      },
      {
        title: "Beehiiv vs Kit for indie app newsletters",
        slug: "beehiiv-vs-kit-indie-app-newsletters",
        target_keyword: "beehiiv vs Kit newsletter",
        search_intent: "commercial investigation",
        target_category_id: categories.get("email-waitlists").id,
        related_tool_ids: [tools.get("beehiiv").id, tools.get("kit").id],
        priority: 65,
        status: "briefed",
        notes:
          "Next 30 days. Supports the email cluster and the Kit/beehiiv choice in the launch content.",
      },
      {
        title: "When a solo app actually needs a backend",
        slug: "when-a-solo-app-needs-a-backend",
        target_keyword: "does my app need a backend",
        search_intent: "practical investigation",
        target_category_id: categories.get("backend").id,
        related_tool_ids: [
          tools.get("supabase").id,
          tools.get("firebase").id,
          tools.get("appwrite").id,
        ],
        priority: 60,
        status: "briefed",
        notes:
          "Next 30 days. Decision guide that routes into the Supabase vs Firebase vs Appwrite comparison.",
      },
    ],
    { onConflict: "slug" },
  );

  console.log("Seed completed idempotently.");
} catch (error) {
  console.error(error.message);
  exit(1);
}
