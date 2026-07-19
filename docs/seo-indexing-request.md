# Request indexing on flagship guides & comparisons

Companion checklist for the "Request indexing … and tighten internal links" task.
The internal-linking half shipped in code (see below). This half is a **manual
Google Search Console action** — Google's Indexing API only accepts `JobPosting`
and `BroadcastEvent` pages, so general content URLs must be submitted by hand.

## How to submit (per URL, ~30s each)

1. Open [Google Search Console](https://search.google.com/search-console) for the
   `indieappstack.com` property.
2. Paste the URL into the **URL Inspection** bar at the top.
3. Wait for the fetch, then click **Request indexing**.
4. GSC caps manual requests at ~10–12/day — do Tier 1 first, Tier 2 the next day.

Before submitting, re-submit the sitemap (`https://indieappstack.com/sitemap.xml`)
under **Sitemaps** so the crawler has the current lastmod set.

## Tier 1 — flagship "money" pages (submit first)

These are the monetization / paywall / backend / ASO pages that map to the lost
money keywords in the dm-hub audit.

- https://indieappstack.com/guides/subscription-mvp-stack-solo-ios-app
- https://indieappstack.com/guides/best-monetization-tools-solo-mobile-developers
- https://indieappstack.com/guides/best-paywall-tools-ios-apps
- https://indieappstack.com/comparisons/revenuecat-vs-adapty-ios-subscriptions
- https://indieappstack.com/comparisons/supabase-vs-firebase-indie-mobile-apps
- https://indieappstack.com/guides/best-aso-tools-for-indie-developers
- https://indieappstack.com/comparisons/appfigures-vs-apptweak-aso-tools

## Tier 2 — remaining guides & comparisons

- https://indieappstack.com/guides/aso-starter-checklist-indie-mobile-apps
- https://indieappstack.com/guides/crash-reporting-setup-indie-mobile-apps
- https://indieappstack.com/comparisons/sentry-vs-firebase-crashlytics-mobile-apps
- https://indieappstack.com/guides/privacy-friendly-analytics-starter-stack
- https://indieappstack.com/guides/mobile-app-launch-stack-checklist
- https://indieappstack.com/guides/best-landing-page-builders-mobile-apps
- https://indieappstack.com/guides/warp-terminal-for-indie-mobile-developers

## Internal linking shipped alongside this (code)

Landed so that once any one flagship page is crawled, Google discovers the rest:

- **Article detail pages** (`/guides/*`, `/comparisons/*`) now render a
  "Related guides and comparisons" mesh (ranked by shared tools → same category →
  recency). Previously these pages only linked out to tools — never to each other.
- **Category pages** now link attached comparisons to their real
  `/comparisons/<slug>` URL. This fixed four broken `/guides/<comparison-slug>`
  links that returned 404 (e.g. the Backend category's only article,
  `supabase-vs-firebase`), wasting crawl budget and giving those comparisons no
  valid link from their category hub.

## Success metric to watch (GSC → Performance / Pages)

- Tier 1 URLs move to **Indexed** in the Pages report.
- Impressions / positions start appearing for the six lost-money keywords.
