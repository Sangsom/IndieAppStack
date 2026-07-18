---
brand: IndieAppStack
slug: indieappstack
domain: indieappstack.com
url: https://indieappstack.com
business_model: content/media (affiliate directory) — first affiliate program live (Warp, 2026-07-18)
created: 2026-07-18
refreshed: 2026-07-18
provenance_note: voice & visual identity & facts derived-from-site (measured); guardrails, affiliate status & Notion wiring user-provided; audit linked under links.

positioning:
  icp: "Solo / indie mobile app developers (primarily iOS) choosing tools and assembling a lean stack for a small app."
  usp: "A practical, source-checked field guide that tells you when a tool fits — and when it does not — for a solo mobile app."
  wedge: "Cross-vendor neutrality plus indie-specific curation: honest 'when not to use this' calls a vendor cannot credibly publish, opinionated ready-made stacks, and a Stack Finder — vs vendor blogs, community UGC, and general SaaS directories."
  category: "Indie app-tooling directory / developer content, comparisons & guides."
  provenance: measured

voice:
  tone: [calm, plain-spoken, practical, honest, quietly-opinionated]
  reading_level: "Grade 9–10 / experienced solo-dev practitioner"
  point_of_view: "Imperative to the builder ('Choose the right tools…'); refers to the reader as a 'builder' or 'solo mobile developer', not 'users'."
  formality: "conversational-professional — no slang, no hype"
  contractions: false          # observed: writes 'when it is not', 'should not' in full
  lexicon_use: ["field guide", "stack", "lean stack", "fit / practical fit", "when to use / when not to use", "durable apps", "solo mobile developers", "indie", "source-checked", "last-checked", "decision area", "ship / shipping", "verify before adopting"]
  lexicon_avoid: ["superlatives (best, #1, top, revolutionary, guaranteed)", "fake hands-on / 'we tested' claims", "invented pricing / prices without a source", "exclamation-driven marketing", "emoji", "generic SaaS buzzwords", "competitor disparagement"]
  formatting: { oxford_comma: true, emoji: "none", numbers: "numerals (e.g. '4 tools'); dates as 'Jul 1, 2026'", pricing: "always with a last-checked date or source link" }
  examples:
    - "IndieAppStack organizes mobile app tools by use case, stage, platform, pricing model, and practical fit so builders can make faster stack decisions."          # explanatory
    - "The goal is to describe when a tool is a good fit, when it is not, and what a builder should verify before adopting it."                                        # editorial / persuasive
    - "A calm monthly note on useful app tools, pricing changes, and stack decisions for solo mobile developers."                                                     # warm / brand
  provenance: derived-from-site

visual:
  accent: "#2c5f4f"            # Pine — dm-hub artifacts theme their --accent to this
  palette: ["#2c5f4f", "#9a6b23", "#20241f", "#fbfaf7", "#6e6a5e", "#e7e2d7"]   # pine, gold, ink, paper, muted, rule
  accent_soft: "#e8efea"       # pale pine tint
  danger: "#9e4434"            # brick red (used sparingly)
  fonts: { display: "Source Serif 4 (serif)", body: "Inter (sans)", label: "SF Mono (mono, uppercase labels)" }
  radii: { card: "7px", button: "6px", badge: "4px" }
  logo_url: "https://indieappstack.com/icon.svg"
  style_guide_url: "n/a"
  provenance: measured        # extracted from site CSS :root custom properties

facts:
  - claim: "Positioned as 'a practical field guide for solo mobile developers choosing tools, building systems, and shipping durable apps.'"
    provenance: measured
    source: "indieappstack.com/about (Organization/WebSite schema description)"
  - claim: "Organizes mobile app tools by use case, stage, platform, pricing model, and practical fit."
    provenance: measured
    source: "indieappstack.com/about"
  - claim: "Content types: tool pages, category pages, comparison pages, guides, and a Stack Finder tool."
    provenance: measured
    source: "indieappstack.com/about + sitemap.xml"
  - claim: "Catalog covers ~28 tools across 12 categories (Monetization, Paywalls, ASO, Analytics, Backend, Crash reporting, Push, Launch, Landing pages, Email/waitlists, Screenshots, Dev productivity)."
    provenance: measured
    source: "sitemap.xml + homepage"
  - claim: "Editorial method: describes when a tool fits and when it does not; avoids fake hands-on claims and invented pricing; includes last-checked dates or source links."
    provenance: measured
    source: "indieappstack.com/about (Editorial approach)"
  - claim: "Recommendations are editorial and based on fit for solo mobile developers; affiliate status does not decide whether a tool is included or recommended."
    provenance: measured
    source: "indieappstack.com/about + /affiliate-disclosure"
  - claim: "Privacy-first: cookieless Plausible analytics with custom conversion events; no ad pixels or cookie banner."
    provenance: measured
    source: "digital-presence-audit 2026-07-18 (production JS bundle)"
  - claim: "Built on Next.js with static generation (SSG); fully server-rendered HTML."
    provenance: measured
    source: "digital-presence-audit 2026-07-18"
  - claim: "Contact: info@indieappstack.com."
    provenance: measured
    source: "indieappstack.com/about"
  - claim: "First affiliate program went live 2026-07-18: Warp (self-serve referral) via an active /go/warp redirect with rel=sponsored nofollow and inline disclosure. Other programs (RevenueCat, Framer, Appwrite, Webflow) remain not-applied/pending."
    provenance: user-provided
    source: "scripts/seed-database.mjs; https://indieappstack.com/go/warp"

