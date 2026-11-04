import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseArticleMarkdown } from "../lib/article-markdown.ts";
import { extractFaqItems } from "../lib/faq-schema.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = path.join(root, "scripts/seed-database.mjs");
const seed = fs.readFileSync(seedPath, "utf8");

const guideSlug = "best-crash-reporting-tools-mobile";
const comparisonTitle =
  '          title: "Sentry vs Firebase Crashlytics for Mobile Apps"';
const comparisonSeo = 'seo_title: "Sentry vs Crashlytics: Free Limits in 2026"';
const comparisonHash =
  "494f9d733d83a5ed4a92f9910e90e5bc0e66afa4ca86453c43daf59e7ce084eb";

function comparisonObject() {
  const start = seed.indexOf(comparisonTitle);
  const seo = seed.indexOf(comparisonSeo, start);
  const endMarker = "          published_at: publishedAt,\n        },\n";
  const end = seed.indexOf(endMarker, seo);

  assert.ok(start > -1 && seo > start && end > seo);
  return seed.slice(start, end + endMarker.length);
}

function guideBody() {
  const slugAt = seed.indexOf(`slug: "${guideSlug}"`);
  const bodyAt = seed.indexOf("body_markdown: `", slugAt);
  const closeAt = seed.indexOf(
    '\n          author: "IndieAppStack",\n          status: "published",\n          content_type: "guide",\n          primary_category_id: categories.get("crash-reporting").id,\n          seo_title:\n            "Best Crash Reporting Tools for Mobile Apps (2026): Free Tiers Compared"',
    bodyAt,
  );

  assert.ok(slugAt > -1 && bodyAt > slugAt && closeAt > bodyAt);
  const raw = seed.slice(bodyAt + "body_markdown: `".length, closeAt);
  assert.ok(raw.endsWith("`,"));
  return raw.slice(0, -2);
}

test("the crash reporting guide sits after the Sentry comparison", () => {
  const comparisonAt = seed.indexOf(
    'slug: "sentry-vs-firebase-crashlytics-mobile-apps"',
  );
  const guideAt = seed.indexOf(`slug: "${guideSlug}"`);
  const nextAt = seed.indexOf(
    'slug: "privacy-friendly-analytics-starter-stack"',
  );

  assert.ok(comparisonAt > -1);
  assert.ok(guideAt > comparisonAt);
  assert.ok(nextAt > guideAt);
  assert.equal(seed.split(`slug: "${guideSlug}"`).length, 2);
});

test("the Sentry comparison keeps its Aug 11 body plus one Flutter link", () => {
  const object = comparisonObject();
  const hash = createHash("sha256").update(object).digest("hex");

  assert.equal(hash, comparisonHash);
  assert.equal(object.includes(guideSlug), false);
  assert.equal(object.match(/\/guides\/flutter-crash-reporting/g).length, 1);
  assert.match(object, /Last checked: Aug 11, 2026\./);
});

test("the guide slug renders through the article pipeline and sitemap contract", () => {
  const body = guideBody();
  const blocks = parseArticleMarkdown(body);
  const headings = blocks
    .filter((block) => block.type === "heading")
    .map((block) => block.text);
  const images = blocks.filter((block) => block.type === "image");
  const tables = blocks.filter((block) => block.type === "table");
  const faqs = extractFaqItems(blocks);

  assert.ok(headings.includes("Short answer"));
  assert.ok(headings.includes("Crash reporting on Android"));
  assert.ok(headings.includes("iOS notes"));
  assert.ok(
    headings.includes(
      "What it took to get Crashlytics working in our own iOS app",
    ),
  );
  assert.equal(tables.length, 1);
  assert.equal(tables[0].rows.length, 10);
  assert.deepEqual(
    faqs.map((item) => item.question),
    [
      "What is the best free crash reporting tool?",
      "Is there a Crashlytics alternative without Firebase?",
      "Do I need crash reporting for a small app?",
    ],
  );

  for (const image of images) {
    assert.equal(
      fs.existsSync(path.join(root, "public", image.src)),
      true,
      image.src,
    );
  }

  const guideObjectStart = seed.indexOf(`slug: "${guideSlug}"`);
  const guideObject = seed.slice(
    guideObjectStart,
    seed.indexOf('slug: "privacy-friendly-analytics-starter-stack"'),
  );

  assert.match(guideObject, /content_type: "guide"/);
  assert.match(guideObject, /status: "published"/);
  assert.match(guideObject, /human_reviewed: true/);
  assert.match(
    guideObject,
    /primary_category_id: categories\.get\("crash-reporting"\)\.id/,
  );

  const sitemap = fs.readFileSync(
    path.join(root, "lib/sitemap-data.ts"),
    "utf8",
  );
  assert.match(sitemap, /content_type === "comparison"/);
  assert.match(sitemap, /`\/guides\/\$\{article\.slug\}`/);
  assert.match(sitemap, /\.eq\("status", "published"\)/);
  assert.match(sitemap, /\.eq\("human_reviewed", true\)/);
  assert.match(sitemap, /\.in\("content_type", \["comparison", "guide"\]\)/);
});

test("every price is dated and the disclosure line is present", () => {
  const body = guideBody();
  const paragraphs = body.split(/\n\s*\n/);
  const pricePattern = /\$\d|No-cost|5,000 errors/;

  for (const paragraph of paragraphs) {
    if (pricePattern.test(paragraph)) {
      assert.match(paragraph, /checked Oct 20, 2026/i);
    }
  }

  const tableRows = body
    .split("\n")
    .filter((line) => line.startsWith("| ") && !line.includes("---"));
  const dataRows = tableRows.slice(1);

  assert.equal(dataRows.length, 10);
  for (const row of dataRows) {
    assert.match(row, /Checked Oct 20, 2026/);
    assert.match(row, /https?:\/\//);
  }

  assert.match(body, /We build Mantis and MrGripper\./);
  assert.match(body, /Mantis is an iPhone trading journal/);
  assert.match(
    body,
    /Sandbox: upload-symbols … deny\(1\) file-read-data …\/GoogleService-Info\.plist/,
  );
  assert.match(
    body,
    /Could not get GOOGLE_APP_ID in Google Services file from build environment/,
  );
  assert.match(body, /upload_symbols_to_crashlytics/);
  assert.equal(
    body.match(/sentry-vs-firebase-crashlytics-mobile-apps/g).length,
    1,
  );
});

test("the crash-reporting category keeps the ranked shortlist and adds the Flutter guide", () => {
  const description =
    'slug: "crash-reporting",\n          description:\n            "Monitor crashes, errors, regressions, and production quality so releases stay trustworthy after app store approval. Ranked shortlist: /guides/best-crash-reporting-tools-mobile. Flutter: [Flutter crash reporting tools](/guides/flutter-crash-reporting).",';

  assert.equal(seed.includes(description), true);
  assert.equal(
    seed.split("/guides/best-crash-reporting-tools-mobile").length - 1,
    2,
  );
});
