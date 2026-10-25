import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

const seedPath = "scripts/seed-database.mjs";
const seed = fs.readFileSync(seedPath, "utf8");

function objectForSlug(source, slug) {
  const slugAt = source.indexOf(`slug: "${slug}"`);
  assert.notEqual(slugAt, -1, `missing slug ${slug}`);
  const objectStart = source.lastIndexOf("\n        {", slugAt);
  const nextSlug = source.indexOf('\n          slug: "', slugAt + slug.length);
  const searchEnd = nextSlug === -1 ? source.length : nextSlug;
  const objectEnd = source.lastIndexOf("\n        },", searchEnd);
  assert.ok(objectStart !== -1 && objectEnd > objectStart, `bounds ${slug}`);
  return source.slice(objectStart, objectEnd + "\n        },".length);
}

function bodyForSlug(source, slug) {
  const object = objectForSlug(source, slug);
  const start = object.indexOf("body_markdown: `");
  const end = object.lastIndexOf("`,");
  assert.ok(start !== -1 && end > start, `body ${slug}`);
  return object.slice(start + "body_markdown: `".length, end);
}

const comparison = objectForSlug(seed, "adapty-vs-superwall");
const body = bodyForSlug(seed, "adapty-vs-superwall");

test("the comparison sits after RevenueCat vs Adapty and before Superwall vs RevenueCat", () => {
  const revenueCat = seed.indexOf(
    'slug: "revenuecat-vs-adapty-ios-subscriptions"',
  );
  const pair = seed.indexOf('slug: "adapty-vs-superwall"');
  const superwall = seed.indexOf('slug: "superwall-vs-revenuecat"');

  assert.ok(revenueCat !== -1 && pair !== -1 && superwall !== -1);
  assert.ok(revenueCat < pair && pair < superwall);
});

test("the slug renders on the comparison route the sitemap uses", () => {
  assert.match(comparison, /content_type: "comparison"/);
  assert.match(comparison, /status: "published"/);
  assert.match(comparison, /human_reviewed: true/);
  assert.match(
    comparison,
    /primary_category_id: categories\.get\("paywalls"\)\.id/,
  );
  assert.match(
    comparison,
    /title: "Adapty vs Superwall for iOS subscription apps"/,
  );
  assert.match(
    comparison,
    /seo_title: "Adapty vs Superwall: Pricing, Paywalls & Which to Pick"/,
  );

  const contentType = "comparison";
  const slug = "adapty-vs-superwall";
  const path =
    contentType === "comparison" ? `/comparisons/${slug}` : `/guides/${slug}`;

  assert.equal(path, "/comparisons/adapty-vs-superwall");
  assert.match(body, /## Short answer/);
  const visuals = [
    "adapty-vs-superwall-cover.webp",
    "adapty-vs-superwall-fees.svg",
    "adapty-vs-superwall-feature-matrix.svg",
    "adapty-vs-superwall-decision-flow.svg",
    "adapty-vs-superwall-stack.svg",
  ];

  for (const fileName of visuals) {
    assert.match(body, new RegExp(`/content-visuals/articles/${fileName}`));
    assert.ok(
      fs.existsSync(`public/content-visuals/articles/${fileName}`),
      fileName,
    );
  }

  assert.doesNotMatch(body, /adapty-vs-superwall-jobs\.svg/);
  assert.equal(
    fs.existsSync(
      "public/content-visuals/articles/adapty-vs-superwall-jobs.svg",
    ),
    false,
  );
});

test("each price sits with a checked date, and the disclosure line is present", () => {
  assert.match(body, /Disclosure: we build Mantis and MrGripper\./);

  const note = body.match(
    /> \[!NOTE\] What we use[\s\S]*?Disclosure: we build Mantis and MrGripper\./,
  );
  assert.ok(note, "What we use box");
  assert.doesNotMatch(note[0], /\$\d/);
  assert.match(note[0], /RevenueCat/);
  assert.match(note[0], /Mantis/);
  assert.match(note[0], /MrGripper/);

  const tables = [...body.matchAll(/:::comparison ([^\n]+)[\s\S]*?\n:::/g)];
  assert.ok(tables.length >= 3);
  for (const table of tables) {
    assert.match(table[1], /checked/i, table[1]);
  }

  const withoutTables = body.replace(/:::comparison[\s\S]*?\n:::/g, "");
  const paragraphs = withoutTables.split(/\n\n+/);
  for (const paragraph of paragraphs) {
    if (!/\$\d|\d%/.test(paragraph)) {
      continue;
    }
    assert.match(paragraph, /checked/i, paragraph.slice(0, 180));
  }
});

test("the adapty-vs-superwall object and tool content stay unchanged against origin/main", () => {
  const baseSeed = execSync("git show origin/main:scripts/seed-database.mjs", {
    encoding: "utf8",
  });
  assert.equal(
    objectForSlug(seed, "adapty-vs-superwall"),
    objectForSlug(baseSeed, "adapty-vs-superwall"),
  );
  assert.equal(
    fs.readFileSync("scripts/tool-content.json", "utf8"),
    execSync("git show origin/main:scripts/tool-content.json", {
      encoding: "utf8",
    }),
  );
});
