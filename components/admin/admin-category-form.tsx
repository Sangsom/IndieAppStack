import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  categoryStatusOptions,
  type AdminCategoryEditor,
  type AdminCategoryOption,
} from "@/lib/admin-categories";

type AdminCategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: AdminCategoryEditor;
  parentOptions: AdminCategoryOption[];
  submitLabel: string;
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

export function AdminCategoryForm({
  action,
  category,
  parentOptions,
  submitLabel,
}: AdminCategoryFormProps) {
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
      description="Category changes feed public category pages, tool filters, and sitemap entries."
      title={category ? `Edit ${category.name}` : "Create category"}
    >
      {category ? (
        <>
          <input name="category_id" type="hidden" value={category.id} />
          <input name="previous_slug" type="hidden" value={category.slug} />
        </>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Name">
          <input
            className={inputClass}
            defaultValue={category?.name ?? ""}
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
            defaultValue={category?.slug ?? ""}
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />
        </AdminField>
      </div>

      <AdminField label="Description">
        <textarea
          className={`${inputClass} min-h-28 py-3`}
          defaultValue={category?.description ?? ""}
          name="description"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Sort order">
          <input
            className={inputClass}
            defaultValue={category?.sort_order ?? 0}
            name="sort_order"
            required
            type="number"
          />
        </AdminField>

        <AdminField label="Parent">
          <select
            className={inputClass}
            defaultValue={category?.parent_id ?? ""}
            name="parent_id"
          >
            <option value="">No parent</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Status">
          <select
            className={inputClass}
            defaultValue={category?.status ?? "draft"}
            name="status"
          >
            {categoryStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="SEO title">
          <input
            className={inputClass}
            defaultValue={category?.seo_title ?? ""}
            name="seo_title"
          />
        </AdminField>

        <AdminField label="SEO description">
          <textarea
            className={`${inputClass} min-h-24 py-3`}
            defaultValue={category?.seo_description ?? ""}
            name="seo_description"
          />
        </AdminField>
      </div>
    </AdminForm>
  );
}
