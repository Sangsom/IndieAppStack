const destructiveFlags = new Set([
  "--delete",
  "--replace",
  "--reset",
  "--truncate",
]);

const knownFlags = new Set(["--dry-run", "--upsert-only"]);

const timestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function parseSeedArgs(argv) {
  const args = argv.slice(2);

  for (const arg of args) {
    if (destructiveFlags.has(arg)) {
      throw new Error(
        `Refusing ${arg}. Production seeding is upsert-only and does not delete rows.`,
      );
    }

    if (!knownFlags.has(arg)) {
      throw new Error(`Unknown seed argument: ${arg}`);
    }
  }

  return {
    dryRun: args.includes("--dry-run"),
    upsertOnly: true,
  };
}

export function conflictColumns(onConflict) {
  if (!onConflict || typeof onConflict !== "string") {
    throw new Error("Upsert requires onConflict. Refusing an unbounded write.");
  }

  const columns = onConflict
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean);

  if (columns.length === 0) {
    throw new Error("Upsert requires onConflict. Refusing an unbounded write.");
  }

  return columns;
}

export function stableValue(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    if (timestampPattern.test(value)) {
      const parsed = Date.parse(value);

      if (!Number.isNaN(parsed)) {
        return new Date(parsed).toISOString();
      }
    }

    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => stableValue(item));
  }

  if (typeof value === "object") {
    const sorted = {};

    for (const key of Object.keys(value).sort()) {
      sorted[key] = stableValue(value[key]);
    }

    return sorted;
  }

  return value;
}

export function valuesEqual(left, right) {
  return (
    JSON.stringify(stableValue(left)) === JSON.stringify(stableValue(right))
  );
}

export function conflictKey(row, columns) {
  return columns
    .map((column) => JSON.stringify(stableValue(row[column] ?? null)))
    .join("|");
}

// PostgREST upsert sends the union of keys and treats missing keys as null
// (`defaultToNull: true`). The diff uses that same shape.
export function normalizePayloadRows(rows) {
  const keys = [];
  const seen = new Set();

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }

  return rows.map((row) => {
    const normalized = {};

    for (const key of keys) {
      normalized[key] = row[key] === undefined ? null : row[key];
    }

    return normalized;
  });
}

function payloadChanged(row, existing) {
  return Object.keys(row).some(
    (field) => !valuesEqual(row[field], existing[field]),
  );
}

export function planUpsert(table, rows, onConflict, existingRows) {
  const columns = conflictColumns(onConflict);
  const normalized = normalizePayloadRows(rows);
  const existingByKey = new Map();

  for (const existing of existingRows) {
    existingByKey.set(conflictKey(existing, columns), existing);
  }

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  const previewRows = [];

  for (const [index, row] of normalized.entries()) {
    const existing = existingByKey.get(conflictKey(row, columns));

    if (!existing) {
      inserted += 1;
      previewRows.push({
        ...row,
        id: row.id ?? `dry-run:${table}:${index}`,
      });
      continue;
    }

    if (payloadChanged(row, existing)) {
      updated += 1;
    } else {
      unchanged += 1;
    }

    previewRows.push({
      ...existing,
      ...row,
      id: existing.id ?? row.id,
    });
  }

  return {
    inserted,
    previewRows,
    table,
    unchanged,
    updated,
  };
}
