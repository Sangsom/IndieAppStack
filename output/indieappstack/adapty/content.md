# Adapty

**Slug:** adapty
**URL:** /tools/adapty
**SEO title:** Adapty review, pricing, alternatives, and fit
**SEO description:** Free under $5,000 monthly revenue, then 1% of that month. Pricing checked September 29, 2026.

## Short answer
Adapty pricing is free while the revenue Adapty tracks stays under $5,000, then 1% of that revenue once you cross the threshold. The free check is a rolling 30 days. After you cross $5,000, Adapty starts a monthly billing cycle and charges 1% of that month's revenue. The meter includes subscriptions, renewals, and one-time purchases, in USD, before Apple, Google, or Stripe take their cut (checked Sep 29, 2026).

## Adapty pricing
Two public plans. Pro is the revenue meter. Enterprise is custom.

:::comparison Adapty plans (checked Sep 29, 2026)
| Plan | Price | What is included |
| --- | --- | --- |
| Pro | $0 while tracked revenue stays under $5,000 on a rolling 30-day check; then 1% of that month's revenue | Open-source SDKs, web payments, cross-platform sync, revenue analytics, the paywall builder, A/B testing, and email support. Live chat is listed for paid customers |
| Enterprise | Custom | Everything in Pro plus onboarding and migration, a dedicated success manager, a Slack channel, custom SLAs, US or EU data residency, and SOC 2 Type II as stated on the pricing page |
:::

Two facts on that table are easy to misread.

**The 1% applies to the month that crossed the line, not only the dollars above $5,000.** Adapty's pricing FAQ says that once you cross $5,000 in revenue over the last 30 days, you pay 1% of that amount. On an $8,000 month of tracked revenue, that published rule is $80. The same arithmetic is on the [monetization category](/categories/monetization).

**Crossing $5,000 starts monthly billing. The FAQ does not say a later quiet month returns to $0.** Before the threshold, Adapty tracks revenue on a rolling 30-day basis and does not charge. Once you cross $5,000, the monthly cycle begins, and the FAQ says you are billed 1% of each month's revenue from then on. [RevenueCat](/tools/revenuecat) publishes the opposite rule for its own meter: a later month under $2,500 returns to $0 (checked Sep 25, 2026). Do not import that rule onto Adapty.

What the meter counts: subscriptions, renewals, and one-time purchases, in USD, before the store or payment platform takes its cut. It is not the money you keep after Apple's commission.

The pricing page lists Refund Saver, attribution, and an App Growth Team beside Pro. Their prices were not in the Pro table on Sep 29, 2026. The FAQ says that under $5,000 you can use nearly every feature for free, including some of the add-ons. A February 16, 2026 pricing post said Refund Saver, Adapty UA, and Apple Ads Manager are free under $5,000 and priced individually after that. This page does not state an add-on rate, because the live table does not publish one.

