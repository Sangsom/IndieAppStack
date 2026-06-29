import Link from "next/link";

import { archiveTool } from "./actions";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import { getAdminToolList } from "@/lib/admin-tools";

type AdminToolsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  archive_failed: {
    tone: "error",
    text: "The tool could not be archived. Try again from the edit screen.",
  },
  archived: {
    tone: "info",
    text: "Tool archived and public pages revalidated.",
  },
  create_failed: {
    tone: "error",
    text: "The tool could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Tool created and public pages revalidated.",
  },
  duplicate_slug: {
    tone: "error",
    text: "That slug is already used by another tool.",
  },
  invalid_tool: {
    tone: "error",
    text: "Check the tool fields and try again.",
  },
  missing_tool: {
    tone: "error",
    text: "The selected tool could not be found.",
  },
  update_failed: {
    tone: "error",
    text: "The tool could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Tool updated and public pages revalidated.",
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
      {status}
    </span>
  );
}

export default async function AdminToolsPage({
  searchParams,
}: AdminToolsPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const tools = await getAdminToolList();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          href="/admin/tools/new"
        >
          New tool
        </Link>
      }
      description="Create, edit, archive, and review tool records that power the public directory and detail pages."
      eyebrow="Admin section"
      title="Tools"
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <AdminTable
        caption="Admin tools"
        columns={[
          {
            key: "tool",
            label: "Tool",
          },
          {
            key: "categories",
            label: "Categories",
          },
          {
            key: "pricing",
            label: "Pricing",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Create the first tool to populate the public directory."
        emptyTitle="No tools yet"
        rows={tools.map((tool) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/tools/${tool.id}/edit`}
              >
                Edit
              </Link>
              <form action={archiveTool}>
                <input name="tool_id" type="hidden" value={tool.id} />
                <input name="slug" type="hidden" value={tool.slug} />
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-danger transition-colors hover:border-danger hover:bg-surface"
                  type="submit"
                >
                  Archive
                </button>
              </form>
            </div>
          ),
          categories: tool.categories.length
            ? tool.categories.map((category) => category.name).join(", ")
            : "Unassigned",
          pricing: (
            <div>
              <p>{tool.pricing_model.replaceAll("_", " ")}</p>
              <p className="mt-1 text-sm text-muted">
                Last checked: {tool.pricing_last_checked ?? "Not set"}
              </p>
            </div>
          ),
          status: <StatusBadge status={tool.status} />,
          tool: (
            <div>
              <p className="font-semibold text-ink">{tool.name}</p>
              <p className="mt-1 text-sm text-muted">/{tool.slug}</p>
              {tool.tagline ? (
                <p className="mt-2 max-w-md text-sm text-muted">
                  {tool.tagline}
                </p>
              ) : null}
            </div>
          ),
        }))}
      />
    </AdminPageShell>
  );
}
