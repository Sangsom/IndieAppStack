# iOS 27 and your stack: what actually changed for a solo developer

**Slug:** ios-27-and-your-stack
**URL:** /guides/ios-27-and-your-stack
**SEO title:** iOS 27: what indie developers need to do
**SEO description:** iOS 27 shipped Sep 14, 2026. Most solo apps can wait. New uploads need the iOS 27 SDK in April 2027. Answer one question if you submit now.

## Short answer

iOS 27 reached customers on Sep 14, 2026. For a solo app already on the store, what indie developers need to do is usually nothing this month. New uploads must use the iOS 27 SDK starting April 2027. Submit before then only if you already planned an update, and answer Apple's social-media question when you do.

> [!NOTE] What this page will and will not do
> Every date below is copied from an Apple page, an Apple technote, or a vendor changelog, checked Sep 26, 2026. A day Apple does not publish is marked n/a. This is orientation for a one-person iOS app. It is not a feature tour, and it is not a prompt to rebuild.

![Three times to act on iOS 27: answer the social-media question only if you submit this month, adopt the scene-based life cycle before the first Xcode 27 build, and meet the iOS 27 SDK minimum in April 2027.](/content-visuals/articles/ios-27-solo-developer-decision.svg "This month is a questionnaire, not a rebuild. The SDK minimum for new uploads is April 2027. Checked Sep 26, 2026.")

## The checks that can matter before April

Two situations change the "nothing this month" answer. A third is a toolchain move you can schedule, not an outage.

**You are submitting an update in September 2026.** Apple's WWDC26 App Store guide says that starting September 2026 you must indicate whether the app or game includes social media capabilities in order to submit a new version or an update. Entertainment and Games Time Allowances follow the categories you already set. Social Media follows that questionnaire answer, including a minimum age rating of 13+ if you say the capability is on. If you are not submitting, the question does not block the build that is already on the store.

**You install Xcode 27.** Apple's SDK table lists Xcode 27 (build 27A266a, Sep 14, 2026) as requiring macOS Tahoe 26.6 or later. Its deployment range for upload is iOS 15 through iOS 27, watchOS 9 through watchOS 27, and macOS 12 through macOS 27. Xcode 26, which is still the minimum for uploads, already starts at iOS 15. An iPhone-only app on that toolchain does not gain a new phone floor by waiting. A watch app below watchOS 9, or a Mac app below macOS 12, meets the new floor on the first Xcode 27 build, not on Sep 14.

**The first binary you compile with the iOS 27 SDK.** Apple's documentation says that, starting in iOS 27, apps built with the latest SDK must use the scene-based life cycle or they fail to launch. An Apple Frameworks Engineer on the developer forums tied that requirement to the iOS 27 SDK: apps built against previous releases continue to work as they previously did. TN3192 also says that starting in iOS 27 and iPadOS 27, a launch screen is required for App Store submission. If the app already has one, that line is a check, not a project.

Until April 2027, the upload rule on Apple's upcoming-requirements page is still the one in force since Apr 28, 2026: Xcode 26 or later, using an iOS 26, iPadOS 26, tvOS 26, visionOS 26, or watchOS 26 SDK. You may upload an iOS 27 SDK build now. You do not have to.

## What changed in the store and purchase surface

The store changes that have a date are a questionnaire and a future SDK minimum. The purchase changes are real, and most of them do not have a day a customer can complete the new purchase.

![Store changes that have a date, and purchase options Apple has not given a calendar day.](/content-visuals/articles/ios-27-defer-timeline.svg "Social capabilities are required on the next submission from September 2026. The iOS 27 SDK minimum is April 2027. Volume Purchasing, Group Purchases, and Bundles do not have a published day. Checked Sep 26, 2026.")

