# Refresh — Codemagic tool page

**Mode:** refresh-existing · **URL (unchanged):** `https://indieappstack.com/tools/codemagic`
**Target query:** `codemagic pricing` · **Intent:** pricing / decision
**Pillar:** The Price Ledger · **Funnel stage:** Decision · **Goal:** Non-branded organic + AI-cited sessions
**CTA (single):** Explore the dev-productivity category → `/categories/dev-productivity`
**Draft date:** 2026-08-05 · **All prices checked:** 2026-08-05

---

## How to publish this

This page is database-backed, not a Markdown file. The fields below map to `scripts/tool-content.json` (key `codemagic`) and the `Codemagic` object in `scripts/seed-database.mjs` (~line 689). Publishing is: edit the fields → seed the hosted Supabase → redeploy (pages are SSG, so a redeploy is required for the new HTML).

Two things are already handled by the platform and need no work:

- **Title tag** is templated: `Codemagic review, pricing, alternatives, and fit | IndieAppStack`. It already carries "pricing".
- **`FAQPage` schema** auto-emits from any `## Frequently asked questions` H2 with two or more `###` questions (`lib/faq-schema.ts`). This draft ships five, so the schema fires. `SoftwareApplication` + `BreadcrumbList` already emit from the route.

**Meta description** is derived, not authored: `${tagline} Pricing checked ${lastChecked}.` So the `tagline` field below _is_ the meta description. It is written to fit that template within 155 characters.

---

## Field 1 — `tagline`

Feeds the lede paragraph under the H1 **and** the meta description. Kept to 83 characters so the templated description lands at 112.

```
Hosted mobile CI/CD with 500 free macOS minutes a month, then $0.095 per M2 minute.
```

Resulting meta description (112 chars):
`Hosted mobile CI/CD with 500 free macOS minutes a month, then $0.095 per M2 minute. Pricing checked Aug 5, 2026.`

## Field 2 — `pricing_summary`

Feeds the sidebar Decision snapshot.

```
First 500 macOS M2 build minutes each month are free, then $0.095 per M2 minute and $0.045 per Linux minute on the same plan, with fixed annual plans from $3,990 and enterprise from $12,000.
```

## Field 3 — `pricing_last_checked`

```
2026-08-05
```

## Field 4 — `best_for`

```json
[
  "Cross-platform mobile CI/CD",
  "Solo apps that stay inside 500 build minutes a month",
  "TestFlight and App Store uploads"
]
```

## Field 5 — `not_good_for`

```json
[
  "iOS-only apps already covered by Xcode Cloud's included hours",
  "Rare releases a local fastlane run already handles",
  "Teams needing a second concurrent build or a second seat"
]
```

## Field 6 — `pros`

```json
[
  "The free 500 macOS M2 minutes per month let a solo developer run real iOS builds and TestFlight uploads at no cost.",
  "Pay as you go bills per minute, so an app with a slow release cadence does not pay for idle capacity.",
  "Linux and Windows minutes cost $0.045 against $0.095 on the M2 Mac, so non-Apple work in a cross-platform pipeline is roughly half price.",
  "Configuration lives in a codemagic.yaml file in your repository, so the pipeline is version-controlled alongside the app.",
  "It can call fastlane lanes, so existing local automation carries into CI without a rewrite."
]
```

## Field 7 — `cons`

```json
[
  "Past the free 500 minutes, macOS minutes are metered at $0.095 each on the M2, so a slow build on every push turns into real money.",
  "The free plan is capped at one concurrency and one team member, and it cannot buy more — extra concurrency requires moving to pay as you go at $49 each.",
  "An iOS-only developer already pays for the Apple Developer Program, which includes 25 Xcode Cloud compute hours a month — three times Codemagic's free minute allowance.",
  "Fixed annual plans start at $3,990, which only pays off above roughly 67 hours of M2 build time a month.",
  "iOS code signing on hosted machines takes deliberate setup before the first green build."
]
```

## Field 8 — `body_markdown`

> Uses the site's Markdown dialect: `##`/`###` headings, `:::comparison … :::` tables, `- ` lists, `> [!NOTE]` callouts, `![alt](/local-path)` images. Internal links are root-relative.

