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

test("keywords everywhere title is at most 60 characters and sets title.absolute", () => {
  const entry = TOOL_SEO_OVERRIDES["keywords-everywhere"];

  assert.equal(
    entry.title,
    "Keywords Everywhere Review 2026: Pricing, Credits & Mobile",
  );
  assert.equal(entry.title.length, 58);
  assert.ok(entry.title.length <= 60, `title length ${entry.title.length}`);
  assert.deepEqual(absoluteTitleForSlug("keywords-everywhere", entry.title), {
    absolute: entry.title,
  });
  assert.equal(
    entry.description,
    "Annual credits from $84. The API key is free. Google web volume, not App Store or Play Store demand. No Android, iPhone, or iPad app. Checked Oct 22, 2026.",
  );
  assert.equal(
    entry.heading,
    "Keywords Everywhere review, credit pricing, and no mobile app",
  );
  assert.equal(
    TOOL_SEO_OVERRIDES.appwrite.title,
    "Appwrite Pricing 2026: Free Tier, Pro $25/mo",
  );
  assert.equal(
    TOOL_SEO_OVERRIDES.codemagic.title,
    "Codemagic Pricing 2026: 500 Free Minutes, Then $0.095",
  );
});

test("bitrise title is the pricing override and the description records the check", () => {
  const entry = TOOL_SEO_OVERRIDES.bitrise;

  assert.equal(
    entry.title,
    "Bitrise Pricing 2026: Free Hobby Plan, Starter From $89/mo",
  );
  assert.equal(entry.title.length, 58);
  assert.ok(entry.title.length <= 60, `title length ${entry.title.length}`);
  assert.equal(
    entry.description,
    "Bitrise Hobby is free: 1 app, 300 credits a month. Starter is $89/mo yearly or $99 monthly; Pro is $200. When it's worth paying. Checked Oct 25, 2026.",
  );
  assert.match(entry.description, /Checked/);
  assert.equal(entry.description.length, 150);
  assert.ok(
    entry.description.length <= 155,
    `description length ${entry.description.length}`,
  );
  assert.equal(
    entry.heading,
    "Bitrise pricing, plans, and when it's worth paying",
  );
  assert.deepEqual(absoluteTitleForSlug("bitrise", entry.title), {
    absolute: entry.title,
  });

  const content = JSON.parse(
    readFileSync(
      new URL("../scripts/tool-content.json", import.meta.url),
      "utf8",
    ),
  );

  assert.equal(content.bitrise.pricing_last_checked, "2026-10-25");
  assert.equal(content.bitrise.body_markdown.includes("July 19, 2026"), false);
  assert.match(content.bitrise.body_markdown, /Is Bitrise worth the price\?/);
  assert.match(
    content.bitrise.body_markdown,
    /We build Mantis and MrGripper\./,
  );
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
