import { redactSecrets } from "./revalidate-production.mjs";

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

const LIST_HEADERS = [
  "Would push these migrations:",
  "Do you want to push these migrations to the remote database?",
];

const OUTPUT_TAIL_LINES = 20;

export function stripAnsi(text) {
  return String(text ?? "")
    .replace(/\u001b(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "")
    .replace(/\r/g, "");
}

export function extractVersions(text) {
  const found = stripAnsi(text).match(/\d{14}/g) ?? [];

  return [...new Set(found)].sort();
}

function listSection(text) {
  let headerAt = -1;
  let headerLength = 0;

  for (const header of LIST_HEADERS) {
    const found = text.indexOf(header);

    if (found !== -1 && (headerAt === -1 || found < headerAt)) {
      headerAt = found;
      headerLength = header.length;
    }
  }

  if (headerAt === -1) {
    return null;
  }

  const lines = text.slice(headerAt + headerLength).split("\n");
  const section = [];
  let started = false;

  for (const line of lines) {
    const blank = line.trim() === "";

    if (!started) {
      if (blank) {
        continue;
      }

      if (/^Finished\b/i.test(line.trim())) {
        break;
      }

      started = true;
      section.push(line);
      continue;
    }

    if (blank || /^Finished\b/i.test(line.trim())) {
      break;
    }

    section.push(line);
  }

  return section.join("\n");
}

export function pendingVersions(text) {
  const clean = stripAnsi(text);
  const section = listSection(clean);

  return extractVersions(section === null ? clean : section);
}

function migrationSource(item) {
  if (typeof item === "string") {
    return item;
  }

  if (!item || typeof item !== "object") {
    return "";
  }

  return item.version ?? item.name ?? item.file ?? item.path ?? "";
}

function versionsFromMigrations(migrations) {
  if (!Array.isArray(migrations)) {
    return [];
  }

  const versions = [];

  for (const item of migrations) {
    const match = String(migrationSource(item)).match(/\d{14}/);

    if (match) {
      versions.push(match[0]);
    }
  }

  return [...new Set(versions)].sort();
}

function parseJsonPlan(text) {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      continue;
    }

    let value;

    try {
      value = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }

    const hasUpToDate = Object.hasOwn(value, "upToDate");
    const hasMigrations = Object.hasOwn(value, "migrations");

    if (!hasUpToDate && !hasMigrations) {
      continue;
    }

    return {
      upToDate: value.upToDate === true,
      versions: versionsFromMigrations(value.migrations),
    };
  }

  return null;
}

function cleanCell(cell) {
  return cell
    .trim()
    .replace(/^`+|`+$/g, "")
    .trim();
}

export function remoteAppliedVersions(output) {
  const applied = new Set();

  for (const line of stripAnsi(output).split("\n")) {
    if (/[|│┃]/.test(line)) {
      const cells = line.split(/[|│┃]/).map(cleanCell);

      if (cells[0] === "") {
        cells.shift();
      }

      if (cells.at(-1) === "") {
        cells.pop();
      }

      if (/^\d{14}$/.test(cells[1] ?? "")) {
        applied.add(cells[1]);
      }

      continue;
    }

    const versions = line.match(/\d{14}/g) ?? [];

    if (versions.length >= 2) {
      applied.add(versions[1]);
    }
  }

  return applied;
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

function mustRunDetail(versions) {
  return versions
    .map((version) => `Do not mark ${version} applied; it must run.`)
    .join("\n");
}

function outputTail(text, secrets) {
  const lines = text.split("\n");

  if (lines.at(-1) === "") {
    lines.pop();
  }

  const tail = lines.slice(-OUTPUT_TAIL_LINES).join("\n");

  if (!tail.trim()) {
    return "";
  }

  return `Dry-run output:\n${redactSecrets(tail, secrets)}`;
}

/**
 * Decide whether a dry-run result is safe to apply.
 * `hold` skips the push and exits 0 (no new migration is waiting).
 * `fail` skips the push and exits 1 (a new migration is blocked, or the
 * dry-run itself failed).
 * `push` is the only action that may run `supabase db push`.
 */
export function planSupabasePush({
  output,
  status,
  baselineVersions,
  secrets = [],
}) {
  const text = stripAnsi(output);
  const jsonPlan = parseJsonPlan(text);
  const versions = jsonPlan ? jsonPlan.versions : pendingVersions(text);
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
  const upToDate =
    status === 0 &&
    versions.length === 0 &&
    ((jsonPlan && jsonPlan.upToDate) ||
      (!jsonPlan && /Remote database is up to date/i.test(text)));

  if (remoteOnly) {
    return {
      action: "fail",
      baselinePending,
      detail:
        "This job will not repair automatically. Compare local and remote with `supabase migration list` before changing any history row by hand.",
      exitCode: 1,
      otherPending,
      summary:
        "Remote migration history has versions that are not in supabase/migrations. Not pushing.",
    };
  }

  if (upToDate) {
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
        mustRunDetail(otherPending),
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
    detail: outputTail(text, secrets),
    exitCode: 1,
    otherPending,
    summary:
      "supabase db push --dry-run did not report a usable migration list. Not pushing.",
  };
}
