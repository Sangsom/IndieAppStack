import "server-only";

import type { Json } from "@/lib/database.types";
import {
  buildArticleDraftPrompt,
  buildSeoBriefPrompt,
  type PromptContext,
} from "@/lib/ai/prompt-templates";

export type GeneratedDraft = {
  affiliate_cta_blocks: Json;
  body_markdown: string;
  content_type:
    | "category_page"
    | "comparison"
    | "guide"
    | "news"
    | "stack_finder"
    | "tool_review";
  excerpt: string | null;
  seo_description: string | null;
  seo_title: string | null;
  subtitle: string | null;
  title: string;
};

const anthropicApiUrl = "https://api.anthropic.com/v1/messages";
const anthropicVersion = "2023-06-01";

function getClaudeConfig() {
  return {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL,
  };
}

async function callClaude(prompt: string, system: string, maxTokens: number) {
  const { apiKey, model } = getClaudeConfig();

  if (!apiKey || !model) {
    return null;
  }

  const response = await fetch(anthropicApiUrl, {
    body: JSON.stringify({
      max_tokens: maxTokens,
      messages: [
        {
          content: prompt,
          role: "user",
        },
      ],
      model,
      system,
    }),
    headers: {
      "anthropic-version": anthropicVersion,
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Claude request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as {
    content?: Array<{ text?: string; type?: string }>;
  };

  return (
    data.content
      ?.map((block) => (block.type === "text" ? block.text : ""))
      .filter((text): text is string => Boolean(text))
      .join("\n")
      .trim() ?? ""
  );
}

function fallbackBrief(context: PromptContext) {
  const toolNames = context.tools.map((tool) => tool.name).join(", ");
  const internalLinks = context.articles
    .slice(0, 6)
    .map((article) => `- [${article.title}](/guides/${article.slug})`)
    .join("\n");

  return `## SEO brief

Topic: ${context.topic.title}
Target keyword: ${context.topic.target_keyword ?? "Needs keyword review"}
Search intent: ${context.topic.search_intent ?? "Needs intent review"}
Category: ${context.categoryName ?? "Needs category review"}

## Angle
Help indie app builders decide which stack choices fit their stage, budget model, and operational needs without over-claiming pricing or affiliate terms.

## Outline
1. Define the reader problem and the decision they are trying to make.
2. Explain the evaluation criteria: fit, stage, pricing model, implementation effort, reporting needs, and risks.
3. Summarize relevant tools from admin-provided data only: ${toolNames || "no related tools selected"}.
4. Add a comparison section when multiple tools are involved.
5. Add practical next steps and review notes.

## Internal-link suggestions
${internalLinks || "- No internal candidates available yet."}

## Comparison table structure
- Tool
- Best fit
- Pricing model from admin data
- Implementation notes
- Human-review gaps

## Human-review checklist
- Verify current pricing pages before publishing.
- Verify affiliate terms before adding CTAs.
- Remove any claim that implies hands-on testing unless evidence exists.
- Confirm internal links and table rows are useful, not filler.`;
}

function fallbackDraft(context: PromptContext): GeneratedDraft {
  const brief = context.topic.notes ?? fallbackBrief(context);
  const internalLinks = context.articles
    .slice(0, 5)
    .map((article) => `- [${article.title}](/guides/${article.slug})`)
    .join("\n");
  const toolSections = context.tools
    .map(
      (tool) => `### ${tool.name}

${tool.description ?? tool.tagline ?? "Admin data does not include a long description yet."}

- Best for: ${tool.best_for.join(", ") || "Needs review"}
- Not good for: ${tool.not_good_for.join(", ") || "Needs review"}
- Pricing model: ${tool.pricing_model}
- Pricing summary: ${tool.pricing_summary ?? "Needs current pricing review before publishing."}`,
    )
    .join("\n\n");

  return {
    affiliate_cta_blocks: [],
    body_markdown: `# ${context.topic.title}

> Editorial review draft. This AI-assisted draft is not published and needs human verification before use.

## Reader intent

${context.topic.search_intent ?? "The search intent needs to be confirmed before publication."}

## Recommended angle

${brief}

## Tools to consider

${toolSections || "No related tools were selected for this topic. Add related tools before publishing."}

## Internal links to consider

${internalLinks || "No internal links were available in the provided article data."}

## Comparison table draft

| Tool | Best fit | Pricing note | Review gap |
| --- | --- | --- | --- |
${context.tools
  .map(
    (tool) =>
      `| ${tool.name} | ${tool.best_for[0] ?? "Needs review"} | ${tool.pricing_summary ?? "Verify current pricing"} | Confirm claims before publishing |`,
  )
  .join("\n")}

## Human-review checklist

- Verify every pricing statement against current vendor pages.
- Verify affiliate terms before adding any affiliate CTA.
- Remove or rewrite any claim that implies hands-on testing.
- Confirm recommendations are based on fit, not commissions.
- Expand thin sections before publishing.`,
    content_type: "guide",
    excerpt:
      "A review-only AI-assisted draft generated from an approved IndieAppStack topic brief.",
    seo_description:
      "Review-only AI-assisted draft for an IndieAppStack guide.",
    seo_title: context.topic.title,
    subtitle: "Review draft generated from an approved topic brief.",
    title: context.topic.title,
  };
}

function parseDraftJson(text: string): GeneratedDraft | null {
  const jsonText = text.match(/```json\s*([\s\S]*?)```/)?.[1] ?? text;

  try {
    const parsed = JSON.parse(jsonText) as Partial<GeneratedDraft>;

    if (!parsed.title || !parsed.body_markdown) {
      return null;
    }

    return {
      affiliate_cta_blocks: Array.isArray(parsed.affiliate_cta_blocks)
        ? parsed.affiliate_cta_blocks
        : [],
      body_markdown: parsed.body_markdown,
      content_type: parsed.content_type ?? "guide",
      excerpt: parsed.excerpt ?? null,
      seo_description: parsed.seo_description ?? null,
      seo_title: parsed.seo_title ?? parsed.title,
      subtitle: parsed.subtitle ?? null,
      title: parsed.title,
    };
  } catch {
    return null;
  }
}

export async function generateSeoBrief(context: PromptContext) {
  const prompt = buildSeoBriefPrompt(context);
  const generated = await callClaude(
    prompt,
    "You are an editorial SEO strategist for IndieAppStack. Follow the guardrails exactly.",
    3_500,
  );

  return generated || fallbackBrief(context);
}

export async function generateArticleDraft(context: PromptContext) {
  const prompt = buildArticleDraftPrompt(context);
  const generated = await callClaude(
    prompt,
    "You are an AI drafting assistant for IndieAppStack. Return strict JSON and never publish.",
    5_000,
  );

  if (!generated) {
    return fallbackDraft(context);
  }

  return (
    parseDraftJson(generated) ?? {
      ...fallbackDraft(context),
      body_markdown: generated,
    }
  );
}
