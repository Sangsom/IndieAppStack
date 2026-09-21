import fs from "node:fs";
import path from "node:path";

export const keywordsEverywherePublishedAt = "2026-09-21T09:00:00.000Z";
export const keywordsEverywherePricingChecked = "2026-09-21";
export const keywordsEverywhereAffiliateUrl =
  "https://keywordseverywhere.com/?fpr=od3ykm";

export const keywordsEverywhereSlug = "keywords-everywhere";
export const keywordsEverywhereGuideSlug =
  "keywords-everywhere-indie-mobile-developers";

export function readKeywordsEverywhereMarkdown(repoRoot = process.cwd()) {
  const contentDir = path.join(repoRoot, "scripts/content");

  return {
    guide: fs.readFileSync(
      path.join(contentDir, "keywords-everywhere-guide.md"),
      "utf8",
    ),
    tool: fs.readFileSync(
      path.join(contentDir, "keywords-everywhere-tool.md"),
      "utf8",
    ),
  };
}

export function getKeywordsEverywhereToolSeed() {
  const { tool } = readKeywordsEverywhereMarkdown();

  return {
    name: "Keywords Everywhere",
    slug: keywordsEverywhereSlug,
    tagline:
      "Browser extension for Google search volume, CPC, and competition while you browse.",
    description:
      "Keywords Everywhere is a Chrome, Firefox, and Edge extension that overlays search volume, CPC, competition, and related keyword ideas on Google and 15+ other sites. For a solo mobile developer it is a landing-page and content-research tool, not an App Store ASO tool.",
    website_url: "https://keywordseverywhere.com/",
    pricing_summary:
      "Freemium. Free install with keyword ideas, traffic and Moz metrics, SEO reports, social insights, and prompt templates. Paid annual credit plans for search volume, CPC, competition, and trends: Bronze $84 / 100,000 credits / 1 seat; Silver $168 / 400,000 / 3 seats; Gold $480 / 2,000,000 / 10 seats; Platinum $1,440 / 8,000,000 / 20 seats. No monthly plans. Credits expire after 12 months. Checked 2026-09-21.",
    pricing_model: "freemium",
    best_for: [
      "Landing page keyword research",
      "Checking Google demand before writing content",
      "Inline volume, CPC, and competition while browsing",
    ],
    not_good_for: [
      "App Store listing research and ASO",
      "Rank tracking",
      "Anyone expecting an iPhone, iPad, or Safari app",
    ],
    platforms: ["Chrome", "Firefox", "Edge", "Web"],
    app_stages: ["Prototype", "MVP", "Growth"],
    alternatives: ["AppTweak", "Appfigures", "Mangools"],
    categorySlugs: ["landing-pages", "launch"],
    pricing_last_checked: keywordsEverywherePricingChecked,
    published_at: keywordsEverywherePublishedAt,
    status: "published",
    noindex: false,
    internal_notes:
      "Pricing/features checked 2026-09-21 from https://keywordseverywhere.com/compare-plans.html, https://keywordseverywhere.com/frequently-asked-questions.html, https://keywordseverywhere.com, and the Chrome Web Store listing. Affiliate: FirstPromoter link https://keywordseverywhere.com/?fpr=od3ykm. Third-party directories list 40% recurring / 60-day cookie; confirm in the FirstPromoter dashboard before publishing commission claims.",
    pros: [
      "Shows volume, CPC, and competition on the Google searches you already run, so landing-page research does not need a separate SEO suite.",
      "The extension is free to install, and keyword ideas, traffic metrics, and prompt templates work without credits (checked September 21, 2026).",
      "Bronze is $84 per year for 100,000 credits and one seat, which matches a solo builder who researches in bursts rather than all day.",
      "It is a browser overlay, not an SDK, so nothing is added to the app binary.",
    ],
    cons: [
      "It is not an ASO tool. App Store and Google Play keyword research still need a dedicated store-intelligence product.",
      "Search volume, CPC, and competition sit on annual credit plans. There is no monthly option, and unused credits expire after 12 months.",
      "There is no Safari version and no iOS or Android app, so it will not run on an iPhone or iPad.",
      "A Google search that shows 8 Related, 20 People Also Search For, and 25 Long-tail keywords uses 54 credits, so casual browsing burns the meter faster than a one-keyword lookup.",
    ],
    body_markdown: tool,
  };
}

