# How much does it cost to run an indie iOS app? The annual ledger for a solo subscription stack

**Slug:** cost-to-run-an-indie-ios-app
**URL:** /guides/cost-to-run-an-indie-ios-app
**SEO title:** How much does it cost to run an indie iOS app?
**SEO description:** A solo iOS subscription stack costs $2,019, $10,251, or $20,151 a year at $1,000, $5,000, and $10,000 a month. Every line dated and sourced.
**Intent:** buying-guide
**Schema:** Article, FAQPage
**Ledger CSV:** /data/price-ledger/solo-ios-subscription-stack-2026-11-03.csv

## Short answer
A solo iOS subscription app on a lean stack costs about $2,019 a year at $1,000 a month in sales, $10,251 at $5,000 a month, and $20,151 at $10,000 a month. Apple's 15 percent Small Business Program commission is close to 9 of every 10 dollars on that bill at all three sizes. Everything except the commission, including the $99 Apple Developer Program membership, comes to $219, $1,251, and $2,151 a year. Every price below was checked on Nov 3, 2026, against the vendor's own page.

> [!NOTE] One dated snapshot
> This is the first price ledger IndieAppStack has published. It is a single check, made on Nov 3, 2026. It does not show how any of these prices moved over time, because that history has not been kept yet. The same table is published as a [CSV file of the Nov 3, 2026 ledger](/data/price-ledger/solo-ios-subscription-stack-2026-11-03.csv), and the file name carries the check date.

![Stacked bars for three app sizes. At $1,000 a month the year costs $2,019, of which $1,800 is Apple's commission. At $5,000 a month it costs $10,250.88, of which $9,000 is commission. At $10,000 a month it costs $20,150.88, of which $18,000 is commission.](/content-visuals/articles/solo-ios-stack-annual-cost-three-sizes.svg "Annual cost of a solo iOS subscription stack at three revenue levels. Prices checked Nov 3, 2026.")

## The stack and the three sizes
The stack is the boring one from the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app): App Store Connect owns the products, [RevenueCat](/tools/revenuecat) owns purchase and entitlement truth, and every other layer stays on a free tier until a published limit forces a change.

The three sizes are calculation bases. They are not a claim about what a solo app earns.

- **$1,000 a month** ($12,000 a year). No backend yet, and no paid keyword tracking.
- **$5,000 a month** ($60,000 a year). The app has accounts on a free backend tier, and you pay for keyword tracking.
- **$10,000 a month** ($120,000 a year). Same as the middle size, except the database has outgrown the free tier's 500 MB limit. That is an assumption, stated so you can remove it.

Assumptions that apply to every column:

- Every sale goes through Apple In-App Purchase, and the account is in the App Store Small Business Program.
- Sales hold steady every month. A launch month full of annual plans behaves differently, as the free-tier section explains.
- Revenue is the price customers pay before tax. Apple calculates its commission after certain taxes and adjustments. This page does not model tax, and it does not model sales tax that vendors add at checkout.
- Prices are in US dollars, as each vendor publishes them.

## The ledger, line by line
Each line names the plan, the published price, and the page it came from. All were checked Nov 3, 2026.

| Line | Plan and published price | $1,000 a month | $5,000 a month | $10,000 a month |
| --- | --- | --- | --- | --- |
| Apple Developer Program | $99 annual membership | $99 | $99 | $99 |
| App Store commission | Small Business Program, 15 percent | $1,800 | $9,000 | $18,000 |
| Purchases and entitlements | RevenueCat Pro: $0 under $2,500 monthly tracked revenue, then 1 percent of all of it | $0 | $600 | $1,200 |
| Backend | None, then Supabase Free, then Supabase Pro from $25 a month | $0 | $0 | $300 |
| Crash reporting | Firebase Crashlytics, no-cost | $0 | $0 | $0 |
| Analytics | Google Analytics for Firebase, no-cost | $0 | $0 | $0 |
| CI builds | Xcode Cloud, 25 compute hours a month included with membership | $0 | $0 | $0 |
| Landing page and domain | Framer Basic, $10 a month, custom domain | $120 | $120 | $120 |
| Keyword tracking | Appfigures Starter, then Monitor at $35.99 a month on annual billing | $0 | $431.88 | $431.88 |
| Newsletter | Kit Free, up to 10,000 subscribers | $0 | $0 | $0 |
| App Store screenshots | Screenshots Pro Basic | $0 | $0 | $0 |
| **Total for the year** | | **$2,019.00** | **$10,250.88** | **$20,150.88** |
| Without the App Store commission | | $219.00 | $1,250.88 | $2,150.88 |
| Total as a share of sales | | 16.8% | 17.1% | 16.8% |

