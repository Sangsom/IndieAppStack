import Link from "next/link";

import { ToolFilterForm } from "@/components/public/tool-filter-form";
import { ToolCard } from "@/components/public/tool-card";
import {
  getToolDirectoryData,
  parseToolDirectoryFilters,
  type FilterGroup,
  type ToolDirectoryFilters,
} from "@/lib/tool-directory-data";

type ToolsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

function getActiveFilterCount(filters: ToolDirectoryFilters) {
  return Object.values(filters).reduce(
    (count, values) => count + values.length,
    0,
  );
}

function FilterFieldset({
  filters,
  group,
}: {
  filters: ToolDirectoryFilters;
  group: FilterGroup;
}) {
  const selectedValues = filters[group.key];

  return (
    <fieldset className="border-t border-rule pt-5 first:border-t-0 first:pt-0">
      <legend className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
        {group.label}
      </legend>
      <div className="mt-3 grid gap-2">
        {group.options.map((option) => (
          <label
            className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-button border border-rule bg-paper px-3 py-2 text-sm text-ink transition-colors hover:border-pine"
            key={`${group.key}-${option.value}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <input
                className="size-4 accent-pine"
                defaultChecked={selectedValues.includes(option.value)}
                name={group.key}
                type="checkbox"
                value={option.value}
              />
              <span className="truncate">{option.label}</span>
            </span>
            <span className="font-mono text-label-sm font-semibold uppercase text-muted">
              {option.count}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const filters = parseToolDirectoryFilters(resolvedSearchParams);
  const { filterGroups, resultCount, totalCount, tools } =
    await getToolDirectoryData(filters);
  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="max-w-4xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          Tools directory
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Browse tools for every mobile app decision.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Filter the field guide by category, platform, pricing model, app
          stage, and tool type. Results are server-rendered and every filtered
          URL is shareable.
        </p>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
        <ToolFilterForm
          action="/tools"
          className="rounded-card border border-rule bg-surface p-5 shadow-field"
          method="get"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Filters
            </h2>
            {activeFilterCount ? (
              <Link
                className="text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                href="/tools"
              >
                Clear
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-5">
            {filterGroups.map((group) => (
              <FilterFieldset filters={filters} group={group} key={group.key} />
            ))}
          </div>

          <button
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            type="submit"
          >
            Apply filters
          </button>
        </ToolFilterForm>

        <section aria-live="polite">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {resultCount} of {totalCount} tools
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                {activeFilterCount ? "Filtered results" : "All published tools"}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Filters combine with AND across groups and OR within each group.
            </p>
          </div>

          {tools.length ? (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {tools.map((tool) => (
                <ToolCard
                  affiliateHref={tool.affiliateHref}
                  bestFor={tool.bestFor}
                  category={tool.category}
                  detailsHref={tool.detailsHref}
                  key={tool.name}
                  lastChecked={tool.lastChecked}
                  logoUrl={tool.logoUrl}
                  name={tool.name}
                  officialHref={tool.officialHref}
                  platforms={tool.platforms}
                  pricing={tool.pricing}
                  tagline={tool.tagline}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-card border border-rule bg-surface p-6 shadow-field">
              <h3 className="font-serif text-2xl font-semibold text-ink">
                No tools match those filters.
              </h3>
              <p className="mt-3 max-w-2xl text-body-md text-muted">
                Try clearing one filter group or start from a broader category.
                The directory is curated, so narrow combinations may fill in as
                more tools are reviewed.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  href="/tools"
                >
                  Clear filters
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  href="/stack-finder"
                >
                  Find my stack
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
