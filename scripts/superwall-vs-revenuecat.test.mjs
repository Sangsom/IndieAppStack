import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

import {
  buildFeeChartSvg,
  revenueCatMonthlyFee,
  superwallIndieMonthlyFee,
} from "./superwall-vs-revenuecat-fee-chart.mjs";

const seedPath = "scripts/seed-database.mjs";
const bodyPath = "output/indieappstack/superwall-vs-revenuecat/content.md";
const chartPath =
  "public/content-visuals/articles/superwall-vs-revenuecat-monthly-fee-chart.svg";

function gitShow(ref, filePath) {
  return execSync(`git show ${ref}:${filePath}`, { encoding: "utf8" });
}

function baseText(filePath) {
  const refs = ["origin/main", "main"];
  const errors = [];

  for (const ref of refs) {
    try {
      return gitShow(ref, filePath);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(
    `Could not read ${filePath} from base.\n${errors.join("\n")}`,
  );
}

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

function slugsIn(source) {
  return [...source.matchAll(/\n          slug: "([^"]+)"/g)].map(
    (match) => match[1],
  );
}

const seed = fs.readFileSync(seedPath, "utf8");
const baseSeed = baseText(seedPath);
const content = fs.readFileSync(bodyPath, "utf8");
const seededBody = content.slice(content.indexOf("## Short answer"));
const comparison = objectForSlug(seed, "superwall-vs-revenuecat");

test("seo title, description, and H1 use the query order", () => {
  assert.match(
    comparison,
    /seo_title: "Superwall vs RevenueCat: Pricing & What Each Does \(2026\)"/,
  );
  assert.match(
    comparison,
    /title: "Superwall vs RevenueCat for iOS subscription apps"/,
  );
  assert.doesNotMatch(
    comparison,
    /The same decision as Superwall vs RevenueCat/,
  );

  const description = comparison.match(/seo_description:\n\s+"([^"]+)"/);
  assert.ok(description, "seo_description");
  assert.ok(description[1].length <= 155, description[1].length);
  assert.match(description[1], /^Checked Oct 25, 2026:/);
});

