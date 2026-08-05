---
brand: IndieAppStack
slug: indieappstack
domain: indieappstack.com
url: https://indieappstack.com
business_model: content/media (affiliate directory) — one affiliate program live (Warp); pre-revenue
created: 2026-07-18
refreshed: 2026-08-03
provenance_note: voice, visual identity & catalog facts re-verified against the live site on 2026-08-03 (measured); privacy/analytics guardrail, monetization status & Notion wiring user-provided; audit linked under links is from 2026-07-18 and predates the GA4 switch.

positioning:
  icp: "Solo / indie mobile app developers (primarily iOS) choosing tools and assembling a lean stack for a small app."
  usp: "A practical, source-checked field guide that tells you when a tool fits — and when it does not — for a solo mobile app."
  wedge: "Cross-vendor neutrality plus indie-specific curation: honest 'when not to use this' calls a vendor cannot credibly publish, head-to-head comparisons, six ready-made indie iOS stack archetypes, and a Stack Finder — vs vendor blogs, community UGC, and general SaaS directories."
  category: "Indie app-tooling directory / developer content, comparisons & guides."
  provenance: measured

voice:
  tone: [calm, plain-spoken, practical, honest, quietly-opinionated]
  reading_level: "Grade 9–10 / experienced solo-dev practitioner"
  point_of_view: "Imperative to the builder ('Choose the right tools…'); refers to the reader as a 'builder' or 'solo mobile developer', not 'users'."
  formality: "conversational-professional — no slang, no hype"
  contractions: false          # re-verified 2026-08-03: writes 'when it is not', 'do not', 'you do not operate yet' in full
  lexicon_use: ["field guide", "stack", "lean stack", "boring (as praise — 'keep the stack boring')", "fit / practical fit", "when to use / when not to use", "durable apps", "solo mobile developers", "indie", "source-checked", "last checked", "decision area", "tradeoffs visible", "owns / responsibility (each block has one job)", "Short answer (guide opener)", "ship / shipping", "verify before adopting"]
  lexicon_avoid: ["superlatives (best, #1, top, revolutionary, guaranteed)", "fake hands-on / 'we tested' claims", "invented pricing / prices without a source", "exclamation-driven marketing", "emoji", "generic SaaS buzzwords", "competitor disparagement", "privacy-first / cookieless positioning (see banned_claims)"]
  formatting: { oxford_comma: true, emoji: "none", numbers: "numerals (e.g. '4 tools'); dates as 'Jul 19, 2026'", pricing: "always with a last-checked date or source link" }
  byline: "Organization ('IndieAppStack') — the owner decided 2026-08-03 to stay anonymous. Do NOT propose named-author, Person-schema, personal-brand, or podcast/practitioner-feature work; that decision is settled. Substitute INSTITUTIONAL accountability instead: a public methodology page, a versioned correction log, and an open dataset whose git history is the audit trail."
  byline_provenance: user-provided
  examples:
    - "IndieAppStack organizes mobile app tools by use case, stage, platform, pricing model, and practical fit so builders can make faster stack decisions."   # explanatory
    - "For a solo iOS subscription MVP, keep the stack boring: App Store Connect owns the subscription products, RevenueCat owns purchase and entitlement truth, and the app owns the paywall and unlock decision."   # editorial / opinionated
    - "The lowest-risk backend is the one you do not operate yet."                                                                                            # aphoristic / persuasive
    - "A calm monthly note on useful app tools, pricing changes, and stack decisions for solo mobile developers."                                             # warm / brand
  provenance: derived-from-site

visual:
  accent: "#2c5f4f"            # Pine — dm-hub artifacts theme their --accent to this
  palette: ["#2c5f4f", "#9a6b23", "#20241f", "#fbfaf7", "#6e6a5e", "#e7e2d7"]   # pine, gold, ink, paper, muted, rule
  surface: "#ffffff"
  accent_soft: "#e8efea"       # pale pine tint
  danger: "#9e4434"            # brick red (used sparingly)
  fonts: { display: "Source Serif 4 (serif)", body: "Inter (sans)", label: "SF Mono (mono, uppercase labels)" }
  radii: { card: "7px", button: "6px", badge: "4px" }
  logo_url: "https://indieappstack.com/icon.svg"
  style_guide_url: "https://indieappstack.com/styleguide (noindex, internal)"
  provenance: measured        # re-extracted 2026-08-03 from live CSS :root and app/globals.css — unchanged since 2026-07-18

