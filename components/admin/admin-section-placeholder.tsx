import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminTable } from "@/components/admin/admin-table";
import { adminNavigationItems } from "@/lib/admin-navigation";

type AdminSectionPlaceholderProps = {
  href: string;
  primaryActionLabel: string;
};

const columns = [
  {
    key: "name",
    label: "Section",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "next",
    label: "Next CRUD task",
  },
];

export function AdminSectionPlaceholder({
  href,
  primaryActionLabel,
}: AdminSectionPlaceholderProps) {
  const section = adminNavigationItems.find((item) => item.href === href);

  if (!section) {
    throw new Error(`Unknown admin section: ${href}`);
  }

  return (
    <AdminPageShell
      actions={
        <button
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule bg-surface px-4 text-sm font-semibold text-muted shadow-field"
          disabled
          type="button"
        >
          {primaryActionLabel}
        </button>
      }
      description={section.description}
      eyebrow="Admin section"
      title={section.label}
    >
      <AdminTable
        caption={`${section.label} admin placeholder`}
        columns={columns}
        emptyDescription={`${section.label} records will appear here once the CRUD task for this section is implemented.`}
        emptyTitle={`No ${section.label.toLowerCase()} records yet`}
        rows={[
          {
            name: (
              <div>
                <p className="font-semibold text-ink">{section.label}</p>
                <p className="mt-1 text-sm text-muted">{section.description}</p>
              </div>
            ),
            next: "Connect database queries, row actions, validation, and publishing workflow.",
            status: (
              <span className="inline-flex rounded-badge border border-gold bg-surface px-2 py-1 font-mono text-label-sm font-semibold uppercase text-gold">
                Placeholder
              </span>
            ),
          },
        ]}
      />
    </AdminPageShell>
  );
}