banned_claims:
  - "Unsubstantiated superlatives — 'best', '#1', 'top', 'guaranteed' — unless provable and sourced."
  - "Fake hands-on / first-hand testing claims ('we tested', 'in our experience') that did not happen."
  - "Specific prices or tiers stated without a last-checked date or source link."
  - "Any implication that a tool is recommended because it pays a commission."
compliance_notes: "Affiliate: always disclose near monetized links. Monetization went live 2026-07-18 with the Warp referral (/go/warp, rel=sponsored nofollow, disclosed inline) — the /affiliate-disclosure page's description of redirect/attribute behavior is now accurate for Warp; keep it in sync as more programs (RevenueCat et al.) go active. Not a regulated (health/finance/legal) category; the About page notes its own legal text is 'a practical baseline, not legal advice.' Comparisons must remain neutral — no competitor disparagement."

wiring:
  notion_project_url: "https://app.notion.com/p/domanov/IndieAppStack-398be5ec9ff680168238c7b841286e2b"
  notion_project_id: "398be5ec-9ff6-8016-8238-c7b841286e2b"
  content_calendar_ds: "n/a"
  provenance: user-provided

links:
  latest_audit: "dm_hub/skills/digital-presence-audit/output/indieappstack-audit-2026-07-18.html"
  latest_audit_artifact: "https://claude.ai/code/artifact/03b7c68d-675f-4ff2-b330-9e8e9e4e1fd6"
  latest_competitors: "n/a"
  latest_goals: "n/a"
  latest_strategy: "n/a"
---

# IndieAppStack — Brand Profile

*The durable account file. Every dm-hub skill reads this as its highest-priority input, so voice, facts, guardrails, colours, and wiring stay consistent across the whole team. Re-run `brand-setup` to refresh when the brand drifts.*

## Who this brand is

**IndieAppStack** is a practical field guide for **solo / indie mobile app developers** — primarily iOS — deciding which tools to use and how to assemble a lean, durable stack. It organizes app tools by use case, stage, platform, pricing model, and practical fit, and publishes tool profiles, category hubs, head-to-head comparisons, guides, and a Stack Finder quiz. The business model is **content/media with affiliate monetization**, though monetization is currently **dormant / pre-revenue**.

Its defensible **wedge** is cross-vendor neutrality *plus* indie specificity: the honest "when this tool is *not* the right fit" calls a vendor's own blog cannot credibly make, opinionated ready-made stacks, and a Stack Finder — against a landscape of vendor blogs (RevenueCat, Adapty, Superwall), community UGC (Reddit, Indie Hackers), and general SaaS directories.

## Voice & style — *derived from the brand's own copy*

The voice is **calm, plain-spoken, and practical** — an expert field guide that trusts the reader, states trade-offs plainly, and refuses hype. It addresses the builder directly with imperative verbs ("Choose", "Compare", "Pick", "Build"), and it deliberately writes in full ("when it is not", "should not") rather than leaning on contractions — a quiet, editorial restraint.

**Sounds like**
- Measured and honest — describes fit, names the downside, tells you what to verify before adopting.
- Source-checked — pairs claims with a "last-checked" date or a source; never states pricing from memory.
- Quietly opinionated — has a point of view, but earns it; no shouting, no exclamation marks.
- Concrete and lean — short, specific sentences aimed at someone shipping an app this month.

**Never sounds like**
- Hype or superlatives ("the best", "#1", "revolutionary", "guaranteed").
- Fake first-hand experience ("we tested…") that did not happen.
- Invented prices or feature claims with no source.
- Generic SaaS marketing, emoji, or filler.