```markdown
## Short answer

Codemagic gives every account 500 free macOS M2 build minutes a month, then charges $0.095 per M2 minute on that same plan, with Linux minutes at $0.045 and fixed annual plans from $3,990 (checked Aug 5, 2026). For a solo iOS developer the allowance covers a light release cadence — Xcode Cloud's 25 included compute hours cover more.

## What you are actually renting

Codemagic is hosted mobile CI/CD. It runs your builds, tests, code signing, and store uploads on managed macOS and Linux machines, so you do not maintain a build server or keep a Mac awake for releases. For a solo developer the product is simple to describe: you are renting a Mac by the minute.

That framing matters more than the feature list, because every pricing decision below follows from it. A build minute is wall-clock time on a machine, not compute you can optimise away with a faster laptop. A ten-minute build that runs on every push to a busy branch is a recurring bill, and the fastest way to cut a Codemagic invoice is to make the build shorter or run it less often — not to move to a cheaper plan.

## What does Codemagic cost?

Four ways to pay: a free monthly allowance, per-minute billing, a fixed annual fee, and enterprise.

:::comparison Codemagic plans (checked Aug 5, 2026)

| Plan          | Price                                                                                           | What is included                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free          | $0, then standard per-minute rates                                                              | First 500 Mac mini M2 minutes each month at $0, then $0.095 each. Unlimited applications, 1 concurrency, 1 team member, 30-day artifact retention |
| Pay as you go | $0.045 per minute on Linux X2 and Windows, $0.095 on the Mac mini M2, $0.114 on the Mac mini M4 | Minutes billed per minute, unlimited team members, 1 concurrency included and up to 3 at $49 each                                                 |
| Fixed price   | From $3,990 per year on the M2, $5,400 on the M4, $9,000 on the Mac Studio M4 Max               | Unlimited minutes on that machine, 3 concurrent builds, extra concurrency from $1,500 per year                                                    |
| Enterprise    | From $12,000 per year                                                                           | Custom machines and regions, SSO, dedicated support                                                                                               |
| :::           |

The free allowance is the number that matters for a solo app, so be precise about what it is. Codemagic's own plan comparison lists the free Mac mini M2 rate as "first 500 / month - $0, then $0.095 / minute" (checked Aug 5, 2026), and inside the app the allowance appears as a "Free macOS minutes personal use" counter that runs to 500. So the 500 minutes are the first 500 of the month rather than a separate product you graduate out of, and the rate past them is the standard one.

Going past the allowance is still a deliberate step, not a silent overage. The CI/CD card in the app carries an **Enable subscription** action, so continuing means turning billing on. At a fifteen-minute iOS build the allowance is about 33 builds a month — enough for a weekly TestFlight and a release before that decision arrives.

Prices last checked Aug 5, 2026, from [codemagic.io/pricing](https://codemagic.io/pricing/). Confirm before you commit spend — per-minute rates and machine generations both move.

## Codemagic, Xcode Cloud, or Bitrise: where does the cost cross over?

For a solo iOS developer this is the only comparison that decides anything, and it is a cost question, not a features question. Here are the list prices side by side.

:::comparison iOS CI at list price (checked Aug 5, 2026)

| Path                         | List price                                            | What that buys per month                        | Where it wins                                      |
| ---------------------------- | ----------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| Xcode Cloud, included        | $0 on top of the $99 per year Apple Developer Program | 25 compute hours                                | iOS-only, light to moderate cadence                |
| Codemagic free plan          | $0 up to 500 M2 minutes, then $0.095 each             | 500 free minutes, 1 concurrency, 1 seat         | A solo developer at almost any realistic cadence   |
| Codemagic pay as you go      | $0.095 per M2 minute from the first minute            | Exactly the minutes you use, no allowance       | Teams needing unlimited seats or extra concurrency |
| Xcode Cloud, first paid tier | $49.99 per month                                      | 100 compute hours                               | Steady iOS builds and parallel test matrices       |
| Bitrise Starter              | $89 per month billed annually, $99 monthly            | Unlimited builds, up to 3 concurrent            | Predictable spend at a heavier cadence             |
| Codemagic Fixed M2           | $3,990 per year, or $332.50 per month                 | Unlimited M2 and Linux X2 minutes, 3 concurrent | High volume only                                   |

A solo developer stays on the free plan and pays overage; the pay-as-you-go plan exists for unlimited seats and extra concurrency, which a one-person app does not need.

:::

Add the 500 free minutes to the subscription divided by the per-minute rate, and the crossover points fall out. Codemagic costs less than:

- **Xcode Cloud's $49.99 tier** until about **1,026 minutes a month** — 500 free, plus the 526 minutes that $49.99 buys at $0.095. That is roughly 17 hours of building.
- **Bitrise Starter at $89** billed annually until about **1,437 minutes a month**, roughly 24 hours.
- **Codemagic's own Fixed M2 plan** ($332.50 a month) until **4,000 minutes a month**, about 67 hours. A solo app does not reach that without a broken pipeline.

Those thresholds are high. At a fifteen-minute build, 1,026 minutes is 68 builds a month — more than two a day, every day. Most solo apps never get there, which is the honest headline: for one developer, Codemagic's metered billing is usually the cheaper structure, and the reason to leave it is rarely price.

Two honest caveats, because the units are not the same thing.

**Compute hours are not build minutes.** Apple bills Xcode Cloud in compute hours and runs tests in parallel, so parallel work consumes the allowance faster than the wall clock suggests — Apple's own example is five twelve-minute tests adding up to one compute hour. A minute-for-minute reading overstates Apple's advantage as soon as you run a test matrix.

**Bitrise prices its free tier in credits, not minutes.** Hobby includes 300 build credits a month, and the credit-per-minute rate for each machine is not stated on the pricing page (checked Aug 5, 2026), so the free tiers are not directly comparable. Bitrise's paid Starter plan is the honest comparator, because "unlimited builds up to 3 concurrent" needs no conversion.

> [!NOTE] The one-line verdict
> For iOS-only work, start with the Xcode Cloud hours you already pay for. Choose Codemagic when the app is cross-platform, when the cadence is irregular enough that per-minute billing beats a subscription, or when you want the pipeline defined in a file in the repository.

## When should you not use Codemagic?

Four cases where the answer is no, and one of them is the common one.

- **You ship iOS only and already pay the $99 Apple Developer Program fee.** That membership includes 25 Xcode Cloud compute hours a month — three times Codemagic's 500 free minutes in raw units, on Apple's own machines, inside Xcode. Spending money on hosted CI before exhausting an allowance you have already bought is the most expensive mistake on this page.
- **You release rarely and a local [fastlane](/tools/fastlane) run already works.** Hosted CI is overhead you do not need yet. The cheapest CI is the one you have not rented.
- **Your build is slow and you push often.** As a hypothetical: ten pushes a day of a twenty-minute build is 200 minutes a day, so the free 500 minutes are gone before the third day and every day after costs about $19 at $0.095 a minute. Cache dependencies and gate the pipeline on branches before you scale spend.
- **You need parallel builds on a budget.** The free plan is one concurrency and cannot buy more, and extra concurrency on pay as you go is $49 each. [Bitrise](/tools/bitrise) Starter's three concurrent builds at $89 a month billed annually is the cleaner buy at that point.

If Codemagic is not the fit, the rest of the [dev-productivity category](/categories/dev-productivity) covers the CI and release-automation tools reviewed here.

## Setup and integration

Codemagic supports native iOS and Android, Flutter, React Native, Ionic, Unity, and MAUI (checked Aug 5, 2026). You connect a Git repository and define builds in a codemagic.yaml file or the workflow editor; the iOS path covers signing with an App Store Connect API key, building the archive, and uploading to TestFlight or the App Store. Expect a moderate first setup rather than a five-minute one.

Two gotchas are worth planning for. iOS code signing is the usual stumbling block, so set up the App Store Connect API key and certificates early. Build minutes on macOS machines are metered, so cache dependencies and avoid rebuilding on every trivial commit — on pay as you go that is the difference between a rounding error and a subscription.

Codemagic appears as a release-automation alternative in the [indie iOS stack archetypes](/stacks/subscription-consumer-app), where fastlane is the default and hosted CI is the upgrade path.

## Frequently asked questions

### How much does Codemagic cost per build?

Nothing, until you pass the free allowance. The first 500 Mac mini M2 minutes each month cost $0; after that you are billed per minute, not per build, so the cost is your build length times the machine rate: $0.095 per minute on the Mac mini M2, $0.114 on the M4, and $0.045 on Linux X2 or Windows (checked Aug 5, 2026). A fifteen-minute iOS build past the allowance is about $1.43.

### Is the free tier enough for one app?

For a light cadence, yes — and passing it is not a cliff. The free plan includes 500 macOS M2 build minutes a month, one concurrency, and one team member (checked Aug 5, 2026), which is roughly 33 builds at fifteen minutes each. Past 500 the rate is the standard $0.095 a minute, so the cost rises gradually rather than jumping to a new tier — though you do have to enable a subscription in the app to keep building. What forces a real plan change is needing a second concurrent build or a second seat, neither of which the free plan allows.

### Is Codemagic cheaper than Xcode Cloud?

For iOS-only work Apple is usually cheaper, because its included allowance is larger. The Apple Developer Program at $99 a year includes 25 Xcode Cloud compute hours a month, which is three times Codemagic's 500 free minutes in raw units. Codemagic only passes Xcode Cloud's $49.99 tier at about 1,026 minutes a month. So Apple wins on the free allowance, Codemagic wins on cross-platform builds Xcode Cloud does not run at all, and past roughly 1,026 minutes of monthly iOS building the subscription is the cheaper shape.

### How is Codemagic different from Bitrise?

Both are hosted mobile CI/CD with macOS machines and store deployment. [Bitrise](/tools/bitrise) uses a step-based visual workflow and prices in build credits and monthly plans, while Codemagic centers on a YAML config with a free monthly minute allowance and per-minute billing. Codemagic is usually the lighter start for a solo developer; Bitrise Starter's unlimited builds at $89 a month billed annually is the better shape once the cadence is heavy.

### Do I still need fastlane with Codemagic?

Not necessarily, but they pair well. Codemagic can sign, build, and upload on its own, yet many pipelines call [fastlane](/tools/fastlane) lanes for finer control over metadata, screenshots, or signing. Running the same lanes locally and in CI keeps behavior consistent.
```

