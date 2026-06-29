import Link from "next/link";

import { createAffiliateProgram } from "../actions";
import { AdminAffiliateProgramForm } from "@/components/admin/admin-affiliate-program-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";

export default function NewAdminAffiliateProgramPage() {
  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/affiliate-programs"
        >
          Back to programs
        </Link>
      }
      description="Create an internal affiliate program record for tracking application status and partner terms."
      eyebrow="Affiliate CRUD"
      title="New affiliate program"
    >
      <AdminAffiliateProgramForm
        action={createAffiliateProgram}
        submitLabel="Create program"
      />
    </AdminPageShell>
  );
}