facts:
  - claim: "Positioned as 'a practical field guide for solo mobile developers choosing the tools, systems, and workflows behind durable apps.'"
    provenance: measured
    source: "indieappstack.com/about (last updated Jun 29, 2026)"
  - claim: "Organizes mobile app tools by use case, stage, platform, pricing model, and practical fit."
    provenance: measured
    source: "indieappstack.com/about"
  - claim: "Catalog: 28 published tool pages across 12 categories (Monetization, Paywalls, ASO, Analytics, Backend, Crash reporting, Push, Launch, Landing pages, Email/waitlists, Screenshots, Dev productivity). 26 are indexable; 2 (Braze, Emerge Tools) are deliberately noindexed as the weakest fits."
    provenance: measured
    source: "indieappstack.com/tools + sitemap.xml, 2026-08-03"
  - claim: "Content surface: 28 tool pages, 12 category hubs, 7 head-to-head comparisons, 10 guides, 6 indie iOS stack archetype pages, and a Stack Finder — 72 URLs in the sitemap."
    provenance: measured
    source: "sitemap.xml, 2026-08-03"
  - claim: "Editorial method: describes when a tool fits and when it does not; avoids fake hands-on claims and invented pricing; pricing carries a visible last-checked date."
    provenance: measured
    source: "indieappstack.com/about (Editorial approach); tool cards show 'Pricing checked Jul 19, 2026'"
  - claim: "Recommendations are editorial and based on fit for solo mobile developers; affiliate status does not decide whether a tool is included or recommended."
    provenance: measured
    source: "indieappstack.com/about + /affiliate-disclosure"
  - claim: "Analytics is Google Analytics 4 (gtag.js, G-Y7CVEVCJ7H) as the sole provider, env-gated via NEXT_PUBLIC_GA_MEASUREMENT_ID. GA4 sets first-party _ga cookies and currently runs without a consent banner. Plausible was retired 2026-07-20."
    provenance: measured
    source: "production HTML + docs/analytics.md + commit 167a7e6"
  - claim: "Built on Next.js with static generation (SSG); fully server-rendered HTML. Sitemap emits honest per-page lastmod; IndexNow submits to Bing/Yandex automatically on production deploys; the site is verified in Google Search Console via DNS TXT."
    provenance: measured
    source: "commits b764b6e, 0ac6acb, de32886; docs/search-console-setup.md"
  - claim: "Contact: info@indieappstack.com."
    provenance: measured
    source: "indieappstack.com/about"
  - claim: "One affiliate program is live: Warp (self-serve referral) via an active /go/warp redirect (302 → app.warp.dev/referral/L6LWW) with rel=sponsored nofollow and inline disclosure at the first CTA. RevenueCat is 'pending'; Framer, Appwrite, and Webflow remain 'not_applied'. No commission has been earned yet — the site is pre-revenue."
    provenance: user-provided
    source: "scripts/seed-database.mjs; live /go/ probe 2026-08-03; owner confirmation 2026-08-03"

banned_claims:
  - "Unsubstantiated superlatives — 'best', '#1', 'top', 'guaranteed' — unless provable and sourced."
  - "Fake hands-on / first-hand testing claims ('we tested', 'in our experience') that did not happen."
  - "Specific prices or tiers stated without a last-checked date or source link."
  - "Any implication that a tool is recommended because it pays a commission."
  - "Privacy-first / cookieless / 'no cookie banner' / 'no tracking' positioning of IndieAppStack itself — FALSE as of 2026-07-20. Banned until a consent banner + Google Consent Mode v2 ship. (Writing *about* privacy-friendly analytics tools such as TelemetryDeck is still fine — the ban is on claims about this site.)"
compliance_notes: "ANALYTICS/GDPR (live risk): GA4 runs without a consent banner and sets _ga cookies. EU regulators require opt-in before GA4 fires; analytics does not qualify for the ePrivacy Art.5(3) strictly-necessary exemption, and legitimate interest is not accepted in most member states. Two open follow-ups from docs/analytics.md: (1) the privacy policy should name GA4 and its cookies explicitly — it currently says only 'privacy-conscious analytics' and 'may use cookies'; (2) adopt a banner + Consent Mode v2, or accept the exposure knowingly. Never use the GA4 'Create event' UI (use the event wrapper in lib/analytics/client.ts). AFFILIATE: always disclose near monetized links; the /affiliate-disclosure page's description of sponsored-nofollow /go redirects is accurate for Warp — keep it in sync as more programs go live. Not a regulated (health/finance/legal) category; site legal pages self-describe as 'a practical baseline, not legal advice.' Comparisons must remain neutral — no competitor disparagement."

