import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import {
  approveTopicBrief,
  generateTopicBrief,
  generateTopicDraft,
} from "@/app/(admin)/admin/(protected)/topics/actions";
import { AI_PROMPT_TEMPLATE_VERSION } from "@/lib/ai/prompt-templates";
import { formatTopicStatus, getAdminTopicAiContext } from "@/lib/admin-topics";

type TopicAiPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  approve_failed: {
    tone: "error",
    text: "The brief could not be approved. Check the topic and try again.",
  },
  brief_approved: {
    tone: "info",
    text: "Brief approved. This topic can now generate a review draft.",
  },
  brief_failed: {
    tone: "error",
    text: "The brief could not be generated. Check AI configuration and try again.",
  },
  brief_generated: {
    tone: "info",
    text: "Brief generated and saved to the topic notes.",
  },
  brief_not_approved: {
    tone: "error",
    text: "Approve the brief before generating a draft.",
  },
  brief_required: {
    tone: "error",
    text: "Generate and review a brief before approving or drafting.",
  },
  draft_duplicate_slug: {
    tone: "error",
    text: "An article already uses this topic slug. Update the topic slug before generating a draft.",
  },
  draft_failed: {
    tone: "error",
    text: "The draft could not be created. Check the generated payload and try again.",
  },
  intent_required: {
    tone: "error",
    text: "Add search intent before using AI drafting.",
  },
  topic_already_drafted: {
    tone: "error",
    text: "This topic has already moved beyond briefing.",
  },
  topic_update_failed: {
    tone: "error",
    text: "Draft created, but the topic status could not be updated.",
  },
};

const cardClass = "rounded-card border border-rule bg-surface p-5 shadow-field";
const buttonClass =
  "inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink";
const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-button border border-rule bg-surface px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft";

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function TopicActionForm({
  action,
  buttonLabel,
  disabled,
  topicId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  disabled?: boolean;
  topicId: string;
}) {
  return (
    <form action={action}>
      <input name="topic_id" type="hidden" value={topicId} />
      <button className={buttonClass} disabled={disabled} type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}

export default async function TopicAiPage({
  params,
  searchParams,
}: TopicAiPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const status = getParam(query, "status");
  const error = getParam(query, "error");
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const context = await getAdminTopicAiContext(id);

  if (!context) {
    notFound();
  }

  const canGenerateBrief =
    Boolean(context.topic.search_intent) &&
    !["drafted", "reviewing", "published"].includes(context.topic.status);
  const canApproveBrief =
    Boolean(context.topic.notes) &&
    Boolean(context.topic.search_intent) &&
    context.topic.status !== "drafted" &&
    context.topic.status !== "published";
  const canGenerateDraft =
    context.topic.status === "briefed" && Boolean(context.topic.notes);

  return (
    <AdminPageShell
      actions={
        <>
          <Link className={secondaryButtonClass} href="/admin/topics">
            Back to topics
          </Link>
          <Link
            className={secondaryButtonClass}
            href={`/admin/topics/${context.topic.id}/edit`}
          >
            Edit topic
          </Link>
        </>
      }
      description="Generate a brief from an approved topic, approve the brief explicitly, then create a review-only AI-assisted article draft."
      eyebrow="AI brief to draft"
      title={context.topic.title}
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <section className={cardClass}>
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-muted">Status</p>
            <p className="mt-1 font-mono text-label-sm font-semibold uppercase text-ink">
              {formatTopicStatus(context.topic.status)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">Keyword</p>
            <p className="mt-1 text-ink">
              {context.topic.target_keyword ?? "No keyword"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">Intent</p>
            <p className="mt-1 text-ink">
              {context.topic.search_intent ?? "No intent"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">Template</p>
            <p className="mt-1 font-mono text-label-sm text-ink">
              {AI_PROMPT_TEMPLATE_VERSION}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className={cardClass}>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Step 1
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
            Generate brief
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Uses the topic, selected tools, category, and published
            internal-link candidates.
          </p>
          <div className="mt-5">
            <TopicActionForm
              action={generateTopicBrief}
              buttonLabel="Generate brief"
              disabled={!canGenerateBrief}
              topicId={context.topic.id}
            />
          </div>
        </div>

        <div className={cardClass}>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Step 2
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
            Approve brief
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Approval changes the topic to briefed, which is the only draftable
            queue state.
          </p>
          <div className="mt-5">
            <TopicActionForm
              action={approveTopicBrief}
              buttonLabel="Approve brief"
              disabled={!canApproveBrief}
              topicId={context.topic.id}
            />
          </div>
        </div>

        <div className={cardClass}>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Step 3
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
            Generate draft
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Creates a review-status article with AI-assisted on and
            human-reviewed off.
          </p>
          <div className="mt-5">
            <TopicActionForm
              action={generateTopicDraft}
              buttonLabel="Generate draft"
              disabled={!canGenerateDraft}
              topicId={context.topic.id}
            />
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Saved brief
        </h2>
        {context.topic.notes ? (
          <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-card border border-rule bg-paper p-4 text-sm leading-6 text-ink">
            {context.topic.notes}
          </pre>
        ) : (
          <p className="mt-2 text-body-md text-muted">
            No brief has been generated for this topic yet.
          </p>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Provided context
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-muted">Related tools</p>
            <ul className="mt-2 grid gap-2 text-sm text-ink">
              {context.relatedTools.length ? (
                context.relatedTools.map((tool) => (
                  <li key={tool.slug}>
                    {tool.name}: {tool.pricing_summary ?? "Pricing not noted"}
                  </li>
                ))
              ) : (
                <li>No related tools selected.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">
              Internal-link candidates
            </p>
            <ul className="mt-2 grid gap-2 text-sm text-ink">
              {context.articles.slice(0, 8).map((article) => (
                <li key={article.slug}>{article.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AdminPageShell>
  );
}
