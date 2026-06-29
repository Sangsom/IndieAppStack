import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  topicStatusOptions,
  type AdminTopicCategory,
  type AdminTopicEditor,
  type AdminTopicTool,
} from "@/lib/admin-topics";

type AdminTopicFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: AdminTopicCategory[];
  submitLabel: string;
  tools: AdminTopicTool[];
  topic?: AdminTopicEditor;
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

export function AdminTopicForm({
  action,
  categories,
  submitLabel,
  tools,
  topic,
}: AdminTopicFormProps) {
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
      description="Topic queue entries are the controlled source for AI drafting. Drafting statuses require clear search intent, and rejected topics keep feedback for reuse."
      title={topic ? `Edit ${topic.title}` : "Create topic"}
    >
      {topic ? <input name="topic_id" type="hidden" value={topic.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <input
            className={inputClass}
            defaultValue={topic?.title ?? ""}
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
            defaultValue={topic?.slug ?? ""}
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_180px]">
        <AdminField label="Target keyword">
          <input
            className={inputClass}
            defaultValue={topic?.target_keyword ?? ""}
            name="target_keyword"
          />
        </AdminField>

        <AdminField
          description="Required before a topic can move beyond idea or rejected."
          label="Search intent"
        >
          <input
            className={inputClass}
            defaultValue={topic?.search_intent ?? ""}
            name="search_intent"
            placeholder="commercial investigation"
          />
        </AdminField>

        <AdminField label="Priority">
          <input
            className={inputClass}
            defaultValue={topic?.priority ?? 0}
            inputMode="numeric"
            name="priority"
            type="number"
          />
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Status">
          <select
            className={inputClass}
            defaultValue={topic?.status ?? "idea"}
            name="status"
          >
            {topicStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Target category">
          <select
            className={inputClass}
            defaultValue={topic?.target_category_id ?? ""}
            name="target_category_id"
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
                defaultChecked={topic?.related_tool_ids.includes(tool.id)}
                name="related_tool_ids"
                type="checkbox"
                value={tool.id}
              />
              {tool.name}
            </label>
          ))}
        </div>
      </fieldset>

      <AdminField label="Notes">
        <textarea
          className={`${inputClass} min-h-32 py-3`}
          defaultValue={topic?.notes ?? ""}
          name="notes"
        />
      </AdminField>

      <AdminField
        description="Required when rejecting. Keep the reason useful for future reuse."
        label="Rejection feedback"
      >
        <textarea
          className={`${inputClass} min-h-32 py-3`}
          defaultValue={topic?.feedback ?? ""}
          name="feedback"
        />
      </AdminField>
    </AdminForm>
  );
}
