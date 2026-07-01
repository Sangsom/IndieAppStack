# IndieAppStack First Publishing Sprint

Created: 2026-06-30.
Source plan: `plugins/indieappstack-content-affiliate/docs/initial-90-day-plan.md`.
Planning agent: `ias-content-strategist`.

## Strategy Summary

Sprint 1 should make IndieAppStack credible for the highest-value reader job in the 90-day plan: a solo mobile developer choosing the first subscription app stack.

The current seed already includes starter articles for monetization, RevenueCat vs Adapty, paywalls, backend, analytics, launch, ASO, and crash reporting. Treat those as draft-level public pages that need upgrading, not as finished authority content.

Publish or substantially refresh three pieces:

1. New flagship guide: `Subscription MVP stack for a solo iOS app`.
2. Substantial comparison refresh: expand `RevenueCat vs Adapty for iOS subscriptions` into a RevenueCat, Adapty, and Superwall decision page.
3. Hub refresh: upgrade `Best monetization tools for solo mobile developers` so it routes readers into the flagship guide, paywall comparison, backend, and analytics content.

This keeps week one focused on monetization trust before heavier affiliate work. RevenueCat can be mentioned as a pending partner target, but recommendations must still work with all affiliate links removed.

## Prioritized Topic Table

Scores use 1 to 5 for reader pain, search intent, monetization fit, evidence readiness, and internal-link value.

| Priority | Topic | Work Type | Reader Job | Reader Pain | Search Intent | Monetization Fit | Evidence Readiness | Internal-Link Value | Weighted Score | Rationale |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| P0 | RevenueCat vs Adapty vs Superwall | Substantial refresh | Choose subscription infrastructure and paywall workflow | 5 | 5 | 5 | 4 | 5 | 4.8 | Highest buying intent, already has a RevenueCat vs Adapty seed, and strengthens paywalls plus monetization paths. Superwall needs source checks before claims are expanded. |
| P0 | Subscription MVP stack for a solo iOS app | New flagship guide | Choose payment, entitlement, backend, analytics, and crash defaults | 5 | 5 | 4 | 4 | 5 | 4.65 | Best authority builder from the 90-day plan. It should become the page that explains the smallest useful stack before readers compare tools. |
| P1 | Best monetization tools for solo mobile developers | Hub refresh | Understand the monetization tool landscape before choosing a stack | 4 | 4 | 4 | 5 | 5 | 4.35 | Already published as a seed page. Refreshing it prevents thin content from weakening trust and creates a strong internal-link hub. |

## Publishing Calendar

Use this as a short kickoff sprint from Tuesday, 2026-06-30 through Friday, 2026-07-03. If the team wants a full Monday-to-Friday sprint, shift the same sequence to 2026-07-06 through 2026-07-10.

| Date | Owner Role | Work | Output |
| --- | --- | --- | --- |
| 2026-06-30 | Content strategist | Finalize sprint briefs, search intent, topic-queue records, internal-link targets, and evidence list. | Three brief-ready topics and visual briefs. |
| 2026-07-01 | Editorial writer | Draft the subscription MVP stack flagship guide. Build the stack map and decision table. | Draft flagship article plus image brief. |
| 2026-07-02 | Editorial writer | Refresh the RevenueCat vs Adapty comparison into a three-way RevenueCat, Adapty, Superwall comparison. Refresh the monetization hub outline and links. | Comparison refresh draft and hub refresh draft. |
| 2026-07-03 | Affiliate operator and editor | Source-check pricing/features, verify affiliate status, add disclosures where needed, QA internal links, publish or schedule. | Two publishable articles, one refreshed hub, and updated topic queue. |

## Brief-Ready Notes

### Subscription MVP Stack For A Solo iOS App

- Recommended slug: `subscription-mvp-stack-solo-ios-app`.
- Content type: flagship guide.
- Target keyword: `subscription MVP stack iOS app`.
- Search intent: practical investigation.
- Category: Monetization.
- Related tools: RevenueCat, Supabase, TelemetryDeck, Sentry, App Store Connect.
- Why now: this should be the trust anchor for the first 30 days and explain the stack before the site asks readers to compare vendors.
- Short answer: start with RevenueCat for purchases and entitlements, Supabase only if the app needs account-backed data, TelemetryDeck or a small event taxonomy for product signal, and crash reporting before public launch.
- Required sections: short answer, smallest viable stack, what to delay, decision table, implementation order, failure modes, internal links, source-check notes.
- Visual plan: stack map showing purchase, entitlement, backend, analytics, and crash reporting responsibilities.
- Evidence needed: official pricing and docs for RevenueCat, Supabase, TelemetryDeck, Sentry, and Apple subscription setup; no hands-on claims unless notes exist.
- Internal links: `/tools/revenuecat`, `/tools/supabase`, `/tools/telemetrydeck`, `/tools/sentry`, `/categories/monetization`, `/categories/backend`, `/categories/analytics`, `/guides/privacy-friendly-analytics-starter-stack`, `/guides/crash-reporting-setup-indie-mobile-apps`.
- Affiliate status: RevenueCat is a target program and the seed link is pending. Use direct links until approval is confirmed. No monetized claims.

### RevenueCat Vs Adapty Vs Superwall