| Change | What Apple says | When it binds a solo app |
| --- | --- | --- |
| Social media capabilities | Required in order to submit a new version or an update | September 2026, and only on that submission |
| SDK for new uploads | iOS and iPadOS apps must be built with the iOS 27 and iPadOS 27 SDK or later | April 2027 |
| Current upload minimum | Xcode 26 or later, iOS 26 SDK | In force since Apr 28, 2026 |
| Xcode 27 itself | Available as 27A266a; uploads of the release candidate opened Sep 9, 2026 | Optional until the April 2027 minimum |

On subscriptions, use Apple's words and stop where the day is missing.

- **Group Purchases and Volume Purchasing.** The WWDC26 App Store guide says Volume Purchasing subscriptions are coming this fall, and the Group Purchase option is coming later this year. The WWDC26 session on offering subscriptions to groups describes these as available for auto-renewable subscriptions that use StoreKit 2, on by default for most, and opted out for Family Sharing subscriptions. A calendar day when an organization can complete a volume purchase is n/a on the Apple pages checked for this guide. Secondary writeups that name a day in October are not used here.
- **Bundles and Suites.** A Bundle sells subscriptions that can also be bought alone. A Suite sells subscriptions that are not available standalone. Apple says more information on how to request them would come later, and the WWDC26 In-App Purchase session says the API can be tested in Xcode 27 with more details later in 2026. A date when the request form opened is n/a.
- **Monthly subscriptions with a 12-month commitment.** The same App Store guide marks these "Now available" on iOS 26.4, iPadOS 26.4, macOS Tahoe 26.4, tvOS 26.4, and visionOS 26.4 or later, except the United States and Singapore. That is not an iOS 27 task. App Store Connect's notes also record that the offer can be sold outside the United States and Singapore. Do not rebuild for it because iOS 27 shipped.
- **In-App Purchase review grouping.** Apple describes grouping In-App Purchases, including subscriptions, into one submission, with App Store Connect web and API support "coming later this summer." Whether that web flow is open on Sep 26, 2026 is n/a on the news posts checked here. It is an App Store Connect workflow, not an SDK migration.
- **Product page headers, search assets, and Asset Library.** The guide says they are coming this fall. The Sep 9, 2026 developer news post says the product page preview tool is coming soon. Preparing those assets is marketing work. It does not change the binary.

One purchase change is easy to mix up with this operating system release, and it is not one. EU App Store business terms take effect Oct 1, 2026. The commission arithmetic is on [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost). iOS 27 does not set those rates.

If the app sells auto-renewable subscriptions and you do not want seats offered to a group or an organization, open the subscription in App Store Connect and read the control before those options are on sale. That is an account check. It is not a reason to ship a new binary this week. The purchase path for a normal solo subscription app is still the one in the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app): App Store Connect owns the products, and a purchase layer such as [RevenueCat](/tools/revenuecat) owns entitlement truth.

## What you can safely defer, and for how long

Defer anything that does not block a submission you are already making, and does not fire on the SDK you are already using.

| Item | Safe until | Why it can wait |
| --- | --- | --- |
| Rebuilding with Xcode 27 | The first upload you choose to build with that SDK, and no later than April 2027 if you need to upload at all | Older SDK builds keep launching. Apple has not published a date that removes the binary already on the store. |
| Scene-based life cycle | That same first iOS 27 SDK build | The failure to launch is tied to the new SDK, not to a customer installing iOS 27. |
| Liquid Glass, Apple Intelligence, Foundation Models, Siri | When the product needs the feature | Apple's Sep 14, 2026 newsroom post describes them as customer features. A compatibility flag's removal date is n/a. Small Business Program access to Private Cloud Compute models, for apps under 2 million first-time downloads, is described on the WWDC26 App Store guide. It is optional. |
| On-Demand Resources | Plan it. Do not treat Sep 14 as an outage. | Deprecated starting in iOS 27. Apple says apps that use them continue to function in the near term. A shutdown date is n/a. |
| CarPlay video, new product-page headers, Bundles and Suites | When you are building that product | Not required for an app that does not offer them. |
| macOS 27 on Intel | Only if you ship a Mac app | Apple says macOS 27 is Apple silicon only, and that macOS 26 is the last release with Intel and Rosetta support. An iPhone app does not inherit that job. |

