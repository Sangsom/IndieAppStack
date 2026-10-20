import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const seed = fs.readFileSync(
  new URL("./seed-database.mjs", import.meta.url),
  "utf8",
);

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `missing ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `missing ${endMarker}`);
  return source.slice(start, end);
}

const guide = sliceBetween(
  seed,
  'title: "Best ASO Tools for Indie Developers (2026): Prices Compared"',
  'slug: "best-landing-page-builders-mobile-apps"',
);

const asoCategory = sliceBetween(seed, 'slug: "aso"', 'slug: "analytics"');

test("ASO guide title is the dated price list", () => {
  assert.match(
    guide,
    /title: "Best ASO Tools for Indie Developers \(2026\): Prices Compared"/,
  );
  assert.match(
    guide,
    /seo_title:\s*"Best ASO Tools for Indie Developers \(2026\): Prices Compared"/,
  );
});

test("first comparison block is the dated entry-price table", () => {
  const first = guide.indexOf(":::comparison");
  const jobs = guide.indexOf(":::comparison ASO jobs and tools");
  assert.ok(first !== -1 && first < jobs);
  assert.match(
    guide.slice(first, jobs),
    /ASO tools by entry price \(checked Oct 20, 2026\)/,
  );
  for (const tool of [
    "Astro",
    "Appfigures",
    "AppTweak",
    "AppFollow",
    "AppScreens",
  ]) {
    assert.match(guide.slice(first, jobs), new RegExp(`\\| ${tool} \\|`));
  }
});

test("prices cite the Oct 20, 2026 vendor check", () => {
  assert.match(guide, /Last checked: 2026-10-20/);
  assert.match(guide, /Pricing checked 2026-10-20/);
  assert.match(guide, /https:\/\/tryastro\.app\//);
  assert.match(guide, /https:\/\/appfigures\.com\/platform\/pricing/);
  assert.match(guide, /https:\/\/www\.apptweak\.com\/en\/pricing/);
  assert.match(guide, /https:\/\/appfollow\.io\/pricing/);
  assert.match(guide, /https:\/\/appscreens\.com\/pricing/);
  assert.match(guide, /\$108/);
  assert.match(guide, /\$9\.99 per month/);
  assert.match(guide, /\$79 per month on annual billing/);
  assert.match(guide, /does not print a price/);
  assert.match(guide, /\$99, or \$25 billed monthly/);
});

test("first-hand Astro note stays inside the documented use", () => {
  assert.match(guide, /We build Mantis and MrGripper/);
  assert.match(
    guide,
    /Astro is the ASO tool we use for keyword tracking on those two apps/,
  );
  assert.doesNotMatch(
    guide,
    /\bwe (?:tested|used|tried|ranked|benchmarked)\b/i,
  );
  assert.doesNotMatch(guide, /\b\d+% of (?:our|Astro) users\b/i);
  assert.match(guide, /The Astro note does not report ranks or results/);
});

test("ASO category description links the price guide", () => {
  assert.match(
    asoCategory,
    /\[Compare ASO tools by price →\]\(\/guides\/best-aso-tools-for-indie-developers\)/,
  );
});

test("ASO map records the price check date", () => {
  const svg = fs.readFileSync(
    new URL(
      "../public/content-visuals/articles/best-aso-tools-map.svg",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(svg, /Entry prices checked Oct 20, 2026/);
  assert.match(svg, /AppTweak · Astro/);
});
