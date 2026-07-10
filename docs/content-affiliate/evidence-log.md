# Editorial Evidence Log

Created: 2026-07-01.

Notion database: https://app.notion.com/p/ad8f8fb867684da09270fad5c81681c2

The evidence log is the source-check layer for IndieAppStack articles. Its job is to prevent invented pricing, feature, testing, or affiliate claims. Every material tool claim in a draft needs either a source row or an explicit evidence-gap row before the article can publish.

## Database Schema

Use these fields in Notion and in article review notes:

| Field         | Purpose                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| Claim         | The exact claim or source requirement being checked.                                                        |
| Tool          | Tool, vendor, or grouped target.                                                                            |
| Article slug  | Draft or article where the claim will appear.                                                               |
| Claim type    | One of: pricing, feature, platform, integration, partner, affiliate, hands_on, visual_asset, internal_link. |
| Source URL    | Official page, docs page, pricing page, partner page, internal note, or blank when it is an evidence gap.   |
| Source name   | Human-readable source label.                                                                                |
| Date checked  | Date the source was checked or the gap was recorded.                                                        |
| Review status | One of: verified, needs_review, evidence_gap, stale, do_not_publish.                                        |
| Reviewer      | Person or agent responsible for the check.                                                                  |
| Evidence gap  | Checked when the claim must not be used yet.                                                                |
| Notes         | Constraints, allowed wording, follow-up, or publishing blocker.                                             |

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

