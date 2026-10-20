import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { readEnvLocal } from "./env-local.mjs";
import { parseSeedArgs, planUpsert, valuesEqual } from "./seed-plan.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("seed args stay upsert-only", () => {
  assert.deepEqual(parseSeedArgs(["node", "seed"]), {
    dryRun: false,
    upsertOnly: true,
  });
  assert.equal(parseSeedArgs(["node", "seed", "--dry-run"]).dryRun, true);
  assert.equal(
    parseSeedArgs(["node", "seed", "--upsert-only", "--dry-run"]).upsertOnly,
    true,
  );
});

test("destructive seed flags are refused", () => {
  for (const flag of ["--delete", "--truncate", "--replace", "--reset"]) {
    assert.throws(() => parseSeedArgs(["node", "seed", flag]), /upsert-only/);
  }

  assert.throws(
    () => parseSeedArgs(["node", "seed", "--drop-table"]),
    /Unknown seed argument/,
  );
});

test("planUpsert counts inserts, updates, and unchanged rows", () => {
  const plan = planUpsert(
    "categories",
    [
      { name: "New", slug: "new" },
      { name: "Renamed", slug: "existing" },
      { name: "Same", slug: "same" },
    ],
    "slug",
    [
      { id: "id-existing", name: "Old", slug: "existing" },
      { id: "id-same", name: "Same", slug: "same" },
    ],
  );

  assert.equal(plan.inserted, 1);
  assert.equal(plan.updated, 1);
  assert.equal(plan.unchanged, 1);
  assert.equal(plan.previewRows[0].id, "dry-run:categories:0");
  assert.equal(plan.previewRows[1].id, "id-existing");
  assert.equal(plan.previewRows[2].id, "id-same");
});

test("timestamp formatting does not count as an update", () => {
  assert.equal(
    valuesEqual("2026-07-10T02:08:13.410Z", "2026-07-10T02:08:13.41+00:00"),
    true,
  );

  const plan = planUpsert(
    "articles",
    [{ published_at: "2026-07-10T02:08:13.410Z", slug: "guide" }],
    "slug",
    [{ id: "1", published_at: "2026-07-10T02:08:13.41+00:00", slug: "guide" }],
  );

  assert.equal(plan.updated, 0);
  assert.equal(plan.unchanged, 1);
});

test("missing payload keys are compared as null", () => {
  const plan = planUpsert(
    "tools",
    [{ body_markdown: "Body", slug: "with-body" }, { slug: "without-body" }],
    "slug",
    [
      { body_markdown: "Body", id: "1", slug: "with-body" },
      { body_markdown: "Keep me", id: "2", slug: "without-body" },
    ],
  );

  assert.equal(plan.unchanged, 1);
  assert.equal(plan.updated, 1);
  assert.equal(plan.previewRows[1].body_markdown, null);
});

test("json key order does not count as an update", () => {
  const plan = planUpsert(
    "stack_recommendations",
    [{ quiz_answers: { budget: "under-50", platform: "ios" }, slug: "mvp" }],
    "slug",
    [
      {
        id: "1",
        quiz_answers: { platform: "ios", budget: "under-50" },
        slug: "mvp",
      },
    ],
  );

  assert.equal(plan.unchanged, 1);
});

test("composite conflict keys distinguish rows", () => {
  const plan = planUpsert(
    "tool_categories",
    [
      { category_id: "cat-a", sort_order: 10, tool_id: "tool-a" },
      { category_id: "cat-b", sort_order: 20, tool_id: "tool-a" },
    ],
    "tool_id,category_id",
    [{ category_id: "cat-a", sort_order: 10, tool_id: "tool-a" }],
  );

  assert.equal(plan.inserted, 1);
  assert.equal(plan.unchanged, 1);
});

test("seed script does not issue destructive queries", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "scripts/seed-database.mjs"),
    "utf8",
  );

  assert.doesNotMatch(source, /\.delete\s*\(/);
  assert.doesNotMatch(source, /\.rpc\s*\(/);
  assert.match(source, /upsert-only/);
  assert.match(source, /onConflict/);
});

test("env file parser keeps values that contain equals signs", () => {
  const file = path.join(repoRoot, "scripts/.env-local-parser-test");
  fs.writeFileSync(
    file,
    "# comment\nNEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co\nSECRET=abc=def\n",
  );

  try {
    assert.deepEqual(readEnvLocal(file), {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SECRET: "abc=def",
    });
  } finally {
    fs.unlinkSync(file);
  }
});
