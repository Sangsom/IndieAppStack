"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateArticleDraft, generateSeoBrief } from "@/lib/ai/draft-flow";
import { AI_PROMPT_TEMPLATE_VERSION } from "@/lib/ai/prompt-templates";
import {
  getAdminTopicAiContext,
  topicStatusOptions,
  type TopicStatus,
} from "@/lib/admin-topics";
import { requireAdmin } from "@/lib/auth/admin";
import type { TablesInsert } from "@/lib/database.types";

type TopicFormResult = {
  errors: string[];
  payload?: TablesInsert<"topic_queue">;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const statusesRequiringIntent = new Set<TopicStatus>([
  "briefed",
  "drafted",
  "reviewing",
  "published",
]);

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function nullableText(formData: FormData, name: string) {
  const value = textValue(formData, name);
  return value.length ? value : null;
}

function parseStatus(value: string, errors: string[]): TopicStatus {
  const allowed = topicStatusOptions.map((option) => option.value);

  if (allowed.includes(value as TopicStatus)) {
    return value as TopicStatus;
  }

  errors.push("Choose a valid topic status.");
  return "idea";
}

function parsePriority(value: string, errors: string[]) {
  if (!value) {
    return 0;
  }

  const priority = Number.parseInt(value, 10);

  if (Number.isNaN(priority)) {
    errors.push("Priority must be a number.");
    return 0;
  }

  return priority;
}

function parseTopicForm(formData: FormData): TopicFormResult {
  const errors: string[] = [];
  const title = textValue(formData, "title");
  const slug = textValue(formData, "slug").toLowerCase();
  const searchIntent = nullableText(formData, "search_intent");
  const status = parseStatus(textValue(formData, "status"), errors);
  const feedback = nullableText(formData, "feedback");

  if (!title) {
    errors.push("Title is required.");
  }

  if (!slugPattern.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  }

  if (statusesRequiringIntent.has(status) && !searchIntent) {
    errors.push("Search intent is required before drafting.");
  }

  if (status === "rejected" && !feedback) {
    errors.push("Rejected topics require feedback.");
  }

  const payload = {
    feedback,
    notes: nullableText(formData, "notes"),
    priority: parsePriority(textValue(formData, "priority"), errors),
    related_tool_ids: [
      ...new Set(
        formData
          .getAll("related_tool_ids")
          .filter((value): value is string => typeof value === "string"),
      ),
    ],
    search_intent: searchIntent,
    slug,
    status,
    target_category_id: nullableText(formData, "target_category_id"),
    target_keyword: nullableText(formData, "target_keyword"),
    title,
  } satisfies TablesInsert<"topic_queue">;

  return {
    errors,
    payload,
  };
}

function adminTopicsUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/topics?${query.toString()}`;
}

function adminTopicAiUrl(topicId: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/topics/${topicId}/ai?${query.toString()}`;
}

function isDuplicateSlugError(message: string) {
  return (
    message.includes("topic_queue_slug_key") ||
    message.includes("duplicate key")
  );
}

function redirectForValidation(errors: string[]): never {
  if (errors.some((error) => error.includes("Search intent"))) {
    redirect(adminTopicsUrl({ error: "intent_required" }));
  }

  if (errors.some((error) => error.includes("feedback"))) {
    redirect(adminTopicsUrl({ error: "feedback_required" }));
  }

  redirect(adminTopicsUrl({ error: "invalid_topic" }));
}

function revalidateTopicPaths() {
  revalidatePath("/admin/topics");
}

function revalidateAiFlowPaths(topicId: string) {
  revalidateTopicPaths();
  revalidatePath(`/admin/topics/${topicId}/ai`);
  revalidatePath("/admin/articles");
}

export async function createTopic(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseTopicForm(formData);

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { error } = await supabase.from("topic_queue").insert(result.payload);

  if (error) {
    redirect(
      adminTopicsUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "create_failed",
      }),
    );
  }

  revalidateTopicPaths();
  redirect(adminTopicsUrl({ status: "created" }));
}

export async function updateTopic(formData: FormData) {
  const { supabase } = await requireAdmin();
  const topicId = textValue(formData, "topic_id");
  const result = parseTopicForm(formData);

  if (!topicId) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { error } = await supabase
    .from("topic_queue")
    .update(result.payload)
    .eq("id", topicId);

  if (error) {
    redirect(
      adminTopicsUrl({
        error: isDuplicateSlugError(error.message)
          ? "duplicate_slug"
          : "update_failed",
      }),
    );
  }

  revalidateTopicPaths();
  redirect(adminTopicsUrl({ status: "updated" }));
}

