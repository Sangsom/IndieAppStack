import fs from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";

import { createClient } from "@supabase/supabase-js";

import {
  getKeywordsEverywhereArticleSeed,
  getKeywordsEverywhereProgramSeed,
  getKeywordsEverywhereToolSeed,
  getKeywordsEverywhereTopicSeed,
  keywordsEverywhereAffiliateUrl,
  keywordsEverywhereGuideSlug,
  keywordsEverywhereSlug,
} from "./content/keywords-everywhere.mjs";

function readEnvLocal() {
  const envPath = path.join(cwd(), ".env.local");

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

const envLocal = readEnvLocal();
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? envLocal.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? envLocal.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
  exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});

async function upsert(table, rows, options) {
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, options)
    .select();

  if (error) {
    throw new Error(`${table} upsert failed: ${error.message}`);
  }

  return data;
}

async function requireBySlug(table, slug) {
  const { data, error } = await supabase
    .from(table)
    .select("id,slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`${table} lookup failed for ${slug}: ${error.message}`);
  }

  if (!data) {
    throw new Error(`${table} row not found for slug ${slug}`);
  }

  return data;
}

const toolSeed = getKeywordsEverywhereToolSeed();
const { categorySlugs, ...toolRow } = toolSeed;

const [landingPages, apptweak, appfigures, framer] = await Promise.all([
  requireBySlug("categories", "landing-pages"),
  requireBySlug("tools", "apptweak"),
  requireBySlug("tools", "appfigures"),
  requireBySlug("tools", "framer"),
]);

const tools = await upsert("tools", [toolRow], { onConflict: "slug" });
const tool = tools[0];

const programs = await upsert(
  "affiliate_programs",
  [getKeywordsEverywhereProgramSeed()],
  { onConflict: "name" },
);
const program = programs[0];

const launch = await requireBySlug("categories", "launch");

await upsert(
  "tool_categories",
  [
    {
      category_id: landingPages.id,
      sort_order: 10,
      tool_id: tool.id,
    },
    {
      category_id: launch.id,
      sort_order: 20,
      tool_id: tool.id,
    },
  ],
  { onConflict: "tool_id,category_id" },
);

await upsert(
  "affiliate_links",
  [
    {
      tool_id: tool.id,
      affiliate_program_id: program.id,
      destination_url: keywordsEverywhereAffiliateUrl,
      slug: keywordsEverywhereSlug,
      status: "active",
      default_rel: "sponsored nofollow",
      disclosure_required: true,
      notes:
        "FirstPromoter parameter fpr=od3ykm. Do not publish commission or cookie window until the dashboard confirms them.",
    },
  ],
  { onConflict: "slug" },
);

const articles = await upsert(
  "articles",
  [getKeywordsEverywhereArticleSeed(landingPages.id)],
  { onConflict: "slug" },
);
const article = articles[0];

await supabase.from("article_tools").delete().eq("article_id", article.id);

const { error: articleToolsError } = await supabase
  .from("article_tools")
  .insert([
    {
      article_id: article.id,
      tool_id: tool.id,
      relationship: "featured",
      sort_order: 10,
    },
    {
      article_id: article.id,
      tool_id: apptweak.id,
      relationship: "supporting",
      sort_order: 20,
    },
    {
      article_id: article.id,
      tool_id: appfigures.id,
      relationship: "supporting",
      sort_order: 30,
    },
    {
      article_id: article.id,
      tool_id: framer.id,
      relationship: "supporting",
      sort_order: 40,
    },
  ]);

if (articleToolsError) {
  throw new Error(`article_tools insert failed: ${articleToolsError.message}`);
}

await upsert(
  "topic_queue",
  [
    getKeywordsEverywhereTopicSeed({
      landingPagesCategoryId: landingPages.id,
      toolIds: [tool.id, apptweak.id, appfigures.id, framer.id],
    }),
  ],
  { onConflict: "slug" },
);

console.log(
  JSON.stringify(
    {
      tool: `/tools/${keywordsEverywhereSlug}`,
      guide: `/guides/${keywordsEverywhereGuideSlug}`,
      redirect: `/go/${keywordsEverywhereSlug}`,
      topicKeyword: "keywords everywhere",
      program: program.name,
      destination: keywordsEverywhereAffiliateUrl,
    },
    null,
    2,
  ),
);