- Existing seed page: `/guides/revenuecat-vs-adapty-ios-subscriptions`.
- Recommended approach: refresh the existing page if redirects are not ready; only change the slug after a redirect plan exists.
- Content type: comparison.
- Target keyword: `RevenueCat vs Adapty vs Superwall`.
- Search intent: commercial investigation.
- Category: Paywalls.
- Related tools: RevenueCat, Adapty, Superwall.
- Why now: it is the most monetizable week-one topic and fixes a current gap in the existing two-tool comparison.
- Short answer: RevenueCat is strongest when purchase infrastructure and entitlements are the center, Adapty fits paywall workflow plus subscription analytics, and Superwall fits teams that want remote paywall presentation and iteration.
- Required sections: short answer, decision table, use-case matrix, setup complexity, analytics and experiment workflow, what to verify before switching, source-check notes.
- Visual plan: three-column decision table plus a paywall workflow diagram from app screen to purchase, entitlement, experiment, and analytics.
- Evidence needed: official pricing pages, docs, SDK/platform support, experiment/paywall claims, and source-check dates for all three tools.
- Internal links: `/tools/revenuecat`, `/tools/adapty`, `/tools/superwall`, `/categories/paywalls`, `/categories/monetization`, `/guides/best-paywall-tools-ios-apps`, `/guides/best-monetization-tools-solo-mobile-developers`.
- Affiliate status: RevenueCat partner target is documented and seed status is pending. Adapty and Superwall are tier-two research targets. Use direct links until each program is verified and approved.

### Best Monetization Tools For Solo Mobile Developers

- Existing seed page: `/guides/best-monetization-tools-solo-mobile-developers`.
- Content type: hub refresh.
- Target keyword: `mobile app monetization tools`.
- Search intent: commercial investigation.
- Category: Monetization.
- Related tools: RevenueCat, Adapty, Superwall, Supabase, TelemetryDeck.
- Why now: it is already public and currently acts as the monetization hub. It should not remain thin while the sprint publishes stronger supporting pages.
- Short answer: pick tools by revenue workflow, not category labels: purchase infrastructure first, paywall iteration second, backend only when accounts or synced data require it, and analytics only for decisions the developer can act on.
- Required sections: decision framework, starter stacks by stage, tool roles, what to delay, internal links, disclosure policy.
- Visual plan: monetization decision tree that routes readers to subscription stack, paywall tools, backend, and analytics.
- Evidence needed: current seed data, official pricing/source dates for mentioned tools, and updated internal links after the two sprint articles publish.
- Internal links: `/categories/monetization`, `/categories/paywalls`, `/categories/backend`, `/categories/analytics`, `/guides/subscription-mvp-stack-solo-ios-app`, `/guides/revenuecat-vs-adapty-ios-subscriptions`, `/guides/best-paywall-tools-ios-apps`, `/guides/privacy-friendly-analytics-starter-stack`.
- Affiliate status: keep disclosure language because RevenueCat may become monetized. Do not add tracked `/go/revenuecat` links until the program is approved.

## Topic Queue Inputs

| Title | Slug | Target Keyword | Search Intent | Category | Related Tools | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| Subscription MVP stack for a solo iOS app | `subscription-mvp-stack-solo-ios-app` | `subscription MVP stack iOS app` | practical investigation | Monetization | RevenueCat, Supabase, TelemetryDeck, Sentry | 100 | briefed | New flagship guide for sprint 1. Needs stack map and official source checks. |
| RevenueCat vs Adapty vs Superwall | `revenuecat-vs-adapty-vs-superwall` | `RevenueCat vs Adapty vs Superwall` | commercial investigation | Paywalls | RevenueCat, Adapty, Superwall | 95 | briefed | Refresh existing RevenueCat vs Adapty page unless redirects are ready. Needs Superwall source checks. |
| Best monetization tools for solo mobile developers | `best-monetization-tools-solo-mobile-developers` | `mobile app monetization tools` | commercial investigation | Monetization | RevenueCat, Adapty, Superwall, Supabase, TelemetryDeck | 80 | briefed | Hub refresh for existing public page. Add decision framework and route to sprint articles. |

## Internal-Link Cluster

- Monetization hub links down to the subscription MVP stack, paywall tools guide, RevenueCat comparison, privacy-friendly analytics, backend category, and crash reporting setup.
- Subscription MVP stack links sideways to RevenueCat comparison, Supabase vs Firebase, privacy-friendly analytics, crash setup, and launch checklist.
- RevenueCat comparison links back to the monetization hub, paywall tools guide, RevenueCat tool page, Adapty tool page, Superwall tool page, and the subscription MVP stack.
- Paywall tools guide should be refreshed after this sprint to link to the new three-way comparison.

## Required Evidence And Visuals

| Article | Evidence | Visuals |
| --- | --- | --- |
| Subscription MVP stack | Official docs/pricing for RevenueCat, Supabase, TelemetryDeck, Sentry, and Apple subscriptions. Confirm source-check dates in article notes. | Hero stack map, implementation order diagram, decision table. |
| RevenueCat vs Adapty vs Superwall | Official pricing, docs, SDK/platform support, paywall, analytics, and experiment claims for all three tools. | Three-way decision table, paywall workflow diagram. |
| Monetization tools hub | Current tool records, updated source-check dates, and links to new sprint content. | Decision tree, starter stack comparison table. |

## Risks And Guardrails

- Do not claim hands-on testing unless review notes exist.
- Do not claim commission rates, cookie windows, or approval status unless verified from official partner materials.
- Do not create a duplicate RevenueCat comparison URL until redirects are planned.
- Do not publish the monetization hub refresh until the two week-one pieces have stable slugs.
- Keep every recommendation useful without affiliate links.

## Next Actions

1. Add or update the three topic queue records from the table above.
2. Source-check the three monetization/paywall tools before drafting comparison claims.
3. Produce the stack map and paywall workflow diagram before final review.
4. Publish the flagship guide first, the comparison second, and the monetization hub refresh last.
5. Run the Friday analytics and QA checklist after publication, even if traffic is still near zero.
