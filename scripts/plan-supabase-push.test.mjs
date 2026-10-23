import assert from "node:assert/strict";
import test from "node:test";

import {
  BASELINE_MIGRATION_VERSIONS,
  extractVersions,
  planSupabasePush,
  remoteAppliedVersions,
} from "./plan-supabase-push.mjs";
import {
  pushSupabaseMigrations,
  supabaseCommandResult,
} from "./supabase-db-push.mjs";

const baseline = BASELINE_MIGRATION_VERSIONS;

const secrets = {
  SUPABASE_ACCESS_TOKEN: "sbp_test_token",
  SUPABASE_DB_PASSWORD: "hunter2",
  SUPABASE_PROJECT_REF: "abcdefghijklmnopqrst",
};

function plan(output, status) {
  return planSupabasePush({
    baselineVersions: baseline,
    output,
    status,
  });
}

function assertNoUnsafeArgs(calls) {
  for (const args of calls) {
    assert.equal(args.includes("repair"), false, args.join(" "));
    assert.equal(args.includes("--include-all"), false, args.join(" "));
  }
}

const appliedList = [
  "| Local | Remote | Time (UTC) |",
  "| 20261022050000 | 20261022050000 | 2026-10-22 05:00:00 |",
].join("\n");

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
  assert.match(
    result.detail,
    /Do not mark 20261022050000 applied; it must run\./,
  );
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

test("remote history that is not in git fails and does not repair", () => {
  const result = plan(
    [
      "Remote migration versions not found in local migrations directory.",
      "supabase migration repair --status reverted 20260101010101",
      "supabase migration repair --status reverted 20261022050000",
    ].join("\n"),
    1,
  );

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.match(result.detail, /will not repair automatically/i);
  assert.doesNotMatch(result.detail, /migration repair/);
  assert.doesNotMatch(result.detail, /--status reverted/);
  assert.doesNotMatch(result.detail, /--status applied/);
});

test("a connection failure does not look like a history repair", () => {
  const result = plan("failed to connect to the database", 1);

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.match(result.detail, /failed to connect to the database/);
  assert.doesNotMatch(result.detail, /migration repair/);
  assert.doesNotMatch(result.detail, /--include-all/);
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

      if (args.includes("list")) {
        return { output: appliedList, status: 0 };
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
  assert.deepEqual(calls[3], ["migration", "list", "--linked"]);
  assertNoUnsafeArgs(calls);
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

test("dry-run stderr lists the migration when stdout is only the footer", () => {
  const combined = supabaseCommandResult({
    stdout: "Finished supabase db push.",
    stderr:
      "DRY RUN...\nWould push these migrations:\n • 20261022050000_updated_at_only_on_change.sql",
    status: 0,
  });
  const result = plan(combined.output, combined.status);

  assert.equal(combined.status, 0);
  assert.equal(result.action, "push");
  assert.deepEqual(result.otherPending, ["20261022050000"]);
  assert.deepEqual(result.baselinePending, []);
});

test("stderr secrets are redacted and the planned migration is confirmed", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: secrets,
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("link")) {
        return { output: "linked", status: 0 };
      }

      if (args.includes("--dry-run")) {
        return {
          stdout: "Finished supabase db push.",
          stderr: [
            "DRY RUN...",
            "Would push these migrations:",
            " • 20261022050000_updated_at_only_on_change.sql",
            "host db.abcdefghijklmnopqrst.supabase.co password hunter2 token sbp_test_token",
          ].join("\n"),
          status: 0,
        };
      }

      if (args.includes("list")) {
        return {
          stdout: appliedList,
          stderr: "password hunter2",
          status: 0,
        };
      }

      return {
        output:
          "Applying migration 20261022050000_updated_at_only_on_change.sql",
        status: 0,
      };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(calls[2], ["--yes", "db", "push"]);
  assert.deepEqual(calls[3], ["migration", "list", "--linked"]);
  assert.match(result.log, /20261022050000/);
  assert.match(result.log, /\[redacted\]/);
  assert.doesNotMatch(result.log, /hunter2/);
  assert.doesNotMatch(result.log, /sbp_test_token/);
  assert.doesNotMatch(result.log, /abcdefghijklmnopqrst/);
  assertNoUnsafeArgs(calls);
});

test("a history mismatch fails closed and does not repair a new migration", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: secrets,
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          stdout: "",
          stderr: [
            "Remote migration versions not found in local migrations directory.",
            "Make sure your local git repo is up-to-date. If the error persists, try repairing the migration history table:",
            "supabase migration repair --status reverted 20261022050000",
          ].join("\n"),
          status: 1,
        };
      }

      return { output: "linked", status: 0 };
    },
  });

  assert.equal(result.exitCode, 1);
  assert.equal(
    calls.some((args) => args.at(-1) === "push"),
    false,
  );
  assert.match(result.log, /will not repair automatically/i);
  assert.doesNotMatch(result.log, /migration repair/);
  assert.doesNotMatch(result.log, /20261022050000/);
  assertNoUnsafeArgs(calls);
});

