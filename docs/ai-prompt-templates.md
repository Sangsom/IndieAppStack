# AI Prompt Templates

Template version: `2026-06-29.p5.3`

Prompt templates live in `lib/ai/prompt-templates.ts` so prompt changes are reviewable with code changes.

## Capabilities

The template module covers these AI assistant jobs:

- Suggest topic queue entries from existing content, categories, and tool data.
- Create SEO briefs from an approved topic.
- Draft review-status articles from approved briefs.
- Summarize tools from admin-provided tool records only.
- Suggest internal links from published, human-reviewed article candidates.
- Suggest comparison-table structures.
- Flag articles that may need updates based on stale article/tool data.

## Guardrails

Every prompt includes the same editorial guardrails:

- Never publish or imply the article is ready to publish.
- Never invent pricing, trial limits, affiliate terms, commission rates, or payout details.
- Never claim hands-on testing unless source notes explicitly say testing happened.
- Never rank or recommend a tool because it pays.
- Avoid thin pages by requiring intent, depth, examples, and internal links.
- Use only admin-provided tool data for tool facts.
- Include human-review notes for claims that need current verification.

## Admin Flow

1. Open `/admin/topics`.
2. Select `AI flow` on a topic.
3. Generate a brief. The brief is saved into `topic_queue.notes`.
4. Review and approve the brief. Approval sets `topic_queue.status = briefed`.
5. Generate a draft. Draft generation only accepts `briefed` topics.
6. The article is created with `status = review`, `ai_assisted = true`, `human_reviewed = false`, and `published_at = null`.
7. The topic moves to `drafted`.

## Model Configuration

Set these server-only env vars in Vercel:

```text
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
```

Use Anthropic's current preferred Claude model ID in `ANTHROPIC_MODEL`. If either value is missing locally, the flow produces deterministic review-only brief/draft scaffolds so the admin workflow can still be tested without live AI calls.
