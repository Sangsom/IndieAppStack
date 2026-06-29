import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminTable } from "@/components/admin/admin-table";
import {
  clickAnalyticsRangeOptions,
  getAdminClickAnalytics,
  parseClickAnalyticsRange,
  type ClickAnalyticsRow,
} from "@/lib/admin-click-analytics";

type AdminClicksPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string | null) {
  if (!value) {
    return "No clicks yet";
  }

  return dateFormatter.format(new Date(value));
}

function sumClicks(rows: ClickAnalyticsRow[]) {
  return rows.reduce((sum, row) => sum + row.clickCount, 0);
}

function MetricCard({
  label,
  value,
  detail,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <section className="rounded-card border border-rule bg-surface p-5 shadow-field">
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
        {label}
      </p>
      <p className="mt-3 font-serif text-4xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </section>
  );
}

function AnalyticsTable({
  emptyDescription,
  emptyTitle,
  maxClicks,
  rows,
  title,
}: {
  emptyDescription: string;
  emptyTitle: string;
  maxClicks: number;
  rows: ClickAnalyticsRow[];
  title: string;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Table total: {numberFormatter.format(sumClicks(rows))} clicks
          </p>
        </div>
      </div>
      <AdminTable
        caption={title}
        columns={[
          {
            key: "label",
            label: "Group",
          },
          {
            className: "min-w-64",
            key: "volume",
            label: "Volume",
          },
          {
            key: "lastClicked",
            label: "Last click",
          },
        ]}
        emptyDescription={emptyDescription}
        emptyTitle={emptyTitle}
        rows={rows.map((row) => ({
          label: (
            <div>
              <p className="font-semibold text-ink">{row.label}</p>
              <p className="mt-1 font-mono text-label-sm uppercase text-muted">
                {row.groupKey}
              </p>
            </div>
          ),
          lastClicked: formatDate(row.lastClickedAt),
          volume: (
            <div className="grid min-w-56 gap-2">
              <p className="font-semibold text-ink">
                {numberFormatter.format(row.clickCount)}
              </p>
              <div className="h-2 rounded-full bg-accent-soft">
                <div
                  className="h-2 rounded-full bg-pine"
                  style={{
                    width: `${maxClicks ? Math.max(6, (row.clickCount / maxClicks) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          ),
        }))}
      />
    </section>
  );
}

export default async function AdminClicksPage({
  searchParams,
}: AdminClicksPageProps) {
  const params = (await searchParams) ?? {};
  const range = parseClickAnalyticsRange(getParam(params, "range"));
  const analytics = await getAdminClickAnalytics(range);
  const allRows = [
    ...analytics.byTool,
    ...analytics.bySourcePage,
    ...analytics.byPlacement,
  ];
  const maxClicks = Math.max(0, ...allRows.map((row) => row.clickCount));

  return (
    <AdminPageShell
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
          href="/admin/links"
        >
          Manage links
        </Link>
      }
      description="Track outbound affiliate clicks by tool, source page, and placement so content decisions can follow real conversion signals."
      eyebrow="Admin analytics"
      title="Click analytics"
    >
      <form className="rounded-card border border-rule bg-surface p-4 shadow-field">
        <label className="grid gap-2 text-sm font-semibold text-ink sm:max-w-xs">
          Date range
          <select
            className="h-10 rounded-button border border-rule bg-paper px-3 text-base text-ink outline-none transition-colors focus:border-pine"
            defaultValue={analytics.range}
            name="range"
          >
            {clickAnalyticsRangeOptions.map((option) => (
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
            Apply range
          </button>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
            href="/admin/clicks"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          detail={`Since ${dateFormatter.format(new Date(analytics.startAt))}`}
          label="Total clicks"
          value={numberFormatter.format(analytics.totalClicks)}
        />
        <MetricCard
          detail="Unique grouped tools in the selected range"
          label="Tools clicked"
          value={numberFormatter.format(analytics.byTool.length)}
        />
        <MetricCard
          detail="Unique source pages or source tags in the selected range"
          label="Sources"
          value={numberFormatter.format(analytics.bySourcePage.length)}
        />
      </div>

      <AnalyticsTable
        emptyDescription="Affiliate clicks with linked tools will appear here after visitors use /go redirects."
        emptyTitle="No tool clicks"
        maxClicks={maxClicks}
        rows={analytics.byTool}
        title="Clicks by tool"
      />

      <AnalyticsTable
        emptyDescription="Clicks with source or source_page metadata will appear here."
        emptyTitle="No source-page clicks"
        maxClicks={maxClicks}
        rows={analytics.bySourcePage}
        title="Clicks by source page"
      />

      <AnalyticsTable
        emptyDescription="Clicks with placement metadata will appear here."
        emptyTitle="No placement clicks"
        maxClicks={maxClicks}
        rows={analytics.byPlacement}
        title="Clicks by placement"
      />
    </AdminPageShell>
  );
}
