import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminState } from "@/components/admin/admin-states";
import { AdminTable } from "@/components/admin/admin-table";
import {
  affiliateProgramStatusOptions,
  getAdminAffiliateProgramList,
  parseAffiliateProgramStatus,
} from "@/lib/admin-affiliate-programs";

type AdminAffiliateProgramsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  create_failed: {
    tone: "error",
    text: "The affiliate program could not be created. Check required fields and try again.",
  },
  created: {
    tone: "info",
    text: "Affiliate program created.",
  },
  duplicate_name: {
    tone: "error",
    text: "That affiliate program name already exists.",
  },
  invalid_email: {
    tone: "error",
    text: "Contact email must be valid.",
  },
  invalid_program: {
    tone: "error",
    text: "Check the affiliate program fields and try again.",
  },
  invalid_url: {
    tone: "error",
    text: "Application and dashboard URLs must be valid http or https URLs.",
  },
  missing_program: {
    tone: "error",
    text: "The selected affiliate program could not be found.",
  },
  update_failed: {
    tone: "error",
    text: "The affiliate program could not be updated. Check required fields and try again.",
  },
  updated: {
    tone: "info",
    text: "Affiliate program updated.",
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
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default async function AdminAffiliateProgramsPage({
  searchParams,
}: AdminAffiliateProgramsPageProps) {
  const params = (await searchParams) ?? {};
  const status = getParam(params, "status");
  const error = getParam(params, "error");
  const filter = parseAffiliateProgramStatus(getParam(params, "filter"));
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;
  const programs = await getAdminAffiliateProgramList(filter);

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
          href="/admin/affiliate-programs/new"
        >
          New program
        </Link>
      }
      description="Track application status, networks, commission notes, cookie terms, promotion rules, and internal contact details."
      eyebrow="Admin section"
      title="Affiliate programs"
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
          Application status
          <select
            className="h-10 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine"
            defaultValue={filter ?? ""}
            name="filter"
          >
            <option value="">All statuses</option>
            {affiliateProgramStatusOptions.map((option) => (
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
            href="/admin/affiliate-programs"
          >
            Clear
          </Link>
        </div>
      </form>

      <AdminTable
        caption="Admin affiliate programs"
        columns={[
          {
            key: "program",
            label: "Program",
          },
          {
            key: "network",
            label: "Network",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "terms",
            label: "Terms",
          },
          {
            key: "actions",
            label: "Actions",
          },
        ]}
        emptyDescription="Add the first affiliate program to start tracking applications and partner terms."
        emptyTitle="No affiliate programs"
        rows={programs.map((program) => ({
          actions: (
            <div className="flex flex-wrap gap-2">
              {program.application_url ? (
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                  href={program.application_url}
                >
                  Apply
                </Link>
              ) : null}
              {program.dashboard_url ? (
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                  href={program.dashboard_url}
                >
                  Dashboard
                </Link>
              ) : null}
              <Link
                className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
                href={`/admin/affiliate-programs/${program.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ),
          network: program.network,
          program: (
            <div>
              <p className="font-semibold text-ink">{program.name}</p>
              <p className="mt-1 text-sm text-muted">
                {program.contact_email ?? "No contact"} · {program.linkCount}{" "}
                links
              </p>
            </div>
          ),
          status: <StatusBadge status={program.status} />,
          terms: (
            <div className="max-w-md text-sm text-muted">
              <p>{program.commission_notes ?? "No commission notes"}</p>
              {program.cookie_notes ? (
                <p className="mt-1">Cookie: {program.cookie_notes}</p>
              ) : null}
            </div>
          ),
        }))}
      />
    </AdminPageShell>
  );
}
