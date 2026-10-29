import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  adaptyMonthlyFee,
  apphudFreeToProMonthlyFee,
  buildFeeChartSvg,
  buildFreeTierChartSvg,
  FEE_LEVELS,
  qonversionMonthlyFee,
  revenueCatMonthlyFee,
  storeKitMonthlyFee,
} from "./revenuecat-alternatives-fees.mjs";

const seedPath = "scripts/seed-database.mjs";
const feeChartPath =
  "public/content-visuals/articles/revenuecat-alternatives-fees-oct-2026.svg";
const freeTierChartPath =
  "public/content-visuals/articles/revenuecat-alternatives-free-tiers-oct-2026.svg";
const decisionPath =
  "public/content-visuals/articles/revenuecat-alternatives-decision.svg";

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

const seed = fs.readFileSync(seedPath, "utf8");
const comparison = objectForSlug(seed, "revenuecat-alternatives");
const body = bodyForSlug(seed, "revenuecat-alternatives");

test("seo title and description stay inside the rendered limits", () => {
  assert.match(
    comparison,
    /seo_title: "RevenueCat Alternatives for iOS Apps \(2026\)"/,
  );
  assert.match(
    comparison,
    /title: "RevenueCat alternatives for iOS subscription apps"/,
  );

  const title = comparison.match(/seo_title: "([^"]+)"/);
  assert.ok(title, "seo_title");
  assert.ok(title[1].length <= 44, String(title[1].length));

  const description = comparison.match(/seo_description:\n\s+"([^"]+)"/);
  assert.ok(description, "seo_description");
  assert.ok(description[1].length <= 155, String(description[1].length));
  assert.match(description[1], /Prices checked Oct 29, 2026\.$/);
});

test("the short answer is 40 to 60 words and names the free-tier ends", () => {
  const paragraph = body
    .split(/\n\n+/)[1]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  const words = paragraph.split(/\s+/);

  assert.ok(words.length >= 40 && words.length <= 60, String(words.length));
  assert.match(paragraph, /\$2,500/);
  assert.match(paragraph, /Apphud \$10K/);
  assert.match(paragraph, /StoreKit 2 alone has no vendor fee/);
  assert.match(paragraph, /Prices checked Oct 29, 2026\.$/);
});

test("Qonversion is one Pro plan and the July check is gone", () => {
  assert.match(body, /\| \[Apphud\]\(https:\/\/apphud\.com\/pricing\)/);
  assert.match(body, /0\.8% of total tracked revenue/);
  assert.match(body, /\$64 at \$8,000/);
  assert.match(body, /\$400 at \$50,000/);
  assert.doesNotMatch(comparison, /Starter/);
  assert.doesNotMatch(comparison, /Growth/);
  assert.doesNotMatch(comparison, /2026-07-19/);
  assert.match(body, /## Apphud: when a higher free tier matters/);
  assert.match(body, /What is the cheapest RevenueCat alternative\?/);
  assert.match(body, /no public price \(sales demo\)/);
});

test("related links point pricing and Superwall alternatives away from this page", () => {
  assert.match(body, /\[RevenueCat pricing\]\(\/tools\/revenuecat\)/);
  assert.match(
    body,
    /\[Superwall alternatives\]\(\/comparisons\/superwall-alternatives-ios-apps\)/,
  );
});

test("the fee chart is the published-rate arithmetic", () => {
  assert.deepEqual(FEE_LEVELS, [3000, 8000, 15000, 50000]);
  assert.equal(revenueCatMonthlyFee(3000), 30);
  assert.equal(revenueCatMonthlyFee(8000), 80);
  assert.equal(revenueCatMonthlyFee(15000), 150);
  assert.equal(revenueCatMonthlyFee(50000), 500);
  assert.equal(adaptyMonthlyFee(3000), 0);
  assert.equal(adaptyMonthlyFee(8000), 80);
  assert.equal(qonversionMonthlyFee(8000), 64);
  assert.equal(qonversionMonthlyFee(15000), 120);
  assert.equal(qonversionMonthlyFee(50000), 400);
  assert.equal(apphudFreeToProMonthlyFee(8000), 0);
  assert.equal(apphudFreeToProMonthlyFee(15000), 148.5);
  assert.equal(apphudFreeToProMonthlyFee(50000), 495);
  assert.equal(storeKitMonthlyFee(), 0);

  const chart = buildFeeChartSvg();
  assert.equal(fs.readFileSync(feeChartPath, "utf8"), chart);
  assert.match(chart, /Prices checked Oct 29, 2026 · vendor pricing pages/);
  assert.match(body, /revenuecat-alternatives-fees-oct-2026\.svg/);

  const freeTier = buildFreeTierChartSvg();
  assert.equal(fs.readFileSync(freeTierChartPath, "utf8"), freeTier);
  assert.match(freeTier, /Prices checked Oct 29, 2026 · vendor pricing pages/);
  assert.match(body, /revenuecat-alternatives-free-tiers-oct-2026\.svg/);
});

test("every in-body image is a parseable local asset", () => {
  const imageLine = /^!\[([^\]]*)\]\((\/[^)\s]+)(?:\s+"([^"]+)")?\)$/;
  const images = body.split("\n").filter((line) => line.startsWith("!["));

  assert.ok(images.length >= 3 && images.length <= 5, String(images.length));
  assert.match(images[0], /revenuecat-alternatives-fees-oct-2026\.svg/);

  for (const line of images) {
    assert.match(line, imageLine);
    const src = line.match(imageLine)[2];
    assert.ok(fs.existsSync(`public${src}`), src);
  }
});

test("the decision diagram names Apphud and does not print a price", () => {
  const diagram = fs.readFileSync(decisionPath, "utf8");
  assert.match(diagram, /Apphud/);
  assert.doesNotMatch(diagram, /\$/);
  assert.doesNotMatch(diagram, /2026-07-19/);
  assert.match(body, /revenuecat-alternatives-decision\.svg/);
});