---

## Fact ledger

Every number in the draft, typed and sourced. Nothing was written from memory.

| Claim as written                                                                                                                                                       | Type              | Provenance    | Source (retrieved)                                                                                                                                                                                                                                                                  | Status   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Free plan Mac mini M2 rate: "first 500 / month - $0, then $0.095 / minute"                                                                                             | sourced           | measured      | codemagic.io/pricing plan-comparison table, read from the live DOM (2026-08-05)                                                                                                                                                                                                     | verified |
| Free plan: 500 M2 minutes/month, unlimited applications, 1 concurrency, 1 team member, 30-day artifact retention, 3GB cache/build, no additional concurrency available | sourced           | measured      | codemagic.io/pricing (2026-08-05); screenshot captured                                                                                                                                                                                                                              | verified |
| In-app the allowance reads "Free macOS minutes personal use — 0 / 500", with an "Enable subscription" action on the CI/CD card                                         | brand-fact        | user-provided | screenshot from the owner's signed-in Codemagic account (2026-08-05). Counter reads 0, so it evidences the meter and the 500 ceiling, not consumption in action                                                                                                                     | verified |
| Pay as you go: $0.095/min M2, $0.114/min M4, $0.045/min Linux X2 and Windows                                                                                           | sourced           | measured      | codemagic.io/pricing (2026-08-05)                                                                                                                                                                                                                                                   | verified |
| Extra concurrency $49 each, up to 3, on pay as you go                                                                                                                  | sourced           | measured      | codemagic.io/pricing (2026-08-05)                                                                                                                                                                                                                                                   | verified |
| Fixed plans: $3,990/yr M2, $5,400/yr M4, $9,000/yr Mac Studio M4 Max; extra concurrency from $1,500/yr                                                                 | sourced           | measured      | codemagic.io/pricing (2026-08-05)                                                                                                                                                                                                                                                   | verified |
| Enterprise from $12,000/yr, SSO, custom regions                                                                                                                        | sourced           | measured      | codemagic.io/pricing (2026-08-05)                                                                                                                                                                                                                                                   | verified |
| Xcode Cloud: 25 compute hours/month included with the Apple Developer Program                                                                                          | sourced           | measured      | developer.apple.com/xcode-cloud/ (2026-08-05)                                                                                                                                                                                                                                       | verified |
| Xcode Cloud paid tiers: 100h $49.99, 250h $99.99, 1,000h $399.99, 10,000h $3,999.99 per month                                                                          | sourced           | measured      | developer.apple.com/xcode-cloud/ (2026-08-05)                                                                                                                                                                                                                                       | verified |
| Apple's compute-hour example: five 12-minute tests equal one compute hour                                                                                              | sourced           | measured      | developer.apple.com/xcode-cloud/ (2026-08-05)                                                                                                                                                                                                                                       | verified |
| Apple Developer Program is $99/year                                                                                                                                    | sourced           | measured      | developer.apple.com/programs/ (2026-08-05)                                                                                                                                                                                                                                          | verified |
| Bitrise Starter: $89/mo billed annually, $99/mo monthly, unlimited builds up to 3 concurrent                                                                           | sourced           | measured      | bitrise.io/pricing (2026-08-05)                                                                                                                                                                                                                                                     | verified |
| Bitrise Hobby: 300 build credits/month                                                                                                                                 | sourced           | measured      | bitrise.io/pricing (2026-08-05)                                                                                                                                                                                                                                                     | verified |
| "The credit-per-minute rate for each machine is not stated on the pricing page (checked Aug 5, 2026)"                                                                  | sourced           | measured      | bitrise.io/pricing (2026-08-05); docs.bitrise.io build-machine-types lists specs with no credit rate; the credit-based-pricing doc URL 404'd. **Framing accepted by the owner 2026-08-05** — the sentence describes what the page does and does not state, which is itself verified | verified |
| Crossover arithmetic: 500 + $49.99 ÷ $0.095 ≈ 1,026 min; 500 + $89 ÷ $0.095 ≈ 1,437 min; 500 + $332.50 ÷ $0.095 = 4,000 min                                            | sourced (derived) | measured      | arithmetic on the rows above, including the 500 free minutes; shown in-text                                                                                                                                                                                                         | verified |
| "500 minutes is about 33 builds" and "a 15-minute M2 build is about $1.43"                                                                                             | sourced (derived) | measured      | 500 ÷ 15 = 33.3; 15 × $0.095 = $1.425                                                                                                                                                                                                                                               | verified |
| "10 pushes a day of a 20-minute build costs about $19 a day past the allowance"                                                                                        | illustrative      | n/a           | labelled "As a hypothetical" in-text; 20 × 10 × $0.095 = $19.00                                                                                                                                                                                                                     | verified |
| Codemagic supports native iOS/Android, Flutter, React Native, Ionic, Unity, and MAUI; configuration via codemagic.yaml or the workflow editor                          | brand-fact        | measured      | codemagic.io homepage (2026-08-05) — re-verified, and the list was corrected: Ionic and MAUI were missing from the live page's copy                                                                                                                                                 | verified |
| iOS signing uses an App Store Connect API key                                                                                                                          | brand-fact        | measured      | retained from the live page, checked 2026-06-29; a stable product mechanism, not a price or a superlative                                                                                                                                                                           | verified |
| ~~"Roughly an afternoon for a working iOS pipeline"~~ — **cut 2026-08-05**                                                                                             | unverified        | n/a           | removed on the owner's decision; no first-hand test behind it, and it sat close to the ban on fake hands-on claims. Replaced with "a moderate first setup rather than a five-minute one", which asserts no measurement                                                              | resolved |
| Codemagic listed as a release-automation alternative in the stack archetypes                                                                                           | brand-fact        | measured      | config/indie-ios-stacks.json (2026-08-05)                                                                                                                                                                                                                                           | verified |

