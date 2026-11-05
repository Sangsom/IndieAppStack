import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const seed = fs.readFileSync(
  new URL("./seed-database.mjs", import.meta.url),
  "utf8",
);
const guideMarkdown = fs.readFileSync(
  new URL(
    "../output/indieappstack/best-paywall-tools-ios-apps/content.md",
    import.meta.url,
  ),
  "utf8",
);

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `missing ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `missing ${endMarker}`);
  return source.slice(start, end);
}

function readQuotedField(source, field) {
  const match = new RegExp(`\\b${field}\\s*:\\s*\\n?\\s*"([^"]*)"`).exec(
    source,
  );
  assert.ok(match, `missing ${field}`);
  return match[1];
}

const guide = sliceBetween(
  seed,
  'slug: "best-paywall-tools-ios-apps"',
  'slug: "best-aso-tools-for-indie-developers"',
);

const flowSvgPath = new URL(
  "../public/content-visuals/articles/custom-paywall-storekit2-flow.svg",
  import.meta.url,
);

test("paywall tools seo title and description stay inside the limits", () => {
  const seoTitle = readQuotedField(guide, "seo_title");
  const seoDescription = readQuotedField(guide, "seo_description");

  assert.equal(seoTitle, "Paywall Tools and Software for iOS (2026)");
  assert.ok(seoTitle.length <= 44, `seo_title length ${seoTitle.length}`);
  assert.equal(
    seoDescription,
    "Paywall tools and software for iOS: RevenueCat, Adapty, Superwall and Qonversion fees, and when a custom StoreKit 2 paywall is enough. Oct 29, 2026.",
  );
  assert.ok(
    seoDescription.length <= 155,
    `seo_description length ${seoDescription.length}`,
  );
  const titleWindow = seed.slice(
    seed.indexOf('slug: "best-paywall-tools-ios-apps"') - 180,
    seed.indexOf('slug: "best-paywall-tools-ios-apps"'),
  );
  assert.match(titleWindow, /title: "Paywall tools and software for iOS apps"/);
  assert.match(
    guideMarkdown,
    /^\*\*SEO title:\*\* Paywall Tools and Software for iOS \(2026\)$/m,
  );
  assert.ok(guideMarkdown.includes(`**SEO description:** ${seoDescription}`));
});

test("the guide has one H1 and does not put Superwall alternatives in a heading", () => {
  const h1s = guideMarkdown.match(/^# [^#].*$/gm) ?? [];
  assert.deepEqual(h1s, ["# Paywall tools and software for iOS apps"]);

  const headings = guideMarkdown.match(/^#{2,3} .+$/gm) ?? [];
  assert.ok(headings.length > 0);
  for (const heading of headings) {
    assert.doesNotMatch(heading, /Superwall alternatives/i);
  }
  assert.match(
    guideMarkdown,
    /\[Superwall alternatives\]\(\/comparisons\/superwall-alternatives-ios-apps\)/,
  );
});

test("the custom paywall flow SVG is referenced and present", () => {
  const src = "/content-visuals/articles/custom-paywall-storekit2-flow.svg";
  assert.match(guideMarkdown, new RegExp(src.replaceAll("/", "\\/")));
  const svg = fs.readFileSync(flowSvgPath, "utf8");
  assert.match(svg, /width="1200"/);
  assert.match(svg, /height="675"/);
  assert.match(svg, /Load Products/);
  assert.match(svg, /Verify and/);
  assert.match(svg, /Oct 29, 2026/);
});

test("dated prices still match the Oct 29, 2026 vendor check", () => {
  assert.match(guideMarkdown, /Last checked: Oct 29, 2026/);
  assert.doesNotMatch(guideMarkdown, /Oct 15, 2026/);
  assert.match(guideMarkdown, /https:\/\/www\.revenuecat\.com\/pricing\//);
  assert.match(
    guideMarkdown,
    /https:\/\/www\.revenuecat\.com\/docs\/welcome\/set-up-revenuecat\/account-management/,
  );
  assert.match(guideMarkdown, /https:\/\/adapty\.io\/pricing\//);
  assert.match(guideMarkdown, /https:\/\/superwall\.com\/pricing/);
  assert.match(guideMarkdown, /https:\/\/qonversion\.io\/pricing/);
  assert.match(
    guideMarkdown,
    /https:\/\/developer\.apple\.com\/documentation\/storekit\/subscriptionstoreview/,
  );
  assert.match(guideMarkdown, /\$2,500/);
  assert.match(guideMarkdown, /\$2,600 as a \$26 charge/);
  assert.match(guideMarkdown, /\$49 per month/);
  assert.match(guideMarkdown, /\$199 per month/);
  assert.match(guideMarkdown, /\$64/);
  assert.match(guideMarkdown, /\$400/);
});