export function getKeywordsEverywhereToolContent() {
  const tool = getKeywordsEverywhereToolSeed();

  return {
    pricing_summary: tool.pricing_summary,
    pricing_last_checked: tool.pricing_last_checked,
    noindex: false,
    pros: tool.pros,
    cons: tool.cons,
    body_markdown: tool.body_markdown,
  };
}

export function getKeywordsEverywhereProgramSeed() {
  return {
    name: "Keywords Everywhere Affiliate Program",
    network: "FirstPromoter",
    status: "approved",
    application_url: "https://keywordseverywhere.com/",
    commission_notes:
      "Program type: affiliate via FirstPromoter. Self-serve referral parameter fpr=od3ykm. Exact commission rate and payout terms are not published on the public marketing site; confirm in the FirstPromoter dashboard before stating a percentage. Third-party directories listed 40% recurring on 2026-09-21; treat that figure as unverified until the dashboard confirms it.",
    cookie_notes:
      "No official public cookie window found on keywordseverywhere.com on 2026-09-21. Third-party directories listed 60 days; confirm in the FirstPromoter dashboard before publishing a cookie claim.",
    allowed_promotion_notes:
      "Approved affiliate link is live. Best fit for landing-page, launch, and content-research articles. Always disclose as an affiliate link. Do not present Keywords Everywhere as an ASO or App Store keyword tool. Do not rank it by commission.",
    internal_notes:
      "Checked 2026-09-21. Owner supplied FirstPromoter link https://keywordseverywhere.com?fpr=od3ykm. Destination normalized to https://keywordseverywhere.com/?fpr=od3ykm. Public copy must not state commission or cookie window until the dashboard values are recorded. Owned UI captures added 2026-09-21: popup (email redacted, credits 0) and Google SERP overlay for an app-related query. Do not quote overlay Moz/traffic figures as site facts.",
  };
}

export function getKeywordsEverywhereArticleSeed(landingPagesCategoryId) {
  const { guide } = readKeywordsEverywhereMarkdown();

  return {
    title:
      "Keywords Everywhere for indie app developers: Google search data, not App Store ASO",
    slug: keywordsEverywhereGuideSlug,
    subtitle:
      "A source-checked look at where a Google-keyword browser extension fits a solo mobile app launch, and where it does not.",
    excerpt:
      "Keywords Everywhere overlays Google search volume, CPC, and competition in Chrome, Firefox, and Edge. Here is an honest read on when it helps an indie app landing page, when App Store ASO tools are the better fit, and what it costs.",
    body_markdown: guide,
    author: "IndieAppStack",
    status: "published",
    content_type: "guide",
    primary_category_id: landingPagesCategoryId,
    seo_title: "Keywords Everywhere for Indie Apps, Not ASO",
    seo_description:
      "A source-checked guide to Keywords Everywhere for solo app builders: Google keyword data vs App Store ASO, current pricing, and when to skip it.",
    human_reviewed: true,
    ai_assisted: true,
    published_at: keywordsEverywherePublishedAt,
  };
}

export function getKeywordsEverywhereTopicSeed({
  landingPagesCategoryId,
  toolIds,
}) {
  return {
    title:
      "Keywords Everywhere for indie app developers: Google search data, not App Store ASO",
    slug: keywordsEverywhereGuideSlug,
    target_keyword: "keywords everywhere",
    search_intent: "commercial investigation",
    target_category_id: landingPagesCategoryId,
    related_tool_ids: toolIds,
    priority: 120,
    status: "published",
    notes:
      "Affiliate keyword setup 2026-09-21. FirstPromoter link fpr=od3ykm. Brand-navigational query plus fit guidance that separates Google keyword data from App Store ASO.",
  };
}
