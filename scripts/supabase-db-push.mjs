import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  BASELINE_MIGRATION_VERSIONS,
  planSupabasePush,
  remoteAppliedVersions,
  stripAnsi,
} from "./plan-supabase-push.mjs";
import { redactSecrets } from "./revalidate-production.mjs";

export const SUPABASE_SECRET_NAMES = [
  "SUPABASE_ACCESS_TOKEN",
  "SUPABASE_PROJECT_REF",
  "SUPABASE_DB_PASSWORD",
];

const baselineVersions = new Set(BASELINE_MIGRATION_VERSIONS);

function missingSecrets(env) {
  return SUPABASE_SECRET_NAMES.filter(
    (name) => !String(env[name] ?? "").trim(),
  );
}

function secretValues(env) {
  return SUPABASE_SECRET_NAMES.map((name) => env[name]);
}

export function supabaseCommandResult(result) {
  if (result?.error) {
    const message =
      result.error instanceof Error
        ? result.error.message
        : String(result.error);

    return {
      output: message,
      stdout: typeof result.stdout === "string" ? result.stdout : "",
      stderr: typeof result.stderr === "string" ? result.stderr : "",
      status: 1,
    };
  }

  const stdout = typeof result?.stdout === "string" ? result.stdout : "";
  const stderr = typeof result?.stderr === "string" ? result.stderr : "";

  return {
    output: stdout + (stdout && stderr ? "\n" : "") + stderr,
    stdout,
    stderr,
    status: result?.status ?? 1,
  };
}

export function runSupabase(args, env) {
  return supabaseCommandResult(
    spawnSync("supabase", args, {
      encoding: "utf8",
      env,
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
}

function normalizeRunResult(result) {
  if (typeof result?.output === "string") {
    return {
      output: result.output,
      stdout: typeof result.stdout === "string" ? result.stdout : "",
      stderr: typeof result.stderr === "string" ? result.stderr : "",
      status: typeof result.status === "number" ? result.status : 1,
    };
  }

  return supabaseCommandResult(result);
}

function withoutUnsafeRepairLines(text) {
  return text
    .split("\n")
    .filter((line) => {
      const match = line.match(/migration repair\s+--status\s+\S+\s+([0-9 ]+)/);

      if (!match) {
        return true;
      }

      const versions = match[1].match(/\d{14}/g) ?? [];

      return (
        versions.length > 0 &&
        versions.every((version) => baselineVersions.has(version))
      );
    })
    .join("\n");
}

function finish(exitCode, lines, env) {
  const text = withoutUnsafeRepairLines(
    stripAnsi(lines.filter((line) => line && line.length > 0).join("\n")),
  );

  return {
    exitCode,
    log: redactSecrets(text, secretValues(env)),
  };
}

export function pushSupabaseMigrations({
  env,
  mode = "apply",
  run = runSupabase,
}) {
  const missing = missingSecrets(env);

  if (missing.length > 0) {
    return finish(
      0,
      [
        `::warning title=Supabase migrations skipped::Missing GitHub Actions secret(s): ${missing.join(", ")}. Add them under Settings > Secrets and variables > Actions. Migrations were not applied.`,
      ],
      env,
    );
  }

  const link = normalizeRunResult(
    run(["--yes", "link", "--project-ref", env.SUPABASE_PROJECT_REF], env),
  );
  const lines = [link.output];

  if (link.status !== 0) {
    lines.push("supabase link failed. Migrations were not applied.");

    return finish(link.status || 1, lines, env);
  }

  const dryRun = normalizeRunResult(
    run(["--yes", "db", "push", "--dry-run"], env),
  );
  lines.push(dryRun.output);

  const plan = planSupabasePush({
    baselineVersions: BASELINE_MIGRATION_VERSIONS,
    output: dryRun.output,
    secrets: secretValues(env),
    status: dryRun.status,
  });

  if (plan.summary) {
    lines.push(plan.summary);
  }

  if (plan.detail) {
    lines.push(plan.detail);
  }

  if (plan.action === "hold") {
    lines.push(
      `::warning title=Supabase migration history gap::${plan.summary}`,
    );

    return finish(plan.exitCode, lines, env);
  }

  if (plan.action === "fail") {
    lines.push(
      `::error title=Supabase migrations not applied::${plan.summary}`,
    );

    return finish(plan.exitCode, lines, env);
  }

  if (plan.action !== "push") {
    return finish(plan.exitCode, lines, env);
  }

  if (mode === "dry-run") {
    lines.push(
      "Dry run only. These migrations would be applied on push to main.",
    );

    return finish(0, lines, env);
  }

  const pushed = normalizeRunResult(run(["--yes", "db", "push"], env));
  lines.push(pushed.output);

  if (pushed.status !== 0) {
    lines.push("supabase db push failed. Migrations were not fully applied.");

    return finish(pushed.status || 1, lines, env);
  }

  const migrationList = normalizeRunResult(
    run(["migration", "list", "--linked"], env),
  );
  lines.push(migrationList.output);

  if (migrationList.status !== 0) {
    lines.push(
      "supabase migration list failed. Could not confirm the migration was applied on remote.",
    );

    return finish(migrationList.status || 1, lines, env);
  }

  const applied = remoteAppliedVersions(migrationList.output);
  const missingRemote = plan.otherPending.filter(
    (version) => !applied.has(version),
  );

  if (missingRemote.length > 0) {
    lines.push(
      `Planned migration ${missingRemote.join(", ")} is not shown as applied on remote.`,
    );

    return finish(1, lines, env);
  }

  return finish(0, lines, env);
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const mode =
    process.env.SUPABASE_PUSH_MODE === "dry-run" ? "dry-run" : "apply";
  const result = pushSupabaseMigrations({ env: process.env, mode });

  process.stdout.write(
    result.log.endsWith("\n") ? result.log : `${result.log}\n`,
  );
  process.exit(result.exitCode);
}