async function insertArticleTools(articleId: string, toolIds: string[]) {
  if (!toolIds.length) {
    return;
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("article_tools").insert(
    toolIds.map((toolId, index) => ({
      article_id: articleId,
      relationship: "ai_context",
      sort_order: (index + 1) * 10,
      tool_id: toolId,
    })),
  );

  if (error) {
    throw new Error(`AI draft tool sync failed: ${error.message}`);
  }
}

export async function generateTopicBrief(formData: FormData) {
  const { supabase } = await requireAdmin();
  const topicId = textValue(formData, "topic_id");

  if (!topicId) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  const context = await getAdminTopicAiContext(topicId);

  if (!context) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  if (!context.topic.search_intent) {
    redirect(adminTopicAiUrl(topicId, { error: "intent_required" }));
  }

  if (["drafted", "reviewing", "published"].includes(context.topic.status)) {
    redirect(adminTopicAiUrl(topicId, { error: "topic_already_drafted" }));
  }

  const brief = await generateSeoBrief({
    articles: context.articles,
    categoryName: context.categoryName,
    tools: context.relatedTools,
    topic: context.topic,
  });

  const { error } = await supabase
    .from("topic_queue")
    .update({
      notes: `AI brief template ${AI_PROMPT_TEMPLATE_VERSION}\n\n${brief}`,
    })
    .eq("id", topicId);

  if (error) {
    redirect(adminTopicAiUrl(topicId, { error: "brief_failed" }));
  }

  revalidateAiFlowPaths(topicId);
  redirect(adminTopicAiUrl(topicId, { status: "brief_generated" }));
}

export async function approveTopicBrief(formData: FormData) {
  const { supabase } = await requireAdmin();
  const topicId = textValue(formData, "topic_id");

  if (!topicId) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  const context = await getAdminTopicAiContext(topicId);

  if (!context) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  if (!context.topic.search_intent) {
    redirect(adminTopicAiUrl(topicId, { error: "intent_required" }));
  }

  if (!context.topic.notes) {
    redirect(adminTopicAiUrl(topicId, { error: "brief_required" }));
  }

  const { error } = await supabase
    .from("topic_queue")
    .update({ status: "briefed" })
    .eq("id", topicId);

  if (error) {
    redirect(adminTopicAiUrl(topicId, { error: "approve_failed" }));
  }

  revalidateAiFlowPaths(topicId);
  redirect(adminTopicAiUrl(topicId, { status: "brief_approved" }));
}

export async function generateTopicDraft(formData: FormData) {
  const { supabase } = await requireAdmin();
  const topicId = textValue(formData, "topic_id");

  if (!topicId) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  const context = await getAdminTopicAiContext(topicId);

  if (!context) {
    redirect(adminTopicsUrl({ error: "missing_topic" }));
  }

  if (context.topic.status !== "briefed") {
    redirect(adminTopicAiUrl(topicId, { error: "brief_not_approved" }));
  }

  if (!context.topic.notes) {
    redirect(adminTopicAiUrl(topicId, { error: "brief_required" }));
  }

  const draft = await generateArticleDraft({
    articles: context.articles,
    categoryName: context.categoryName,
    tools: context.relatedTools,
    topic: context.topic,
  });

  const { data, error } = await supabase
    .from("articles")
    .insert({
      affiliate_cta_blocks: draft.affiliate_cta_blocks,
      ai_assisted: true,
      author: "IndieAppStack AI Draft Assistant",
      body_markdown: draft.body_markdown,
      content_type: draft.content_type,
      excerpt: draft.excerpt,
      human_reviewed: false,
      primary_category_id: context.topic.target_category_id,
      published_at: null,
      seo_description: draft.seo_description,
      seo_title: draft.seo_title,
      slug: context.topic.slug,
      status: "review",
      subtitle: draft.subtitle,
      title: draft.title,
    } satisfies TablesInsert<"articles">)
    .select("id,slug")
    .single();

  if (error) {
    redirect(
      adminTopicAiUrl(topicId, {
        error: isDuplicateSlugError(error.message)
          ? "draft_duplicate_slug"
          : "draft_failed",
      }),
    );
  }

  await insertArticleTools(data.id, context.topic.related_tool_ids);

  const { error: updateError } = await supabase
    .from("topic_queue")
    .update({ status: "drafted" })
    .eq("id", topicId);

  if (updateError) {
    redirect(adminTopicAiUrl(topicId, { error: "topic_update_failed" }));
  }

  revalidateAiFlowPaths(topicId);
  redirect(`/admin/articles/${data.id}/edit`);
}
