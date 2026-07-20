# Analytics Baseline

IndieAppStack uses Plausible as the default privacy-friendly analytics provider. It is cookieless, keeps the site free of consent popups for basic measurement, and can be swapped behind the local analytics wrapper later if needed.

Google Analytics 4 (GA4) runs **alongside** Plausible for richer, funnel-style reporting. It is env-gated and off by default. Both providers receive the same events through the shared client wrapper, so instrumentation is written once.

## Environment

Set these public values in Vercel for both Preview and Production:

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: `indieappstack.com` in production, and the preview domain if preview traffic should be measured separately.
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`: optional override for a proxied or self-hosted Plausible script. Leave blank to use `https://plausible.io/js/script.js`.

Keep `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` empty locally unless intentionally testing analytics traffic.

For GA4, set one public value in Vercel for the environments you want measured:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: the Measurement ID (`G-XXXXXXXXXX`) from the GA4 web data stream. Leave empty to keep GA4 off. Setting it on Production only keeps preview traffic out of the property.

> **Cookies / consent.** GA4 sets first-party cookies (`_ga`, `_ga_*`), unlike Plausible. This project currently runs GA4 without a consent banner. That is the simplest setup but carries GDPR/ePrivacy risk for EU visitors — revisit with Consent Mode v2 + a banner if that becomes a concern, and make sure the privacy policy discloses GA4 and its cookies.

## Implementation

- `components/analytics/plausible-analytics.tsx` loads the Plausible script only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- `components/analytics/google-analytics.tsx` loads gtag.js only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, and issues the `gtag('config', …)` call.
- `lib/analytics/events.ts` is the centralized event catalog.
- `lib/analytics/client.ts` exposes `analytics.track(event, props)` and `analytics.pageview(url)`, and fans each call out to **both** Plausible and GA4 (`window.gtag`). GA4 also auto-tracks pageviews via the `config` call plus Enhanced Measurement, so no manual pageview wiring is needed.

Example:

```tsx
import { analytics } from "@/lib/analytics/client";

analytics.track("cta_clicked", {
  label: "Join the newsletter",
  location: "homepage_hero",
});
```

Do not send names, email addresses, raw search queries, auth IDs, or any other personally identifiable information in analytics properties.

## Goals

The `goal: true` flag in `lib/analytics/events.ts` is the source of truth for
which events should have a matching Plausible **custom-event goal** (goal name
must equal the event name exactly). An event only shows up as a conversion in
Plausible once its goal exists. The current goal set is:

- `affiliate_link_clicked` — partner click-out (monetizing)
- `outbound_link_clicked` — non-partner external click-out
- `tool_card_clicked` — clicked into a tool's detail page (engagement step)
- `cta_clicked` — primary call-to-action
- `newsletter_signup` — newsletter subscription
- `stack_finder_start` — started the stack-finder quiz
- `stack_finder_completion` — completed the stack finder

Tracked but intentionally **not** goals (engagement signals, not conversions):
`search_submitted`, `stack_recommendation_viewed`, and all admin-only events.
Flip the `goal` flag in `events.ts` if that changes.

Page views are recorded automatically by the Plausible script. Stack Finder
result email capture reuses `newsletter_signup` with `source=stack-finder`.

## Click-out funnel

"Click-out" = a visitor leaving to an external destination, i.e.
`affiliate_link_clicked` (partner) or `outbound_link_clicked` (official site).
Plausible funnel steps are single goals, so the primary funnel tracks the
monetizing path:

1. **Pageview** — a tool detail page (`/tools/**`)
2. **`affiliate_link_clicked`**

Per-tool / per-guide click-out rate (the task's success metric) comes from the
`affiliate_link_clicked` and `outbound_link_clicked` goals viewed with a page
breakdown, rather than from the funnel itself. Funnels require a paid Plausible
plan.

## Validation

Plausible:

1. Deploy a preview with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` configured.
2. Visit the preview URL.
3. Open browser dev tools and confirm the Plausible script loads.
4. Confirm the visit appears in Plausible.
5. Trigger a custom event after the matching goal is created and verify it appears in the dashboard.

GA4:

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (locally in `.env.local`, or in Vercel for a deploy) and restart/redeploy.
2. Load a page and confirm `https://www.googletagmanager.com/gtag/js` loads (Network tab) with no console errors.
3. In GA4, open **Reports → Realtime** and confirm your session appears.
4. Trigger a tracked interaction (e.g. click an affiliate CTA) and confirm the event name (e.g. `affiliate_link_clicked`) shows under **Realtime → Event count by Event name** or **Admin → DebugView** (with the GA Debugger extension on).