### Open placeholders (0) — all resolved 2026-08-05

Nothing is outstanding. The three that were open closed as follows:

1. **Whether the 500 free minutes carry onto pay-as-you-go** — _resolved by evidence._ The plan-comparison table reads `first 500 / month - $0, then $0.095 / minute` for the Free plan's M2 machines. Every crossover figure was recalculated; the in-app meter capture corroborates the 500 ceiling and added the `Enable subscription` nuance.
2. **The Bitrise credit rate** — _framing accepted by the owner._ The sentence states what Bitrise's pricing page does and does not publish, which is verified in itself. No conversion is asserted.
3. **The "roughly an afternoon" setup estimate** — _cut on the owner's decision._ Replaced with "a moderate first setup rather than a five-minute one", which claims no measurement. While closing this, the retained platform list was re-verified and found **wrong**: it omitted Ionic and MAUI. Corrected and re-dated.

**Closed 2026-08-05 during the creative-studio run:** the question of whether Codemagic's 500 free minutes carry onto pay-as-you-go is resolved. Reading the plan-comparison table from the live DOM showed the Free plan's Mac mini M2 row as `first 500 / month - $0, then $0.095 / minute` — the allowance is the first 500 minutes of the free plan itself, not a separate tier you graduate out of. Every crossover figure in this draft was recalculated on that basis.

