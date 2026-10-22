import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  BASELINE_MIGRATION_VERSIONS,
  planSupabasePush,
} from "./plan-supabase-push.mjs";
import { redactSecrets } from "./revalidate-production.mjs";

export const SUPABASE_SECRET_NAMES = [
  "SUPABASE_ACCESS_TOKEN",
  "SUPABASE_PROJECT_REF",
  "SUPABASE_DB_PASSWORD",
];

function missingSecrets(env) {
  return SUPABASE_SECRET_NAMES.filter(
    (name) => !String(env[name] ?? "").trim(),
  );
}

function secretValues(env) {
  return SUPABASE_SECRET_NAMES.map((name) => env[name]);
}

export function runSupabase(args, env) {
  try {
    const stdout = execFileSync("supabase", args, {
      encoding: "utf8",
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    return { output: stdout ?? "", status: 0 };
  } catch (error) {
    const stdout = typeof error.stdout === "string" ? error.stdout : "";
    const stderr = typeof error.stderr === "string" ? error.stderr : "";

    return {
      output: `${stdout}${stderr}`,
      status: typeof error.status === "number" ? error.status : 1,
    };
  }
}

function finish(exitCode, lines, env) {
  const text = lines.filter((line) => line && line.length > 0).join("\n");

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

  const link = run(
    ["--yes", "link", "--project-ref", env.SUPABASE_PROJECT_REF],
    env,
  );
  const lines = [link.output];

  if (link.status !== 0) {
    lines.push("supabase link failed. Migrations were not applied.");

    return finish(link.status || 1, lines, env);
  }

  const dryRun = run(["--yes", "db", "push", "--dry-run"], env);
  lines.push(dryRun.output);

  const plan = planSupabasePush({
    baselineVersions: BASELINE_MIGRATION_VERSIONS,
    output: dryRun.output,
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

  const pushed = run(["--yes", "db", "push"], env);
  lines.push(pushed.output);

  if (pushed.status !== 0) {
    lines.push("supabase db push failed. Migrations were not fully applied.");

    return finish(pushed.status || 1, lines, env);
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
