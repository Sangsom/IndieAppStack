import type { ReactNode } from "react";

import { AdminState } from "@/components/admin/admin-states";
import { cn } from "@/lib/utils";

type AdminTableColumn = {
  className?: string;
  key: string;
  label: string;
};

type AdminTableProps = {
  caption?: string;
  columns: AdminTableColumn[];
  emptyDescription: string;
  emptyTitle: string;
  rows: Array<Record<string, ReactNode>>;
};

export function AdminTable({
  caption,
  columns,
  emptyDescription,
  emptyTitle,
  rows,
}: AdminTableProps) {
  if (!rows.length) {
    return (
      <AdminState
        description={emptyDescription}
        title={emptyTitle}
        tone="empty"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-rule bg-surface shadow-field">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="border-b border-rule bg-accent-soft">
            <tr>
              {columns.map((column) => (
                <th
                  className={cn(
                    "px-4 py-3 font-mono text-label-sm font-semibold uppercase tracking-[0.12em] text-pine",
                    column.className,
                  )}
                  key={column.key}
                  scope="col"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {rows.map((row, index) => (
              <tr className="bg-surface" key={index}>
                {columns.map((column) => (
                  <td
                    className={cn(
                      "px-4 py-4 align-top text-ink",
                      column.className,
                    )}
                    key={column.key}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
