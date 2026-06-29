import Link from "next/link";

import { createTool } from "../actions";
import { AdminToolForm } from "@/components/admin/admin-tool-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminToolOptions } from "@/lib/admin-tools";

export default async function NewAdminToolPage() {
  const { categories } = await getAdminToolOptions();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/tools"
        >
          Back to tools
        </Link>
      }
      description="Create a tool record for the public directory. Publish when the entry is ready to appear publicly."
      eyebrow="Tool CRUD"
      title="New tool"
    >
      <AdminToolForm
        action={createTool}
        categories={categories}
        submitLabel="Create tool"
      />
    </AdminPageShell>
  );
}
