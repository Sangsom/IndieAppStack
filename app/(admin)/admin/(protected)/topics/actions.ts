"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { topicStatusOptions, type TopicStatus } from "@/lib/admin-topics";
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
