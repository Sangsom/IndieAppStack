# RevenueCat

**Slug:** revenuecat
**URL:** /tools/revenuecat
**SEO title:** RevenueCat review, pricing, alternatives, and fit
**SEO description:** Free under $2,500 monthly tracked revenue, then 1% of that MTR. Pricing checked Sep 24, 2026.

## Short answer
RevenueCat pricing is free while monthly tracked revenue (MTR) stays under $2,500, then 1% of that whole MTR once you are above the threshold. MTR is the amount charged to the customer, before store commission and taxes, and it includes purchases and renewals, including non-subscription products (checked Sep 24, 2026). RevenueCat is the purchase and entitlement layer between your app and the App Store or Google Play. It does not replace the store commission.

## RevenueCat pricing
The public pricing page has one usage meter, plus a path for teams that keep their own purchase backend.

:::comparison RevenueCat pricing (checked Sep 24, 2026)
| Plan | Price | What the meter covers |
| --- | --- | --- |
| Pro | $0 while MTR is under $2,500; then 1% of MTR | Purchases and renewals RevenueCat tracks, before store commission and taxes |
| Growth tools | 1% of MTR on the conversions those tools produce | Paywalls, web-to-app funnels, and A/B/n testing while you keep your own purchase backend |
| Custom | Custom | Volume discounts, dedicated support, and custom SLAs for high-volume apps |
:::

Two details on that table are easy to misread.

**The 1% applies to the whole MTR, not the amount above $2,500.** RevenueCat's billing docs say MTR under $2,500 is free, and MTR above $2,500 is billed at 1% of the tracked amount. Their example: $2,600 in MTR bills $26. A later month that falls back under $2,500 returns to $0. The pricing page says you pay nothing for up to $2,500, then 1% once you hit $2,500. Both pages were checked Sep 24, 2026.

**MTR is not the money you keep.** It is the amount charged to the customer, before the store commission and before tax. An annual subscription counts in the month it is charged for invoicing, rather than spread across the year the way a monthly-recurring chart would. [RevenueCat staff described that invoice treatment in March 2025](https://community.revenuecat.com/general-questions-7/clarification-on-mtr-calculation-for-annual-subscriptions-6002). The billing docs state the before-commission base.

Sources: [RevenueCat pricing](https://www.revenuecat.com/pricing/) and [billing and account settings](https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management), checked Sep 24, 2026.

## What the September 2026 App Store terms add
Apple's EU business terms take effect Oct 1, 2026. For a solo developer on EU In-App Purchase who is in the Small Business Program, Apple's commission is 15 percent of the price the customer pays. At $1,000, $5,000, and $10,000 in a month, that commission is $150, $750, and $1,500. Those figures are Apple's, copied on [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost) from Apple's published rates, checked Sep 24, 2026.

That Apple rate does not change if the purchase goes through RevenueCat, [Adapty](/tools/adapty), [Superwall](/tools/superwall), [Qonversion](/tools/qonversion), or StoreKit 2. RevenueCat's 1% is a second bill, on a different base: MTR before the store cut, and only in months above $2,500. Do not add 15 percent and 1 percent as if they share a denominator.

## When RevenueCat is premature
Skip it and use StoreKit 2 in the app when all of these are true:

- The app is iOS-only, and you will not sell the same entitlement on Android or the web.
- You have one product, or a single one-time unlock, and you can check the entitlement yourself.
- You will not change paywalls or run experiments without an app release.

A purchase SDK is overhead until the subscription layer is the thing that can break the release. The earlier cut of that choice is the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app). If the job is paywall iteration rather than purchase truth, read [Superwall vs RevenueCat](/comparisons/superwall-vs-revenuecat). The wider set is [RevenueCat alternatives](/comparisons/revenuecat-alternatives).

## Setup and integration
RevenueCat ships open-source SDKs for iOS, Android, React Native, Flutter, and a REST API (checked Sep 24, 2026 on the pricing page feature list). On iOS you add the SDK, create products and subscription groups in App Store Connect, and map them to entitlements in the dashboard. The SDK then reports purchase state you check in code.

You still own store setup, App Store review of the purchase flow, and sandbox testing on a device. The paywall editor can change paywall layout without a release. Leaving later means replacing entitlement checks that currently run through the SDK.

## Frequently asked questions
### What does RevenueCat pricing cost?
$0 while monthly tracked revenue stays under $2,500, then 1% of the whole MTR. RevenueCat's example is $2,600 in MTR, which bills $26. Growth tools are 1% of MTR on the conversions those tools produce if you keep your own purchase backend. Custom pricing is for high-volume apps. Checked Sep 24, 2026 on the [pricing page](https://www.revenuecat.com/pricing/) and the [billing docs](https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management).

### What is monthly tracked revenue?
MTR is the revenue RevenueCat tracks for billing. It includes purchases and renewals, including non-subscription products, and it is measured before store commission and taxes. It is not monthly recurring revenue, and it is not your proceeds after Apple's cut.

### Do the September 2026 App Store terms change the RevenueCat fee?
No. The September terms change Apple's EU commission. They do not change the $2,500 MTR threshold or the 1% rate. A Small Business Program developer on EU In-App Purchase still pays Apple 15 percent of the customer price, and pays RevenueCat only when MTR is above $2,500. The arithmetic is on the [September 2026 cost guide](/guides/app-store-business-terms-2026-cost).

### When should I use StoreKit instead of RevenueCat?
When the app is iOS-only, the purchase surface is small, and you will not run remote paywall experiments. StoreKit 2 can own that case without a third-party SDK. Add RevenueCat when receipt validation, restores, and a cross-platform customer record are the risk you do not want to maintain yourself.

### Do I still need App Store Connect?
Yes. You create products, prices, and subscription groups in App Store Connect. RevenueCat maps those products to entitlements. It does not replace store setup or review.