"In the near term" and "this fall" are Apple's phrases. They are not a promise that a deferred item stays harmless past April 2027. The hard date for a new upload is the SDK minimum. Put the scene-based life cycle on the calendar before that upload, not on this week's ship list, unless you are moving to Xcode 27 now.

## Which catalog tools shipped an update

"Shipped an update" here means a published release whose own notes name iOS 27 or Xcode 27. A normal weekly SDK release with no such line is not listed. Checked Sep 26, 2026.

| Tool | Release | Date | What the notes say |
| --- | --- | --- | --- |
| [RevenueCat](/tools/revenuecat) iOS SDK | 5.90.0 | Sep 17, 2026 | Fixes the original paywall footer layout on iOS 27 |
| RevenueCat iOS SDK, 4.x line | 4.44.3 | Aug 4, 2026 | Adds Xcode 27 support |
| [Sentry](/tools/sentry) Cocoa | 9.25.0 | Aug 5, 2026 | Raises the minimum to macOS 12 and watchOS 9 because Xcode 27 no longer supports earlier versions |

RevenueCat also shipped earlier build fixes while Xcode 27 was in beta: a compilation fix in 5.78.0 on Jun 8, 2026, and a crash fix for Xcode 27.0 beta 1 and beta 2 in 5.80.1 on Jul 2, 2026. If you are still on a 5.7x or 5.80.0 build and you open Xcode 27, move to 5.90.0 rather than treating the beta fixes as the current line. This page did not run those builds.

A published release whose notes name iOS 27 or Xcode 27 was not confirmed, in this check, for Superwall, Adapty, Qonversion, Firebase, TelemetryDeck, OneSignal, or Fastlane. The update date for those catalog tools is n/a. Firebase's July 2026 commits that mention Xcode 27 are continuous-integration work, including a changelog line that was rolled back on Jul 23, 2026. That is not counted as a shipped SDK update.

Sentry's change matters if the app also ships on Mac or watchOS below those new floors. An iPhone-only app that already deploys to iOS 15 or later does not have to bump Sentry because a customer installed iOS 27. Keep crash reporting in place either way. The setup steps are in the [crash reporting guide](/guides/crash-reporting-setup-indie-mobile-apps).

## Common questions

### Do I need to update my app for iOS 27 this month?

No, if the app is already on the store and you are not submitting an update. Customers can install iOS 27 on Sep 14, 2026 without a new binary from you. If you do submit in September 2026, answer the social media capabilities question first.

### When do new uploads have to use the iOS 27 SDK?

Starting April 2027. Until then, Apple's upcoming-requirements page still requires the iOS 26 SDK via Xcode 26 or later. You can upload an Xcode 27 build now. You do not have to.

### Will an app built with Xcode 26 fail to launch on iOS 27?

Apple's forums guidance says no. The scene-based life cycle requirement is enforced when you build with the iOS 27 SDK. Builds against previous SDKs continue to work as they did. The failure mode is the next toolchain, not the customer's update.

### What should a subscription app check?

Read the Group Purchases and Volume Purchasing setting before those options are on sale. Apple describes them as on by default for most StoreKit 2 auto-renewable subscriptions, with Family Sharing subscriptions opted out. A day when a customer can complete that purchase is n/a. The EU fee change on Oct 1, 2026 is a separate page.

## What to verify before you act

Three pages are enough. Read them before you schedule a migration.