**Calibration examples (verbatim from the site):**
> "IndieAppStack organizes mobile app tools by use case, stage, platform, pricing model, and practical fit so builders can make faster stack decisions."

> "The goal is to describe when a tool is a good fit, when it is not, and what a builder should verify before adopting it."

> "A calm monthly note on useful app tools, pricing changes, and stack decisions for solo mobile developers."

**Mechanics:** Grade 9–10 practitioner reading level · imperative / second-person to the "builder" · conversational-professional · sparing contractions · Oxford comma · no emoji · numerals for counts ("4 tools") · dates as "Jul 1, 2026" · pricing always with a last-checked date.

## Visual identity — *extracted from site CSS*

A warm, editorial "almanac" system — paper and ink with a deep pine accent and a muted gold secondary.

| Token | Hex | Role |
|-------|-----|------|
| Pine | `#2c5f4f` | **Accent** — links, primary actions, focus |
| Gold | `#9a6b23` | Secondary accent / highlights |
| Ink | `#20241f` | Primary text (warm near-black) |
| Paper | `#fbfaf7` | Page ground (warm off-white) |
| Muted | `#6e6a5e` | Secondary text (warm taupe) |
| Rule | `#e7e2d7` | Hairlines / borders |
| Accent-soft | `#e8efea` | Pale pine tint (surfaces) |
| Danger | `#9e4434` | Brick red (used sparingly) |

**Type:** Source Serif 4 (serif display) · Inter (sans body) · SF Mono (uppercase mono labels). **Radii:** card 7px · button 6px · badge 4px. **Logo/favicon:** `https://indieappstack.com/icon.svg`.

*dm-hub artifacts for this brand theme their `--accent` to Pine `#2c5f4f`.*

## Facts we can state

- A practical field guide for solo mobile developers choosing tools, building systems, and shipping durable apps. *(measured — /about)*
- Organizes tools by use case, stage, platform, pricing model, and practical fit. *(measured — /about)*
- Content: tool pages, category pages, comparisons, guides, and a Stack Finder. *(measured — /about, sitemap)*
- ~28 tools across 12 categories. *(measured — sitemap, homepage)*
- Editorial method: fit-based, no fake hands-on claims, no invented pricing, with last-checked dates/sources. *(measured — /about)*
- Recommendations stay editorial; affiliate status does not decide inclusion. *(measured — /about, /affiliate-disclosure)*
- Privacy-first: cookieless Plausible, no ad pixels, no cookie banner. *(measured — audit)*
- Built on Next.js (SSG). *(measured — audit)*
- Contact: info@indieappstack.com. *(measured — /about)*
- **First affiliate program live (2026-07-18):** Warp, via an active `/go/warp` referral redirect (`rel=sponsored nofollow`, disclosed inline). Other programs remain pending. *(user-provided)*

## Never claim — compliance guardrail

Downstream skills flag any draft that touches these:

- ✕ Unsubstantiated superlatives ("best", "#1", "guaranteed") without proof.
- ✕ Fake hands-on / first-hand testing claims that did not happen.
- ✕ Prices or tiers with no last-checked date or source.
- ✕ Any implication that commission drove a recommendation.

**Notes.** Always disclose affiliate relationships near monetized links. Monetization is currently dormant — align the `/affiliate-disclosure` copy with live reality (it describes sponsored/nofollow `/go` redirects that are not yet implemented). Not a regulated category; keep comparisons neutral (no competitor disparagement).

## Wiring & living-strategy links

- **Notion:** wired → [IndieAppStack project](https://app.notion.com/p/domanov/IndieAppStack-398be5ec9ff680168238c7b841286e2b) · id `398be5ec-9ff6-8016-8238-c7b841286e2b`. `push-to-notion` and the content skills will tie work to this project.
- **Latest audit (living baseline):** `dm_hub/skills/digital-presence-audit/output/indieappstack-audit-2026-07-18.html` → overall **33/100 (Emerging)**, goal *Brand awareness & authority*. [Artifact](https://claude.ai/code/artifact/03b7c68d-675f-4ff2-b330-9e8e9e4e1fd6)
- Competitors / goals / strategy: not yet run — this profile links to them once their skills produce outputs.

---
*Created 2026-07-18 · Refreshed 2026-07-18 · Sources: live pages on indieappstack.com (home, /about, /affiliate-disclosure), site CSS custom properties, sitemap.xml, and the dm-hub digital-presence-audit (2026-07-18). Fields tagged user-provided were supplied by the owner; nothing was invented.*
