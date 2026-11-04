import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseArticleMarkdown } from "../lib/article-markdown.ts";
import { extractFaqItems } from "../lib/faq-schema.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seed = fs.readFileSync(
  path.join(root, "scripts/seed-database.mjs"),
  "utf8",
);
const toolContent = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/tool-content.json"), "utf8"),
);

const guideSlug = "flutter-crash-reporting";

function guideBody() {
  const slugAt = seed.indexOf(`slug: "${guideSlug}"`);
  const bodyAt = seed.indexOf("body_markdown: `", slugAt);
  const closeAt = seed.indexOf(
    '\n          author: "IndieAppStack",\n          status: "published",\n          content_type: "guide",\n          primary_category_id: categories.get("crash-reporting").id,\n          seo_title:\n            "Flutter crash reporting tools (2026): Crashlytics, Sentry, Bugsnag, Embrace"',
    bodyAt,
  );

  assert.ok(slugAt > -1 && bodyAt > slugAt && closeAt > bodyAt);
  const raw = seed.slice(bodyAt + "body_markdown: `".length, closeAt);
  assert.ok(raw.endsWith("`,"));
  return raw.slice(0, -2).replace(/\\`/g, "`");
}

test("the Flutter guide is a published crash-reporting article", () => {
  assert.equal(seed.split(`slug: "${guideSlug}"`).length, 2);

  const slugAt = seed.indexOf(`slug: "${guideSlug}"`);
  const object = seed.slice(slugAt, slugAt + 120000);

  assert.match(object, /content_type: "guide"/);
  assert.match(object, /status: "published"/);
  assert.match(object, /human_reviewed: true/);
  assert.match(
    object,
    /primary_category_id: categories\.get\("crash-reporting"\)\.id/,
  );
  assert.match(object, /published_at: "2026-11-04T15:00:00.000Z"/);
});

test("the Flutter guide renders, cites prices, and stays on the Flutter intent", () => {
  const body = guideBody();
  const blocks = parseArticleMarkdown(body);
  const headings = blocks
    .filter((block) => block.type === "heading")
    .map((block) => block.text);
  const images = blocks.filter((block) => block.type === "image");
  const faqs = extractFaqItems(blocks);
  const words = body.replace(/```[\s\S]*?```/g, " ").match(/[A-Za-z0-9']+/g);

  assert.ok(headings.includes("Short answer"));
  assert.ok(headings.includes("Free tiers and the first paid month"));
  assert.ok(headings.includes("Symbol upload"));
  assert.ok(headings.includes("Setup checklist and a forced test crash"));
  assert.ok(headings.includes("Frequently asked questions"));
  assert.equal(faqs.length, 6);
  assert.ok(words.length >= 1200);
  assert.equal(images.length, 4);
  assert.equal(
    blocks.filter((block) => block.type === "table")[0].rows.length,
    7,
  );
  assert.equal(
    blocks.filter((block) => block.type === "code")[0].language,
    "dart",
  );

  for (const image of images) {
    assert.equal(
      fs.existsSync(path.join(root, "public", image.src)),
      true,
      image.src,
    );
  }

  assert.match(body, /firebase_crashlytics/);
  assert.match(body, /sentry_flutter/);
  assert.match(body, /sentry_dart_plugin/);
  assert.match(body, /bugsnag_flutter/);
  assert.match(body, /Embrace\.instance\.start/);
  assert.match(body, /FlutterError\.onError/);
  assert.match(body, /PlatformDispatcher\.instance\.onError/);
  assert.match(body, /runZonedGuarded/);
  assert.match(body, /as of November 2026/i);
  assert.match(body, /Last checked: Nov 4, 2026\./);
  assert.equal(body.includes("we tested"), false);
  assert.equal(
    /\b(best|don't|it's|can't|won't)\b/i.test(
      body.replaceAll("/guides/best-crash-reporting-tools-mobile", ""),
    ),
    false,
  );

  for (const href of [
    "/guides/best-crash-reporting-tools-mobile",
    "/comparisons/sentry-vs-firebase-crashlytics-mobile-apps",
    "/categories/crash-reporting",
    "/guides/crash-reporting-setup-indie-mobile-apps",
    "/tools/sentry",
    "/tools/firebase",
  ]) {
    assert.equal(body.includes(href), true, href);
  }
});

test("the surrounding pages link the Flutter guide without rewriting the general list", () => {
  const generalAt = seed.indexOf('slug: "best-crash-reporting-tools-mobile"');
  const generalBodyAt = seed.indexOf("body_markdown: `", generalAt);
  const generalClose = seed.indexOf(
    'seo_title:\n            "Best Crash Reporting Tools for Mobile Apps (2026): Free Tiers Compared"',
    generalBodyAt,
  );
  const generalBody = seed.slice(
    generalBodyAt + "body_markdown: `".length,
    generalClose,
  );

  assert.equal(
    generalBody.split("/guides/flutter-crash-reporting").length - 1,
    1,
  );
  assert.match(generalBody, /Last checked: Oct 20, 2026\./);
  assert.match(
    toolContent.firebase.body_markdown,
    /\/guides\/flutter-crash-reporting/,
  );
  assert.match(
    toolContent.sentry.body_markdown,
    /\/guides\/flutter-crash-reporting/,
  );
  assert.match(
    seed,
    /For a Flutter app, compare SDKs in \[Flutter crash reporting tools\]\(\/guides\/flutter-crash-reporting\)\./,
  );
});
