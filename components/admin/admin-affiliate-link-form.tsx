import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  affiliateLinkStatusOptions,
  type AdminAffiliateLink,
  type AdminAffiliateLinkOptions,
} from "@/lib/admin-affiliate-links";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type AdminAffiliateLinkFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  link?: AdminAffiliateLink;
  options: AdminAffiliateLinkOptions;
  submitLabel: string;
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

export function AdminAffiliateLinkForm({
  action,
  link,
  options,
  submitLabel,
}: AdminAffiliateLinkFormProps) {
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
      description="Affiliate links are referenced publicly through internal redirect slugs, while destination URLs stay editable here."
      title={link ? `Edit ${link.slug}` : "Create affiliate link"}
    >
      {link ? <input name="link_id" type="hidden" value={link.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Destination URL">
          <input
            className={inputClass}
            defaultValue={link?.destination_url ?? ""}
            name="destination_url"
            required
            type="url"
          />
        </AdminField>

        <AdminField
          description={
            link
              ? `Public path: ${getAffiliateRedirectPath(link.slug)}`
              : "Leave blank to generate from the selected tool, program, or destination host."
          }
          label="Internal slug"
        >
          <input
            className={inputClass}
            defaultValue={link?.slug ?? ""}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="revenuecat"
          />
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Tool">
          <select
            className={inputClass}
            defaultValue={link?.tool_id ?? ""}
            name="tool_id"
          >
            <option value="">No tool</option>
            {options.tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Affiliate program">
          <select
            className={inputClass}
            defaultValue={link?.affiliate_program_id ?? ""}
            name="affiliate_program_id"
          >
            <option value="">No program</option>
            {options.programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} · {program.network}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Status">
          <select
            className={inputClass}
            defaultValue={link?.status ?? "pending"}
            name="status"
          >
            {affiliateLinkStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <AdminField label="Default rel">
          <input
            className={inputClass}
            defaultValue={link?.default_rel ?? "sponsored nofollow"}
            name="default_rel"
            required
          />
        </AdminField>

        <label className="flex min-h-11 items-center gap-3 rounded-card border border-rule bg-paper px-3 text-sm font-semibold text-ink">
          <input
            className="size-4 accent-pine"
            defaultChecked={link?.disclosure_required ?? true}
            name="disclosure_required"
            type="checkbox"
            value="true"
          />
          Disclosure required
        </label>
      </div>

      <AdminField label="Internal notes">
        <textarea
          className={`${inputClass} min-h-28 py-3`}
          defaultValue={link?.notes ?? ""}
          name="notes"
        />
      </AdminField>
    </AdminForm>
  );
}
