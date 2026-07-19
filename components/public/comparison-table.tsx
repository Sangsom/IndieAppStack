import { InlineMarkdown } from "@/components/public/inline-markdown";
import { cn } from "@/lib/utils";

export type ComparisonColumn = {
  key: string;
  label: string;
};

export type ComparisonCell = {
  value: string;
  winner?: boolean;
};

export type ComparisonRow = {
  cells: Record<string, ComparisonCell | string>;
  feature: string;
};

type ComparisonTableProps = {
  caption: string;
  className?: string;
  columns: ComparisonColumn[];
  // Header for the first (row-header) column. Defaults to "Feature" for
  // comparison matrices; a pricing table passes "Plan", etc.
  featureLabel?: string;
  rows: ComparisonRow[];
};

function getCellValue(cell: ComparisonCell | string) {
  return typeof cell === "string" ? cell : cell.value;
}

function isWinnerCell(cell: ComparisonCell | string) {
  return typeof cell === "string" ? false : cell.winner === true;
}

export function ComparisonTable({
  caption,
  className,
  columns,
  featureLabel = "Feature",
  rows,
}: ComparisonTableProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-rule bg-surface shadow-field",
        className,
      )}
    >
      <div className="border-b border-rule px-4 py-3">
        <h3 className="font-serif text-2xl font-semibold text-ink">
          {caption}
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule">
              <th
                className="w-48 bg-paper px-4 py-3 font-mono text-label-sm font-semibold uppercase text-muted"
                scope="col"
              >
                {featureLabel}
              </th>
              {columns.map((column) => (
                <th
                  className="px-4 py-3 font-mono text-label-sm font-semibold uppercase text-muted"
                  key={column.key}
                  scope="col"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="border-b border-rule last:border-b-0"
                key={row.feature}
              >
                <th
                  className="bg-paper px-4 py-4 font-semibold text-ink"
                  scope="row"
                >
                  {row.feature}
                </th>
                {columns.map((column) => {
                  const cell = row.cells[column.key] ?? "";
                  const isWinner = isWinnerCell(cell);

                  return (
                    <td
                      className={cn(
                        "px-4 py-4 text-body-md text-muted",
                        isWinner &&
                          "bg-accent-soft font-semibold text-pine ring-1 ring-inset ring-pine/20",
                      )}
                      key={column.key}
                    >
                      <InlineMarkdown text={getCellValue(cell)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
