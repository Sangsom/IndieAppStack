import assert from "node:assert/strict";
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

const seed = fs.readFileSync(seedPath, "utf8");
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
