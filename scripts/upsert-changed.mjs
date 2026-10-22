import {
  combineUpsertResult,
  conflictColumns,
  planUpsert,
} from "./seed-plan.mjs";

const pageSize = 1000;

export async function fetchAllRows(supabase, table, columns) {
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    let query = supabase.from(table).select("*");

    for (const column of columns) {
      query = query.order(column, { ascending: true });
    }

    const { data, error } = await query.range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`${table} diff failed: ${error.message}`);
    }

    rows.push(...(data ?? []));

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return rows;
}

// Compares each row to the stored row on the conflict key and writes only
// inserts and real field changes. Identical rows are returned with their
// existing ids and are not sent to PostgREST, so the updated_at trigger does
// not run for them.
export async function upsertChangedRows(
  supabase,
  table,
  rows,
  options,
  { dryRun = false } = {},
) {
  const optionNames = Object.keys(options ?? {});

  if (
    optionNames.some((name) => name !== "onConflict") ||
    !options?.onConflict
  ) {
    throw new Error(
      `${table} seed refused. Upserts require onConflict and no other write options.`,
    );
  }

  const existing = await fetchAllRows(
    supabase,
    table,
    conflictColumns(options.onConflict),
  );
  const plan = planUpsert(table, rows, options.onConflict, existing);

  if (dryRun || plan.rowsToWrite.length === 0) {
    return {
      plan,
      rows: plan.previewRows,
    };
  }

  const { data, error } = await supabase
    .from(table)
    .upsert(plan.rowsToWrite, options)
    .select();

  if (error) {
    throw new Error(`${table} upsert failed: ${error.message}`);
  }

  return {
    plan,
    rows: combineUpsertResult(options.onConflict, plan, data ?? []),
  };
}
