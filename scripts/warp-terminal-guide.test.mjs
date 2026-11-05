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
  '"Warp for indie mobile developers: do you actually need an AI terminal?"',
  'slug: "best-monetization-tools-solo-mobile-developers"',
);

function quoted(source, field) {
  const pattern = new RegExp(`${field}:\\s*\\n?\\s*"([^"]*)"`);
  const match = pattern.exec(source);
  assert.ok(match, `missing ${field}`);
  return match[1];
}

test("Warp guide title and meta answer the mobile-app query", () => {
  const seoTitle = quoted(guide, "seo_title");
  const seoDescription = quoted(guide, "seo_description");

  assert.equal(seoTitle, "Does Warp Terminal Have a Mobile App? (2026)");
  assert.ok(seoTitle.length <= 44, `seo_title length ${seoTitle.length}`);
  assert.equal(
    seoDescription,
    "Warp has no iOS or Android app. It runs on macOS, Windows and Linux; from a phone you can only manage cloud agents in a browser. Checked Oct 29, 2026.",
  );
  assert.ok(
    seoDescription.length <= 155,
    `seo_description length ${seoDescription.length}`,
  );
  assert.match(
    guide,
    /Warp for indie mobile developers: do you actually need an AI terminal\?/,
  );
  assert.match(guide, /published_at: warpPublishedAt/);
  assert.doesNotMatch(guide, /2026-07-18/);
});

test("Warp guide pricing section drops credit wording", () => {
  const pricing = sliceBetween(guide, "## Pricing", "## How to try Warp");

  assert.match(pricing, /Warp plans \(checked 2026-10-29\)/);
  assert.match(pricing, /\$0/);
  assert.match(pricing, /\$20 per month, or \$18 per month on the annual plan/);
  assert.match(
    pricing,
    /\$200 per month, or \$180 per month on the annual plan/,
  );
  assert.match(
    pricing,
    /\$50 per user per month, or \$45 per user per month on the annual plan, up to 25 seats/,
  );
  assert.match(pricing, /SAML-based SSO/);
  assert.match(pricing, /https:\/\/www\.warp\.dev\/pricing/);
  assert.doesNotMatch(pricing, /credits/i);
  assert.doesNotMatch(guide, /1,500/);
  assert.doesNotMatch(guide, /18,000/);
  assert.doesNotMatch(guide, /2026-07-18/);
});

test("Warp guide keeps the referral link and answers the mobile FAQ first", () => {
  assert.match(guide, /\/go\/warp/);
  assert.match(guide, /Affiliate disclosure/);
  assert.match(
    guide,
    /The Warp link on this page is a referral link\. If you start with Warp through it, IndieAppStack may receive referral credit at no extra cost to you\./,
  );
  assert.match(guide, /## Is there a Warp mobile app for iPhone or Android\?/);
  assert.match(guide, /Last checked: 2026-10-29/);

  const faq = sliceBetween(
    guide,
    "## Frequently asked questions",
    "## The recommendation",
  );
  const mobileApp = faq.indexOf("### Does Warp have a mobile app?");
  const iosAndroid = faq.indexOf(
    "### Does Warp work for iOS and Android development?",
  );

  assert.ok(mobileApp !== -1 && mobileApp < iosAndroid);
  assert.match(faq, /no native iOS or Android app \(checked Oct 29, 2026\)/);
});

test("Warp guide lead visual is the mobile versus desktop diagram", () => {
  const firstImage = guide.indexOf("/content-visuals/articles/");
  assert.match(
    guide.slice(firstImage, firstImage + 80),
    /warp-mobile-vs-desktop\.svg/,
  );

  const svg = fs.readFileSync(
    new URL(
      "../public/content-visuals/articles/warp-mobile-vs-desktop.svg",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(svg, /width="1200"/);
  assert.match(svg, /height="675"/);
  assert.match(svg, /On your Mac or PC/);
  assert.match(svg, /No Warp app/);
  assert.match(svg, /Oz web app in a browser/);
  assert.match(svg, /Checked Oct 29, 2026/);
  assert.doesNotMatch(svg, /credits/i);

  const decision = fs.readFileSync(
    new URL(
      "../public/content-visuals/articles/warp-terminal-decision.svg",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(decision, /credits/i);
});
