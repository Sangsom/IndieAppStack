import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("updated_at moves only when a column other than updated_at changes", () => {
  const sql = fs.readFileSync(
    path.join(
      repoRoot,
      "supabase/migrations/20261022050000_updated_at_only_on_change.sql",
    ),
    "utf8",
  );

  assert.match(sql, /to_jsonb\(new\) - 'updated_at'/);
  assert.match(sql, /to_jsonb\(old\) - 'updated_at'/);
  assert.match(sql, /is distinct from/i);
  assert.match(sql, /new\.updated_at = now\(\)/);
  assert.match(sql, /new\.updated_at = old\.updated_at/);
  assert.match(sql, /create or replace function public\.set_updated_at\(\)/);
});
