# IndieAppStack Content Affiliate Plugin

This plugin is the dedicated operating layer for turning IndieAppStack into a useful, trustworthy content and affiliate property for solo mobile developers.

It is intentionally opinionated:

- Publish useful stack decisions before monetization-heavy pages.
- Treat affiliate links as a reader-service layer, not the reason an article exists.
- Require evidence, current source checks, visuals, and human review before publishing.
- Use analytics to decide what to expand, update, prune, or monetize.

## Components

- `agents/` contains role-specific agents for strategy, writing, affiliate operations, and performance review.
- `skills/` contains reusable workflows for planning, article production, affiliate intake, and analytics review.
- `docs/` contains the current operating model and first 90-day plan.

## Recommended Weekly Loop

1. Run content planning and pick the next 2-3 briefs.
2. Produce one flagship guide, one comparison, and one supporting article.
3. Add affiliate links only after program status, disclosure, and fit are clear.
4. Review traffic, click, and newsletter signals every Friday.
5. Refresh the topic queue based on the evidence.

## Current Site Fit

The project already has admin tables and screens for topics, articles, tools, affiliate programs, affiliate links, redirects, compliance, click analytics, and AI draft flow. This plugin should use that system instead of creating a separate content machine.

## Local Install

The repo root must contain a supported marketplace manifest at `.claude-plugin/marketplace.json`.
A root-level `marketplace.json` is not enough for `codex plugin marketplace add`.

From the repo root:

```bash
codex plugin marketplace add /Users/rinalds/Developer/Test/IndieAppStack
codex plugin add indieappstack-content-affiliate@indieappstack-local
```

Start a new Codex thread after installing so the plugin skills and agents are loaded.
