// Versions already on main before migration automation. Their SQL is not safe
// to replay: create type, create table, and add column fail or change objects
// if production was built by hand. `supabase db push` applies every local
// version missing from supabase_migrations.schema_migrations, so a missing
// history row would re-run these files. Mark them applied with
// `supabase migration repair` instead. Do not pass --include-all.
export const BASELINE_MIGRATION_VERSIONS = [
  "20260628120000",
  "20260628124500",
  "20260628152000",
  "20260629110000",
  "20260719120000",
];

export function stripAnsi(text) {
  return String(text ?? "").replace(/\u001b\[[0-9;]*m/g, "");
}

export function extractVersions(text) {
  const found = stripAnsi(text).match(/\d{14}/g) ?? [];

  return [...new Set(found)].sort();
}

export function repairCommands(status, versions) {
  return [...versions]
    .sort()
    .map(
      (version) => `supabase migration repair --status ${status} ${version}`,
    );
}

function repairDetail(status, versions) {
  return [
    "Mark those history rows without running the SQL:",
    ...repairCommands(status, versions),
    "Do not pass --include-all. That flag would run the files.",
  ].join("\n");
}

/**
 * Decide whether a dry-run result is safe to apply.
 * `hold` skips the push and exits 0 (no new migration is waiting).
 * `fail` skips the push and exits 1 (a new migration is blocked, or the
 * dry-run itself failed).
 * `push` is the only action that may run `supabase db push`.
 */
export function planSupabasePush({ output, status, baselineVersions }) {
  const text = stripAnsi(output);
  const versions = extractVersions(text);
  const baseline = new Set(baselineVersions);
  const baselinePending = versions.filter((version) => baseline.has(version));
  const otherPending = versions.filter((version) => !baseline.has(version));
  const remoteOnly =
    /Remote migration versions not found in local migrations directory/i.test(
      text,
    );
  const outOfOrder =
    /inserted before the last migration on remote database/i.test(text);
  const listed = status === 0 || outOfOrder;

  if (remoteOnly) {
    const reverted = otherPending.length > 0 ? otherPending : versions;

    return {
      action: "fail",
      baselinePending,
      detail: [
        "Compare local and remote with `supabase migration list`.",
        "To drop a history row that was recorded by mistake, without changing the schema:",
        ...(reverted.length > 0
          ? repairCommands("reverted", reverted)
          : ["supabase migration repair --status reverted <version>"]),
        "Do not run that repair until the version is confirmed to be history-only.",
      ].join("\n"),
      exitCode: 1,
      otherPending,
      summary:
        "Remote migration history has versions that are not in supabase/migrations. Not pushing.",
    };
  }

  if (status === 0 && versions.length === 0 && /up to date/i.test(text)) {
    return {
      action: "up-to-date",
      baselinePending,
      detail: "",
      exitCode: 0,
      otherPending,
      summary: "Remote database is up to date. No migrations to apply.",
    };
  }

  if (listed && baselinePending.length > 0 && otherPending.length === 0) {
    return {
      action: "hold",
      baselinePending,
      detail: repairDetail("applied", baselinePending),
      exitCode: 0,
      otherPending,
      summary:
        "Not pushing. Remote history is missing migrations already on main. Re-running them is not safe. No new migration is pending, so content seeding can continue.",
    };
  }

  if (listed && baselinePending.length > 0 && otherPending.length > 0) {
    return {
      action: "fail",
      baselinePending,
      detail: [
        repairDetail("applied", baselinePending),
        `Do not mark these versions applied. They still need to run: ${otherPending.join(", ")}.`,
      ].join("\n"),
      exitCode: 1,
      otherPending,
      summary: `Not pushing. Remote history is missing migrations already on main, and newer migrations are pending (${otherPending.join(", ")}). db push would re-run the old SQL before the new file.`,
    };
  }

  if (status === 0 && otherPending.length > 0) {
    return {
      action: "push",
      baselinePending,
      detail: "",
      exitCode: 0,
      otherPending,
      summary: `Pending migrations: ${otherPending.join(", ")}.`,
    };
  }

  if (outOfOrder) {
    return {
      action: "fail",
      baselinePending,
      detail:
        "Do not pass --include-all. Repair the remote history, then re-run.",
      exitCode: 1,
      otherPending,
      summary:
        "Not pushing. Local migrations are out of order relative to remote history.",
    };
  }

  return {
    action: "fail",
    baselinePending,
    detail: "",
    exitCode: 1,
    otherPending,
    summary:
      "supabase db push --dry-run did not report a usable migration list. Not pushing.",
  };
}
