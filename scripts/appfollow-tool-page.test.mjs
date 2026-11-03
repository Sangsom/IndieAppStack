import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const toolContent = JSON.parse(
  fs.readFileSync(new URL("./tool-content.json", import.meta.url), "utf8"),
);
const seed = fs.readFileSync(
  new URL("./seed-database.mjs", import.meta.url),
  "utf8",
);
const overrides = fs.readFileSync(
  new URL("../lib/tool-seo-overrides.ts", import.meta.url),
  "utf8",
);

const appfollow = toolContent.appfollow;
const body = appfollow.body_markdown;

test("AppFollow page carries the Nov 3, 2026 check", () => {
  assert.equal(appfollow.pricing_last_checked, "2026-11-03");
  assert.match(appfollow.pricing_summary, /^Checked Nov 3, 2026\./);
  assert.match(body, /^## Short answer\nChecked Nov 3, 2026\./);
  assert.match(body, /:::comparison AppFollow plans \(checked Nov 3, 2026\)/);
  assert.match(body, /https:\/\/appfollow\.io\/pricing/);
});

test("plan table lists the five help-center plans without invented prices", () => {
  for (const plan of ["Free", "ASO", "Essential", "Team", "Enterprise"]) {
    assert.match(body, new RegExp(`\\| ${plan} \\| `));
  }
  const table = body.slice(
    body.indexOf(":::comparison"),
    body.indexOf(":::", body.indexOf(":::comparison") + 3),
  );
  assert.deepEqual(table.match(/\$\d[\d,.]*/g), ["$0"]);
});

test("connector sub-question and FAQ headings are present", () => {
  assert.match(body, /## What the AppFollow connector is/);
  assert.match(body, /Claude connectors directory/);
  assert.match(body, /### What is the AppFollow connector\?/);
  assert.ok((body.match(/^### .+\?$/gm) ?? []).length >= 5);
});

test("over-scoped section and ASO category CTA", () => {
  assert.match(body, /## When AppFollow is over-scoped for a solo app/);
  assert.match(body, /\[ASO category\]\(\/categories\/aso\)/);
  assert.match(body, /\(\/tools\/appfigures\)/);
  assert.match(body, /\(\/tools\/apptweak\)/);
});

test("plan-fit diagram ships with the body", () => {
  assert.match(body, /\(\/content-visuals\/articles\/appfollow-plan-fit\.svg /);
  assert.ok(
    fs.existsSync(
      new URL(
        "../public/content-visuals/articles/appfollow-plan-fit.svg",
        import.meta.url,
      ),
    ),
  );
});

test("seed and SEO override match the refresh", () => {
  const entry = seed.slice(
    seed.indexOf('slug: "appfollow",'),
    seed.indexOf('name: "Framer"'),
  );
  assert.match(entry, /pricing_model: "freemium"/);
  assert.match(entry, /Checked 2026-11-03/);
  assert.match(overrides, /appfollow: \{/);
  const title = overrides.match(/appfollow: \{\s*title: "([^"]+)"/)[1];
  assert.ok(title.length <= 60, `title is ${title.length} chars`);
});
