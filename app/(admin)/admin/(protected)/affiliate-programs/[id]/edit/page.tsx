import Link from "next/link";
import { notFound } from "next/navigation";

import { updateAffiliateProgram } from "../../actions";
import { AdminAffiliateProgramForm } from "@/components/admin/admin-affiliate-program-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminAffiliateProgramEditor } from "@/lib/admin-affiliate-programs";

type EditAdminAffiliateProgramPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminAffiliateProgramPage({
  params,
}: EditAdminAffiliateProgramPageProps) {
  const { id } = await params;
  const program = await getAdminAffiliateProgramEditor(id);

  if (!program) {
    notFound();
  }

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
      description="Edit internal partner terms and application status. These notes are never rendered publicly."
      eyebrow="Affiliate CRUD"
      title={`Edit ${program.name}`}
    >
      <AdminAffiliateProgramForm
        action={updateAffiliateProgram}
        program={program}
        submitLabel="Save program"
      />
    </AdminPageShell>
  );
}