---

## Asset requests

**Status after the creative-studio run (2026-08-05): 4 produced, 0 outstanding.**

| Asset                       | Status               | Where it is                                                                                                                                                                              |
| --------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cost-crossover chart        | **produced**         | `output/indieappstack/assets/ios-ci-cost-crossover-aug-2026.svg` — 1200×675                                                                                                              |
| Free-tier card screenshot   | **captured**         | `output/indieappstack/assets/codemagic-free-tier-500-macos-minutes.png` — 1200×411, light theme, signed out                                                                              |
| Pay-as-you-go rates card    | **captured** (bonus) | `output/indieappstack/assets/codemagic-pay-as-you-go-rates.png` — 900×2004; makes the three per-minute rates checkable                                                                   |
| Free-minutes meter (in-app) | **captured**         | `output/indieappstack/assets/codemagic-free-minutes-meter.png` — 1200×223 slim strip, owner-supplied from the signed-in dashboard. Full card also kept as `codemagic-cicd-card-full.jpg` |

All three produced assets must be copied into `public/` before the copy can reference them: the body Markdown dialect only accepts root-relative image paths.

Creative review package: https://claude.ai/code/artifact/88b496d6-e545-48c1-9435-30bcf69aff7f

Two notes on the chart. Its palette needed a documented deviation — the brand Pine `#2c5f4f` fails the data-mark chroma floor (OKLCH C 0.062 against a 0.10 floor) and reads gray at a 2px line weight, so the mark uses `#2f8f6d`, same hue one step up. And the curve is **kinked at 500 minutes**, because capturing the pricing page resolved the free-allowance question — see the closed placeholder below.

