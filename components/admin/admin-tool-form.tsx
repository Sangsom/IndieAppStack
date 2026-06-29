import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  pricingModelOptions,
  toolStatusOptions,
  type AdminToolCategory,
  type AdminToolEditor,
} from "@/lib/admin-tools";

type AdminToolFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: AdminToolCategory[];
  submitLabel: string;
  tool?: AdminToolEditor;
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

function listValue(values: string[] | undefined) {
  return values?.join("\n") ?? "";
}

export function AdminToolForm({
  action,
  categories,
  submitLabel,
  tool,
}: AdminToolFormProps) {
  return (
    <AdminForm
      action={action}
      actions={
        <button
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          type="submit"
        >
          {submitLabel}
        </button>
      }
      description="Changes save through protected server actions and revalidate the public tool surfaces."
      title={tool ? `Edit ${tool.name}` : "Create tool"}
    >
      {tool ? (
        <>
          <input name="tool_id" type="hidden" value={tool.id} />
          <input name="previous_slug" type="hidden" value={tool.slug} />
          <input
            name="published_at"
            type="hidden"
            value={tool.published_at ?? ""}
          />
        </>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Name">
          <input
            className={inputClass}
            defaultValue={tool?.name ?? ""}
            name="name"
            required
          />
        </AdminField>

        <AdminField
          description="Lowercase letters, numbers, and hyphens. Must be unique."
          label="Slug"
        >
          <input
            className={inputClass}
            defaultValue={tool?.slug ?? ""}
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />
        </AdminField>
      </div>

      <AdminField label="Tagline">
        <input
          className={inputClass}
          defaultValue={tool?.tagline ?? ""}
          name="tagline"
        />
      </AdminField>

      <AdminField label="Description">
        <textarea
          className={`${inputClass} min-h-28 py-3`}
          defaultValue={tool?.description ?? ""}
          name="description"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Website URL">
          <input
            className={inputClass}
            defaultValue={tool?.website_url ?? ""}
            name="website_url"
            type="url"
          />
        </AdminField>

        <AdminField label="Affiliate URL">
          <input
            className={inputClass}
            defaultValue={tool?.affiliateUrl ?? ""}
            name="affiliate_url"
            type="url"
          />
        </AdminField>
      </div>

      <AdminField label="Logo URL">
        <input
          className={inputClass}
          defaultValue={tool?.logo_url ?? ""}
          name="logo_url"
          type="url"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Pricing model">
          <select
            className={inputClass}
            defaultValue={tool?.pricing_model ?? "unknown"}
            name="pricing_model"
          >
            {pricingModelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Pricing last checked">
          <input
            className={inputClass}
            defaultValue={tool?.pricing_last_checked ?? ""}
            name="pricing_last_checked"
            type="date"
          />
        </AdminField>

        <AdminField label="Status">
          <select
            className={inputClass}
            defaultValue={tool?.status ?? "draft"}
            name="status"
          >
            {toolStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <AdminField label="Pricing summary">
        <textarea
          className={`${inputClass} min-h-20 py-3`}
          defaultValue={tool?.pricing_summary ?? ""}
          name="pricing_summary"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField
          description="Use one item per line or comma-separated values."
          label="Best for"
        >
          <textarea
            className={`${inputClass} min-h-32 py-3`}
            defaultValue={listValue(tool?.best_for)}
            name="best_for"
          />
        </AdminField>

        <AdminField
          description="Use one item per line or comma-separated values."
          label="Not good for"
        >
          <textarea
            className={`${inputClass} min-h-32 py-3`}
            defaultValue={listValue(tool?.not_good_for)}
            name="not_good_for"
          />
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField
          description="Examples: iOS, Android, Web, React Native, Flutter."
          label="Platforms"
        >
          <textarea
            className={`${inputClass} min-h-28 py-3`}
            defaultValue={listValue(tool?.platforms)}
            name="platforms"
          />
        </AdminField>

        <AdminField
          description="Examples: Prototype, MVP, Growth, Scale."
          label="App stages"
        >
          <textarea
            className={`${inputClass} min-h-28 py-3`}
            defaultValue={listValue(tool?.app_stages)}
            name="app_stages"
          />
        </AdminField>

        <AdminField
          description="Alternative tool names, one per line."
          label="Alternatives"
        >
          <textarea
            className={`${inputClass} min-h-28 py-3`}
            defaultValue={listValue(tool?.alternatives)}
            name="alternatives"
          />
        </AdminField>
      </div>

      <fieldset className="rounded-card border border-rule bg-paper p-4">
        <legend className="px-1 text-sm font-semibold text-ink">
          Category assignment
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <label
              className="flex min-h-10 items-center gap-2 rounded-button border border-rule bg-surface px-3 text-sm font-semibold text-ink"
              key={category.id}
            >
              <input
                className="size-4 accent-pine"
                defaultChecked={tool?.categoryIds.includes(category.id)}
                name="category_ids"
                type="checkbox"
                value={category.id}
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <AdminField label="Internal notes">
        <textarea
          className={`${inputClass} min-h-28 py-3`}
          defaultValue={tool?.internal_notes ?? ""}
          name="internal_notes"
        />
      </AdminField>
    </AdminForm>
  );
}
