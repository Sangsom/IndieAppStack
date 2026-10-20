import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const { TOOL_SEO_OVERRIDES, absoluteTitleForSlug } =
  await import("./tool-seo-overrides.ts");

const codemagicSnapshot = {
  title: "Codemagic Pricing 2026: 500 Free Minutes, Then $0.095",
  description:
    "Codemagic gives 500 free Mac M2 minutes a month, then $0.095/min. See every plan, cost per build, and when Xcode Cloud or Bitrise is cheaper.",
  heading: "Codemagic pricing, free tier, and when it's worth paying",
};

test("codemagic metadata is byte-identical to the pre-refactor snapshot", () => {
  assert.deepEqual(TOOL_SEO_OVERRIDES.codemagic, codemagicSnapshot);
  assert.equal(
    JSON.stringify(TOOL_SEO_OVERRIDES.codemagic),
    JSON.stringify(codemagicSnapshot),
  );
});

test("appwrite title is at most 60 characters and sets title.absolute", () => {
  const title = TOOL_SEO_OVERRIDES.appwrite.title;

  assert.equal(typeof title, "string");
  assert.ok(title.length > 0);
  assert.ok(title.length <= 60, `title length ${title.length}`);
  assert.deepEqual(absoluteTitleForSlug("appwrite", title), {
    absolute: title,
  });
  assert.equal(absoluteTitleForSlug("appfigures", title), undefined);
});

test("appwrite pricing_last_checked is the write date", () => {
  const content = JSON.parse(
    readFileSync(
      new URL("../scripts/tool-content.json", import.meta.url),
      "utf8",
    ),
  );

  assert.equal(content.appwrite.pricing_last_checked, "2026-10-20");
  assert.equal(content.appwrite.body_markdown.includes("July 19, 2026"), false);
});
