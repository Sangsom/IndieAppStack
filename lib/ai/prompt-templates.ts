import "server-only";

import type { Tables } from "@/lib/database.types";

export const AI_PROMPT_TEMPLATE_VERSION = "2026-06-29.p5.3";

export const AI_DRAFT_GUARDRAILS = [
  "Never publish or imply the article is ready to publish.",
  "Never invent pricing, trial limits, affiliate terms, commission rates, or payout details.",
  "Never claim hands-on testing unless the provided source notes explicitly say testing happened.",
  "Never rank or recommend a tool because it pays; use fit, constraints, and user needs.",
  "Avoid thin pages: require clear search intent, useful depth, examples, and internal links.",
  "Use only admin-provided tool data for tool facts; flag missing facts as review notes.",
  "Include human-review notes for claims that need current verification.",
];

export type PromptTool = Pick<
  Tables<"tools">,
  | "alternatives"
  | "app_stages"
  | "best_for"
  | "description"
  | "internal_notes"
  | "name"
  | "not_good_for"
  | "platforms"
  | "pricing_last_checked"
  | "pricing_model"
  | "pricing_summary"
  | "slug"
  | "tagline"
>;

export type PromptArticle = Pick<
  Tables<"articles">,
  "content_type" | "seo_description" | "slug" | "title" | "updated_at"
>;

export type PromptTopic = Pick<
  Tables<"topic_queue">,
  | "notes"
  | "related_tool_ids"
  | "search_intent"
  | "slug"
  | "target_keyword"
  | "title"
>;

export type PromptContext = {
  articles: PromptArticle[];
  categoryName: string | null;
  topic: PromptTopic;
  tools: PromptTool[];
};

function renderGuardrails() {
  return AI_DRAFT_GUARDRAILS.map((guardrail) => `- ${guardrail}`).join("\n");
}

function renderTools(tools: PromptTool[]) {
  if (!tools.length) {
    return "No related tools were selected. Do not invent tool-specific facts.";
  }

  return tools
    .map(
      (tool) => `## ${tool.name} (/tools/${tool.slug})
Tagline: ${tool.tagline ?? "Not provided"}
Description: ${tool.description ?? "Not provided"}
Best for: ${tool.best_for.join(", ") || "Not provided"}
Not good for: ${tool.not_good_for.join(", ") || "Not provided"}
Platforms: ${tool.platforms.join(", ") || "Not provided"}
App stages: ${tool.app_stages.join(", ") || "Not provided"}
Pricing model: ${tool.pricing_model}
Pricing summary: ${tool.pricing_summary ?? "Not provided"}
Pricing last checked: ${tool.pricing_last_checked ?? "Not provided"}
Alternatives: ${tool.alternatives.join(", ") || "Not provided"}
Internal notes: ${tool.internal_notes ?? "Not provided"}`,
    )
    .join("\n\n");
}

function renderInternalLinkCandidates(articles: PromptArticle[]) {
  if (!articles.length) {
    return "No published article candidates were provided.";
  }

  return articles
    .slice(0, 18)
    .map(
      (article) =>
        `- ${article.title} (/guides/${article.slug}) — ${article.content_type}; ${article.seo_description ?? "No summary"}`,
    )
    .join("\n");
}

export function buildTopicSuggestionPrompt(context: {
  articles: PromptArticle[];
  categories: Array<{ name: string; slug: string }>;
  tools: PromptTool[];
}) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Suggest high-intent IndieAppStack topic ideas from the provided categories, published content, and tool data.

Guardrails:
${renderGuardrails()}

Return JSON with an array named "topics". Each topic must include title, slug, target_keyword, search_intent, target_category_slug, related_tool_slugs, and why_now.

Categories:
${context.categories.map((category) => `- ${category.name} (${category.slug})`).join("\n")}

Existing articles:
${renderInternalLinkCandidates(context.articles)}