wiring:
  notion_project_url: "https://app.notion.com/p/domanov/IndieAppStack-398be5ec9ff680168238c7b841286e2b"
  notion_project_id: "398be5ec-9ff6-8016-8238-c7b841286e2b"
  content_calendar_ds: "bf0adf9e-d9a1-48a0-876c-0bd18edb7caf"   # Content Calendar DB 9317be2b-5c3a-492a-9baf-ced21fbfc0b2; 20 rows pushed 2026-08-03, tied to the IndieAppStack project
  metrics_db_id: "n/a"        # not yet created — next wiring step for performance-tracker
  metrics_db_ds: "n/a"
  metrics_db_url: "n/a"
  ga4_measurement_id: "G-Y7CVEVCJ7H"
  ga4_property_id: "properties/546213572"   # account a163602836; carried from the 2026-07-20 setup session — confirm in GA4 Admin before performance-tracker relies on it
  gsc_site_url: "https://indieappstack.com/"
  provenance: user-provided

links:
  latest_audit: "dm_hub/skills/digital-presence-audit/output/indieappstack-audit-2026-07-18.html"
  latest_audit_artifact: "https://claude.ai/code/artifact/03b7c68d-675f-4ff2-b330-9e8e9e4e1fd6"
  latest_audit_note: "2026-07-18 — predates the GA4 switch and the comparison/stacks clusters; re-run digital-presence-audit for a current baseline."
  latest_competitors: "output/indieappstack-competitors-2026-08-03.html"
  latest_competitors_artifact: "https://claude.ai/code/artifact/0b73e204-cfa0-488f-ac6e-755f5c53dd75"
  latest_competitors_note: "2026-08-03 — wedge revised: neutrality is contested (BuildMVPFast occupies the same quadrant); the defensible differentiator is VERIFIABILITY (dated, sourced, auditable pricing + named authorship). Do not re-state 'honest when-not-to-use' as unique without the verifiability layer."
  latest_goals: "n/a — working set only, set inside the 2026-08-03 strategy: North Star = non-branded organic + AI-cited sessions; sequence authority → traffic → revenue. Run smart-goals to formalise."
  latest_strategy: "output/indieappstack-strategy-2026-08-03.html"
  latest_strategy_artifact: "https://claude.ai/code/artifact/8310c256-c313-4ec5-9246-456515c2bbf9"
  latest_strategy_note: "2026-08-03 — budget basis is $0 cash / 6–12 h per week, so allocation is in HOURS not dollars. Core = content + SEO/GEO (65%), bet = earned/PR (25%), experiment = email (10%). Organic social and paid media deliberately unfunded. Spine: one rolling price-check ritual feeds four channels."
  brand_book_artifact: "https://claude.ai/code/artifact/ce79aa1c-b454-4f68-989a-26b6afd180e3"
  latest_content_calendar: "output/indieappstack-content-calendar-2026-08-03.html"
  latest_content_calendar_json: "output/indieappstack-content-calendar-2026-08-03.json"
  latest_content_calendar_artifact: "https://claude.ai/code/artifact/1bfd2e72-e384-42aa-b461-62d645a8f6d8"
  latest_content_calendar_note: "Aug–Oct 2026, 20 items. Cadence 2 new + 4 refreshes + 1 newsletter per month (user-confirmed). Pillars: The Price Ledger, When Not To Buy, Correct The Record, The Lean Stack. Refresh ordering is GSC-provisional pending a Search Console export."
---

# IndieAppStack — Brand Profile

*The durable account file. Every dm-hub skill reads this as its highest-priority input, so voice, facts, guardrails, colours, and wiring stay consistent across the whole team. Re-run `brand-setup` to refresh when the brand drifts.*

## Who this brand is

**IndieAppStack** is a practical field guide for **solo / indie mobile app developers** — primarily iOS — deciding which tools to use and how to assemble a lean, durable stack. It organizes app tools by use case, stage, platform, pricing model, and practical fit, and publishes tool profiles, category hubs, head-to-head comparisons, guides, ready-made stack archetypes, and a Stack Finder. The business model is **content/media with affiliate monetization**: one program is live (Warp), and the site is **pre-revenue**.

Its defensible **wedge** is cross-vendor neutrality *plus* indie specificity: the honest "when this tool is *not* the right fit" calls a vendor's own blog cannot credibly make, head-to-head comparisons, six opinionated stack archetypes, and a Stack Finder — against a landscape of vendor blogs (RevenueCat, Adapty, Superwall), community UGC (Reddit, Indie Hackers), general SaaS directories, and a growing tier of AI-generated "alternatives" listicles. Category scan (2026-08-03) confirms the wedge is still open: the competing comparison content is overwhelmingly vendor-adjacent or thin affiliate SEO, and almost none of it says *when not to buy*.