Sources: [Adapty pricing](https://adapty.io/pricing/), checked Sep 29, 2026, and [Adapty's February 16, 2026 pricing announcement](https://adapty.io/blog/adapty-new-pricing-2026/).

> [!NOTE] Solo builder read
> The free band holds while a rolling 30-day window stays under $5,000. The 1% is the bill for the month that crosses that line, and the pricing FAQ does not describe a return to $0.

## What the September 2026 App Store terms add
Apple's EU business terms take effect Oct 1, 2026. For a solo developer on EU In-App Purchase who is in the Small Business Program, Apple's commission is 15 percent of the price the customer pays. At $1,000, $5,000, and $10,000 in a month, that commission is $150, $750, and $1,500. Those figures are Apple's, copied on [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost) from Apple's published rates, checked Sep 24, 2026.

![Three cards showing Apple's 15 percent commission at $1,000, $5,000, and $10,000 a month: $150, $750, and $1,500.](/content-visuals/articles/app-store-terms-2026-solo-cost.svg "Small Business Program, EU In-App Purchase: 15 percent of the price the customer pays. Checked Sep 24, 2026.")

That Apple rate does not change if the purchase goes through Adapty, [RevenueCat](/tools/revenuecat), [Superwall](/tools/superwall), [Qonversion](/tools/qonversion), or StoreKit 2. Adapty's 1% is a second bill, on the revenue Adapty tracks before the platform cut, and only after the $5,000 line. Do not add 15 percent and 1 percent as if they share a denominator. At $8,000 charged to the customer, Apple's 15 percent is $1,200. Adapty's 1% of that same $8,000 tracked base is $80. The four-tool version of that table is the [monetization category](/categories/monetization). The sibling price check is [RevenueCat](/tools/revenuecat).

## Price Radar
Adapty Price Radar is a free pricing check, separate from the Pro meter. The page says no sign-up is required to compare your prices and conversion rates with apps in your subcategory, filtered by country. You paste an App Store link, pick countries, confirm the competitor set, and see where you stand. The fuller dataset is behind sign-up. That signed-in section is where Adapty describes conversion benchmarks for 50+ countries ([Price Radar](https://adapty.io/subscription-price-radar/), checked Sep 29, 2026).

The check does not change the $5,000 threshold or the 1% rate. The same page points at Autopilot when you want that comparison turned into tests. The prices customers actually pay still come from the store. Adapty's docs say you change them in App Store Connect or Google Play, or by uploading a price CSV that Adapty writes to both stores ([store sync](https://adapty.io/docs/store-sync), checked Sep 29, 2026).

## When Adapty is the wrong choice
Four cases where the fit is poor.

- **You can ship a StoreKit 2 paywall in code and will not test it remotely.** Receipt validation for one iOS product is overhead until the subscription layer is the thing that can break the release. The earlier cut of that choice is the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app).
- **Purchase truth is the job that must be right before paywall experiments.** Entitlements, restores, and a cross-platform customer record are [RevenueCat](/tools/revenuecat)'s center of gravity. RevenueCat is free under $2,500 in monthly tracked revenue, then 1% of that whole MTR (checked Sep 25, 2026).
- **You want the paywall meter to ignore revenue that never hit the paywall.** [Superwall](/tools/superwall) bills its paywall product on attributed revenue only, and its subscription infrastructure stays free at any scale. Adapty's 1% is on the revenue it tracks, not on a paywall-attributed slice.
- **You want a higher free band on the published meter.** [Qonversion](/tools/qonversion) Pro is free through $7,000 in monthly tracked revenue, then 0.8% of that whole MTR (checked Sep 25, 2026).

If the choice is Adapty or RevenueCat, read the [RevenueCat vs Adapty comparison](/comparisons/revenuecat-vs-adapty-ios-subscriptions).

## Setup and integration
Adapty's pricing page lists open-source SDKs for iOS, Android, Flutter, React Native, and Unity, plus web payments through Stripe, Paddle, or a custom provider (checked Sep 29, 2026). On iOS you add the SDK, create products and subscription groups in App Store Connect, and map them to access levels in the dashboard. The paywall builder can change the paywall without an app release. The SDK reports subscription state you check in code.

You still own store setup, App Store review of the purchase flow, and sandbox testing on a device. The price a customer sees on a paywall comes from StoreKit when the paywall opens, not from a price stored in Adapty ([store sync](https://adapty.io/docs/store-sync), checked Sep 29, 2026). Leaving later means replacing entitlement checks that currently run through the SDK.

## Frequently asked questions
### What does Adapty pricing cost?
$0 while the revenue Adapty tracks stays under $5,000 on a rolling 30-day check, then 1% of the month that crosses that line. Enterprise is custom. Checked Sep 29, 2026 on the [pricing page](https://adapty.io/pricing/).

### Where does the Adapty free tier end?
At $5,000 of tracked revenue over the last 30 days. Under that line, the pricing FAQ says nearly every feature is free, including some add-ons. Once you cross it, Adapty bills 1% of that month's revenue. The FAQ says billing continues at 1% of each month's revenue from then on, and it does not say a later month under $5,000 returns to $0. Add-on prices were not in the Pro table on Sep 29, 2026.

### What is Adapty Price Radar?
A free check, with no sign-up, that compares your subscription prices and conversion rates with apps in your subcategory, by country. Sign-up is what Adapty asks for before the fuller dataset, which the page describes as conversion benchmarks for 50+ countries. The check is not a charge on the Pro plan, and it does not move the $5,000 threshold. Open it at [Adapty Price Radar](https://adapty.io/subscription-price-radar/).

### Do the September 2026 App Store terms change the Adapty fee?
No. The September terms change Apple's EU commission. They do not change the $5,000 threshold or the 1% rate. A Small Business Program developer on EU In-App Purchase still pays Apple 15 percent of the customer price, and pays Adapty only after tracked revenue crosses $5,000. The arithmetic is on the [September 2026 cost guide](/guides/app-store-business-terms-2026-cost).

### When is Adapty the wrong choice?
When you will not run remote paywall tests, when purchase infrastructure is the risk you need to retire first, when you want Superwall's attributed paywall meter, or when Qonversion's higher free band is the published rule you want. For the head-to-head with RevenueCat, use the [RevenueCat vs Adapty comparison](/comparisons/revenuecat-vs-adapty-ios-subscriptions).

### Do I still need App Store Connect?
Yes. You create products, prices, and subscription groups in App Store Connect. Adapty maps those products to access levels. It does not replace store setup or review.