- [App Store submissions now open, Sep 9, 2026](https://developer.apple.com/news/?id=k1mtkt1k): Xcode 27 release candidate uploads, the April 2027 SDK minimum, the social-media indication, and macOS 27 as Apple silicon only.
- [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/): the rule still in force, Xcode 26 or later since Apr 28, 2026.
- [WWDC26 App Store guide](https://developer.apple.com/wwdc26/guides/app-store/): Time Allowances, Volume Purchasing, Group Purchases, Bundles and Suites, and the 12-month commitment that is already available on iOS 26.4 outside the United States and Singapore.

Then check three facts only the account can show:

- Whether the next submission is this month. If it is not, the social-media question can wait.
- Whether the Mac that would run Xcode 27 is on macOS Tahoe 26.6 or later.
- Whether any target is below watchOS 9 or macOS 12. An iPhone target already at iOS 15 does not move.

## Re-check when a missing day gets a date

The dates above were checked on Sep 26, 2026. Re-open this page if Apple publishes a calendar day for Volume Purchasing, Group Purchases, the Bundles and Suites request, or a change to the April 2027 SDK minimum.

The newsletter is where that re-check goes out: a short note when a missing day becomes a date, and a correction if Apple's pages differ from the table here. The signup on this guide is that list. It is not a prompt to rebuild the app this week.

## Source checks

Checked Sep 26, 2026:

- Apple security note, iOS 27 released Sep 14, 2026: https://support.apple.com/en-us/149034
- Apple Newsroom, Sep 14, 2026: https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/
- Apple Developer releases, Xcode 27 (27A266a) on Sep 14, 2026, iOS 27.0 (24A437): https://developer.apple.com/news/releases/
- Apple Developer news, Sep 9, 2026: https://developer.apple.com/news/?id=k1mtkt1k
- Upcoming Requirements, Xcode 26 minimum since Apr 28, 2026: https://developer.apple.com/news/upcoming-requirements/
- Xcode SDK table, Xcode 27 on macOS Tahoe 26.6 or later, deployment iOS 15–27, watchOS 9–27, macOS 12–27: https://developer.apple.com/xcode/system-requirements/
- Scene-based life cycle, fail to launch when built with the latest SDK: https://developer.apple.com/documentation/updates
- Forums, requirement tied to the iOS 27 SDK: https://developer.apple.com/forums/thread/832787
- TN3192, launch screen required for submission starting in iOS 27, revision noted Jun 8, 2026: https://developer.apple.com/documentation/technotes/tn3192-Migrating-your-app-from-the-deprecated-UIRequiresFullScreen-key
- WWDC26 App Store guide: https://developer.apple.com/wwdc26/guides/app-store/
- WWDC26 session, groups and organizations: https://developer.apple.com/videos/play/wwdc2026/391/
- RevenueCat iOS changelog, 5.90.0 (Sep 17, 2026), 4.44.3 (Aug 4, 2026), 5.80.1 (Jul 2, 2026), 5.78.0 (Jun 8, 2026): https://github.com/RevenueCat/purchases-ios/blob/main/CHANGELOG.md
- Sentry Cocoa 9.25.0 (Aug 5, 2026): https://github.com/getsentry/sentry-cocoa/releases/tag/9.25.0

A calendar day for Volume Purchasing, Group Purchases, and the Bundles request is n/a. No vendor blog is a source for an Apple date.

Last checked: Sep 26, 2026.

## Related tools and guides

- Read [what the September 2026 App Store business terms cost](/guides/app-store-business-terms-2026-cost) for the Oct 1, 2026 EU fees. Those rates are not part of the iOS 27 SDK deadline.
- Start from the [subscription MVP stack guide](/guides/subscription-mvp-stack-solo-ios-app) if the purchase path is still In-App Purchase.
- Review [RevenueCat](/tools/revenuecat) when the iOS SDK should be on 5.90.0 or later before an Xcode 27 build.
- Keep [Sentry](/tools/sentry) on a release that can build with the Xcode you actually use. Setup steps are in the [crash reporting guide](/guides/crash-reporting-setup-indie-mobile-apps).
- Browse the [monetization category](/categories/monetization) for the purchase tools around that stack.
