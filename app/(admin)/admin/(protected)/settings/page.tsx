import { AdminForm, AdminField } from "@/components/admin/admin-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";

export default function AdminSettingsPage() {
  return (
    <AdminPageShell
      description="Workspace-level defaults and integration settings. Fields are read-only placeholders until the settings CRUD task is implemented."
      eyebrow="Admin section"
      title="Settings"
    >
      <AdminForm
        actions={
          <button
            className="inline-flex h-10 items-center justify-center rounded-button border border-rule bg-surface px-4 text-sm font-semibold text-muted shadow-field"
            disabled
            type="button"
          >
            Save settings
          </button>
        }
        description="This wrapper establishes the spacing, labels, descriptions, and actions pattern for later admin forms."
        title="Default publishing settings"
      >
        <AdminField
          description="Used as the default review owner for generated or imported content."
          label="Editorial owner"
        >
          <input
            className="h-11 rounded-button border border-rule bg-paper px-3 text-base text-muted outline-none"
            disabled
            value="IndieAppStack"
          />
        </AdminField>

        <AdminField
          description="Future CRUD tasks can replace this with persisted status controls."
          label="Default content status"
        >
          <select
            className="h-11 rounded-button border border-rule bg-paper px-3 text-base text-muted outline-none"
            disabled
            value="draft"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </AdminField>
      </AdminForm>
    </AdminPageShell>
  );
}