Tools:
${renderTools(context.tools)}`;
}

export function buildSeoBriefPrompt(context: PromptContext) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Create an SEO brief for an IndieAppStack article. This is a planning brief, not a public article.

Guardrails:
${renderGuardrails()}

Topic:
- Title: ${context.topic.title}
- Slug: ${context.topic.slug}
- Target keyword: ${context.topic.target_keyword ?? "Not provided"}
- Search intent: ${context.topic.search_intent ?? "Not provided"}
- Target category: ${context.categoryName ?? "Not provided"}

Required brief sections:
1. Search intent and reader job-to-be-done.
2. Article angle and who it is for.
3. Suggested H1, SEO title, meta description, and URL slug.
4. Detailed outline with H2/H3 sections.
5. Related tools to cover, using only the provided tool facts.
6. Internal-link suggestions from the provided article candidates.
7. Comparison table structure if useful.
8. Evidence gaps and human-review checklist.

Related tool data:
${renderTools(context.tools)}

Internal-link candidates:
${renderInternalLinkCandidates(context.articles)}`;
}

export function buildArticleDraftPrompt(context: PromptContext) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Draft a review-status Markdown article from this approved brief. Return strict JSON only with:
{
  "title": string,
  "subtitle": string | null,
  "excerpt": string,
  "seo_title": string,
  "seo_description": string,
  "content_type": "guide" | "comparison" | "tool_review" | "category_page" | "stack_finder" | "news",
  "body_markdown": string,
  "affiliate_cta_blocks": []
}

Guardrails:
${renderGuardrails()}

Draft rules:
- The article must stay in review; do not include publish-ready claims.
- Include a short disclosure when affiliate links may be added later.
- Do not include exact pricing unless it appears in the provided data.
- Include internal-link suggestions as Markdown links.
- Include a human-review checklist near the end.
- Prefer useful depth over generic filler.

Approved brief:
${context.topic.notes ?? "No approved brief provided."}

Topic:
- Title: ${context.topic.title}
- Slug: ${context.topic.slug}
- Target keyword: ${context.topic.target_keyword ?? "Not provided"}
- Search intent: ${context.topic.search_intent ?? "Not provided"}
- Target category: ${context.categoryName ?? "Not provided"}

Related tool data:
${renderTools(context.tools)}

Internal-link candidates:
${renderInternalLinkCandidates(context.articles)}`;
}

export function buildToolSummaryPrompt(tool: PromptTool) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Summarize this tool for editorial use using only the admin-provided data below.

Guardrails:
${renderGuardrails()}

Return: concise summary, best-fit use cases, not-good-for notes, pricing caveats, and human-review gaps.

Tool data:
${renderTools([tool])}`;
}

export function buildInternalLinksPrompt(context: PromptContext) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Suggest internal links for this planned article. Use only the provided candidates.

Guardrails:
${renderGuardrails()}

Return JSON array with anchor_text, url, section, and reason.

Topic: ${context.topic.title}
Brief:
${context.topic.notes ?? "No brief provided."}

Candidates:
${renderInternalLinkCandidates(context.articles)}`;
}

export function buildComparisonTablePrompt(context: PromptContext) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Suggest a comparison-table structure for this article.

Guardrails:
${renderGuardrails()}

Return columns, rows, missing_data, and review_notes. Do not invent pricing or affiliate terms.

Topic: ${context.topic.title}
Brief:
${context.topic.notes ?? "No brief provided."}

Tools:
${renderTools(context.tools)}`;
}

export function buildUpdateNeedsPrompt(context: {
  articles: PromptArticle[];
  tools: PromptTool[];
}) {
  return `Template version: ${AI_PROMPT_TEMPLATE_VERSION}

Flag articles that may need updates based on stale article timestamps, pricing_last_checked dates, and tool changes visible in admin data.

Guardrails:
${renderGuardrails()}

Return JSON array with article_slug, reason, related_tool_slugs, urgency, and suggested_review_steps.

Articles:
${renderInternalLinkCandidates(context.articles)}

Tools:
${renderTools(context.tools)}`;
}