### Original requests

| #                                  | Type       | Sourcing              | Spec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Alt text                                                                            | Filename                                    | Placement                                |
| ---------------------------------- | ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| 1                                  | screenshot | **capture-or-source** | Codemagic's pricing page free-tier card showing the 500 Mac mini M2 minutes, 1 concurrency, 1 team member. Real product — capture or source from the vendor, do **NOT** generate. Proves the load-bearing free-tier number and is the verifiability layer for the Price Ledger pillar.                                                                                                                                                                                                                            | Codemagic free plan card showing 500 macOS M2 build minutes per month               | `codemagic-free-tier-500-macos-minutes.png` | After H2 "What does Codemagic cost?"     |
| 2 _(fulfilled — see status above)_ | screenshot | **capture-or-source** | Codemagic's build or billing view showing per-build minute consumption against the monthly allowance. Real product — capture or source, do **NOT** generate. Supports "minutes are metered wall-clock time".                                                                                                                                                                                                                                                                                                      | Codemagic billing view showing build minutes consumed against the monthly allowance | `codemagic-build-minutes-usage.png`         | After H2 "What you are actually renting" |
| 3                                  | chart      | generate              | _Superseded by what was produced._ As requested: cost-crossover line chart marking the crossings against the Xcode Cloud and Bitrise Starter prices. As delivered: the Codemagic line is kinked at the 500-minute free allowance and the crossings are at 1,026 and 1,437 minutes. **Final alt text:** "Chart showing Codemagic's cost staying at zero for the first 500 macOS build minutes each month, then rising to cross the Xcode Cloud and Bitrise Starter subscription prices at 1,026 and 1,437 minutes" | see left                                                                            | `ios-ci-cost-crossover-aug-2026.svg`        | After the crossover arithmetic list      |

Images in `body_markdown` use `![alt](/local-path "optional caption")` and the `src` must be a root-relative path, so assets need to land in `public/` before the copy references them. The tool page already generates its own OpenGraph image from `app/(public)/tools/[slug]/opengraph-image.tsx`, so no social card is needed.

