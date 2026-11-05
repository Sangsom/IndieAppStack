import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

import {
  adaptyMonthlyFee,
  apphudFreeMonthlyFee,
  apphudProMonthlyFee,
  buildFeeChartSvg,
  qonversionMonthlyFee,
  revenueCatMonthlyFee,
  superwallIndieMonthlyFee,
} from "./superwall-alternatives-fee-chart.mjs";

const seedPath = "scripts/seed-database.mjs";
const seed = fs.readFileSync(seedPath, "utf8");
const chartPath =
  "public/content-visuals/articles/superwall-alternatives-fees-oct-2026.svg";

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

function quotedField(object, field) {
  const match = object.match(new RegExp(`${field}:\\s*"([^"]*)"`));
  assert.ok(match, field);
  return match[1];
}

const comparison = objectForSlug(seed, "superwall-alternatives-ios-apps");
const body = bodyForSlug(seed, "superwall-alternatives-ios-apps");

test("seo title, description, and H1 stay inside the limits", () => {
  const title = quotedField(comparison, "seo_title");
  const description = quotedField(comparison, "seo_description");

  assert.equal(title, "Superwall Alternatives for iOS Apps (2026)");
  assert.ok(title.length <= 44, String(title.length));
  assert.equal(
    description,
    "Superwall alternatives compared: RevenueCat, Adapty, Qonversion, Apphud, Purchasely, Nami ML and StoreKit 2, with prices checked Oct 29, 2026.",
  );
  assert.ok(description.length <= 155, String(description.length));
  assert.equal(
    quotedField(comparison, "title"),
    "Superwall alternatives for iOS apps",
  );
  assert.match(comparison, /published_at: superwallAlternativesPublishedAt/);
  assert.doesNotMatch(comparison, /published_at:\s*"/);
});

test("the short answer is 40 to 60 words and names the fit", () => {
  const paragraph = body
    .split("## Short answer")[1]
    .trim()
    .split(/\n\n+/)[0]
    .trim();
  const words = paragraph.split(/\s+/);

  assert.ok(words.length >= 40 && words.length <= 60, String(words.length));
  assert.match(paragraph, /subscription infrastructure is free/);
  assert.match(paragraph, /\$10,000 MAR/);
  assert.match(paragraph, /RevenueCat or Adapty/);
  assert.match(paragraph, /Qonversion or Apphud/);
  assert.match(paragraph, /StoreKit 2/);
  assert.match(paragraph, /Purchasely or Nami ML/);
  assert.match(paragraph, /checked Oct 29, 2026/);
});

test("the new section stays between 150 and 200 words", () => {
  const section = body
    .split("## Apphud, Purchasely and Nami ML: when they fit\n")[1]
    .split("\n## ")[0]
    .trim();
  const words = section.split(/\s+/);

  assert.ok(words.length >= 150 && words.length <= 200, String(words.length));
  assert.match(section, /https:\/\/apphud\.com\/pricing/);
  assert.match(section, /https:\/\/www\.purchasely\.com\/pricing/);
  assert.match(section, /https:\/\/www\.nami\.ml\/pricing\//);
  assert.match(section, /no public price \(sales demo\)/i);
});

test("the price table drops the old Qonversion plans and prints no Purchasely or Nami price", () => {
  const table = body.match(/:::comparison [\s\S]*?\n:::/);
  assert.ok(table, "price table");
  assert.match(table[0], /checked Oct 29, 2026/);
  assert.doesNotMatch(table[0], /Starter/);
  assert.doesNotMatch(table[0], /Growth/);
  assert.doesNotMatch(table[0], /\$10k/i);

  const pricedRows = table[0]
    .split("\n")
    .filter((line) => /Purchasely|Nami ML/.test(line));
  assert.equal(pricedRows.length, 2);
  for (const row of pricedRows) {
    assert.doesNotMatch(row, /\$/);
    assert.match(row, /No public price \(sales demo\)/);
  }
});

test("the page keeps the required internal links and the three visuals", () => {
  const links = [
    "/comparisons/adapty-vs-superwall",
    "/comparisons/superwall-vs-revenuecat",
    "/comparisons/revenuecat-alternatives",
    "/guides/best-paywall-tools-ios-apps",
    "/tools/superwall",
  ];

  for (const link of links) {
    assert.match(body, new RegExp(link.replaceAll("/", "\\/")));
  }

  assert.match(body, /### What is the best Superwall alternative\?/);
  assert.match(body, /### Is there a free Superwall alternative\?/);
  assert.match(
    body,
    /\/content-visuals\/articles\/superwall-alternatives-fees-oct-2026\.svg/,
  );
  assert.match(
    body,
    /\/content-visuals\/articles\/superwall-paywall-editor\.png/,
  );
  assert.match(
    body,
    /\/content-visuals\/articles\/superwall-alternatives-ios-decision-flow\.svg/,
  );
  assert.doesNotMatch(body, /we tested|in our experience/i);
  assert.equal(fs.readFileSync(chartPath, "utf8"), buildFeeChartSvg());
  assert.match(
    fs.readFileSync(chartPath, "utf8"),
    /Prices checked Oct 29, 2026 · vendor pricing pages/,
  );
  assert.match(
    fs.readFileSync(chartPath, "utf8"),
    /assumes all of the column goes through the paywall/,
  );
});

test("the fee chart is the Oct 29 arithmetic", () => {
  assert.equal(revenueCatMonthlyFee(2500), 0);
  assert.equal(revenueCatMonthlyFee(2600), 26);
  assert.equal(superwallIndieMonthlyFee(10000), 0);
  assert.equal(superwallIndieMonthlyFee(25000), 250);
  assert.equal(adaptyMonthlyFee(5000), 0);
  assert.equal(adaptyMonthlyFee(10000), 100);
  assert.equal(qonversionMonthlyFee(7000), 0);
  assert.equal(qonversionMonthlyFee(8000), 64);
  assert.equal(qonversionMonthlyFee(50000), 400);
  assert.equal(apphudFreeMonthlyFee(10000), 0);
  assert.equal(apphudFreeMonthlyFee(25000), null);
  assert.equal(apphudProMonthlyFee(5000), 49.5);
  assert.equal(apphudProMonthlyFee(25000), 247.5);
  assert.equal(apphudProMonthlyFee(50000), 495);

  const chart = fs.readFileSync(chartPath, "utf8");
  assert.match(chart, /\$49\.50/);
  assert.match(chart, /\$247\.50/);
  assert.match(chart, /\$400/);
  assert.match(chart, /over cap/);
  const omitted = chart.match(/Purchasely and Nami ML are omitted:[^<]*/);
  assert.ok(omitted, "omitted caption");
  assert.doesNotMatch(omitted[0], /\$/);
});

test("this change does not edit neighbouring comparison objects", () => {
  const base = execSync("git show origin/main:scripts/seed-database.mjs", {
    encoding: "utf8",
  });
  const untouched = [
    "revenuecat-alternatives",
    "revenuecat-vs-adapty-ios-subscriptions",
    "superwall-vs-revenuecat",
    "adapty-vs-superwall",
  ];

  for (const slug of untouched) {
    assert.equal(objectForSlug(seed, slug), objectForSlug(base, slug), slug);
  }

  const strip = (source) =>
    source.replace(
      objectForSlug(source, "superwall-alternatives-ios-apps"),
      "OBJECT",
    );
  assert.equal(strip(seed), strip(base));
});