## What changed since the last refresh (2026-07-18 → 2026-08-03)

28 commits. Materially:

- **Analytics replaced.** Plausible retired 2026-07-20; **GA4 is now the sole provider**. This invalidated the old "cookieless, no cookie banner" fact and created a live compliance guardrail — see *Never claim*.
- **The wedge got built.** A 7-page head-to-head **comparison cluster** and **6 indexable indie iOS stack archetype pages** shipped — the differentiation the profile previously described as a claim is now a shipped surface.
- **Catalog rebuilt.** 28 tool pages rewritten with unique substance; the 2 weakest (Braze, Emerge Tools) deliberately noindexed.
- **Indexing infrastructure.** Honest per-page sitemap `lastmod`, IndexNow on production deploys, GSC/Bing verification, www→apex 301, richer Organization/WebSite schema.
- **Unchanged:** positioning, voice, visual identity, and monetization status (Warp only).

## Voice & style — *derived from the brand's own copy*

The voice is **calm, plain-spoken, and practical** — an expert field guide that trusts the reader, states trade-offs plainly, and refuses hype. It addresses the builder directly with imperative verbs ("Choose", "Compare", "Pick", "Build"), and it deliberately writes in full ("when it is not", "do not", "you do not operate yet") rather than leaning on contractions — a quiet, editorial restraint.

**Sounds like**
- Measured and honest — describes fit, names the downside, tells you what to verify before adopting.
- Source-checked — pairs claims with a "last checked" date or a source; never states pricing from memory.
- Quietly opinionated — has a point of view, but earns it; no shouting, no exclamation marks.
- Concrete and lean — short, specific sentences aimed at someone shipping an app this month.
- **Pro-boring** — treats "boring" as the highest compliment a stack can earn.

**Never sounds like**
- Hype or superlatives ("the best", "#1", "revolutionary", "guaranteed").
- Fake first-hand experience ("we tested…") that did not happen.
- Invented prices or feature claims with no source.
- Generic SaaS marketing, emoji, or filler.

**Structural tells:** guides open with a **"Short answer"** block. Each stack layer "owns one job." Comparisons promise to make **"tradeoffs visible."** Articles carry both *Published* and *Last checked* dates.

**Calibration examples (verbatim from the site):**
> "IndieAppStack organizes mobile app tools by use case, stage, platform, pricing model, and practical fit so builders can make faster stack decisions."

> "For a solo iOS subscription MVP, keep the stack boring: App Store Connect owns the subscription products, RevenueCat owns purchase and entitlement truth, and the app owns the paywall and unlock decision."

> "The lowest-risk backend is the one you do not operate yet."

> "A calm monthly note on useful app tools, pricing changes, and stack decisions for solo mobile developers."

**Mechanics:** Grade 9–10 practitioner reading level · imperative / second-person to the "builder" · conversational-professional · no contractions · Oxford comma · no emoji · numerals for counts ("4 tools") · dates as "Jul 19, 2026" · pricing always with a last-checked date.

## Visual identity — *extracted from site CSS*

A warm, editorial "almanac" system — paper and ink with a deep pine accent and a muted gold secondary. Re-verified 2026-08-03; unchanged.

| Token | Hex | Role |
|-------|-----|------|
| Pine | `#2c5f4f` | **Accent** — links, primary actions, focus ring |
| Gold | `#9a6b23` | Secondary accent / highlights |
| Ink | `#20241f` | Primary text (warm near-black) |
| Paper | `#fbfaf7` | Page ground (warm off-white) |
| Surface | `#ffffff` | Cards / raised surfaces |
| Muted | `#6e6a5e` | Secondary text (warm taupe) |
| Rule | `#e7e2d7` | Hairlines / borders |
| Accent-soft | `#e8efea` | Pale pine tint (surfaces) |
| Danger | `#9e4434` | Brick red (used sparingly) |

**Type:** Source Serif 4 (serif display) · Inter (sans body) · SF Mono (uppercase mono labels). **Radii:** card 7px · button 6px · badge 4px. **Logo/favicon:** `https://indieappstack.com/icon.svg`. **Internal styleguide:** `/styleguide` (noindex).

*dm-hub artifacts for this brand theme their `--accent` to Pine `#2c5f4f`.*

## Facts we can state

