import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { BASELINE_MIGRATION_VERSIONS } from "./plan-supabase-push.mjs";
import { isContentSeedPath } from "./seed-content-changed.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const workflow = fs.readFileSync(
  path.join(repoRoot, ".github/workflows/seed-production.yml"),
  "utf8",
);

const runner = fs.readFileSync(
  path.join(repoRoot, "scripts/supabase-db-push.mjs"),
  "utf8",
);

test("production seed applies migrations before the content upsert", () => {
  assert.match(workflow, /supabase\/setup-cli@v1/);
  assert.match(workflow, /version:\s*2\.108\.0/);
  assert.match(workflow, /node scripts\/supabase-db-push\.mjs/);
  assert.match(workflow, /SUPABASE_ACCESS_TOKEN/);
  assert.match(workflow, /SUPABASE_PROJECT_REF/);
  assert.match(workflow, /SUPABASE_DB_PASSWORD/);
  assert.match(workflow, /group: seed-production|seed-production/);
  assert.match(runner, /link", "--project-ref"/);
  assert.match(runner, /"db", "push", "--dry-run"/);
  assert.match(runner, /"db", "push"/);
  assert.doesNotMatch(workflow, /include-all/);
  assert.doesNotMatch(runner, /include-all/);
  assert.doesNotMatch(runner, /printenv/);
  assert.doesNotMatch(runner, /console\.log\(env/);

  const seedNeeds = workflow.indexOf("needs:\n      - migrate");
  const seedSteps = workflow.indexOf("npm run seed:prod");

  assert.ok(seedNeeds > 0);
  assert.ok(seedSteps > seedNeeds);
});

test("pull requests that touch migrations dry-run and do not seed", () => {
  assert.match(workflow, /supabase\/migrations\/\*\*/);
  assert.match(workflow, /SUPABASE_PUSH_MODE:\s*dry-run/);
  assert.match(workflow, /pull_request:/);
});

test("content seeding ignores migration-only pushes", () => {
  assert.equal(
    isContentSeedPath(
      "supabase/migrations/20261022050000_updated_at_only_on_change.sql",
    ),
    false,
  );
  assert.equal(isContentSeedPath("scripts/supabase-db-push.mjs"), false);
  assert.equal(isContentSeedPath("scripts/tool-content.json"), true);
  assert.equal(
    isContentSeedPath("output/indieappstack/example/content.md"),
    true,
  );
  assert.equal(isContentSeedPath("scripts/content/example.mjs"), true);
});

test("baseline migration files exist and are the ones withheld from replay", () => {
  const files = fs.readdirSync(path.join(repoRoot, "supabase/migrations"));

  for (const version of BASELINE_MIGRATION_VERSIONS) {
    assert.equal(
      files.some((file) => file.startsWith(`${version}_`)),
      true,
      version,
    );
  }
});
