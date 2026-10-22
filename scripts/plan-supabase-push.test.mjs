import assert from "node:assert/strict";
import test from "node:test";

import {
  BASELINE_MIGRATION_VERSIONS,
  extractVersions,
  planSupabasePush,
} from "./plan-supabase-push.mjs";
import { pushSupabaseMigrations } from "./supabase-db-push.mjs";

const baseline = BASELINE_MIGRATION_VERSIONS;

function plan(output, status) {
  return planSupabasePush({
    baselineVersions: baseline,
    output,
    status,
  });
}

test("an up to date remote database does not push", () => {
  const result = plan("Remote database is up to date.\n", 0);

  assert.equal(result.action, "up-to-date");
  assert.equal(result.exitCode, 0);
  assert.equal(result.detail.includes("--include-all"), false);
});

test("a new migration is the only pending file", () => {
  const result = plan(
    [
      "DRY RUN: migrations will *not* be pushed to the database.",
      "Would push these migrations:",
      " • 20261022050000_updated_at_only_on_change.sql",
      "Finished supabase db push.",
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "push");
  assert.deepEqual(result.otherPending, ["20261022050000"]);
  assert.deepEqual(result.baselinePending, []);
});

test("ANSI bold around a filename still parses the version", () => {
  const output =
    "Would push these migrations:\n • \u001b[1m20261022050000_updated_at_only_on_change.sql\u001b[0m\n";

  assert.deepEqual(extractVersions(output), ["20261022050000"]);
  assert.equal(plan(output, 0).action, "push");
});

test("baseline versions already on main are not pushed", () => {
  const result = plan(
    baseline.map((version) => ` • ${version}_existing.sql`).join("\n"),
    0,
  );

  assert.equal(result.action, "hold");
  assert.equal(result.exitCode, 0);

  for (const version of baseline) {
    assert.match(result.detail, new RegExp(`--status applied ${version}`));
  }

  assert.match(result.detail, /Do not pass --include-all/);
  assert.doesNotMatch(result.detail, /20261022050000/);
});

test("a new migration waits when baseline history is missing", () => {
  const result = plan(
    [
      " • 20260628120000_healthcheck.sql",
      " • 20261022050000_updated_at_only_on_change.sql",
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.match(result.detail, /--status applied 20260628120000/);
  assert.match(result.detail, /20261022050000/);
  assert.doesNotMatch(result.detail, /--status applied 20261022050000/);
});

test("an out-of-order baseline gap is a hold, not an include-all push", () => {
  const result = plan(
    [
      "Found local migration files to be inserted before the last migration on remote database.",
      "Rerun the command with --include-all flag to apply these migrations:",
      "supabase/migrations/20260628120000_healthcheck.sql",
      "supabase/migrations/20260719120000_tools_body_pros_cons_noindex.sql",
    ].join("\n"),
    1,
  );

  assert.equal(result.action, "hold");
  assert.equal(result.exitCode, 0);
  assert.match(result.detail, /--status applied 20260628120000/);
  assert.match(result.detail, /Do not pass --include-all/);
});

test("remote history that is not in git fails and suggests reverted", () => {
  const result = plan(
    [
      "Remote migration versions not found in local migrations directory.",
      "supabase migration repair --status reverted 20260101010101",
    ].join("\n"),
    1,
  );

  assert.equal(result.action, "fail");
  assert.match(result.detail, /--status reverted 20260101010101/);
  assert.doesNotMatch(result.detail, /--status applied/);
});

test("a connection failure does not look like a history repair", () => {
  const result = plan("failed to connect to the database", 1);

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.equal(result.detail, "");
});

test("missing secrets skip before any CLI call", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: { SUPABASE_ACCESS_TOKEN: "present" },
    mode: "apply",
    run(args) {
      calls.push(args);

      return { output: "", status: 0 };
    },
  });

  assert.equal(calls.length, 0);
  assert.equal(result.exitCode, 0);
  assert.match(result.log, /SUPABASE_PROJECT_REF/);
  assert.match(result.log, /SUPABASE_DB_PASSWORD/);
  assert.match(result.log, /::warning/);
});

test("apply pushes only after a clean dry-run", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: {
      SUPABASE_ACCESS_TOKEN: "sbp_test_token",
      SUPABASE_DB_PASSWORD: "hunter2",
      SUPABASE_PROJECT_REF: "abcdefghijklmnopqrst",
    },
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          output:
            "password hunter2 ref abcdefghijklmnopqrst\n • 20261022050000_updated_at_only_on_change.sql\n",
          status: 0,
        };
      }

      if (args[1] === "link") {
        return { output: "Finished supabase link.", status: 0 };
      }

      return { output: "Finished supabase db push.", status: 0 };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(calls[0], [
    "--yes",
    "link",
    "--project-ref",
    "abcdefghijklmnopqrst",
  ]);
  assert.deepEqual(calls[1], ["--yes", "db", "push", "--dry-run"]);
  assert.deepEqual(calls[2], ["--yes", "db", "push"]);
  assert.equal(
    calls.some((args) => args.includes("--include-all")),
    false,
  );
  assert.equal(
    calls.some((args) => args.includes("hunter2")),
    false,
  );
  assert.doesNotMatch(result.log, /hunter2/);
  assert.doesNotMatch(result.log, /sbp_test_token/);
  assert.doesNotMatch(result.log, /abcdefghijklmnopqrst/);
});

test("dry-run mode does not apply a pending migration", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: {
      SUPABASE_ACCESS_TOKEN: "token",
      SUPABASE_DB_PASSWORD: "password",
      SUPABASE_PROJECT_REF: "ref",
    },
    mode: "dry-run",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          output: " • 20261022050000_updated_at_only_on_change.sql\n",
          status: 0,
        };
      }

      return { output: "linked", status: 0 };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(calls.length, 2);
  assert.match(result.log, /Dry run only/);
});

test("a baseline gap does not call db push", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: {
      SUPABASE_ACCESS_TOKEN: "token",
      SUPABASE_DB_PASSWORD: "password",
      SUPABASE_PROJECT_REF: "ref",
    },
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          output: " • 20260628124500_core_schema_and_rls.sql\n",
          status: 0,
        };
      }

      return { output: "linked", status: 0 };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(
    calls.some((args) => args.at(-1) === "push"),
    false,
  );
  assert.match(result.log, /--status applied 20260628124500/);
});

test("an up to date dry-run does not call db push or fail the job", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: {
      SUPABASE_ACCESS_TOKEN: "token",
      SUPABASE_DB_PASSWORD: "password",
      SUPABASE_PROJECT_REF: "ref",
    },
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return { output: "Remote database is up to date.\n", status: 0 };
      }

      return { output: "linked", status: 0 };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(calls.length, 2);
  assert.doesNotMatch(result.log, /::error/);
});

test("link failure stops before dry-run", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: {
      SUPABASE_ACCESS_TOKEN: "token",
      SUPABASE_DB_PASSWORD: "password",
      SUPABASE_PROJECT_REF: "ref",
    },
    mode: "apply",
    run(args) {
      calls.push(args);

      return { output: "project not found", status: 1 };
    },
  });

  assert.equal(result.exitCode, 1);
  assert.equal(calls.length, 1);
  assert.match(result.log, /supabase link failed/);
});
