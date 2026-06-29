import { AdminField, AdminForm } from "@/components/admin/admin-form";
import {
  affiliateNetworkOptions,
  affiliateProgramStatusOptions,
  type AdminAffiliateProgram,
} from "@/lib/admin-affiliate-programs";

type AdminAffiliateProgramFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  program?: AdminAffiliateProgram;
  submitLabel: string;
};

const inputClass =
  "min-h-11 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine";

export function AdminAffiliateProgramForm({
  action,
  program,
  submitLabel,
}: AdminAffiliateProgramFormProps) {
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
      description="Affiliate program notes stay internal to the admin workspace and are not rendered publicly."
      title={program ? `Edit ${program.name}` : "Create affiliate program"}
    >
      {program ? (
        <input name="program_id" type="hidden" value={program.id} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminField label="Name">
          <input
            className={inputClass}
            defaultValue={program?.name ?? ""}
            name="name"
            required
          />
        </AdminField>

        <AdminField label="Network">
          <select
            className={inputClass}
            defaultValue={program?.network ?? "direct"}
            name="network"
            required
          >
            {affiliateNetworkOptions.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Application status">
          <select
            className={inputClass}
            defaultValue={program?.status ?? "not_applied"}
            name="status"
          >
            {affiliateProgramStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Application URL">
          <input
            className={inputClass}
            defaultValue={program?.application_url ?? ""}
            name="application_url"
            type="url"
          />
        </AdminField>

        <AdminField label="Dashboard URL">
          <input
            className={inputClass}
            defaultValue={program?.dashboard_url ?? ""}
            name="dashboard_url"
            type="url"
          />
        </AdminField>
      </div>

      <AdminField label="Contact email">
        <input
          className={inputClass}
          defaultValue={program?.contact_email ?? ""}
          name="contact_email"
          type="email"
        />
      </AdminField>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminField label="Commission notes">
          <textarea
            className={`${inputClass} min-h-32 py-3`}
            defaultValue={program?.commission_notes ?? ""}
            name="commission_notes"
          />
        </AdminField>

        <AdminField label="Cookie notes">
          <textarea
            className={`${inputClass} min-h-32 py-3`}
            defaultValue={program?.cookie_notes ?? ""}
            name="cookie_notes"
          />
        </AdminField>

        <AdminField label="Allowed promotion notes">
          <textarea
            className={`${inputClass} min-h-32 py-3`}
            defaultValue={program?.allowed_promotion_notes ?? ""}
            name="allowed_promotion_notes"
          />
        </AdminField>
      </div>

      <AdminField label="Internal notes">
        <textarea
          className={`${inputClass} min-h-28 py-3`}
          defaultValue={program?.internal_notes ?? ""}
          name="internal_notes"
        />
      </AdminField>
    </AdminForm>
  );
}