test("five baseline versions plus a new migration must run the new file", () => {
  const result = plan(
    [
      ...baseline.map((version) => ` • ${version}_existing.sql`),
      " • 20261022050000_updated_at_only_on_change.sql",
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.equal(baseline.length, 5);
  assert.deepEqual(result.baselinePending, [...baseline].sort());
  assert.deepEqual(result.otherPending, ["20261022050000"]);
  assert.match(
    result.detail,
    /Do not mark 20261022050000 applied; it must run\./,
  );
  assert.doesNotMatch(result.detail, /--status applied 20261022050000/);

  for (const version of baseline) {
    assert.match(result.detail, new RegExp(`--status applied ${version}`));
  }
});

test("every non-baseline pending version is told to run", () => {
  const result = plan(
    [
      " • 20260628120000_healthcheck.sql",
      " • 20261101010101_later.sql",
      " • 20261202020202_after.sql",
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "fail");
  assert.match(
    result.detail,
    /Do not mark 20261101010101 applied; it must run\./,
  );
  assert.match(
    result.detail,
    /Do not mark 20261202020202 applied; it must run\./,
  );
  assert.doesNotMatch(result.detail, /--status applied 20261101010101/);
  assert.doesNotMatch(result.detail, /--status applied 20261202020202/);
});

test("a confirm prompt list ignores versions after the blank line", () => {
  const result = plan(
    [
      "Do you want to push these migrations to the remote database?",
      " • 20261022050000_updated_at_only_on_change.sql",
      "",
      " [Y/n] y",
      "20260628120000",
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "push");
  assert.deepEqual(result.otherPending, ["20261022050000"]);
  assert.deepEqual(result.baselinePending, []);
});

test("carriage returns do not hide the migration list", () => {
  const result = plan(
    "Would push these migrations:\r\n • 20261022050000_updated_at_only_on_change.sql\r\n",
    0,
  );

  assert.equal(result.action, "push");
  assert.deepEqual(result.otherPending, ["20261022050000"]);
});

test("a json migration list is the source of truth", () => {
  const result = plan(
    [
      " • 20260628120000_healthcheck.sql",
      '{"upToDate":false,"dryRun":true,"migrations":["20261022050000_updated_at_only_on_change.sql"],"message":"Finished supabase db push."}',
    ].join("\n"),
    0,
  );

  assert.equal(result.action, "push");
  assert.deepEqual(result.otherPending, ["20261022050000"]);
  assert.deepEqual(result.baselinePending, []);
});

test("json upToDate with an empty migration list does not push", () => {
  const result = plan(
    '{"upToDate":true,"migrations":[]}\nWould push these migrations:\n • 20261022050000_updated_at_only_on_change.sql\n',
    0,
  );

  assert.equal(result.action, "up-to-date");
  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.otherPending, []);
});

test("a history mismatch beats a json up to date flag", () => {
  const result = plan(
    'Remote migration versions not found in local migrations directory.\n{"upToDate":true,"migrations":["20261022050000_updated_at_only_on_change.sql"]}\n',
    0,
  );

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.match(result.detail, /will not repair automatically/i);
  assert.doesNotMatch(result.detail, /migration repair/);
});

test("an unusable dry-run keeps the last redacted output lines", () => {
  const lines = Array.from({ length: 30 }, (_, index) => `row-${index}`);
  lines[29] = "password hunter2";
  const result = planSupabasePush({
    baselineVersions: baseline,
    output: `${lines.join("\n")}\n`,
    secrets: ["hunter2"],
    status: 1,
  });

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
  assert.match(result.detail, /^row-10$/m);
  assert.match(result.detail, /\[redacted\]/);
  assert.doesNotMatch(result.detail, /^row-9$/m);
  assert.doesNotMatch(result.detail, /hunter2/);
  assert.doesNotMatch(result.detail, /migration repair/);
});

test("a different up to date sentence is not a remote no-op", () => {
  const result = plan("Schema migrations are up to date.\n", 0);

  assert.equal(result.action, "fail");
  assert.equal(result.exitCode, 1);
});

test("migration list remote column decides what was applied", () => {
  const applied = remoteAppliedVersions(
    [
      "|Local|Remote|Time (UTC)|",
      "|`20261022050000`|`20261022050000`|`2026-10-22 05:00:00`|",
      "|`20260628120000`|` `|`2026-06-28 12:00:00`|",
      "│ 20260719120000 │ 20260719120000 │ 2026-07-19 12:00:00 │",
      "20260629110000 20260629110000 2026-06-29 11:00:00",
      "20260628152000                2026-06-28 15:20:00",
    ].join("\n"),
  );

  assert.equal(applied.has("20261022050000"), true);
  assert.equal(applied.has("20260719120000"), true);
  assert.equal(applied.has("20260629110000"), true);
  assert.equal(applied.has("20260628120000"), false);
  assert.equal(applied.has("20260628152000"), false);
});

test("a push that migration list does not show as applied fails", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: secrets,
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          stdout: "Finished supabase db push.",
          stderr:
            "DRY RUN...\nWould push these migrations:\n • 20261022050000_updated_at_only_on_change.sql",
          status: 0,
        };
      }

      if (args.includes("list")) {
        return {
          output:
            "| Local | Remote | Time (UTC) |\n| 20261022050000 |  | 2026-10-22 05:00:00 |",
          status: 0,
        };
      }

      return { output: "Finished supabase db push.", status: 0 };
    },
  });

  assert.equal(result.exitCode, 1);
  assert.match(result.log, /not shown as applied on remote/);
  assert.deepEqual(calls[3], ["migration", "list", "--linked"]);
  assertNoUnsafeArgs(calls);
});

test("a failed migration list after push fails the job", () => {
  const calls = [];
  const result = pushSupabaseMigrations({
    env: secrets,
    mode: "apply",
    run(args) {
      calls.push(args);

      if (args.includes("--dry-run")) {
        return {
          output: " • 20261022050000_updated_at_only_on_change.sql\n",
          status: 0,
        };
      }

      if (args.includes("list")) {
        return { output: "failed to connect", status: 1 };
      }

      return { output: "Finished supabase db push.", status: 0 };
    },
  });

  assert.equal(result.exitCode, 1);
  assert.match(result.log, /migration list failed/);
  assertNoUnsafeArgs(calls);
});

test("a missing supabase binary is a failed command", () => {
  const result = supabaseCommandResult({
    error: new Error("spawn supabase ENOENT"),
    status: null,
    stdout: null,
    stderr: null,
  });

  assert.equal(result.status, 1);
  assert.match(result.output, /ENOENT/);
});
