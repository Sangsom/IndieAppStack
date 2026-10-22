import assert from "node:assert/strict";
import test from "node:test";

import { upsertChangedRows } from "./upsert-changed.mjs";

function fakeSupabase(existingRows) {
  const writes = [];

  return {
    writes,
    client: {
      from() {
        return {
          select() {
            return this;
          },
          order() {
            return this;
          },
          range() {
            return Promise.resolve({ data: existingRows, error: null });
          },
          upsert(rows) {
            writes.push(rows);

            return {
              select() {
                return Promise.resolve({
                  data: rows.map((row, index) => ({
                    ...row,
                    id: row.id ?? `written-${index}`,
                  })),
                  error: null,
                });
              },
            };
          },
        };
      },
    },
  };
}

test("upsertChangedRows does not write a row whose fields already match", async () => {
  const supabase = fakeSupabase([
    { id: "id-same", name: "Same", slug: "same" },
  ]);
  const result = await upsertChangedRows(
    supabase.client,
    "categories",
    [{ name: "Same", slug: "same" }],
    { onConflict: "slug" },
  );

  assert.equal(supabase.writes.length, 0);
  assert.equal(result.plan.unchanged, 1);
  assert.equal(result.plan.rowsToWrite.length, 0);
  assert.equal(result.rows[0].id, "id-same");
});

test("upsertChangedRows writes only the row that changed", async () => {
  const supabase = fakeSupabase([
    { id: "id-same", name: "Same", slug: "same" },
    { id: "id-old", name: "Old", slug: "existing" },
  ]);
  const result = await upsertChangedRows(
    supabase.client,
    "categories",
    [
      { name: "Same", slug: "same" },
      { name: "Renamed", slug: "existing" },
      { name: "New", slug: "new" },
    ],
    { onConflict: "slug" },
  );

  assert.equal(supabase.writes.length, 1);
  assert.deepEqual(
    supabase.writes[0].map((row) => row.slug),
    ["existing", "new"],
  );
  assert.equal(result.rows.find((row) => row.slug === "same").id, "id-same");
  assert.equal(result.rows.find((row) => row.slug === "new").id, "written-1");
  assert.equal(result.plan.unchanged, 1);
  assert.equal(result.plan.updated, 1);
  assert.equal(result.plan.inserted, 1);
});

test("dry-run plans the diff and does not write", async () => {
  const supabase = fakeSupabase([
    { id: "id-old", name: "Old", slug: "existing" },
  ]);
  const result = await upsertChangedRows(
    supabase.client,
    "categories",
    [{ name: "Renamed", slug: "existing" }],
    { onConflict: "slug" },
    { dryRun: true },
  );

  assert.equal(supabase.writes.length, 0);
  assert.equal(result.plan.updated, 1);
  assert.equal(result.rows[0].id, "id-old");
  assert.equal(result.rows[0].name, "Renamed");
});