- A practical field guide for solo mobile developers choosing the tools, systems, and workflows behind durable apps. *(measured — /about)*
- Organizes tools by use case, stage, platform, pricing model, and practical fit. *(measured — /about)*
- **28 published tool pages across 12 categories**; 26 indexable, 2 (Braze, Emerge Tools) deliberately noindexed. *(measured — /tools, sitemap)*
- **Content surface:** 28 tools · 12 category hubs · 7 comparisons · 10 guides · 6 indie iOS stack archetypes · Stack Finder · **72 sitemap URLs**. *(measured — sitemap)*
- Editorial method: fit-based, no fake hands-on claims, no invented pricing, with visible last-checked dates. *(measured — /about, tool cards)*
- Recommendations stay editorial; affiliate status does not decide inclusion. *(measured — /about, /affiliate-disclosure)*
- Built on Next.js (SSG), with honest per-page sitemap `lastmod`, IndexNow on production deploys, and GSC verification. *(measured — repo, commits)*
- Analytics is **GA4 only** (`G-Y7CVEVCJ7H`), env-gated; Plausible retired 2026-07-20. *(measured — production HTML, docs/analytics.md)*
- Contact: info@indieappstack.com. *(measured — /about)*
- **One affiliate program live:** Warp, via `/go/warp` (`rel=sponsored nofollow`, disclosed inline). RevenueCat pending; Framer, Appwrite, Webflow not applied. **Pre-revenue.** *(user-provided)*

## Never claim — compliance guardrail

Downstream skills flag any draft that touches these:

- ✕ Unsubstantiated superlatives ("best", "#1", "guaranteed") without proof.
- ✕ Fake hands-on / first-hand testing claims that did not happen.
- ✕ Prices or tiers with no last-checked date or source.
- ✕ Any implication that commission drove a recommendation.
- ✕ **"Privacy-first" / "cookieless" / "no cookie banner" / "no tracking" said about IndieAppStack itself.** False since 2026-07-20. Banned until a consent banner + Consent Mode v2 ship. *Writing about privacy-friendly analytics tools (TelemetryDeck, etc.) is still fine — the ban covers claims about this site.*

**The live GDPR exposure.** GA4 sets `_ga` first-party cookies and runs with no consent banner. EU regulators require opt-in **before** GA4 fires; analytics does not qualify for the ePrivacy Art. 5(3) strictly-necessary exemption, and legitimate interest is not accepted as the Art. 6 basis in most member states. Two follow-ups already flagged in `docs/analytics.md`: the **privacy policy should name GA4 and its cookies** (it currently says only "privacy-conscious analytics" and "may use cookies"), and the site should either **adopt a banner + Consent Mode v2** or accept the exposure knowingly.

**Other notes.** Always disclose affiliate relationships near monetized links — the `/affiliate-disclosure` copy now matches the live Warp implementation; keep it in sync as programs go live. Never use the GA4 "Create event" UI — events go through the wrapper in `lib/analytics/client.ts`. Not a regulated category; keep comparisons neutral.

## Wiring & living-strategy links

- **Notion:** wired → [IndieAppStack project](https://app.notion.com/p/domanov/IndieAppStack-398be5ec9ff680168238c7b841286e2b) · id `398be5ec-9ff6-8016-8238-c7b841286e2b`.
- **Measurement:** GA4 `G-Y7CVEVCJ7H` · property `properties/546213572` (account `a163602836`, carried from the 2026-07-20 setup — confirm in GA4 Admin before relying on it) · GSC property `https://indieappstack.com/` (DNS-verified).
- **Metrics DB:** not yet created. Next wiring step — `performance-tracker` can scaffold the Marketing Metrics DB and write its ids back here.
- **Latest audit:** `indieappstack-audit-2026-07-18.html` → **33/100 (Emerging)**, goal *Brand awareness & authority*. [Artifact](https://claude.ai/code/artifact/03b7c68d-675f-4ff2-b330-9e8e9e4e1fd6). **Now partly stale** — it predates the GA4 switch and the comparison/stacks clusters.
- Competitors / goals / strategy: not yet run — this profile links to them once their skills produce outputs.

---
*Created 2026-07-18 · Refreshed 2026-08-03 · Sources: live pages on indieappstack.com (home, /about, /privacy-policy, /affiliate-disclosure, /tools, /guides, a full guide), live CSS custom properties, sitemap.xml, `/go/` redirect probes, the repository (`docs/analytics.md`, `scripts/seed-database.mjs`, `app/globals.css`, git log), and a 2026-08-03 category scan. Fields tagged user-provided were confirmed by the owner. Nothing was invented.*