---

## SEO / GEO scorecard

| Lane        | Verdict | Notes                                                                                                                                                                                                                                                                                                                    |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| On-page     | Pass    | Slug preserved. Query in the templated title tag, the new meta description, the "What does Codemagic cost?" H2, and the first line of the answer block. No stuffing.                                                                                                                                                     |
| GEO         | Pass    | 58-word extractable answer in the brand's `## Short answer` block; three question-shaped H2s; two comparison tables; five FAQ answers each standalone; `FAQPage` schema fires automatically at five questions; original derived crossover figures (1,026 / 1,437 / 4,000 minutes) that an engine can lift and attribute. |
| Readability | Pass    | Grade 9–10 target, not measured. Short paragraphs, front-loaded verdicts, no contractions, Oxford comma, numerals, dates as "Aug 5, 2026".                                                                                                                                                                               |
| E-E-A-T     | Pass    | Every price dated and linked; caveats stated rather than smoothed over; no fake hands-on claim anywhere. Three real captures of the product back the load-bearing numbers, including one from inside the app. The last soft claim — the inherited "afternoon" estimate — was cut.                                        |

**Checklist**

- [x] Extractable answer up top, 40–60 words (58)
- [x] Question-shaped H2s (3 of 7)
- [x] Comparison tables (2)
- [x] FAQ block with `FAQPage` schema (5 questions, auto-emitted)
- [x] Original quotable data (the crossover minute figures)
- [x] Internal links: `/tools/fastlane` ×2, `/tools/bitrise` ×2, `/categories/dev-productivity`, `/stacks/subscription-consumer-app`
- [x] External citation with retrieval date (codemagic.io/pricing)
- [x] Single CTA
- [x] Slug unchanged (refresh mode)
- [x] Every price carries a last-checked date
- [x] No banned claims — no superlatives, no invented prices, no fake hands-on, nothing about this site's own privacy posture
- [x] Zero open `[[verify]]` items → **Stage = Ready-to-schedule**

---

## What was kept vs. changed

**Kept** (it already earns 277 impressions — do not throw it away):

- The URL `/tools/codemagic` and the H1.
- The `## Setup and integration` section, near-verbatim.
- All three existing FAQ questions, updated with current dates.
- The existing internal links to `/tools/fastlane` and `/tools/bitrise`.
- The `:::comparison` plans table pattern, and the "confirm current numbers" honesty line.
- The core fit judgement: hosted CI is overhead if a local fastlane run is enough.

**Changed:**

- `tagline` rewritten to carry the price — this is the meta description, and the old one ("CI/CD for Flutter, React Native, native iOS, Android, and more.") spent the entire snippet on a platform list while the query was about cost.
- Added `## Short answer` with a 58-word extractable answer. The page previously opened by explaining what Codemagic is; a pricing query wants the number first.
- Pricing table rebuilt and re-sourced: three fixed tiers instead of one, the M4 rate added, artifact retention and seat limits added. **Two figures on the live page are now wrong** — it shows only the $3,990 M2 fixed plan and omits the M4 at $5,400 and the Mac Studio M4 Max at $9,000.
- New crossover section with the Xcode Cloud and Bitrise comparison the brief asked for, plus the two unit caveats. Thresholds are 1,026 and 1,437 minutes, computed with the 500 free minutes included — see editor note 1.
- New `## When should you not use Codemagic?` verdict section, replacing a single sentence buried in the intro.
- `not_good_for` replaced. It read "Teams that only deploy static websites" — off-audience filler for a site whose readers are all mobile developers. It now names the three real cases.
- Two new pricing-shaped FAQ questions, which also strengthens the `FAQPage` schema.
- `pricing_last_checked` moved 2026-07-19 → 2026-08-05.
- Body grows from roughly 600 to 1,356 words of prose (1,689 including the two tables).

## Editor notes

