import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  articleContentTypeOptions,
  articleStatusOptions,
  formatJsonForTextarea,
  type AdminArticleCategory,
  type AdminArticleEditor,
  type AdminArticleTool,
} from "@/lib/admin-articles";

type AdminArticleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  article?: AdminArticleEditor;
  categories: AdminArticleCategory[];
  submitLabel: string;
  tools: AdminArticleTool[];
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

export function AdminArticleForm({
  action,
  article,
  categories,
  submitLabel,
  tools,
}: AdminArticleFormProps) {
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
      description="Article saves are protected by server validation. Publishing requires human review and explicit confirmation."
      title={article ? `Edit ${article.title}` : "Create article"}
    >
      {article ? (
        <>
          <input name="article_id" type="hidden" value={article.id} />
          <input name="previous_slug" type="hidden" value={article.slug} />
          <input
            name="published_at"
            type="hidden"
            value={article.published_at ?? ""}
          />
        </>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <input
            className={inputClass}
            defaultValue={article?.title ?? ""}
            name="title"
            required
          />
        </AdminField>

        <AdminField
          description="Lowercase letters, numbers, and hyphens. Must be unique."
          label="Slug"
        >
          <input
            className={inputClass}
            defaultValue={article?.slug ?? ""}
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Subtitle">
          <input
            className={inputClass}
            defaultValue={article?.subtitle ?? ""}
            name="subtitle"
          />
        </AdminField>

        <AdminField label="Author">
          <input
            className={inputClass}
            defaultValue={article?.author ?? "IndieAppStack"}
            name="author"
          />
        </AdminField>
      </div>

      <AdminField label="Excerpt">
        <textarea
          className={`${inputClass} min-h-24 py-3`}
          defaultValue={article?.excerpt ?? ""}
          name="excerpt"
        />
      </AdminField>

      <AdminField
        description="Markdown is rendered through the public article renderer for preview and published pages."
        label="Body markdown"
      >
        <textarea
          className={`${inputClass} min-h-[420px] font-mono text-sm leading-6 py-3`}
          defaultValue={article?.body_markdown ?? ""}
          name="body_markdown"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Status">
          <select
            className={inputClass}
            defaultValue={article?.status ?? "draft"}
            name="status"
          >
            {articleStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Content type">
          <select
            className={inputClass}
            defaultValue={article?.content_type ?? "guide"}
            name="content_type"
          >
            {articleContentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Primary category">
          <select
            className={inputClass}
            defaultValue={article?.primary_category_id ?? ""}
            name="primary_category_id"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="SEO title">
          <input
            className={inputClass}
            defaultValue={article?.seo_title ?? ""}
            name="seo_title"
          />
        </AdminField>

        <AdminField label="SEO description">
          <textarea
            className={`${inputClass} min-h-24 py-3`}
            defaultValue={article?.seo_description ?? ""}
            name="seo_description"
          />
        </AdminField>
      </div>

      <fieldset className="rounded-card border border-rule bg-paper p-4">
        <legend className="px-1 text-sm font-semibold text-ink">
          Related tools
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <label
              className="flex min-h-10 items-center gap-2 rounded-button border border-rule bg-surface px-3 text-sm font-semibold text-ink"
              key={tool.id}
            >
              <input
                className="size-4 accent-pine"
                defaultChecked={article?.relatedToolIds.includes(tool.id)}
                name="related_tool_ids"
                type="checkbox"
                value={tool.id}
              />
              {tool.name}
            </label>
          ))}
        </div>
      </fieldset>

      <AdminField
        description="JSON array reserved for future affiliate CTA block rendering. Keep valid JSON."
        label="Affiliate CTA blocks"
      >
        <textarea
          className={`${inputClass} min-h-32 font-mono text-sm leading-6 py-3`}
          defaultValue={formatJsonForTextarea(
            article?.affiliate_cta_blocks ?? [],
          )}
          name="affiliate_cta_blocks"
        />
      </AdminField>

      <fieldset className="rounded-card border border-rule bg-paper p-4">
        <legend className="px-1 text-sm font-semibold text-ink">
          Review gate
        </legend>
        <div className="mt-3 grid gap-3">
          <label className="flex items-start gap-3 text-sm font-semibold text-ink">
            <input
              className="mt-1 size-4 accent-pine"
              defaultChecked={article?.human_reviewed ?? false}
              name="human_reviewed"
              type="checkbox"
              value="true"
            />
            <span>
              Human reviewed
              <span className="mt-1 block font-normal leading-6 text-muted">
                Required before an article can be published.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm font-semibold text-ink">
            <input
              className="mt-1 size-4 accent-pine"
              defaultChecked={article?.ai_assisted ?? false}
              name="ai_assisted"
              type="checkbox"
              value="true"
            />
            <span>
              AI assisted
              <span className="mt-1 block font-normal leading-6 text-muted">
                Marks drafts that need human editorial review before publishing.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-card border border-gold bg-surface p-3 text-sm font-semibold text-ink">
            <input
              className="mt-1 size-4 accent-pine"
              name="confirm_publish"
              type="checkbox"
              value="true"
            />
            <span>
              Confirm publish
              <span className="mt-1 block font-normal leading-6 text-muted">
                Check this when changing status to Published. The server blocks
                publishing without this explicit confirmation.
              </span>
            </span>
          </label>
        </div>
      </fieldset>
    </AdminForm>
  );
}
