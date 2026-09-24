# What the September 2026 App Store business terms actually cost a solo developer

**Slug:** app-store-business-terms-2026-cost
**URL:** /guides/app-store-business-terms-2026-cost
**SEO title:** App Store new business terms 2026 cost
**SEO description:** EU App Store terms take effect Oct 1, 2026. Commission at $1,000, $5,000, and $10,000 a month, from Apple's published rates.

## Short answer
For a solo developer on an EU App Store app who uses In-App Purchase and the Small Business Program, the new business terms cost 15 percent of the price the customer pays. At $1,000, $5,000, and $10,000 in a month, that commission is $150, $750, and $1,500. Apple published the terms on Aug 18, 2026. They take effect Oct 1, 2026. The initial acquisition fee and the store services fee are eliminated. The 5 percent Core Technology Commission applies only when the app is distributed outside the App Store.

> [!NOTE] What this page will and will not do
> Every rate below is copied from an Apple page or from Apple's Alternative Terms Addendum, checked Sep 24, 2026. A figure Apple does not publish is marked n/a. This is arithmetic for a one-person app. It is not a recommendation to switch payment tools, and it is not tax or legal advice.

![Three cards showing Apple's 15 percent commission at $1,000, $5,000, and $10,000 a month: $150, $750, and $1,500.](/content-visuals/articles/app-store-terms-2026-solo-cost.svg "Small Business Program, EU In-App Purchase: 15 percent of the price the customer pays. Checked Sep 24, 2026.")

## What changed, who it applies to, and what it costs
On Aug 18, 2026, Apple updated the Apple Developer Program License Agreement for apps distributed in the European Union. The Account Holder can agree to the terms now. They take effect on Oct 1, 2026, or on the date the account agrees, whichever is later. Until then, a developer who already uses alternative distribution or alternative payments in the EU can stay on the terms already in place.

The change is EU storefronts and EU distribution. Apple's support page does not apply these rates to the rest of the world. A cost for a non-EU storefront is n/a on this page.

Three charges are easy to mix up, because two of them are being removed and one of them shares a name with a new commission:

- The **initial acquisition fee** and the **store services fee** are defined in the Alternative Terms Addendum. The new terms eliminate both.
- The **store services commission** is a different charge. It stays, and it applies only to certain out-of-app sales.
- The **Core Technology Fee** was €0.50 per first annual install above a threshold. The new terms replace it, for apps distributed outside the App Store, with a **Core Technology Commission** of 5 percent.

![Diagram of three EU fee paths: In-App Purchase at 15 or 26 percent, link-outs within 7 days at 10 or 15 percent, and a 5 percent Core Technology Commission outside the App Store.](/content-visuals/articles/app-store-terms-2026-fee-paths.svg "The initial acquisition fee and the store services fee are eliminated. The 5 percent commission is only for apps distributed outside the App Store.")

If you sell through Apple In-App Purchase and you are in the Small Business Program, or the sale is an auto-renewable subscription after its first year, the new App Store rate is 15 percent. That is the figure in the short answer. The other rows in the table are for a different payment path or a developer who is not in a reduced-rate program.

## The three fees, in plain language
These definitions are the ones in force under the Alternative Terms Addendum until the unified terms replace it. Apple says that addendum, and the StoreKit External Purchase Link Entitlement (EU) Addendum, are superseded by Attachment 14 of the license agreement on Oct 1, 2026.

### Initial acquisition fee
This fee is not a charge on In-App Purchase. Apple's addendum says it applies to sales of digital goods or services to someone who installs the app for the first time, did not pay for that install, and buys within six months of that install, after the app is available with the entitlement for Communication and Promotion of Offers. Sales made with Apple's in-app purchase system are excluded. So are auto-renewals of a subscription the customer started before that first install.

The rate is 2 percent of those transaction proceeds. It is 0 percent while you are in the App Store Small Business Program, and 0 percent on an auto-renewal in the second year or later of an auto-renewing subscription.

Under the unified terms, this fee is eliminated. On a sale after Oct 1, 2026, the initial acquisition fee is $0. Do not carry the 2 percent forward.

### Store services fee
This is also not a charge on In-App Purchase. It applies to sales of digital goods or services to someone who installs, reinstalls, or updates the app after it is available with that same entitlement, within twelve months of the install, and again for twelve months after a later install. In-App Purchase sales are excluded.

The rate is 13 percent of those transaction proceeds. If you opt out of Tier 2 store services and pay only for Tier 1, the rate is 5 percent. You may make that choice once per quarter. While you are in the Small Business Program, or the transaction is an auto-renewal in year two or later, the store services fee is 10 percent, and the Tier 1 rate stays 5 percent.

Under the unified terms, this fee is eliminated. The name that remains is the store services **commission**, and the trigger is narrower: an out-of-app offer with an actionable link, and only the sales made within 7 days of the link tap.

| | Store services fee (addendum, until it is superseded) | Store services commission (unified terms) |
| --- | --- | --- |
| Applies to | Digital sales tied to an install, for 12 months, excluding In-App Purchase | Out-of-app offers with an actionable link |
| Window | 12 months from the install | 7 days from the link tap |
| Standard rate | 13 percent, or 5 percent on Tier 1 only | 15 percent |
| Small Business Program, or a subscription after year one | 10 percent, or 5 percent on Tier 1 only | 10 percent |

A sale outside the 7-day window is not subject to the store services commission. Apple's page does not publish a different commission for that sale. If the sale is also not In-App Purchase and not alternative payment inside the app, the rate on it is n/a here.

### Core Technology Commission
The Core Technology Commission is 5 percent. It applies to alternative app marketplaces, to apps distributed through them, and to apps distributed via Web Distribution. The base is sales of paid apps and of digital goods or services, including one-time purchases and auto-renewing subscriptions, for use within apps on an Apple platform. It also covers the download or access price of those apps, and sales from an actionable link that opens in a browser, limited to sales within 7 days of the tap.

It does not appear in Apple's App Store In-App Purchase table. A solo developer who distributes only on the App Store does not pay it. Treating 5 percent as the App Store rate is a misread.

The commission applies to the total price payable by each user, less any transaction taxes. You collect and remit tax on sales an alternative payment provider processes, and you report the transactions to Apple.

The old Core Technology Fee is a different instrument: €0.50 per first annual install of an iOS or iPadOS app in the EU above 1 million installs in a rolling twelve-month period. At $1,000, $5,000, or $10,000 of monthly sales, that fee cannot be computed, because Apple prices it per install, not as a percent of revenue. Without an install count, the Core Technology Fee is n/a. A developer who has never exceeded 1 million first annual installs, and who earns less than €10 million of global business revenue in a twelve-month period, may register not to pay it. Whether you qualify is an account fact, not a figure this page can supply.

There is a separate waiver for a small marketplace operator, on the marketplace app's own download price or subscription fee: under €10 million global revenue in the last 12 months, and under €1 million lifetime revenue from that EU marketplace app. It does not waive the 5 percent on a normal app's in-app sales.

## Worked math at three monthly revenue levels
Assumptions, all of them stated so the arithmetic can be checked:

- The three levels are $1,000, $5,000, and $10,000 in a month. They are calculation bases, not a claim about what a solo app earns.
- "Revenue" here means the price customers pay for digital goods or services in that month, which is the base Apple names for the new App Store rates. The label is US dollars so the table is readable. The percent does not change with the currency.
- Each dollar in the row is assumed to qualify for that row's fee. A real month mixes In-App Purchase, link-outs, renewals, and refunds. The blended invoice is n/a without your transaction report.
- Tax is not subtracted. Apple says App Store commission applies to the price paid by the customer, and that tax is calculated as set out in the license agreement. The Core Technology Commission applies to the price less transaction taxes. This table does not estimate either adjustment.
- Small Business Program, Mini Apps Partner Program, and Video Partner Program rates are the reduced column. This page does not know whether your account is in one of them.
- Payment-processor fees charged by someone other than Apple, and proceeds after refunds, are n/a. Apple does not publish those in the rate tables.

If every dollar qualifies, Apple's commission is:

| Path, from Apple's unified terms | Rate | On $1,000 | On $5,000 | On $10,000 |
| --- | --- | --- | --- | --- |
| App Store, In-App Purchase, Small Business Program or a subscription after year one | 15% | $150 | $750 | $1,500 |
| App Store, In-App Purchase, standard rate | 26% | $260 | $1,300 | $2,600 |
| Alternative payment inside the app, reduced programs or a subscription after year one | 10% | $100 | $500 | $1,000 |
| Alternative payment inside the app, standard rate | 20% | $200 | $1,000 | $2,000 |
| Out-of-app actionable link, store services commission, reduced programs or a subscription after year one | 10% | $100 | $500 | $1,000 |
| Out-of-app actionable link, store services commission, standard rate | 15% | $150 | $750 | $1,500 |
| Distributed outside the App Store, Core Technology Commission | 5% | $50 | $250 | $500 |
| Initial acquisition fee, after the unified terms take effect | eliminated | $0 | $0 | $0 |
| Store services fee, after the unified terms take effect | eliminated | $0 | $0 | $0 |

You keep the rest of that base only if no other party takes a fee. Apple's table does not list a payment-processor fee on top of the alternative-payment rates. Do not add one from memory. If your processor publishes a fee, check that page yourself. It is n/a here.

For comparison, the addendum rates on a dollar that qualifies, before the unified terms replace them:

| Fee under the Alternative Terms Addendum | Who | Rate on a qualifying dollar | On $1,000 | On $5,000 | On $10,000 |
| --- | --- | --- | --- | --- | --- |
| Initial acquisition fee | Small Business Program, or a subscription auto-renewal after year one | 0% | $0 | $0 | $0 |
| Initial acquisition fee | Otherwise, inside the six-month window | 2% | $20 | $100 | $200 |
| Store services fee | Small Business Program, or a subscription auto-renewal after year one | 10% | $100 | $500 | $1,000 |
| Store services fee | Tier 2, not in those reduced cases | 13% | $130 | $650 | $1,300 |
| Store services fee | Tier 1 only | 5% | $50 | $250 | $500 |
| In-App Purchase on the addendum | Small Business Program, or a qualifying subscription after one year, plus the 3% processing fee | 10% + 3% | $130 | $650 | $1,300 |
| In-App Purchase on the addendum | Standard commission, plus the 3% processing fee | 17% + 3% | $200 | $1,000 | $2,000 |
| Core Technology Fee | Any revenue level, install count unknown | €0.50 per first annual install above 1 million | n/a | n/a | n/a |

The initial acquisition fee and the store services fee can both apply to the same link-out sale in the first six months after a first unpaid install. They do not apply to In-App Purchase. Adding 2 percent and 13 percent and calling it the App Store commission is the wrong base.

On the addendum, In-App Purchase in the EU is a separate schedule: 17 percent, or 10 percent for the Small Business Program or a qualifying subscription after one year, plus a 3 percent fee for payment processing and related commerce services. Under the unified terms, the In-App Purchase rates are 26 percent and 15 percent, and Apple's new table does not add a separate 3 percent processing line. For a Small Business Program developer who used In-App Purchase on the addendum, the published rate moves from 13 percent combined to 15 percent. For a Small Business Program developer who was never on the addendum, this page does not state the previous worldwide rate. That comparison is n/a until you read the Paid Applications Agreement that applies to your account.

## What this changes about tool choice, and what it does not
The commission is a property of the distribution and payment path. It is not a property of the paywall SDK.

If the app stays on the App Store and keeps using In-App Purchase, [RevenueCat](/tools/revenuecat), [Adapty](/tools/adapty), [Superwall](/tools/superwall), [Qonversion](/tools/qonversion), and a native StoreKit 2 integration all sit on the same Apple rate. Switching among them does not move a Small Business Program app from 15 percent to 10 percent or to 5 percent. The decision among those tools is still the one on [RevenueCat alternatives for subscription apps](/comparisons/revenuecat-alternatives): who owns entitlements, who runs paywall experiments, and whether you want a third-party purchase SDK at all. The [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) is the earlier cut of that choice.

Alternative payment inside an EU app is a different path. The reduced rate is 10 percent instead of 15 percent, on dollars that actually process that way. Apple also says you then handle taxes, refunds, billing issues, and a monthly transaction report within 15 days of month end. You must keep the payment options you select, across EU storefronts, for 12 months. A paywall vendor does not file that report. Choosing a paywall tool in order to "get the new rate" does not change the rate.

The 5 percent Core Technology Commission requires distribution outside the App Store: an alternative marketplace or Web Distribution. App Store In-App Purchase is not available on a marketplace build. Eligibility for operating a marketplace or using Web Distribution expands on Oct 1, 2026, and the list includes a financial-stability score, public listing, venture funding, an audit, a nonprofit fee waiver, a standby letter of credit of USD 1,000,000, or one million first annual installs worldwide. A solo developer who meets none of those does not get to use 5 percent as the planning rate. Whether you meet one of them is n/a here.

[Stripe](/guides/why-stripe-is-not-a-revenuecat-alternative-ios) is still not a substitute for a StoreKit entitlement layer. The EU terms add a regional payment path. They do not turn a card processor into the tool that restores purchases.

## What to verify before you act
Agreeing to the license agreement is an Account Holder action. Read the primary pages before you change a paywall or a payment provider.

- [Apple Developer news, Aug 18, 2026](https://developer.apple.com/news/?id=gmws0jgp): the announcement, the Oct 1, 2026 effective date, and the statement that the initial acquisition fee and the store services fee are eliminated.
- [Changes for apps in the European Union](https://developer.apple.com/support/apps-in-the-eu/): the rate tables for In-App Purchase, alternative payment, the store services commission, and the Core Technology Commission, plus the transition rule.
- [Payment options on the App Store in the EU](https://developer.apple.com/support/payment-options-on-the-app-store-in-the-eu): the same rates, the 12-month payment-choice lock, the 7-day link window, and the reporting deadline.
- [Alternative Terms Addendum for Apps in the EU](https://developer.apple.com/contact/request/download/external/Alternative-EU-Terms-Addendum.pdf): the initial acquisition fee, the store services fee, the older In-App Purchase schedule, and the Core Technology Fee. This document is being phased out.

Then check three facts only you can see:

- Whether the Account Holder has agreed, and whether the account is still on the addendum until Oct 1, 2026.
- Whether the account is in the Small Business Program or another reduced-rate program.
- What share of last month's digital sales was In-App Purchase, alternative payment, or a sale within 7 days of an actionable link. Without that split, do not multiply one rate by all of last month's revenue.

## Re-check when the terms take effect
The rates above were checked on Sep 24, 2026, against the pages linked in the previous section. The terms take effect Oct 1, 2026. This page should be re-checked then, because an agreed account can move earlier and because Attachment 14 supersedes the addendum on that date.

The newsletter is where that re-check goes out: a short note when the terms are in force, and a correction if Apple's published rates differ from the tables here. The signup on this guide is that list. It is not a prompt to migrate payments before you have read the license agreement.

## Source checks
Checked Sep 24, 2026, against Apple only:

- Apple Developer news, Aug 18, 2026: https://developer.apple.com/news/?id=gmws0jgp
- Changes for apps in the European Union: https://developer.apple.com/support/apps-in-the-eu/
- Payment options on the App Store in the EU: https://developer.apple.com/support/payment-options-on-the-app-store-in-the-eu
- Alternative Terms Addendum for Apps in the EU (initial acquisition fee, store services fee, In-App Purchase schedule in section 3.4, Core Technology Fee in section 4.1): https://developer.apple.com/contact/request/download/external/Alternative-EU-Terms-Addendum.pdf

No vendor blog is a source for a rate in this guide. Payment-processor fees, tax, and the share of sales inside each window are n/a.

Last checked: Sep 24, 2026.

## Related tools and guides
- Read [why Stripe is not a RevenueCat alternative on iOS](/guides/why-stripe-is-not-a-revenuecat-alternative-ios) before treating an EU payment option as a StoreKit replacement.
- Start from the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) if the purchase path is still In-App Purchase.
- Compare [RevenueCat alternatives](/comparisons/revenuecat-alternatives) when the job is entitlements or paywall iteration, not Apple's commission.
- Review the [monetization category](/categories/monetization).
