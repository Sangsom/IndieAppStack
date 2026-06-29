import Link from "next/link";
import { notFound } from "next/navigation";

import { updateAffiliateLink } from "../../actions";
import { AdminAffiliateLinkForm } from "@/components/admin/admin-affiliate-link-form";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import {
  getAdminAffiliateLinkEditor,
  getAdminAffiliateLinkOptions,
} from "@/lib/admin-affiliate-links";

type EditAdminAffiliateLinkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminAffiliateLinkPage({
  params,
}: EditAdminAffiliateLinkPageProps) {
  const { id } = await params;
  const [link, options] = await Promise.all([
    getAdminAffiliateLinkEditor(id),
    getAdminAffiliateLinkOptions(),
  ]);

  if (!link) {
    notFound();
  }

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
      description="Update the destination, redirect slug, status, relationship mapping, rel value, and disclosure requirement."
      eyebrow="Affiliate CRUD"
      title={`Edit ${link.slug}`}
    >
      <AdminAffiliateLinkForm
        action={updateAffiliateLink}
        link={link}
        options={options}
        submitLabel="Save link"
      />
    </AdminPageShell>
  );
}
