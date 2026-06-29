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
Revisit paywall testing, lifecycle email, and attribution once the app has real subscription traffic.

## Best for
- Solo builders launching subscriptions with [RevenueCat](/tools/revenuecat).
- Apps that need a simple backend like [Supabase](/tools/supabase).
- Teams that want lightweight analytics before adding a larger growth stack.

## Not good for
- Apps that only sell one-time web purchases.
- Teams that already have a mature payment and entitlement backend.

## Internal links
- Compare the full [monetization tools category](/categories/monetization).
- Review [paywall tools](/categories/paywalls) before running experiments.
- Pair this with the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Short answer
Choose [Supabase](/tools/supabase) when your app data is relational, you want SQL visibility, and portability matters. Choose [Firebase](/tools/firebase) when you already want Google's mobile backend ecosystem, document-style data, and Crashlytics/Analytics nearby.

## Comparison table
:::comparison Backend fit
| Decision | Supabase | Firebase |
| --- | --- | --- |
| Data model | Relational Postgres | Document-first NoSQL |
| Auth | Built in | Built in |
| Best fit | SQL-backed app data | Google ecosystem mobile apps |
| Portability | Strong SQL portability | Strong Google platform fit |
| Source | [Supabase pricing](https://supabase.com/pricing) | [Firebase pricing](https://firebase.google.com/pricing) |
:::

## Tool-by-tool breakdown
### Supabase
[Supabase](/tools/supabase) fits apps that want Postgres, SQL reporting, Auth, Storage, and a backend that feels close to a normal database-backed product.

### Firebase
[Firebase](/tools/firebase) fits apps that want a broad mobile backend suite, fast setup, Google ecosystem integrations, and a document-first data model.

## Recommendation matrix
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Relational app data | Supabase | Postgres keeps joins, reporting, and migrations familiar |
| Google-first mobile stack | Firebase | Firebase keeps auth, analytics, messaging, and Crashlytics close together |
| SQL reporting needs | Supabase | Direct SQL access is easier to reason about |
| Document sync mental model | Firebase | Firestore is designed around document collections |
:::

## Pricing comparison
Last checked: 2026-06-29. Use the official [Supabase pricing](https://supabase.com/pricing) and [Firebase pricing](https://firebase.google.com/pricing) pages before committing, because usage limits and product packaging can change.

## Setup complexity
Supabase is simple when the team is comfortable with SQL, schema design, and migrations. Firebase is simple when the app fits Firebase defaults and the team wants less database administration.

## Platform support
Both can support iOS, Android, and web apps. The practical difference is not platform availability; it is whether your future product logic is easier as relational SQL or Firebase documents.

## Recommendation
For most indie apps with structured app data, Supabase is the cleaner default. Choose Firebase when the app benefits from staying inside Firebase's mobile product suite.

## Affiliate disclosure
This comparison may link to tools that could become partner relationships in the future. Editorial recommendations are based on fit, not commission.

## Related tools and guides
- Compare [Supabase](/tools/supabase) and [Firebase](/tools/firebase).
- Review the [backend category](/categories/backend).
- Pair this with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).`,
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
          title: "RevenueCat vs Adapty for iOS subscriptions",
          slug: "revenuecat-vs-adapty-ios-subscriptions",
          subtitle:
            "A practical comparison for subscription infrastructure, paywalls, experiments, and analytics.",
          excerpt:
            "Compare RevenueCat and Adapty before choosing a subscription and paywall stack for an iOS app.",
          body_markdown: `## Short answer
Choose [RevenueCat](/tools/revenuecat) when subscription infrastructure, receipt validation, and entitlement reliability are the core job. Choose [Adapty](/tools/adapty) when no-code paywalls, experiments, and subscription analytics are a larger part of the workflow.

## Comparison table
:::comparison Subscription tool fit
| Decision | RevenueCat | Adapty |
| --- | --- | --- |
| Primary job | Purchases and entitlements | Paywalls, experiments, and subscription analytics |
| Strongest fit | Infrastructure-first subscription apps | Growth workflow around paywalls |
| Team stage | MVP to scale | MVP to scale |
| Source | [RevenueCat pricing](https://www.revenuecat.com/pricing/) | [Adapty pricing](https://adapty.io/pricing/) |
:::

## Tool-by-tool breakdown
### RevenueCat
[RevenueCat](/tools/revenuecat) is the stronger default when the team wants a reliable subscription backend first: products, purchases, receipt validation, entitlements, and cross-platform customer state.

### Adapty
[Adapty](/tools/adapty) is a better fit when the paywall workflow itself is the main operating surface, especially if the team wants visual paywall iteration, experiments, and analytics in one place.

## Recommendation matrix
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Subscription backend first | RevenueCat | Entitlements and purchase infrastructure are the center |
| Paywall experimentation first | Adapty | Paywall iteration and analytics are more prominent |
| Small solo app launching subscriptions | RevenueCat | Fewer moving parts for the core purchase path |
| Growth team optimizing upgrade screens | Adapty | More emphasis on paywall and experiment workflows |
:::

## Pricing comparison
Last checked: 2026-06-29. Check [RevenueCat pricing](https://www.revenuecat.com/pricing/) and [Adapty pricing](https://adapty.io/pricing/) before choosing. Do not rely on copied plan names or thresholds without checking the official pricing pages.

## Setup complexity
RevenueCat setup complexity is usually around product configuration, SDK integration, and entitlement modeling. Adapty setup complexity is similar for purchases, then adds paywall configuration and experiment workflow decisions.

## Platform support
Both are relevant for iOS subscription apps and broader mobile subscription workflows. Confirm current SDK coverage and store support in official docs before implementing.

## Recommendation
Start with RevenueCat if you mainly need durable purchase infrastructure. Choose Adapty if the team expects frequent paywall iteration to be the primary operating loop.

## Affiliate disclosure
This comparison may link to tools that could become partner relationships in the future. Editorial recommendations are based on fit, not commission.

## Related tools and guides
- Compare [RevenueCat](/tools/revenuecat) and [Adapty](/tools/adapty).
- Review the [paywalls category](/categories/paywalls).
- Read [Best paywall tools for iOS apps](/guides/best-paywall-tools-ios-apps).`,
          author: "IndieAppStack",
          status: "published",
          content_type: "comparison",
          primary_category_id: categories.get("paywalls").id,
          seo_title: "RevenueCat vs Adapty for iOS subscriptions",
          seo_description:
            "Compare RevenueCat and Adapty for iOS subscriptions, paywalls, entitlements, setup complexity, pricing checks, and best use cases.",
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
Choose [AppTweak](/tools/apptweak) when keyword research and ASO planning are the main jobs. Choose [Appfigures](/tools/appfigures) when app intelligence, rankings, reviews, and ongoing store monitoring are the bigger need.

## Comparison table
:::comparison ASO workflow fit
| Decision | Appfigures | AppTweak |
| --- | --- | --- |
| Primary job | App intelligence and monitoring | ASO research and optimization |
| Strongest fit | Rankings, reviews, market signal | Keywords, metadata, competitor ASO |
| Team stage | Launch to growth | Launch to growth |
| Source | [Appfigures pricing](https://appfigures.com/pricing) | [AppTweak pricing](https://www.apptweak.com/pricing) |
:::

## Tool-by-tool breakdown
### Appfigures
[Appfigures](/tools/appfigures) is useful when the team wants a broad read on store performance, rankings, review changes, and market intelligence over time.

### AppTweak
[AppTweak](/tools/apptweak) is a stronger fit when the next job is picking keywords, auditing metadata, and improving the search side of an app listing.

## Recommendation matrix
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Keyword research sprint | AppTweak | ASO planning is the center of the workflow |
| Ongoing rank and review monitoring | Appfigures | Broader app intelligence is the core job |
| Metadata refresh before launch | AppTweak | Better fit for search intent and competitor metadata work |
| Portfolio-level store tracking | Appfigures | Better fit for monitoring multiple apps over time |
:::

## Pricing comparison
Last checked: 2026-06-29. Check [Appfigures pricing](https://appfigures.com/pricing) and [AppTweak pricing](https://www.apptweak.com/pricing) directly before buying, especially if you need multiple apps, countries, keywords, seats, or advanced intelligence features.

## Setup complexity
Both tools are lighter to adopt than engineering tools. The real setup cost is deciding which apps, countries, keywords, and competitors to track so the dashboard does not become noise.

## Platform support
Both are relevant to App Store and Google Play research workflows. Confirm current country, keyword, and store coverage on the official product pages before committing.

## Recommendation
Pick AppTweak when you are actively rewriting the listing around keywords. Pick Appfigures when you need a broader monitoring habit around rankings, reviews, and market signal.

## Affiliate disclosure
This comparison may link to tools that could become partner relationships in the future. Editorial recommendations are based on fit, not commission.

## Related tools and guides
- Compare [Appfigures](/tools/appfigures) and [AppTweak](/tools/apptweak).
- Review the [ASO category](/categories/aso).
- Read [Best ASO tools for indie developers](/guides/best-aso-tools-for-indie-developers).`,
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
Choose [Sentry](/tools/sentry) when you want error monitoring that can span mobile, backend, and web surfaces. Choose [Firebase](/tools/firebase) Crashlytics when your app already uses Firebase and you want crash reporting inside that mobile stack.

## Comparison table
:::comparison Crash reporting fit
| Decision | Sentry | Firebase Crashlytics |
| --- | --- | --- |
| Primary job | Error monitoring across app surfaces | Mobile crash reporting in Firebase |
| Strongest fit | Cross-platform error visibility | Firebase-native mobile apps |
| Team stage | MVP to scale | MVP to scale |
| Source | [Sentry pricing](https://sentry.io/pricing/) | [Firebase Crashlytics](https://firebase.google.com/products/crashlytics) |
:::

## Tool-by-tool breakdown
### Sentry
[Sentry](/tools/sentry) is useful when crashes, handled errors, releases, and traces need to be visible across more than the mobile app.

### Firebase Crashlytics
[Firebase](/tools/firebase) Crashlytics fits teams already using Firebase who want native mobile crash reporting close to Firebase Analytics and other Firebase services.

## Recommendation matrix
:::comparison Best choice by use case
| Use case | Recommended choice | Why |
| --- | --- | --- |
| Firebase app already in production | Firebase Crashlytics | Keeps crash reporting in the same operational stack |
| Mobile plus backend/web monitoring | Sentry | One error-monitoring workflow can span surfaces |
| First lightweight mobile crash setup | Firebase Crashlytics | Especially simple if Firebase is already installed |
| Release regression analysis across services | Sentry | Stronger fit when errors cross app boundaries |
:::

## Pricing comparison
Last checked: 2026-06-29. Check [Sentry pricing](https://sentry.io/pricing/) and [Firebase pricing](https://firebase.google.com/pricing) before deciding. Also review [Firebase Crashlytics](https://firebase.google.com/products/crashlytics) for current product scope.

## Setup complexity
Crashlytics is usually simplest when Firebase is already in the app. Sentry can still be straightforward, but the team should decide what platforms, releases, environments, and alerts belong in the same project.

## Platform support
Both are relevant for mobile crash monitoring. Sentry also covers broader application surfaces, while Crashlytics is centered on Firebase's mobile app workflow.

## Recommendation
Use Crashlytics if Firebase is already the center of the app stack. Use Sentry if you want error monitoring that can grow beyond mobile crash reports.

## Affiliate disclosure
This comparison may link to tools that could become partner relationships in the future. Editorial recommendations are based on fit, not commission.

## Related tools and guides
- Compare [Sentry](/tools/sentry) and [Firebase](/tools/firebase).
- Review the [crash reporting category](/categories/crash-reporting).
- Read [Crash reporting setup for indie mobile apps](/guides/crash-reporting-setup-indie-mobile-apps).`,
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
Review events monthly and remove anything that does not change product decisions.

## Best for
- Apps that need activation, retention, and conversion signal.
- Teams choosing between [TelemetryDeck](/tools/telemetrydeck), [PostHog](/tools/posthog), and [Amplitude](/tools/amplitude).
- Builders who want to keep the first event taxonomy small.

## Not good for
- Apps that need full paid-ad attribution before product analytics.
- Teams that cannot maintain consistent event names.

## Internal links
- Compare more [analytics tools](/categories/analytics).
- Connect analytics to [monetization decisions](/categories/monetization).
- Use this with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Start with the searchable promise
ASO work is easier when the app's core promise is specific enough to become keywords, screenshots, and comparison copy.

## First checklist
- Pick a small set of primary and secondary keywords.
- Compare three direct competitors for title, subtitle, screenshots, and reviews.
- Check whether your first screenshots explain the app before showing UI detail.
- Set a recurring review-monitoring habit.

:::comparison ASO starter tools
| Job | AppTweak | Appfigures | AppScreens |
| --- | --- | --- | --- |
| Keyword research | Strong | Useful | Not primary |
| Review/ranking monitoring | Useful | Strong | Not primary |
| Screenshot production | Not primary | Not primary | Strong |
:::

## Review cadence
Re-check rankings, screenshots, and review language monthly while the app is still learning what converts.

## Best for
- Teams preparing metadata, screenshots, and keyword updates.
- Indie developers comparing [AppTweak](/tools/apptweak), [Appfigures](/tools/appfigures), and [AppScreens](/tools/appscreens).
- Apps that need a repeatable store-listing review cadence.

## Not good for
- Products that have not yet clarified their target user or app promise.
- Teams expecting ASO software to replace positioning work.

## Internal links
- Compare the full [ASO tools category](/categories/aso).
- Use screenshots from the [screenshots category](/categories/screenshots).
- Pair the work with the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Keep the launch stack small
The first launch stack should explain the app, capture interest, and make the store listing look credible.

## Recommended launch flow
- Build a landing page that names the problem and target user.
- Add waitlist or newsletter capture before release.
- Prepare store screenshots before sending traffic.
- Keep a lightweight update channel for beta users and early subscribers.

:::comparison Launch starter tools
| Job | Framer | beehiiv | AppScreens |
| --- | --- | --- | --- |
| Landing page | Strong | Basic | Not primary |
| Audience capture | Basic | Strong | Not primary |
| Store creative | Not primary | Not primary | Strong |
:::

## What to revisit
After launch, compare which source drives clicks, installs, subscribers, or paid conversions before adding more channels.

## Best for
- Solo developers planning a first App Store or Google Play release.
- Apps that need a page, waitlist, screenshots, and an update channel.
- Teams choosing between [Framer](/tools/framer), [beehiiv](/tools/beehiiv), and [AppScreens](/tools/appscreens).

## Not good for
- Teams that already have a mature marketing site and CRM workflow.
- Apps that need enterprise campaign orchestration on day one.

## Internal links
- Compare more [launch tools](/categories/launch).
- Build the page with [landing page tools](/categories/landing-pages).
- Prepare store visuals with [screenshot tools](/categories/screenshots).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Search intent
This guide is for builders comparing paywall and subscription tools before implementing or replacing an iOS subscription flow.

## Shortlist
- [RevenueCat](/tools/revenuecat) is a strong default when receipt validation, entitlement sync, and subscription infrastructure matter.
- [Adapty](/tools/adapty) is useful when no-code paywalls, experiments, and subscription analytics are central.
- [Superwall](/tools/superwall) fits teams that want remote paywall presentation and iteration without frequent app releases.

:::comparison Paywall tools
| Decision | RevenueCat | Adapty | Superwall |
| --- | --- | --- | --- |
| Best fit | Entitlements and purchases | Paywalls plus analytics | Remote paywall iteration |
| Good stage | MVP to scale | MVP to scale | MVP to scale |
| Check before choosing | Revenue model fit | Revenue threshold and SDK fit | Platform and experiment needs |
:::

## Best for
- Subscription apps that need reliable paywalls and entitlement state.
- Teams comparing [monetization tools](/categories/monetization) before launch.
- Builders who want to test pricing, layout, or upgrade prompts over time.

## Not good for
- Apps that only sell one-time web products.
- Teams that cannot define the subscription promise or upgrade moment yet.

## Internal links
- Compare the broader [paywalls category](/categories/paywalls).
- Start with [Best monetization tools for solo mobile developers](/guides/best-monetization-tools-solo-mobile-developers).
- Add measurement with the [privacy-friendly analytics starter stack](/guides/privacy-friendly-analytics-starter-stack).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Search intent
This guide is for indie developers who want a practical ASO tool shortlist without buying a large market-intelligence stack too early.

## Tool fit
- [AppTweak](/tools/apptweak) is strongest when keyword research and competitor metadata are the main work.
- [Appfigures](/tools/appfigures) is useful for rankings, reviews, app intelligence, and store performance monitoring.
- [AppFollow](/tools/appfollow) fits teams that care about review workflows and reputation monitoring.
- [AppScreens](/tools/appscreens) supports the creative side: screenshots, captions, exports, and localization.

## Best for
- Apps preparing a launch, relaunch, or metadata refresh.
- Teams comparing the [ASO category](/categories/aso) before committing to a workflow.
- Builders who need store insights and screenshot production to work together.

## Not good for
- Apps that have not settled the target audience or positioning.
- Teams expecting ASO tools to guarantee installs without better store copy.

## Internal links
- Start with the [ASO starter checklist](/guides/aso-starter-checklist-indie-mobile-apps).
- Prepare creative assets with [screenshot tools](/categories/screenshots).
- Connect launch planning through the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).

Last checked: 2026-06-29.`,
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
          body_markdown: `## Search intent
This guide is for app builders choosing a landing page tool before launch, waitlist collection, or a store-listing refresh.

## Shortlist
- [Framer](/tools/framer) is strong for fast visual launch pages with polished interaction.
- [Webflow](/tools/webflow) fits more structured marketing sites and CMS-backed pages.
- [Kit](/tools/kit) is useful when the landing page mainly exists to grow an email list.

:::comparison Landing page builders
| Decision | Framer | Webflow | Kit |
| --- | --- | --- | --- |
| Best fit | Fast visual launch page | CMS marketing site | Email-first waitlist |
| Platform | Web | Web | Web |
| Watch out for | Site plan needs | Build complexity | Design flexibility |
:::

## Best for
- Apps validating positioning before paid acquisition.
- Teams building a waitlist or beta signup page.
- Builders comparing [landing page tools](/categories/landing-pages) and [launch tools](/categories/launch).

## Not good for
- Teams that need a full CRM or enterprise lifecycle platform on day one.
- Native UI prototyping work that belongs inside the app.

## Internal links
- Use the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist).
- Compare the broader [email and waitlist category](/categories/email-waitlists).
- Prepare store visuals with [AppScreens](/tools/appscreens).

Last checked: 2026-06-29.`,
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
          title: "Crash reporting setup for indie mobile apps",
          slug: "crash-reporting-setup-indie-mobile-apps",
          subtitle:
            "A lightweight monitoring setup for crashes, errors, releases, and regressions.",
          excerpt:
            "Choose a crash reporting workflow that helps you fix production issues without adding unnecessary process.",
          body_markdown: `## Search intent
This guide is for indie app developers setting up production monitoring before or shortly after launch.

## Practical setup
- [Sentry](/tools/sentry) is a strong default for error monitoring, releases, stack traces, and alerts.
- [Firebase](/tools/firebase) is useful if the app already relies on Firebase and wants Crashlytics in the same ecosystem.
- [Emerge Tools](/tools/emerge-tools) is useful when binary size, startup time, and performance regressions become important.

## Best for
- Apps preparing a production launch or first serious release cycle.
- Teams that need to connect crashes with versions and release quality.
- Builders comparing [crash reporting tools](/categories/crash-reporting) with broader [developer productivity tools](/categories/dev-productivity).

## Not good for
- Pure prototypes that are not in TestFlight, Play testing, or production yet.
- Teams that cannot make time to triage alerts after installing tooling.

## Internal links
- Compare [Sentry](/tools/sentry), [Firebase](/tools/firebase), and [Emerge Tools](/tools/emerge-tools).
- Connect this to [Codemagic](/tools/codemagic) or [Bitrise](/tools/bitrise) once releases are automated.
- Use the [mobile app launch stack checklist](/guides/mobile-app-launch-stack-checklist) before public launch.

Last checked: 2026-06-29.`,
          author: "IndieAppStack",
          status: "published",
          content_type: "guide",
          primary_category_id: categories.get("crash-reporting").id,
          seo_title: "Crash reporting setup for indie mobile apps",
          seo_description:
            "Set up crash reporting for indie mobile apps with practical guidance for Sentry, Firebase Crashlytics, release tracking, and regressions.",
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
        article_id: articles.get("supabase-vs-firebase-indie-mobile-apps").id,
        tool_id: tools.get("firebase").id,
        relationship: "featured",
        sort_order: 20,
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