| Tool                                         | Claim type   | Article slug                                   | Status       | Source                                                                    |
| -------------------------------------------- | ------------ | ---------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| RevenueCat                                   | pricing      | revenuecat-vs-adapty-vs-superwall              | verified     | https://www.revenuecat.com/pricing/                                       |
| RevenueCat                                   | feature      | revenuecat-vs-adapty-vs-superwall              | verified     | https://www.revenuecat.com/docs/                                          |
| RevenueCat                                   | partner      | revenuecat-vs-adapty-vs-superwall              | needs_review | https://www.revenuecat.com/partners/                                      |
| Adapty                                       | pricing      | revenuecat-vs-adapty-vs-superwall              | verified     | https://adapty.io/pricing/                                                |
| Adapty                                       | feature      | revenuecat-vs-adapty-vs-superwall              | verified     | https://adapty.io/docs/                                                   |
| Adapty                                       | affiliate    | revenuecat-vs-adapty-vs-superwall              | evidence_gap | https://adapty.io/affiliate-program/                                      |
| Adapty                                       | partner      | revenuecat-vs-adapty-vs-superwall              | evidence_gap | https://adapty.io/partners/                                               |
| Superwall                                    | pricing      | revenuecat-vs-adapty-vs-superwall              | verified     | https://superwall.com/pricing                                             |
| Superwall                                    | feature      | revenuecat-vs-adapty-vs-superwall              | verified     | https://docs.superwall.com/                                               |
| Superwall                                    | affiliate    | revenuecat-vs-adapty-vs-superwall              | evidence_gap | https://superwall.com/affiliate-program                                   |
| Superwall                                    | partner      | revenuecat-vs-adapty-vs-superwall              | evidence_gap | https://superwall.com/partners                                            |
| RevenueCat vs Adapty vs Superwall comparison | visual_asset | revenuecat-vs-adapty-vs-superwall              | verified     | /content-visuals/articles/revenuecat-adapty-superwall-comparison.svg      |
| Supabase                                     | pricing      | supabase-vs-firebase-indie-mobile-apps         | verified     | https://supabase.com/pricing                                              |
| Supabase                                     | platform     | supabase-vs-firebase-indie-mobile-apps         | verified     | https://supabase.com/docs                                                 |
| Firebase                                     | pricing      | supabase-vs-firebase-indie-mobile-apps         | verified     | https://firebase.google.com/pricing                                       |
| Firebase                                     | platform     | supabase-vs-firebase-indie-mobile-apps         | verified     | https://firebase.google.com/docs                                          |
| Appwrite                                     | pricing      | supabase-vs-firebase-indie-mobile-apps         | verified     | https://appwrite.io/pricing                                               |
| Appwrite                                     | platform     | supabase-vs-firebase-indie-mobile-apps         | verified     | https://appwrite.io/docs                                                  |
| Appwrite                                     | partner      | affiliate-link-governance                      | needs_review | https://appwrite.io/partners                                              |
| Sentry                                       | pricing      | crash-reporting-setup-indie-mobile-apps        | verified     | https://sentry.io/pricing/                                                |
| Sentry                                       | feature      | crash-reporting-setup-indie-mobile-apps        | verified     | https://docs.sentry.io/platforms/apple/guides/ios/                        |
| Sentry                                       | release      | crash-reporting-setup-indie-mobile-apps        | verified     | https://docs.sentry.io/platforms/apple/guides/ios/configuration/releases/ |
| Firebase Crashlytics                         | feature      | crash-reporting-setup-indie-mobile-apps        | verified     | https://firebase.google.com/docs/crashlytics                              |
| Firebase Crashlytics                         | product      | crash-reporting-setup-indie-mobile-apps        | verified     | https://firebase.google.com/products/crashlytics                          |
| Firebase                                     | pricing      | crash-reporting-setup-indie-mobile-apps        | verified     | https://firebase.google.com/pricing                                       |
| Crash reporting launch flow                  | visual_asset | crash-reporting-setup-indie-mobile-apps        | verified     | /content-visuals/articles/crash-reporting-launch-flow.svg                 |
| TelemetryDeck                                | pricing      | app-analytics-for-indie-apps                   | needs_review | https://dashboard.telemetrydeck.com/plans                                 |
| TelemetryDeck                                | feature      | app-analytics-for-indie-apps                   | verified     | https://telemetrydeck.com/docs/                                           |
| Qonversion                                   | pricing      | best-monetization-tools-solo-mobile-developers | verified     | https://qonversion.io/pricing                                             |
| PostHog                                      | pricing      | best-monetization-tools-solo-mobile-developers | verified     | https://posthog.com/pricing                                               |
| PostHog                                      | feature      | best-monetization-tools-solo-mobile-developers | verified     | https://posthog.com/docs                                                  |
| Apple App Store Connect                      | platform     | subscription-mvp-stack-solo-ios-app            | verified     | https://developer.apple.com/help/app-store-connect/manage-subscriptions/  |
| RevenueCat                                   | pricing      | subscription-mvp-stack-solo-ios-app            | verified     | https://www.revenuecat.com/pricing/                                       |
| RevenueCat                                   | feature      | subscription-mvp-stack-solo-ios-app            | verified     | https://www.revenuecat.com/docs/                                          |
| Supabase                                     | pricing      | subscription-mvp-stack-solo-ios-app            | verified     | https://supabase.com/pricing                                              |
| Supabase                                     | platform     | subscription-mvp-stack-solo-ios-app            | verified     | https://supabase.com/docs                                                 |
| Firebase                                     | pricing      | subscription-mvp-stack-solo-ios-app            | verified     | https://firebase.google.com/pricing                                       |
| Firebase                                     | platform     | subscription-mvp-stack-solo-ios-app            | verified     | https://firebase.google.com/docs                                          |
| Appwrite                                     | pricing      | subscription-mvp-stack-solo-ios-app            | verified     | https://appwrite.io/pricing                                               |
| Appwrite                                     | platform     | subscription-mvp-stack-solo-ios-app            | verified     | https://appwrite.io/docs                                                  |
| TelemetryDeck                                | pricing      | subscription-mvp-stack-solo-ios-app            | needs_review | https://dashboard.telemetrydeck.com/plans                                 |
| TelemetryDeck                                | feature      | subscription-mvp-stack-solo-ios-app            | verified     | https://telemetrydeck.com/docs/                                           |
| Sentry                                       | pricing      | subscription-mvp-stack-solo-ios-app            | verified     | https://sentry.io/pricing/                                                |
| Sentry                                       | feature      | subscription-mvp-stack-solo-ios-app            | verified     | https://docs.sentry.io/platforms/apple/                                   |
| Subscription MVP stack map                   | visual_asset | subscription-mvp-stack-solo-ios-app            | verified     | /content-visuals/articles/subscription-mvp-stack-map.svg                  |
| AppTweak                                     | pricing      | aso-workflow-for-indie-apps                    | verified     | https://www.apptweak.com/pricing                                          |
| AppTweak                                     | feature      | aso-workflow-for-indie-apps                    | verified     | https://www.apptweak.com/                                                 |
| Appfigures                                   | pricing      | aso-workflow-for-indie-apps                    | verified     | https://appfigures.com/pricing                                            |
| Appfigures                                   | feature      | aso-workflow-for-indie-apps                    | verified     | https://appfigures.com/                                                   |
| Framer                                       | pricing      | framer-vs-webflow-for-saas-marketing           | verified     | https://www.framer.com/pricing/                                           |
| Framer                                       | affiliate    | affiliate-batch-1                              | verified     | https://www.framer.com/creators                                           |
| RevenueCat                                   | partner      | affiliate-batch-1                              | verified     | https://www.revenuecat.com/partners/                                      |
| Appwrite                                     | partner      | affiliate-batch-1                              | verified     | https://appwrite.io/partners                                              |
| Webflow                                      | affiliate    | affiliate-batch-1                              | verified     | https://webflow.com/solutions/affiliates                                  |
| All first-sprint tools                       | hands_on     | all-first-sprint-articles                      | evidence_gap | Internal hands-on notes missing.                                          |
| All affiliate targets                        | affiliate    | all-affiliate-mentions                         | evidence_gap | Affiliate dashboard or acceptance email missing.                          |

