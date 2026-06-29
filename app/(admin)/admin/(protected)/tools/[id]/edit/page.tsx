import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveTool, updateTool } from "../../actions";
import { AdminToolForm } from "@/components/admin/admin-tool-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminToolEditor, getAdminToolOptions } from "@/lib/admin-tools";

type EditAdminToolPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminToolPage({
  params,
}: EditAdminToolPageProps) {
  const { id } = await params;
  const [tool, options] = await Promise.all([
    getAdminToolEditor(id),
    getAdminToolOptions(),
  ]);

  if (!tool) {
    notFound();
  }

  return (
    <AdminPageShell
      actions={
        <>
          {tool.status === "published" ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              href={`/tools/${tool.slug}`}
            >
              View public page
            </Link>
          ) : null}
          <Link
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/tools"
          >
            Back to tools
          </Link>
        </>
      }
      description="Edit the tool fields that feed public directory cards, tool detail pages, category pages, and internal notes."
      eyebrow="Tool CRUD"
      title={`Edit ${tool.name}`}
    >
      <AdminToolForm
        action={updateTool}
        categories={options.categories}
        submitLabel="Save tool"
        tool={tool}
      />

      <form
        action={archiveTool}
        className="rounded-card border border-danger bg-surface p-5 shadow-field"
      >
        <input name="tool_id" type="hidden" value={tool.id} />
        <input name="slug" type="hidden" value={tool.slug} />
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Archive tool
        </h2>
        <p className="mt-2 max-w-2xl text-body-md text-muted">
          Archived tools disappear from public directory and detail queries by
          default. The record remains available for admin recovery.
        </p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-button border border-danger px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-surface"
          type="submit"
        >
          Archive tool
        </button>
      </form>
    </AdminPageShell>
  );
}
