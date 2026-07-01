# Editorial Evidence Log

Created: 2026-07-01.

Notion database: https://app.notion.com/p/ad8f8fb867684da09270fad5c81681c2

The evidence log is the source-check layer for IndieAppStack articles. Its job is to prevent invented pricing, feature, testing, or affiliate claims. Every material tool claim in a draft needs either a source row or an explicit evidence-gap row before the article can publish.

## Database Schema

Use these fields in Notion and in article review notes:

| Field | Purpose |
| --- | --- |
| Claim | The exact claim or source requirement being checked. |
| Tool | Tool, vendor, or grouped target. |
| Article slug | Draft or article where the claim will appear. |
| Claim type | One of: pricing, feature, platform, integration, partner, affiliate, hands_on, visual_asset, internal_link. |
| Source URL | Official page, docs page, pricing page, partner page, internal note, or blank when it is an evidence gap. |
| Source name | Human-readable source label. |
| Date checked | Date the source was checked or the gap was recorded. |
| Review status | One of: verified, needs_review, evidence_gap, stale, do_not_publish. |
| Reviewer | Person or agent responsible for the check. |
| Evidence gap | Checked when the claim must not be used yet. |
| Notes | Constraints, allowed wording, follow-up, or publishing blocker. |

## Status Rules

- `verified`: Source exists and can support neutral article wording. Pricing must still be re-checked near publication.
- `needs_review`: Source exists, but a human must read terms/details before we make a claim.
- `evidence_gap`: Do not publish the claim unless the article explicitly frames it as unknown or pending.
- `stale`: Source was checked before, but the claim is old enough to require another check.
- `do_not_publish`: The claim is risky, unsupported, or contradicted.

## Publishing Workflow

1. Add or update source rows before drafting a new article.
2. Map each article section to the relevant source rows during outlining.
3. Add source-check notes to the draft with dates for pricing, features, integrations, and partner claims.
4. Remove hands-on language unless testing notes exist.
5. Keep affiliate claims out of article copy until program acceptance and link governance are complete.
6. Before publishing, filter the Notion log for the article slug and resolve any `evidence_gap`, `needs_review`, `stale`, or `do_not_publish` rows.
7. After publishing, re-check pricing and affiliate terms during major refreshes or when analytics show a page is getting meaningful traffic.

## Claim Guardrails

- Do not publish exact pricing, limits, quotas, commissions, cookie windows, or payout terms without an official source and date checked.
- Do not say "we tested", "in our benchmark", "in our setup", "hands-on", or similar unless a linked testing note exists.
- Do not rank tools by commission. Recommendations must be based on reader fit.
- Use direct non-affiliate links while a program is pending.
- Once affiliate links are approved, use `/go/[slug]`, visible disclosure, and `sponsored nofollow` where appropriate.
- Screenshots must be owned, captured during real review, or clearly allowed by the source.

## Initial Source Rows

These rows were seeded into Notion on 2026-07-01.

