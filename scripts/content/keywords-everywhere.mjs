import fs from "node:fs";
import path from "node:path";

export const keywordsEverywherePublishedAt = "2026-09-21T09:00:00.000Z";
export const keywordsEverywherePricingChecked = "2026-10-20";
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
      "Web search volume from $84 a year, with a free API key. Not App Store keywords, and not a phone app.",
    description:
      "Keywords Everywhere overlays Google web search volume, CPC, and competition in Chrome, Firefox, and Edge. It is not App Store search volume, and there is no Android or iPhone app. Paid metrics use a free API key and annual credits.",
    website_url: "https://keywordseverywhere.com/",
    pricing_summary:
      "Freemium. Free install. Volume, CPC, competition, and trends are annual credits: Bronze $84 / 100,000 credits / 1 seat; Silver $168 / 400,000 / 3 seats; Gold $480 / 2,000,000 / 10 seats; Platinum $1,440 / 8,000,000 / 20 seats. No monthly plan. The vendor prints $7 a month beside Bronze, which is $84 divided by 12. Credits expire after 12 months. Checked October 20, 2026.",
    pricing_model: "freemium",
    best_for: [
      "Launch-page and blog research on Google",
      "Checking web demand before you write or buy ads",
      "One person on the Bronze credit plan",
    ],
    not_good_for: [
      "App Store or Google Play search volume",
      "Android, iPhone, iPad, or Safari",
      "Rank tracking",
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
      "Pricing/features checked 2026-10-20 from https://keywordseverywhere.com/compare-plans.html (Bronze $84/100k/1 seat, Silver $168/400k/3, Gold $480/2M/10, Platinum $1,440/8M/20; annual only; $7/mo is $84/12; per-site caps 1k/2k/5k/10k), https://keywordseverywhere.com/frequently-asked-questions.html (free API key, no Safari/iOS/Android app), and https://keywordseverywhere.com/google-play-search-volume.html (Play overlay is Google Keyword Planner volume). Affiliate: FirstPromoter link https://keywordseverywhere.com/?fpr=od3ykm. Vendor FAQ now states 40% recurring; public copy still omits the rate until the FirstPromoter dashboard confirms the live link. Cookie window still unpublished on the vendor site.",
    pros: [
      "Shows Google volume, CPC, and competition on the searches you already run, so a launch page does not need a separate SEO suite.",
      "The API key is free. Paid credits attach to that key, and the same key covers your own browsers on one seat (checked October 20, 2026).",
      "Bronze is $84 a year for 100,000 credits and one seat. Silver is $168, Gold is $480, and Platinum is $1,440, all annual (checked October 20, 2026).",
      "It is a browser overlay, not an SDK, so nothing is added to the app binary.",
    ],
    cons: [
      "The numbers are Google web search volume. The vendor says a Google Play overlay is Keyword Planner data, not Play Store demand. It does not replace an App Store ASO tool.",
      "Plans are annual only. The vendor prints $7 a month beside Bronze, which is $84 divided by 12, not a monthly bill. Credits expire 12 months after purchase.",
      "There is no Android app, no iPhone or iPad app, and no Safari version. You need Chrome, Firefox, or Edge on a desktop or laptop.",
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
      "Program type: affiliate via FirstPromoter. Self-serve referral parameter fpr=od3ykm. The vendor FAQ stated 40% recurring commissions on 2026-10-20 (https://keywordseverywhere.com/frequently-asked-questions.html). Public pages still do not state a rate until the FirstPromoter dashboard confirms the live link pays that rate.",
    cookie_notes:
      "No official public cookie window found on keywordseverywhere.com on 2026-10-20. Third-party directories listed 60 days on 2026-09-21; confirm in the FirstPromoter dashboard before publishing a cookie claim.",
    allowed_promotion_notes:
      "Approved affiliate link is live. Best fit for landing-page, launch, and content-research articles. Always disclose as an affiliate link. Do not present Keywords Everywhere as an ASO or App Store keyword tool. Do not rank it by commission.",
    internal_notes:
      "Rechecked 2026-10-20. Owner supplied FirstPromoter link https://keywordseverywhere.com?fpr=od3ykm. Destination normalized to https://keywordseverywhere.com/?fpr=od3ykm. Vendor FAQ states 40% recurring; public copy still must not state commission or cookie window until the dashboard confirms the live link. Owned UI captures from 2026-09-21: popup (email redacted, credits 0) and Google SERP overlay for an app-related query. Do not quote overlay Moz/traffic figures as site facts.",
  };
}

export function getKeywordsEverywhereArticleSeed(landingPagesCategoryId) {
  const { guide } = readKeywordsEverywhereMarkdown();

  return {
    title:
      "Keywords Everywhere for indie app developers: Google search data, not App Store ASO",
    slug: keywordsEverywhereGuideSlug,
    subtitle:
      "How to use the browser extension on a launch page or blog post, and when a solo mobile developer should leave it out of the stack.",
    excerpt:
      "Install Keywords Everywhere on a laptop browser, read Google volume while you draft a launch page, and keep App Store listing work in an ASO tool. Pricing, the API key, and the phone answer are on the tool page.",
    body_markdown: guide,
    author: "IndieAppStack",
    status: "published",
    content_type: "guide",
    primary_category_id: landingPagesCategoryId,
    seo_title: "Keywords Everywhere for Indie Apps, Not ASO",
    seo_description:
      "How a solo developer uses Keywords Everywhere on a launch page: Google volume in the browser, and when to leave listing keywords to an ASO tool.",
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
    search_intent: "how-to",
    target_category_id: landingPagesCategoryId,
    related_tool_ids: toolIds,
    priority: 120,
    status: "published",
    notes:
      "Intent split 2026-10-20. This guide is the launch-page how-to. The tool page owns the review, credit pricing, API key, and mobile or Android answer. FirstPromoter link fpr=od3ykm.",
  };
}
