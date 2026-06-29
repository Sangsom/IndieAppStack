import "server-only";

import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Tables } from "@/lib/database.types";

export type TopicStatus = Enums<"topic_status">;

export type AdminTopicCategory = Pick<
  Tables<"categories">,
  "id" | "name" | "slug"
>;

export type AdminTopicTool = Pick<Tables<"tools">, "id" | "name" | "slug">;

export type AdminTopicListItem = Tables<"topic_queue"> & {
  categoryName: string | null;
  relatedToolNames: string[];
};

export type AdminTopicEditor = Tables<"topic_queue">;

export type AdminTopicAiContext = {
  articles: Pick<
    Tables<"articles">,
    "content_type" | "seo_description" | "slug" | "title" | "updated_at"
  >[];
  categoryName: string | null;
  relatedTools: Pick<
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
  >[];
  topic: Tables<"topic_queue">;
};

export const topicStatusOptions: Array<{
  label: string;
  value: TopicStatus;
}> = [
  { label: "Idea", value: "idea" },
  { label: "Briefed", value: "briefed" },
  { label: "Drafted", value: "drafted" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

export function formatTopicStatus(value: string) {
  return value.replaceAll("_", " ");
}

function attachTopicRelations(
  topics: Tables<"topic_queue">[],
  categories: AdminTopicCategory[],
  tools: AdminTopicTool[],
): AdminTopicListItem[] {
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const toolById = new Map(tools.map((tool) => [tool.id, tool]));

  return topics.map((topic) => ({
    ...topic,
    categoryName: topic.target_category_id
      ? (categoryById.get(topic.target_category_id)?.name ?? null)
      : null,
    relatedToolNames: topic.related_tool_ids
      .map((toolId) => toolById.get(toolId)?.name)
      .filter((name): name is string => Boolean(name)),
  }));
}

export async function getAdminTopicOptions() {
  const { supabase } = await requireAdmin();

  const [categoriesResult, toolsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug")
      .neq("status", "archived")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("tools")
      .select("id,name,slug")
      .neq("status", "archived")
      .order("name", { ascending: true }),
  ]);

  const firstError = [categoriesResult.error, toolsResult.error].find(Boolean);

  if (firstError) {
    throw new Error(`Admin topic options query failed: ${firstError.message}`);
  }

  return {
    categories: (categoriesResult.data ?? []) as AdminTopicCategory[],
    tools: (toolsResult.data ?? []) as AdminTopicTool[],
  };
}

export async function getAdminTopicList(): Promise<AdminTopicListItem[]> {
  const { supabase } = await requireAdmin();

  const [topicsResult, options] = await Promise.all([
    supabase
      .from("topic_queue")
      .select("*")
      .order("priority", { ascending: false })
      .order("updated_at", { ascending: false }),
    getAdminTopicOptions(),
  ]);

  if (topicsResult.error) {
    throw new Error(`Admin topics query failed: ${topicsResult.error.message}`);
  }

  return attachTopicRelations(
    (topicsResult.data ?? []) as Tables<"topic_queue">[],
    options.categories,
    options.tools,
  );
}

export async function getAdminTopicEditor(
  topicId: string,
): Promise<AdminTopicEditor | null> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("topic_queue")
    .select("*")
    .eq("id", topicId)
    .maybeSingle();

  if (error) {
    throw new Error(`Admin topic query failed: ${error.message}`);
  }

  return (data as Tables<"topic_queue"> | null) ?? null;
}

export async function getApprovedTopicQueue(): Promise<AdminTopicListItem[]> {
  const { supabase } = await requireAdmin();

  const [topicsResult, options] = await Promise.all([
    supabase
      .from("topic_queue")
      .select("*")
      .eq("status", "briefed")
      .not("search_intent", "is", null)
      .order("priority", { ascending: false })
      .order("updated_at", { ascending: false }),
    getAdminTopicOptions(),
  ]);

  if (topicsResult.error) {
    throw new Error(
      `Approved topic queue query failed: ${topicsResult.error.message}`,
    );
  }

  return attachTopicRelations(
    (topicsResult.data ?? []) as Tables<"topic_queue">[],
    options.categories,
    options.tools,
  );
}

export async function getAdminTopicAiContext(
  topicId: string,
): Promise<AdminTopicAiContext | null> {
  const { supabase } = await requireAdmin();

  const { data: topic, error: topicError } = await supabase
    .from("topic_queue")
    .select("*")
    .eq("id", topicId)
    .maybeSingle();

  if (topicError) {
    throw new Error(`Admin topic AI query failed: ${topicError.message}`);
  }

  if (!topic) {
    return null;
  }

  const typedTopic = topic as Tables<"topic_queue">;
  const [categoryResult, toolsResult, articlesResult] = await Promise.all([
    typedTopic.target_category_id
      ? supabase
          .from("categories")
          .select("id,name,slug")
          .eq("id", typedTopic.target_category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    typedTopic.related_tool_ids.length
      ? supabase
          .from("tools")
          .select(
            "name,slug,tagline,description,best_for,not_good_for,platforms,app_stages,pricing_model,pricing_summary,pricing_last_checked,alternatives,internal_notes",
          )
          .in("id", typedTopic.related_tool_ids)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("articles")
      .select("title,slug,content_type,seo_description,updated_at")
      .eq("status", "published")
      .eq("human_reviewed", true)
      .order("updated_at", { ascending: false })
      .limit(24),
  ]);

  const firstError = [
    categoryResult.error,
    toolsResult.error,
    articlesResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Admin topic AI context failed: ${firstError.message}`);
  }

  return {
    articles: (articlesResult.data ?? []) as AdminTopicAiContext["articles"],
    categoryName:
      (categoryResult.data as AdminTopicCategory | null)?.name ?? null,
    relatedTools: (toolsResult.data ??
      []) as AdminTopicAiContext["relatedTools"],
    topic: typedTopic,
  };
}