| Tool | Claim type | Article slug | Status | Source |
| --- | --- | --- | --- | --- |
| RevenueCat | pricing | revenuecat-vs-adapty-vs-superwall | verified | https://www.revenuecat.com/pricing/ |
| RevenueCat | feature | revenuecat-vs-adapty-vs-superwall | verified | https://www.revenuecat.com/docs/ |
| RevenueCat | partner | affiliate-link-governance | needs_review | https://www.revenuecat.com/partners/ |
| Adapty | pricing | revenuecat-vs-adapty-vs-superwall | verified | https://adapty.io/pricing/ |
| Adapty | feature | revenuecat-vs-adapty-vs-superwall | verified | https://adapty.io/docs/ |
| Superwall | pricing | revenuecat-vs-adapty-vs-superwall | verified | https://superwall.com/pricing |
| Superwall | feature | revenuecat-vs-adapty-vs-superwall | verified | https://docs.superwall.com/ |
| Supabase | pricing | supabase-vs-firebase-vs-appwrite | verified | https://supabase.com/pricing |
| Supabase | platform | supabase-vs-firebase-vs-appwrite | verified | https://supabase.com/docs |
| Firebase | pricing | supabase-vs-firebase-vs-appwrite | verified | https://firebase.google.com/pricing |
| Firebase | platform | supabase-vs-firebase-vs-appwrite | verified | https://firebase.google.com/docs |
| Appwrite | pricing | supabase-vs-firebase-vs-appwrite | verified | https://appwrite.io/pricing |
| Appwrite | platform | supabase-vs-firebase-vs-appwrite | verified | https://appwrite.io/docs |
| Appwrite | partner | affiliate-link-governance | needs_review | https://appwrite.io/partners |
| Sentry | pricing | crash-reporting-for-indie-apps | verified | https://sentry.io/pricing/ |
| Sentry | feature | crash-reporting-for-indie-apps | verified | https://docs.sentry.io/ |
| TelemetryDeck | pricing | app-analytics-for-indie-apps | needs_review | https://dashboard.telemetrydeck.com/plans |
| TelemetryDeck | feature | app-analytics-for-indie-apps | verified | https://telemetrydeck.com/docs/ |
| Qonversion | pricing | best-monetization-tools-solo-mobile-developers | verified | https://qonversion.io/pricing |
| PostHog | pricing | best-monetization-tools-solo-mobile-developers | verified | https://posthog.com/pricing |
| PostHog | feature | best-monetization-tools-solo-mobile-developers | verified | https://posthog.com/docs |
| Apple App Store Connect | platform | subscription-mvp-stack-solo-ios-app | verified | https://developer.apple.com/help/app-store-connect/manage-subscriptions/ |
| RevenueCat | pricing | subscription-mvp-stack-solo-ios-app | verified | https://www.revenuecat.com/pricing/ |
| RevenueCat | feature | subscription-mvp-stack-solo-ios-app | verified | https://www.revenuecat.com/docs/ |
| Supabase | pricing | subscription-mvp-stack-solo-ios-app | verified | https://supabase.com/pricing |
| Supabase | platform | subscription-mvp-stack-solo-ios-app | verified | https://supabase.com/docs |
| Firebase | pricing | subscription-mvp-stack-solo-ios-app | verified | https://firebase.google.com/pricing |
| Firebase | platform | subscription-mvp-stack-solo-ios-app | verified | https://firebase.google.com/docs |
| Appwrite | pricing | subscription-mvp-stack-solo-ios-app | verified | https://appwrite.io/pricing |
| Appwrite | platform | subscription-mvp-stack-solo-ios-app | verified | https://appwrite.io/docs |
| TelemetryDeck | pricing | subscription-mvp-stack-solo-ios-app | needs_review | https://dashboard.telemetrydeck.com/plans |
| TelemetryDeck | feature | subscription-mvp-stack-solo-ios-app | verified | https://telemetrydeck.com/docs/ |
| Sentry | pricing | subscription-mvp-stack-solo-ios-app | verified | https://sentry.io/pricing/ |
| Sentry | feature | subscription-mvp-stack-solo-ios-app | verified | https://docs.sentry.io/platforms/apple/ |
| Subscription MVP stack map | visual_asset | subscription-mvp-stack-solo-ios-app | verified | /content-visuals/articles/subscription-mvp-stack-map.svg |
| AppTweak | pricing | aso-workflow-for-indie-apps | verified | https://www.apptweak.com/pricing |
| AppTweak | feature | aso-workflow-for-indie-apps | verified | https://www.apptweak.com/ |
| Appfigures | pricing | aso-workflow-for-indie-apps | verified | https://appfigures.com/pricing |
| Appfigures | feature | aso-workflow-for-indie-apps | verified | https://appfigures.com/ |
| Framer | pricing | framer-vs-webflow-for-saas-marketing | verified | https://www.framer.com/pricing/ |
| Framer | partner | affiliate-link-governance | needs_review | https://www.framer.com/creators |
| All first-sprint tools | hands_on | all-first-sprint-articles | evidence_gap | Internal hands-on notes missing. |
| All affiliate targets | affiliate | all-affiliate-mentions | evidence_gap | Affiliate dashboard or acceptance email missing. |

## Article Review Note Template

Add this block to each draft before it moves from draft to review:

```md
## Source Check

- Evidence log filtered by article slug:
- Pricing checked:
- Feature claims checked:
- Partner or affiliate claims checked:
- Hands-on notes linked:
- Evidence gaps:
- Reviewer:
- Review date:
```
