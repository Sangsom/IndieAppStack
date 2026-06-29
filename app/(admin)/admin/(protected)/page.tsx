import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import { adminNavigationItems } from "@/lib/admin-navigation";

export default function AdminPage() {
  return (
    <AdminPageShell
      description="Protected workspace for managing the IndieAppStack directory, editorial workflow, affiliate links, and tracking data."
      eyebrow="Private workspace"
      title="Admin overview"
    >
      <AdminTable
        caption="Admin sections"
        columns={[
          {
            key: "section",
            label: "Section",
          },
          {
            key: "description",
            label: "Purpose",
          },
          {
            key: "action",
            label: "Open",
          },
        ]}
        emptyDescription="Admin sections will appear here once navigation is configured."
        emptyTitle="No admin sections"
        rows={adminNavigationItems.map((item) => ({
          action: (
            <Link
              className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              href={item.href}
            >
              Open
            </Link>
          ),
          description: item.description,
          section: <span className="font-semibold">{item.label}</span>,
        }))}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminState
          description="Used when a list or relation has no records yet."
          title="Reusable empty state"
        />
        <AdminState
          description="Used by route loading boundaries while protected data resolves."
          title="Reusable loading state"
          tone="loading"
        />
        <AdminState
          description="Used by admin error boundaries with a retry action."
          title="Reusable error state"
          tone="error"
        />
      </div>
    </AdminPageShell>
  );
}
