import Link from "next/link";

import { createAffiliateLink } from "../actions";
import { AdminAffiliateLinkForm } from "@/components/admin/admin-affiliate-link-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminAffiliateLinkOptions } from "@/lib/admin-affiliate-links";

export default async function NewAdminAffiliateLinkPage() {
  const options = await getAdminAffiliateLinkOptions();

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/links"
        >
          Back to links
        </Link>
      }
      description="Create a public redirect slug for an affiliate destination and connect it to a tool and partner program."
      eyebrow="Affiliate CRUD"
      title="New affiliate link"
    >
      <AdminAffiliateLinkForm
        action={createAffiliateLink}
        options={options}
        submitLabel="Create link"
      />
    </AdminPageShell>
  );
}
