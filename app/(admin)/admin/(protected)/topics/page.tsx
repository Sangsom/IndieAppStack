import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import { formatTopicStatus, getAdminTopicList } from "@/lib/admin-topics";

type AdminTopicsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  create_failed: {
    tone: "error",
    text: "The topic could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Topic added to the queue.",
  },
  duplicate_slug: {
    tone: "error",
    text: "That slug is already used by another topic.",
  },
  feedback_required: {
    tone: "error",
    text: "Rejected topics need feedback so the idea can be reused later.",
  },
  intent_required: {
    tone: "error",
    text: "Add clear search intent before moving a topic beyond idea.",
  },
  invalid_topic: {
    tone: "error",
    text: "Check the topic fields and try again.",
  },
  missing_topic: {
    tone: "error",
    text: "The selected topic could not be found.",
  },
  update_failed: {
    tone: "error",
    text: "The topic could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Topic updated.",
  },
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-ink">
      {formatTopicStatus(status)}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminTopicsPage({
  searchParams,
}: AdminTopicsPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const topics = await getAdminTopicList();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          href="/admin/topics/new"
        >
          New topic
        </Link>
      }
      description="Manage the controlled publishing queue that the AI draft assistant will be allowed to pull from."
      eyebrow="AI draft assistant"
      title="Topic queue"
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <AdminTable
        caption="Admin topic queue"
        columns={[
          {
            key: "topic",
            label: "Topic",
          },
          {
            key: "intent",
            label: "Intent",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "tools",
            label: "Related tools",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Create the first controlled topic before connecting AI drafting."
        emptyTitle="No topics queued"
        rows={topics.map((topic) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/topics/${topic.id}/ai`}
              >
                AI flow
              </Link>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/topics/${topic.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ),
          intent: (
            <div className="grid gap-1">
              <span>{topic.search_intent ?? "No intent yet"}</span>
              <span className="text-sm text-muted">
                {topic.target_keyword ?? "No target keyword"}
              </span>
              <span className="text-sm text-muted">
                {topic.categoryName ?? "No category"}
              </span>
            </div>
          ),
          status: (
            <div className="grid gap-2">
              <StatusBadge status={topic.status} />
              <span className="text-sm text-muted">
                Priority {topic.priority}
              </span>
              <span className="text-sm text-muted">
                Updated {formatDate(topic.updated_at)}
              </span>
            </div>
          ),
          tools: topic.relatedToolNames.length
            ? topic.relatedToolNames.join(", ")
            : "No related tools",
          topic: (
            <div>
              <p className="font-semibold text-ink">{topic.title}</p>
              <p className="mt-1 text-sm text-muted">/{topic.slug}</p>
              {topic.status === "rejected" && topic.feedback ? (
                <p className="mt-2 text-sm text-muted">
                  Feedback: {topic.feedback}
                </p>
              ) : topic.notes ? (
                <p className="mt-2 text-sm text-muted">{topic.notes}</p>
              ) : null}
            </div>
          ),
        }))}
      />
    </AdminPageShell>
  );
}