Partner status note for `revenuecat-vs-adapty-vs-superwall`: RevenueCat has a public partner page but no approved IndieAppStack relationship yet. Adapty and Superwall obvious partner/affiliate URLs returned 404 on 2026-07-01, so use direct links and treat outreach as pending.

Task 08 review notes for `supabase-vs-firebase-indie-mobile-apps`:

- Official pricing and product scope pages were checked on 2026-07-01 for Supabase, Firebase, and Appwrite.
- Exact pricing thresholds are intentionally summarized at a high level because plan packaging and usage limits change.
- No hands-on integration or benchmark claims are made.
- Appwrite partner status remains an outreach item, not a confirmed affiliate relationship. No Appwrite affiliate CTA should appear until terms are approved and recorded.
- Public article keeps these review notes out of the body; unresolved claims stay in this evidence log.

## Trust Reset Sprint Re-Checks (2026-07-09)

The eight sample-thin articles were upgraded to substantial pieces during the Days 1-30 trust reset sprint. Pricing and product claims for the primary tools were re-checked against official pages on 2026-07-09. All claims are kept high-level (no exact prices), and no hands-on testing is claimed.

| Tool                 | Claim type | Article slug(s)                                                              | Status   | Source                                                              |
| -------------------- | ---------- | ---------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| Framer               | pricing    | best-landing-page-builders-mobile-apps, mobile-app-launch-stack-checklist    | verified | https://www.framer.com/pricing/                                     |
| Webflow              | pricing    | best-landing-page-builders-mobile-apps, mobile-app-launch-stack-checklist    | verified | https://webflow.com/pricing (May 2026 simplified plans confirmed)   |
| Kit                  | pricing    | best-landing-page-builders-mobile-apps, mobile-app-launch-stack-checklist    | verified | https://kit.com/pricing                                             |
| RevenueCat           | pricing    | best-paywall-tools-ios-apps                                                  | verified | https://www.revenuecat.com/pricing/                                 |
| Superwall            | pricing    | best-paywall-tools-ios-apps                                                  | verified | https://superwall.com/pricing                                       |
| Adapty               | pricing    | best-paywall-tools-ios-apps                                                  | verified | https://adapty.io/pricing/                                          |
| PostHog              | pricing    | privacy-friendly-analytics-starter-stack                                     | verified | https://posthog.com/pricing                                         |
| TelemetryDeck        | pricing    | privacy-friendly-analytics-starter-stack                                     | stale    | Pricing page 404 on 2026-07-09; kept high-level, docs cited instead |
| AppTweak             | pricing    | best-aso-tools-for-indie-developers, appfigures-vs-apptweak-aso-tools        | verified | https://www.apptweak.com/en/pricing                                 |
| Appfigures           | pricing    | best-aso-tools-for-indie-developers, appfigures-vs-apptweak-aso-tools        | verified | https://appfigures.com/pricing                                      |
| AppFollow            | pricing    | best-aso-tools-for-indie-developers, aso-starter-checklist-indie-mobile-apps | verified | https://appfollow.io/pricing (quote-based; no public tiers)         |
| Sentry               | pricing    | sentry-vs-firebase-crashlytics-mobile-apps                                   | verified | https://sentry.io/pricing/                                          |
| Firebase Crashlytics | pricing    | sentry-vs-firebase-crashlytics-mobile-apps                                   | verified | https://firebase.google.com/pricing (listed as no-cost)             |

Notes:

- Webflow simplified its site plans in May 2026 (Starter free, Basic, Premium replacing CMS/Business, plus a Team plan and separate Workspace seats). Articles describe this at a high level.
- The paywall tools (RevenueCat, Superwall, Adapty) have converged on revenue-based pricing above a free threshold; articles summarize the meter without quoting exact percentages.
- TelemetryDeck's public pricing URL returned 404 on 2026-07-09; the analytics article keeps its claims high-level and cites the docs, and defers exact plan details to the live site.
- All eight upgraded articles carry at least three internal links, an owned hero visual, and a dated `## Source checks` section. `human_reviewed` stays true in the seed, but a human should re-read the new bodies before the next `db:seed` to production.

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
