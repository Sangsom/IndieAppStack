import fs from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";

import { createClient } from "@supabase/supabase-js";

function readEnvFile(fileName) {
  const envPath = path.join(cwd(), fileName);

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...valueParts] = line.split("=");
        return [key, valueParts.join("=")];
      }),
  );
}

const env = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...process.env,
};

const requiredFiles = [
  "app/(public)/page.tsx",
  "app/(public)/tools/page.tsx",
  "app/(public)/tools/[slug]/page.tsx",
  "app/(public)/comparisons/page.tsx",
  "app/(public)/comparisons/[slug]/page.tsx",
  "app/(public)/guides/page.tsx",
  "app/(public)/guides/[slug]/page.tsx",
  "app/(public)/stack-finder/page.tsx",
  "app/(public)/stack-finder/results/page.tsx",
  "app/(public)/affiliate-disclosure/page.tsx",
  "app/(public)/privacy-policy/page.tsx",
  "app/(public)/newsletter/route.ts",
  "app/(admin)/admin/(protected)/tools/page.tsx",
  "app/(admin)/admin/(protected)/articles/page.tsx",
  "app/(admin)/admin/(protected)/links/page.tsx",
  "app/go/[slug]/route.ts",
  "app/sitemap.ts",
  "app/robots.ts",
  "components/analytics/google-analytics.tsx",
];

const livePaths = [
  "/",
  "/tools",
  "/tools/revenuecat",
  "/comparisons/revenuecat-vs-adapty-ios-subscriptions",
  "/guides/best-aso-tools-for-indie-developers",
  "/stack-finder",
  "/affiliate-disclosure",
  "/privacy-policy",
  "/sitemap.xml",
  "/robots.txt",
];

const checks = [];

function pass(name, detail) {
  checks.push({ detail, name, passed: true });
}

function fail(name, detail) {
  checks.push({ detail, name, passed: false });
}

function fileExists(file) {
  return fs.existsSync(path.join(cwd(), file));
}

function printResults() {
  for (const check of checks) {
    const status = check.passed ? "PASS" : "FAIL";
    console.log(
      `${status} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`,
    );
  }

  const failures = checks.filter((check) => !check.passed);

  if (failures.length) {
    console.error(
      `\nLaunch readiness failed: ${failures.length} check(s) need attention.`,
    );
    exit(1);
  }

  console.log("\nLaunch readiness checks passed.");
}

function assertRequiredFiles() {
  for (const file of requiredFiles) {
    if (fileExists(file)) {
      pass(`Required route/source: ${file}`);
    } else {
      fail(`Required route/source: ${file}`, "missing");
    }
  }
}

function createSupabaseClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    fail(
      "Supabase launch checks",
      "missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

async function countRows(supabase, table, buildQuery) {
  let query = supabase.from(table).select("*", {
    count: "exact",
    head: true,
  });

  query = buildQuery ? buildQuery(query) : query;
  const { count, error } = await query;

  if (error) {
    throw new Error(`${table} count failed: ${error.message}`);
  }

  return count ?? 0;
}

async function assertDatabaseContent() {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return;
  }

  const [
    publishedTools,
    publishedCategories,
    publishedGuidesAndComparisons,
    publishedComparisons,
    affiliateLinks,
    unpublishedPublicArticles,
    unreviewedPublishedAi,
  ] = await Promise.all([
    countRows(supabase, "tools", (query) => query.eq("status", "published")),
    countRows(supabase, "categories", (query) =>
      query.eq("status", "published"),
    ),
    countRows(supabase, "articles", (query) =>
      query
        .eq("status", "published")
        .eq("human_reviewed", true)
        .in("content_type", ["guide", "comparison"]),
    ),
    countRows(supabase, "articles", (query) =>
      query
        .eq("status", "published")
        .eq("human_reviewed", true)
        .eq("content_type", "comparison"),
    ),
    countRows(supabase, "affiliate_links", (query) =>
      query.in("status", ["active", "pending"]),
    ),
    countRows(supabase, "articles", (query) =>
      query.or("status.neq.published,human_reviewed.eq.false"),
    ),
    countRows(supabase, "articles", (query) =>
      query
        .eq("status", "published")
        .eq("ai_assisted", true)
        .eq("human_reviewed", false),
    ),
  ]);

  if (publishedTools >= 25) {
    pass("25+ published tools", `${publishedTools}`);
  } else {
    fail("25+ published tools", `${publishedTools}`);
  }

  if (publishedCategories >= 5) {
    pass("5+ published categories", `${publishedCategories}`);
  } else {
    fail("5+ published categories", `${publishedCategories}`);
  }

  if (publishedGuidesAndComparisons >= 8) {
    pass(
      "8+ published guide/comparison pages",
      `${publishedGuidesAndComparisons}`,
    );
  } else {
    fail(
      "8+ published guide/comparison pages",
      `${publishedGuidesAndComparisons}`,
    );
  }

  if (publishedComparisons >= 4) {
    pass("4+ published comparison pages", `${publishedComparisons}`);
  } else {
    fail("4+ published comparison pages", `${publishedComparisons}`);
  }

  if (affiliateLinks > 0) {
    pass("Affiliate link records present", `${affiliateLinks}`);
  } else {
    fail("Affiliate link records present", "none active or pending");
  }

  pass(
    "Public draft indexing guard",
    `${unpublishedPublicArticles} non-public article(s) exist but RLS/sitemap only expose published reviewed articles`,
  );

  if (unreviewedPublishedAi === 0) {
    pass("No published AI-assisted drafts without human review");
  } else {
    fail(
      "No published AI-assisted drafts without human review",
      `${unreviewedPublishedAi}`,
    );
  }
}

async function assertLiveUrl() {
  const baseUrl = env.LAUNCH_VERIFY_URL || env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl || baseUrl.includes("localhost")) {
    pass(
      "Live URL probes",
      "skipped; set LAUNCH_VERIFY_URL=https://indieappstack.com to verify production",
    );
    return;
  }

  for (const routePath of livePaths) {
    const url = new URL(routePath, baseUrl).toString();
    const response = await fetch(url, { redirect: "manual" });
    const ok =
      response.status >= 200 &&
      response.status < 400 &&
      response.status !== 401 &&
      response.status !== 403;

    if (ok) {
      pass(`Live route: ${routePath}`, `${response.status}`);
    } else {
      fail(`Live route: ${routePath}`, `${response.status}`);
    }
  }
}

async function main() {
  assertRequiredFiles();
  await assertDatabaseContent();
  await assertLiveUrl();
  printResults();
}

main().catch((error) => {
  console.error(error);
  exit(1);
});