1. **Every crossover number in this draft changed on 2026-08-05, after the first pass.** Capturing the pricing page for the screenshots surfaced the plan-comparison row `first 500 / month - $0, then $0.095 / minute`. The first pass had modelled the free tier and pay-as-you-go as separate plans, so it put the crossovers at 526 and 937 minutes. They are actually at **1,026 and 1,437** — the 500 free minutes belong to the same plan you then pay overage on. This makes Codemagic look materially _better_ for a solo developer, and it is the reason the piece now says the reason to leave metered billing is rarely price. It is also a good argument for capturing the evidence early: the screenshot request found a factual error the prose research had missed.
2. **The strongest thing on this page is the crossover arithmetic**, and it is the reason to ship it: no vendor can publish "start with the Xcode Cloud hours you already pay for", and the 1,026 / 1,437 / 4,000-minute figures are original, checkable, and exactly the kind of line an AI answer engine can lift and attribute. That is the wedge the competitor scan called verifiability.
3. **The live page is factually stale, which raises the priority.** It lists one fixed plan at $3,990 and no M4 rate; Codemagic now publishes three fixed tiers and a $0.114 M4 minute. A page in the Price Ledger pillar carrying a stale price table is the worst possible failure mode for this brand, independent of the ranking upside.
4. **Placeholder 3 is the one with teeth.** "Roughly an afternoon for a working iOS pipeline" is inherited copy with no test behind it, and it sits close to the brand's ban on fake hands-on claims. Softening or cutting it is the safe call.
5. **The paired fastlane refresh (Oct 8) is where the CI cluster closes.** This draft links out to `/tools/fastlane` twice but there is no CI comparison page to link to yet — `cicd-for-solo-mobile-developers` exists only as a briefed row in the content plan, not a published URL, so nothing here links to it. When the fastlane page is refreshed, add reciprocal links and consider promoting that briefed comparison, since two dated CI cost pages would then support it.
6. **Maintenance cost is real and deliberate.** Putting a price in the `tagline` means the meta description goes stale when Codemagic re-prices. That is acceptable only because the templated "Pricing checked" date rides along with it and the rolling price-check ritual owns the refresh. If that ritual lapses, revert the tagline to a durable line.
7. **Measurement.** Baseline to beat, GSC 90 days to 2026-08-03: 277 impressions, 0 clicks, average position 13.63; `codemagic pricing` alone at 50 impressions and position 10.7. Watch position on `codemagic pricing` and first clicks. Because the page targets pricing intent with an answer block, also watch for AI-citation referrals rather than clicks alone.
8. **Sidebar CTA.** The page furniture includes a newsletter "Subscribe" in the sidebar. The body carries exactly one CTA — the dev-productivity category link — so there is no competing ask inside the copy.
9. **The citation link needs no disclosure.** `components/public/inline-markdown.tsx` renders any non-root-relative href as `target="_blank" rel="noreferrer"`, with no `nofollow`. That is correct here: Codemagic is not an affiliate program for this site (only Warp is live), so the link to `codemagic.io/pricing` is a plain source citation and the affiliate-disclosure rule does not apply. If Codemagic ever becomes an affiliate program, this link must move to a `/go/` redirect with `rel="sponsored nofollow"` and inline disclosure.

## Escalations

**None blocking as of 2026-08-05.** All three verifications are closed and all four assets exist. The only remaining action is publishing.

- **Assets are complete.** The owner supplied the in-app allowance meter from their signed-in account, closing the last request. One caveat carried forward: its counter reads `0 / 500`, so it proves the meter and the ceiling but not metering in action. If a month with real consumption is ever captured, it would be a straight upgrade.
- **Confirm the Bitrise credit rate** or accept the "not stated on the pricing page" framing as final (placeholder 1).
- **Decide on the "afternoon" estimate** — soften, cut, or substantiate (placeholder 2).

## Repurposing

| Derivative            | Channel      | Hook                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Long-form social post | LinkedIn / X | "Before you pay for mobile CI: the $99 Apple Developer Program you already bought includes 25 Xcode Cloud compute hours a month. Codemagic gives you 500 free minutes and then charges by the minute — it does not pass Apple's $49.99 tier until about 1,026 minutes a month. Here is where each one stops being the cheaper option." |
| Newsletter item       | Email        | "This month's price check: Codemagic added two fixed tiers and an M4 rate. Its crossover against Xcode Cloud sits at about 1,026 build minutes a month."                                                                                                                                                                               |
| Cluster feed          | Blog         | The dated crossover table drops straight into the Oct 8 fastlane refresh as the shared CI cost reference.                                                                                                                                                                                                                              |