What each line is, and where the figure came from:

- **Apple Developer Program.** $99 a year to publish on the App Store. Source: [Apple Developer Program](https://developer.apple.com/programs/).
- **App Store commission.** Apple's Small Business Program rate is 15 percent on paid apps and In-App Purchases for developers with up to $1 million in proceeds in the prior calendar year, and for developers new to the store. The line is 15 percent of each column's annual sales. Source: [App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/).
- **RevenueCat.** Pro is free up to $2,500 in monthly tracked revenue (MTR). Above that, RevenueCat bills 1 percent of the whole MTR, not only the part above the line. Its own example is $2,600 of MTR, which bills $26. MTR is measured before store commission and taxes, so $5,000 a month bills $50, or $600 a year. Sources: [RevenueCat pricing](https://www.revenuecat.com/pricing/) and [billing docs](https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management).
- **Backend.** The smallest column has no backend, which is the order the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) recommends. The middle column uses the [Supabase](/tools/supabase) Free plan. The largest uses Pro, which is listed "from $25/month" with 8 GB of disk per project and $10 a month in compute credits. $25 times 12 is $300. Source: [Supabase pricing](https://supabase.com/pricing).
- **Crash reporting and analytics.** [Firebase](/tools/firebase) lists Crashlytics and Analytics as no-cost on both the Spark and Blaze plans. Source: [Firebase pricing](https://firebase.google.com/pricing).
- **CI builds.** Apple Developer Program membership includes 25 Xcode Cloud compute hours a month. Source: [Xcode Cloud](https://developer.apple.com/xcode-cloud/).
- **Landing page and domain.** [Framer](/tools/framer) Basic is $10 a month and includes a custom domain. The pricing page lists a complimentary domain on yearly billing and says sales tax is added at checkout. It does not print a separate yearly figure, so the line is $10 times 12. Confirm the domain's renewal price at checkout. Source: [Framer pricing](https://www.framer.com/pricing).
- **Keyword tracking.** [Appfigures](/tools/appfigures) Starter is free for up to 5 connected apps. The first plan with tracked keywords is Monitor, with 100 keywords, at $44.99 a month or $35.99 a month on annual billing. $35.99 times 12 is $431.88. Connect, at $9.99 a month, tracks 0 keywords, so it is not a cheaper keyword plan. Source: [Appfigures pricing](https://appfigures.com/pricing).
- **Newsletter.** [Kit](/tools/kit) is free up to 10,000 subscribers. Source: [Kit pricing](https://kit.com/pricing).
- **App Store screenshots.** [Screenshots Pro](/tools/screenshots-pro) Basic is $0 with the full editor and every device size. Source: [Screenshots Pro pricing](https://screenshots.pro/pricing).

Not in the ledger: a Mac, taxes, paid acquisition such as Apple Search Ads, payment processing outside In-App Purchase, an Android release, and your own time. None of these has one price that fits every solo developer.

## Where does the money go?
The commission is the bill. At $10,000 a month, Apple's 15 percent is $18,000 of a $20,150.88 year. Everything else, including the $99 membership, adds up to $2,150.88.

That changes which decisions matter. At the largest size, the whole tool list costs about as much as six weeks of commission. Confirming that the account is enrolled in the Small Business Program is worth more than any tool swap in this table, because the standard rate applies to developers who are not in it. The arithmetic for EU storefronts under the September 2026 terms is on [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost).

RevenueCat is the only tool line that grows with revenue. Both fees are charged on the customer price, so once RevenueCat bills, together they take 16 percent of sales. Measured against what Apple pays you after its 15 percent, RevenueCat's 1 percent is about 1.2 percent.

## Which free tiers end, and at what threshold?
Most of the ledger is $0 because each tool sits under a published limit. These are the limits, as printed on Nov 3, 2026.

![Free-tier limits in a solo iOS subscription stack: RevenueCat at $2,500 monthly tracked revenue, Kit at 10,000 subscribers, Supabase Free at 500 MB, Xcode Cloud at 25 compute hours a month, the Small Business Program at $1 million in proceeds a year, and Appfigures Starter at 5 connected apps, with keyword tracking from Monitor.](/content-visuals/articles/solo-ios-stack-free-tier-limits.svg "Where each free tier in the ledger ends. Limits checked Nov 3, 2026.")

| Tool | Free until | What happens at the line | Next price |
| --- | --- | --- | --- |
| RevenueCat Pro | $2,500 monthly tracked revenue | 1 percent of the whole month's MTR. A later month back under $2,500 returns to $0 | $26 on $2,600 of MTR |
| App Store Small Business Program | 15 percent rate up to $1 million in proceeds in a calendar year | The standard commission rate applies to future sales | Standard rate |
| Kit Free | 10,000 subscribers | A paid plan is needed | Creator, priced by list size. The page prints $33 a month on monthly billing, or $390 a year on annual billing, only for 1,000 subscribers |
| Supabase Free | 500 MB database, 50,000 monthly active users, 2 active projects | Pro raises disk to 8 GB per project. Free projects are also paused after 1 week of inactivity | Pro from $25 a month |
| Firebase Spark | Firestore: 1 GiB stored, 50,000 reads, 20,000 writes, and 20,000 deletes a day. Authentication: 50,000 monthly active users | Blaze adds metered pay-as-you-go pricing. Crashlytics and Analytics stay no-cost | Metered |
| Xcode Cloud | 25 compute hours a month | A paid compute plan | 100 hours for $49.99 a month |
| Framer Free | Free Framer domain only | A custom domain needs a paid plan | Basic, $10 a month |
| Appfigures Starter | 5 connected apps | Keyword tracking starts at Monitor | $35.99 a month on annual billing |
| Screenshots Pro Basic | Full editor and every device size | Localization, custom fonts, and 3D angles are on Standard | Standard, $19 a month |

Three of these limits are easy to miss.

**RevenueCat counts a month, not an average.** A launch month or a sale where many customers buy an annual plan can push one month's MTR over $2,500 even when the yearly average stays under it. That month bills 1 percent of all its MTR. The next month under the line is $0 again. The [RevenueCat tool page](/tools/revenuecat) covers how annual plans land in MTR.

**Swapping a free tool can bring a smaller limit.** [Sentry](/tools/sentry) Developer is free for 1 user and 5,000 errors, with Team at $26 a month on annual billing or $29 monthly. [TelemetryDeck](/tools/telemetrydeck) is free for 50,000 events a month on accounts created on or after Jul 1, 2026, and 100,000 on older accounts. At the limit, TelemetryDeck's namespace stops accepting data until you upgrade ([TelemetryDeck pricing update](https://telemetrydeck.com/blog/pricing-update-2026/), updated Oct 12, 2026). Its paid prices are in a dashboard calculator, so they are not in this ledger. [beehiiv](/tools/beehiiv) is free to 2,500 subscribers, with Lite at $59 a month or $588 a year at the 1,000-subscriber tier. Any of these swaps changes the line it replaces.

**Supabase Free pauses idle projects.** A staging or test project that sits for a week stops until you resume it. Keep test data somewhere you check.

Sources for this section: [Sentry pricing](https://sentry.io/pricing/), [beehiiv pricing](https://www.beehiiv.com/pricing), and the vendor pages linked in the ledger. All checked Nov 3, 2026.

## What should you cut first when the total gets uncomfortable?
Cut in order of the least risk per dollar saved. Start at the top.

- **Check the commission before you cut a tool.** Confirm Small Business Program enrollment in App Store Connect. On this ledger, that line is close to 90 percent of the bill. No tool change comes near it.
- **Paid keyword tracking.** Appfigures Monitor at $431.88 a year is the largest flat-fee line you chose at the middle size. Drop to Starter and check a short keyword list by hand each month until the list is too long to check that way.
- **A paid backend tier you do not need yet.** If the app can unlock premium features from a verified entitlement, it may not need a backend at all. The [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) explains when to postpone one. If you already run Supabase Pro, check whether the database still exceeds 500 MB before you pay for another year.
- **The landing page plan.** Framer Free on a free Framer domain saves $120 a year and costs you the custom domain. That is a real trade for a brand. Make it last among the optional cuts.
- **RevenueCat, last.** At $10,000 a month the fee is $1,200 a year. Removing it means owning receipt checks, restores, and entitlements yourself with StoreKit 2. Do that when the app is iOS-only and the purchase surface is small.

The $99 Apple Developer Program fee is not a cut. Without it, the app is not on the store.

## Build your own version of this ledger
Your stack will not match this one line for line. The [Stack Finder](/stack-finder) starts from your platform, stage, and monetization model and suggests the tools to price. Take those tools to their pricing pages, put each figure in the same columns as the CSV, and date every row.

This ledger will be re-checked when the page is refreshed. Subscribe to the newsletter on this page to get that re-check, and any correction if a published figure turns out to be wrong. The rules for corrections are on the [editorial policy](/editorial-policy).

## Frequently asked questions
### How much does it cost to run an indie iOS app?
On the lean subscription stack in this ledger, about $2,019 a year at $1,000 a month in sales, $10,251 at $5,000 a month, and $20,151 at $10,000 a month. Apple's 15 percent Small Business Program commission is most of each total. Prices were checked Nov 3, 2026.

### What is the minimum yearly cost to keep an app on the App Store?
The Apple Developer Program is $99 a year. Every other line in this ledger has a free tier, and Apple's commission is a share of sales, so an app with no sales and a free Framer domain costs $99 a year on this stack.

### Is Apple's commission really part of running costs?
For this ledger, yes. It is the largest amount that leaves each sale before it reaches you. Leaving it out would make a tool swap look more important than it is.

### When does RevenueCat start charging?
In any month where monthly tracked revenue is above $2,500. It then bills 1 percent of that whole month's MTR, before Apple's commission. A later month below $2,500 is free again.

### Does this include taxes?
No. The ledger does not model income tax, sales tax added to tool invoices, or the tax adjustments Apple makes before calculating its commission.

## Source checks
Checked Nov 3, 2026, on each vendor's own page:

- Apple Developer Program: https://developer.apple.com/programs/
- App Store Small Business Program: https://developer.apple.com/app-store/small-business-program/
- Xcode Cloud: https://developer.apple.com/xcode-cloud/
- RevenueCat pricing: https://www.revenuecat.com/pricing/
- RevenueCat billing docs: https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management
- Supabase pricing: https://supabase.com/pricing
- Firebase pricing: https://firebase.google.com/pricing
- Framer pricing: https://www.framer.com/pricing
- Appfigures pricing: https://appfigures.com/pricing
- Kit pricing: https://kit.com/pricing
- Screenshots Pro pricing: https://screenshots.pro/pricing
- Sentry pricing: https://sentry.io/pricing/
- beehiiv pricing: https://www.beehiiv.com/pricing
- TelemetryDeck pricing update (published Jul 1, 2026, updated Oct 12, 2026): https://telemetrydeck.com/blog/pricing-update-2026/

A price check reads the pricing page. It is not a test of the product. TelemetryDeck's paid prices sit in a dashboard calculator that did not render as readable text, so no TelemetryDeck paid figure appears here.

Last checked: Nov 3, 2026.

## Related tools and guides
- Start with the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) for what each layer owns.
- Read [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost) for EU commission arithmetic.
- Compare [RevenueCat alternatives](/comparisons/revenuecat-alternatives) when the 1 percent line is the one you want to move.
- Review the [monetization category](/categories/monetization).