test("the short answer is a dated verdict under 60 words", () => {
  const paragraph = seededBody
    .split(/\n\n+/)[0]
    .replace(/^## Short answer\s*/, "")
    .trim();
  const words = paragraph.split(/\s+/);

  assert.ok(words.length <= 60, `${words.length}: ${paragraph}`);
  assert.match(paragraph, /^Pick RevenueCat/);
  assert.match(paragraph, /Checked Oct 25, 2026\.$/);
  assert.match(seededBody, /Disclosure: we build Mantis and MrGripper\./);
});

test("word-order filler is gone and the table leads with Superwall", () => {
  assert.doesNotMatch(seededBody, /Superwall vs RevenueCat is the same choice/);
  assert.doesNotMatch(
    seededBody,
    /What does Superwall vs RevenueCat come down to\?/,
  );
  assert.doesNotMatch(
    seededBody,
    /What does RevenueCat vs Superwall come down to\?/,
  );
  assert.match(seededBody, /### What does the choice come down to\?/);
  assert.match(seededBody, /\| Decision \| Superwall \| RevenueCat \|/);
  assert.match(
    seededBody,
    /\[Adapty vs Superwall\]\(\/comparisons\/adapty-vs-superwall\)/,
  );
});

test("every price chunk carries a checked date", () => {
  const withoutTables = seededBody.replace(/:::comparison[\s\S]*?\n:::/g, "");
  const chunks = [];

  for (const paragraph of withoutTables.split(/\n\n+/)) {
    const lines = paragraph.split("\n").filter((line) => line.trim());
    const listItems = lines.filter((line) => line.trim().startsWith("- "));
    if (listItems.length === lines.length && listItems.length > 0) {
      chunks.push(...listItems);
    } else {
      chunks.push(paragraph);
    }
  }

  const priced = chunks.filter((chunk) => /\$\d|\d%/.test(chunk));
  assert.ok(priced.length >= 8, String(priced.length));

  for (const chunk of priced) {
    assert.match(chunk, /checked/i, chunk.slice(0, 240));
  }
});

test("the fee chart is the published-rate arithmetic", () => {
  assert.equal(revenueCatMonthlyFee(2500), 0);
  assert.equal(revenueCatMonthlyFee(2600), 26);
  assert.equal(revenueCatMonthlyFee(10000), 100);
  assert.equal(revenueCatMonthlyFee(50000), 500);
  assert.equal(superwallIndieMonthlyFee(10000), 0);
  assert.equal(superwallIndieMonthlyFee(25000), 250);
  assert.equal(superwallIndieMonthlyFee(50000), 500);
  assert.ok(Math.abs(superwallIndieMonthlyFee(10000.01) - 100.0001) < 1e-9);

  assert.equal(fs.readFileSync(chartPath, "utf8"), buildFeeChartSvg());
  assert.match(
    seededBody,
    /\/content-visuals\/articles\/superwall-vs-revenuecat-monthly-fee-chart\.svg/,
  );
  assert.match(
    seededBody,
    /Chart of estimated monthly fees for RevenueCat and Superwall Indie from \$0 to \$50,000 in monthly revenue/,
  );
  assert.match(
    seededBody,
    /Arithmetic from published rates, checked Oct 25, 2026; not invoices/,
  );
});

test("only the three named comparison objects differ from main", () => {
  const allowed = new Set([
    "revenuecat-vs-adapty-ios-subscriptions",
    "superwall-alternatives-ios-apps",
    "superwall-vs-revenuecat",
  ]);
  const currentSlugs = slugsIn(seed);
  assert.deepEqual(currentSlugs, slugsIn(baseSeed));

  for (const slug of currentSlugs) {
    if (allowed.has(slug)) {
      continue;
    }

    assert.equal(
      objectForSlug(seed, slug),
      objectForSlug(baseSeed, slug),
      slug,
    );
  }

  assert.equal(
    fs.readFileSync("scripts/tool-content.json", "utf8"),
    baseText("scripts/tool-content.json"),
  );

  const revenueCatSentence =
    "The two-way matchup for that meter split is [Superwall vs RevenueCat](/comparisons/superwall-vs-revenuecat).";
  const alternativesSentence =
    "The dated fee split for running both is [Superwall vs RevenueCat](/comparisons/superwall-vs-revenuecat).";

  for (const [slug, sentence] of [
    ["revenuecat-vs-adapty-ios-subscriptions", revenueCatSentence],
    ["superwall-alternatives-ios-apps", alternativesSentence],
  ]) {
    const current = objectForSlug(seed, slug);
    const restored = current.replace(`\n\n${sentence}\n`, "\n");
    assert.notEqual(restored, current, slug);
    assert.equal(restored, objectForSlug(baseSeed, slug), slug);
  }
});

test("the diff stays off the homepage and off the locked files", () => {
  const changed = new Set(
    [
      execSync("git diff --name-only origin/main", { encoding: "utf8" }),
      execSync("git ls-files --others --exclude-standard", {
        encoding: "utf8",
      }),
    ]
      .join("\n")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );
  const allowed = new Set([
    "components/public/article-body.tsx",
    "output/indieappstack/superwall-vs-revenuecat/content.md",
    "package.json",
    "public/content-visuals/articles/revenuecat-vs-superwall-fee-bases.svg",
    "public/content-visuals/articles/superwall-vs-revenuecat-monthly-fee-chart.svg",
    "scripts/adapty-vs-superwall.test.mjs",
    "scripts/seed-database.mjs",
    "scripts/superwall-vs-revenuecat-fee-chart.mjs",
    "scripts/superwall-vs-revenuecat.test.mjs",
  ]);

  for (const filePath of changed) {
    assert.ok(allowed.has(filePath), filePath);
    assert.doesNotMatch(filePath, /homepage/i);
    assert.notEqual(filePath, "app/(public)/page.tsx");
  }
});
