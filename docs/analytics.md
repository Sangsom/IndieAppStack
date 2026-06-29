# Analytics Baseline

IndieAppStack uses Plausible as the default privacy-friendly analytics provider. It is cookieless, keeps the site free of consent popups for basic measurement, and can be swapped behind the local analytics wrapper later if needed.

## Environment

Set these public values in Vercel for both Preview and Production:

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: `indieappstack.com` in production, and the preview domain if preview traffic should be measured separately.
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`: optional override for a proxied or self-hosted Plausible script. Leave blank to use `https://plausible.io/js/script.js`.

Keep `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` empty locally unless intentionally testing analytics traffic.

## Implementation

- `components/analytics/plausible-analytics.tsx` loads the Plausible script only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- `lib/analytics/events.ts` is the centralized event catalog.
- `lib/analytics/client.ts` exposes `analytics.track(event, props)` and `analytics.pageview(url)`.

Example:

```tsx
import { analytics } from "@/lib/analytics/client";

analytics.track("cta_clicked", {
  label: "Join the newsletter",
  location: "homepage_hero",
});
```

Do not send names, email addresses, raw search queries, auth IDs, or any other personally identifiable information in analytics properties.

## Initial Goals

Create matching Plausible custom event goals for:

- `affiliate_link_clicked`
- `outbound_link_clicked`
- `tool_card_clicked`
- `cta_clicked`
- `newsletter_signup`
- `search_submitted`
- `stack_finder_start`
- `stack_finder_completion`
- `stack_recommendation_viewed`

Page views are recorded automatically by the Plausible script.

## Validation

1. Deploy a preview with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` configured.
2. Visit the preview URL.
3. Open browser dev tools and confirm the Plausible script loads.
4. Confirm the visit appears in Plausible.
5. Trigger a custom event after the matching goal is created and verify it appears in the dashboard.
