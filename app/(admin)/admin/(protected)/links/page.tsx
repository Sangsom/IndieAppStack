import Link from "next/link";

import { CopyAffiliateLinkButton } from "@/components/admin/copy-affiliate-link-button";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import {
  affiliateLinkStatusOptions,
  getAdminAffiliateLinkList,
  parseAffiliateLinkFilter,
} from "@/lib/admin-affiliate-links";
import { getAffiliateRedirectPath } from "@/lib/affiliate-links";

type AdminLinksPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  create_failed: {
    tone: "error",
    text: "The affiliate link could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Affiliate link created.",
  },
  duplicate_slug: {
    tone: "error",
    text: "That internal slug already exists. Choose another slug.",
  },
  invalid_link: {
    tone: "error",
    text: "Check the affiliate link fields and try again.",
  },
  invalid_slug: {
    tone: "error",
    text: "Internal slugs must use lowercase letters, numbers, and hyphens.",
  },
  invalid_url: {
    tone: "error",
    text: "Destination URL must be a valid http or https URL.",
  },
  missing_link: {
    tone: "error",
    text: "The selected affiliate link could not be found.",
  },
  update_failed: {
    tone: "error",
    text: "The affiliate link could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Affiliate link updated.",
  },
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-badge border border-rule bg-paper px-2 py-1 font-mono text-label-sm font-semibold uppercase text-ink">
      {status}
    </span>
  );
}

export default async function AdminLinksPage({
  searchParams,
}: AdminLinksPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const filter = parseAffiliateLinkFilter(getParam(params, "filter"));
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const links = await getAdminAffiliateLinkList(filter);
  const attentionCount = links.filter((link) => link.needsAttention).length;

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          href="/admin/links/new"
        >
          New link
        </Link>
      }
      description="Manage public affiliate redirect slugs, destination URLs, partner relationships, status, and disclosure defaults."
      eyebrow="Admin section"
      title="Affiliate links"
    >
      {message ? (
        <AdminState
          description={message.text}
          title={message.tone === "error" ? "Action failed" : "Action complete"}
          tone={message.tone === "error" ? "error" : "empty"}
        />
      ) : null}

      <form className="rounded-card border border-rule bg-surface p-4 shadow-field">
        <label className="grid gap-2 text-sm font-semibold text-ink sm:max-w-xs">
          Link status
          <select
            className="h-10 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine"
            defaultValue={filter ?? ""}
            name="filter"
          >
            <option value="">All links</option>
            <option value="attention">Broken/missing report</option>
            {affiliateLinkStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center justify-center rounded-button border border-pine bg-pine px-3 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
            type="submit"
          >
            Apply filter
          </button>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/links"
          >
            Clear
          </Link>
        </div>
      </form>

      {attentionCount ? (
        <AdminState
          action={
            <Link
              className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
              href="/admin/links?filter=attention"
            >
              View report
            </Link>
          }
          description={`${attentionCount} link${attentionCount === 1 ? "" : "s"} need attention because they are inactive, broken, or missing a tool/program relationship.`}
          title="Broken/missing link report"
        />
      ) : null}

      <AdminTable
        caption="Admin affiliate links"
        columns={[
          {
            key: "link",
            label: "Link",
          },
          {
            key: "destination",
            label: "Destination",
          },
          {
            key: "relationships",
            label: "Relationships",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Create an affiliate link to generate the first internal redirect slug."
        emptyTitle="No affiliate links"
        rows={links.map((link) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              <CopyAffiliateLinkButton
                value={getAffiliateRedirectPath(link.slug, "admin")}
              />
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/links/${link.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ),
          destination: (
            <div className="max-w-xs break-words text-sm text-muted">
              <Link
                className="text-pine underline-offset-4 hover:underline"
                href={link.destination_url}
              >
                {link.destination_url}
              </Link>
              <p className="mt-1 font-mono text-label-sm uppercase text-muted">
                rel: {link.default_rel}
              </p>
            </div>
          ),
          link: (
            <div>
              <p className="font-mono text-sm font-semibold text-ink">
                {link.redirectPath}
              </p>
              <p className="mt-1 text-sm text-muted">
                Copy source path: {getAffiliateRedirectPath(link.slug, "admin")}
              </p>
            </div>
          ),
          relationships: (
            <div className="text-sm text-muted">
              <p>{link.toolName ?? "Missing tool"}</p>
              <p className="mt-1">{link.programName ?? "Missing program"}</p>
              {link.disclosure_required ? (
                <p className="mt-1 font-semibold text-ink">
                  Disclosure required
                </p>
              ) : null}
            </div>
          ),
          status: <StatusBadge status={link.status} />,
        }))}
      />
    </AdminPageShell>
  );
}
