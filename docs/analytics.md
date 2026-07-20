# Analytics Baseline

IndieAppStack uses **Google Analytics 4 (GA4)** via `gtag.js` as its analytics
provider. It is env-gated and off unless a Measurement ID is set.

> **Cookies / consent.** GA4 sets first-party cookies (`_ga`, `_ga_*`). The site
> currently runs GA4 **without a consent banner** — the simplest setup, but it
> carries GDPR/ePrivacy risk for EU visitors. Two follow-ups this implies:
>
> - The privacy policy must disclose GA4 and its cookies.
> - Any public "cookieless / no cookie banner" positioning (brand profile,
>   marketing copy) is no longer accurate and should be revised, or a Consent
>   Mode v2 + banner setup adopted.

## Environment

Set this public value in Vercel for the environments you want measured:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: the Measurement ID (`G-XXXXXXXXXX`) from the
  GA4 web data stream. Leave empty to keep GA4 off. Set it on Production only to
  keep preview traffic out of the property.

`NEXT_PUBLIC_*` values are **inlined at build time**, so changing this variable
requires a **redeploy** to take effect. It works locally without a rebuild only
because `next dev` reads env at runtime. Keep it empty locally unless
intentionally testing analytics traffic.

## Implementation

- `components/analytics/google-analytics.tsx` loads `gtag.js` and issues the
  `gtag('config', …)` call only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
- `lib/analytics/events.ts` is the centralized event catalog.
- `lib/analytics/client.ts` exposes `analytics.track(event, props)` and
  `analytics.pageview(url)`, which send to GA4 via `window.gtag`. GA4 also
  auto-tracks pageviews via the `config` call plus Enhanced Measurement, so no
  manual pageview wiring is needed.

Example:

```tsx
import { analytics } from "@/lib/analytics/client";

analytics.track("cta_clicked", {
  label: "Join the newsletter",
  location: "homepage_hero",
});
```

Do not send names, email addresses, raw search queries, auth IDs, or any other
personally identifiable information in analytics properties.

## Key events (conversions)

The `goal: true` flag in `lib/analytics/events.ts` is the source of truth for
which events should be marked as **Key events** (conversions) in the GA4 Admin
panel — GA4 → Admin → Events, or Admin → Key events. Marking them is what makes
them count as conversions in reports. The current set is:

- `affiliate_link_clicked` — partner click-out (monetizing)
- `outbound_link_clicked` — non-partner external click-out
- `tool_card_clicked` — clicked into a tool's detail page (engagement step)
- `cta_clicked` — primary call-to-action
- `newsletter_signup` — newsletter subscription
- `stack_finder_start` — started the stack-finder quiz
- `stack_finder_completion` — completed the stack finder

Tracked but intentionally **not** key events (engagement signals, not
conversions): `search_submitted`, `stack_recommendation_viewed`, and all
admin-only events. Flip the `goal` flag in `events.ts` if that changes.

## Click-out funnel

"Click-out" = a visitor leaving to an external destination, i.e.
`affiliate_link_clicked` (partner) or `outbound_link_clicked` (official site).
Build the funnel in GA4 → Explore → **Funnel exploration** (free, unlike
Plausible's paid funnels):

1. **`page_view`** on a tool detail page (add a step condition: `page_location`
   contains `/tools/`)
2. **`affiliate_link_clicked`**

Per-tool / per-guide click-out rate (the task's success metric) comes from the
`affiliate_link_clicked` / `outbound_link_clicked` key events broken down by
`page_location` (or the `tool_slug` / `location` event parameters, once
registered as custom dimensions in GA4).

## Validation

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (locally in `.env.local`, or in Vercel +
   redeploy).
2. Load a page and confirm `https://www.googletagmanager.com/gtag/js` loads
   (Network tab) with no console errors.
3. In GA4, open **Reports → Realtime** and confirm your session appears.
4. Trigger a tracked interaction (e.g. click an affiliate CTA) and confirm the
   event name (e.g. `affiliate_link_clicked`) shows under **Realtime → Event
   count by Event name** or **Admin → DebugView** (with the GA Debugger
   extension enabled).
