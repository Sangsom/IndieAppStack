# Visual Production Workflow

Created: 2026-07-01.

Notion board: https://app.notion.com/p/0447a2213f4545c8b1e044a735fdabbc

This workflow makes IndieAppStack articles more useful by giving every active brief a planned hero visual and a planned in-article visual. The goal is not decoration. Each visual should help the reader decide, compare, remember, or execute.

## Required Visuals

Every active brief needs:

- One hero visual that explains the article's core decision.
- One in-article visual that helps with a setup step, comparison, workflow, or decision.
- Alt text that describes the useful meaning of the image.
- A source/provenance label before the image is used.
- A review note if the visual includes tool claims, pricing, screenshots, or affiliate-sensitive language.

## Standard Visual Types

| Type | Best use | Notes |
| --- | --- | --- |
| Stack map | Show which tool owns which responsibility. | Good for stack guides and backend choices. |
| Decision tree | Route the reader to the right next action. | Avoid ranking by commission or preference alone. |
| Setup checklist | Make implementation steps scannable. | Use only steps that the article can support. |
| Comparison table graphic | Summarize tradeoffs across tools. | Do not include exact prices unless source-checked. |
| Workflow diagram | Show events moving through a system. | Useful for paywalls, analytics, ASO, launch, and crash reporting. |
| Annotated screenshot | Explain a real UI or screen. | Requires owned capture, allowed official source, or synthetic mockup. |

## Provenance Rules

Use these labels in the Notion Visual Production Board:

| Provenance | Meaning | Publishing rule |
| --- | --- | --- |
| generated_concept | Custom illustration, diagram, or abstract mockup. | Safe when it does not imply hands-on testing. |
| owned_capture | Screenshot captured from our own app, site, or controlled test account. | Safe if no private data is visible. |
| official_allowed | Screenshot or image from an official page with clear permission or acceptable editorial use. | Must include source URL in review notes. |
| internal_screenshot | Internal admin/product screenshot. | Strip secrets and avoid publishing unless approved. |
| requires_testing | Would imply hands-on usage or product UI behavior. | Block until testing notes exist. |
| do_not_use | Risky, unsupported, unclear license, or misleading. | Do not publish. |

## Asset Naming

Store article visuals in:

`public/content-visuals/articles/`

Use lowercase, descriptive slugs:

`{article-slug}-{visual-purpose}.{ext}`

Examples:

- `subscription-mvp-stack-map.svg`
- `revenuecat-adapty-superwall-comparison.svg`
- `monetization-tools-decision-tree.svg`
- `backend-choice-architecture-map.svg`

## Alt Text Rules

Good alt text describes what the reader learns from the image:

- "Map of a solo iOS subscription app stack showing purchases, entitlements, backend, analytics, and crash reporting responsibilities."
- "Decision tree routing solo mobile developers from revenue model to subscription stack, paywall tools, backend, and analytics choices."

Avoid empty or decorative alt text unless the image is truly decorative. Avoid "screenshot of" unless the asset is actually a screenshot.

## Screenshot Rules

- Do not use third-party UI screenshots unless they are captured hands-on, clearly allowed by the official source, or replaced with a conceptual diagram.
- Do not imply "we tested" or "we found" from a screenshot unless testing notes exist.
- Remove account names, user data, API keys, project IDs, billing details, and analytics figures.
- If an image is a synthetic mockup, label it as a conceptual example in article notes.
- If a screenshot is from an official source, record the source URL and date checked in the evidence log.

## First 30 Days

The Visual Production Board now tracks 18 visual requirements across the active topic set. The first four custom visuals have been created:

| Article | Asset | Type | Path |
| --- | --- | --- | --- |
| Subscription MVP stack for a solo iOS app | Stack map | stack_map | `/content-visuals/articles/subscription-mvp-stack-map.svg` |
| RevenueCat vs Adapty vs Superwall | Comparison hero | comparison_table_graphic | `/content-visuals/articles/revenuecat-adapty-superwall-comparison.svg` |
| Best monetization tools for solo mobile developers | Decision tree | decision_tree | `/content-visuals/articles/monetization-tools-decision-tree.svg` |
| Supabase vs Firebase vs Appwrite | Backend architecture map | stack_map | `/content-visuals/articles/backend-choice-architecture-map.svg` |

## Article Review Template

Add this block to each article brief or draft:

```md
## Visual Review

- Hero visual:
- In-article visual:
- Asset paths:
- Alt text reviewed:
- Source/provenance:
- Screenshot permission:
- Hands-on implication:
- Visual claims checked against evidence log:
- Reviewer:
```
