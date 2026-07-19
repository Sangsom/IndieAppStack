import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const textFileExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
]);

const publicSourcePaths = [
  "app/(public)",
  "app/go",
  "components/public",
  "lib/affiliate-links.ts",
  "lib/article-markdown.ts",
  "lib/category-page-data.ts",
  "lib/compliance.ts",
  "lib/guide-data.ts",
  "lib/homepage-data.ts",
  "lib/public-navigation.ts",
  "lib/redirects.ts",
  "lib/seo.ts",
  "lib/sitemap-data.ts",
  "lib/site.ts",
  "lib/stack-finder",
  "lib/tool-detail-data.ts",
  "lib/tool-directory-data.ts",
  "public/content-visuals",
];

const seedPublicFields = [
  "body_markdown",
  "description",
  "excerpt",
  "seo_description",
  "seo_title",
  "subtitle",
  "tagline",
  "title",
];

const forbiddenTextRules = [
  // Internal affiliate/link governance should stay in admin tools, docs, or
  // evidence logs. Public pages should only show reader-facing disclosures.
  ["internal affiliate status heading", /Affiliate and partner status/i],
  ["internal link governance heading", /Link governance/i],
  ["internal affiliate CTA instruction", /No affiliate CTA should appear/i],
  ["internal partner status wording", /partner\/affiliate status/i],
  ["internal current link rule wording", /Current link rule/i],
  ["internal status checked wording", /Status checked/i],
  ["partner status label", /\bpartner status\b/i],
  ["affiliate status label", /\baffiliate status\b/i],
  ["program status label", /\bprogram status\b/i],
  ["application status label", /\bapplication status\b/i],
  ["link rule label", /\blink rule\b/i],
  ["unapproved program wording", /not applied or approved/i],
  ["unapproved program wording", /\bnot approved\b/i],
  ["not-applied status wording", /\bnot[-_ ]applied\b/i],
  ["pending approval wording", /\bpending approval\b|\bapproval pending\b/i],
  ["pending partner instruction", /mark partner status pending/i],
  [
    "pending outreach wording",
    /\bpending outreach\b|\boutreach (?:is )?pending\b/i,
  ],
  ["approval and terms instruction", /until approval and terms review/i],
  ["terms-review instruction", /\bterms review\b|\bterms are reviewed\b/i],
  ["approved affiliate-page research note", /approved public affiliate/i],
  ["direct editorial link instruction", /uses? direct\/editorial links/i],
  ["direct editorial link instruction", /use direct editorial links until/i],
  ["outreach instruction", /use direct links until outreach/i],
  [
    "affiliate approval instruction",
    /program is approved, terms are recorded/i,
  ],
  ["partner target wording", /partner target/i],
  [
    "future affiliate relationship wording",
    /may become an affiliate relationship/i,
  ],
  [
    "future partner relationship wording",
    /could become partner relationships/i,
  ],
  ["future partner link wording", /partner links in the future/i],

  // Internal editorial/research workflow language should not be rendered.
  ["editorial-note process heading", /\bEditorial note\b/i],
  ["commission-ranking process wording", /commission ranking/i],
  ["human review notes heading", /Human review notes/i],
  ["human review process wording", /\bhuman[- ]review(?:ed)? notes?\b/i],
  ["production-note process wording", /Production note/i],
  ["visual-rule process wording", /\bVisual rule\b/i],
  ["evidence-log process wording", /Claim scope reviewed|evidence[- ]log/i],
  ["review-status process wording", /\bReview status\b/i],
  ["evidence-gap process wording", /\bevidence[-_ ]gap\b/i],
  ["do-not-publish process status", /\bdo[-_ ]not[-_ ]publish\b/i],
  ["needs-review process status", /\bneeds[-_ ]review\b/i],
  ["reviewer process label", /\bReviewer\b/i],
  ["publishing blocker process wording", /\bpublishing blocker\b/i],
  ["allowed wording process note", /\ballowed wording\b/i],
  [
    "source-check workflow note",
    /\bsource[- ]check(?:ed|ing)? (?:workflow|notes?)\b/i,
  ],
  ["placeholder status", /\bTBD\b/i],
  ["internal notes label", /internal notes/i],
  ["monetized-link operations note", /before using monetized links/i],
];

const publicDataAccessRules = [
  ["public source must not select internal_notes", /\binternal_notes\b/i],
  [
    "public source must not query affiliate_programs",
    /\.from\(\s*["']affiliate_programs["']\s*\)/i,
  ],
  [
    "public source must not use broad Supabase selects",
    /\.select\(\s*["']\*["']\s*\)/i,
  ],
  [
    "public source must not select affiliate link notes",
    /\.from\(\s*["']affiliate_links["']\s*\)[\s\S]{0,300}\.select\(\s*["'][^"']*\bnotes\b/i,
  ],
];

function repoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function isTextFile(filePath) {
  return textFileExtensions.has(path.extname(filePath));
}

function collectFiles(entryPath) {
  const absolutePath = path.join(repoRoot, entryPath);
  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    return isTextFile(absolutePath) ? [absolutePath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const childPath = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(repoPath(childPath)));
    } else if (entry.isFile() && isTextFile(childPath)) {
      files.push(childPath);
    }
  }
  return files;
}

function findRuleMatches({ label, text }, rules) {
  const matches = [];
  for (const [ruleName, pattern] of rules) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      matches.push({
        label,
        line: lineNumber(text, match.index),
        ruleName,
        snippet: text
          .slice(
            Math.max(0, match.index - 60),
            match.index + match[0].length + 60,
          )
          .replace(/\s+/g, " ")
          .trim(),
      });
    }
  }
  return matches;
}

function readQuotedString(source, valueStart) {
  let index = valueStart;
  while (/\s/.test(source[index] ?? "")) {
    index += 1;
  }

  const quote = source[index];
  if (quote !== '"' && quote !== "'" && quote !== "`") {
    return null;
  }

  index += 1;
  const contentStart = index;
  let escaped = false;

  for (; index < source.length; index += 1) {
    const char = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      return {
        text: source.slice(contentStart, index),
        start: contentStart,
      };
    }
  }

  return null;
}

function extractSeedPublicContent() {
  const seedPath = path.join(repoRoot, "scripts/seed-database.mjs");
  const source = readTextFile(seedPath);
  const entries = [];

  for (const field of seedPublicFields) {
    const pattern = new RegExp(`\\b${field}\\s*:`, "g");
    let count = 0;
    while (pattern.exec(source)) {
      const value = readQuotedString(source, pattern.lastIndex);
      if (!value) {
        continue;
      }
      count += 1;
      entries.push({
        label: `scripts/seed-database.mjs ${field} #${count}`,
        text: value.text,
      });
      pattern.lastIndex = value.start + value.text.length + 1;
    }
  }

  return entries;
}

// Rebuilt tool bodies, pros, cons, and pricing summaries live in a JSON data
// file (scripts/tool-content.json) that is merged into the seed. Scan every
// string it contains, including array items, which the seed string scanner
// above cannot reach.
function extractToolContentJson() {
  const contentPath = path.join(repoRoot, "scripts/tool-content.json");
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const data = JSON.parse(readTextFile(contentPath));
  const entries = [];

  for (const [slug, fields] of Object.entries(data)) {
    for (const [field, value] of Object.entries(fields ?? {})) {
      const values = Array.isArray(value) ? value : [value];
      values.forEach((item, index) => {
        if (typeof item !== "string") {
          return;
        }
        const suffix = Array.isArray(value) ? `[${index}]` : "";
        entries.push({
          label: `scripts/tool-content.json ${slug}.${field}${suffix}`,
          text: item,
        });
      });
    }
  }

  return entries;
}

async function auditLiveSite(siteUrl) {
  const normalizedUrl = siteUrl.replace(/\/$/, "");
  const sitemapResponse = await fetch(`${normalizedUrl}/sitemap.xml`, {
    headers: { "user-agent": "IndieAppStack public content safety audit" },
  });

  if (!sitemapResponse.ok) {
    throw new Error(`Could not fetch sitemap: ${sitemapResponse.status}`);
  }

  const sitemap = await sitemapResponse.text();
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  );
  const urls = [...new Set([normalizedUrl, ...sitemapUrls])].sort();
  const findings = [];

  for (const url of urls) {
    const response = await fetch(url, {
      headers: { "user-agent": "IndieAppStack public content safety audit" },
    });
    const html = await response.text();
    if (!response.ok) {
      findings.push({
        label: url,
        line: 1,
        ruleName: `live page returned ${response.status}`,
        snippet: "",
      });
      continue;
    }
    findings.push(
      ...findRuleMatches({ label: url, text: html }, forbiddenTextRules),
    );
  }

  return { checked: urls.length, findings };
}

function printFindings(findings) {
  for (const finding of findings) {
    const location = finding.line
      ? `${finding.label}:${finding.line}`
      : finding.label;
    console.error(`- ${location}`);
    console.error(`  Rule: ${finding.ruleName}`);
    if (finding.snippet) {
      console.error(`  Snippet: ${finding.snippet}`);
    }
  }
}

async function main() {
  const publicFiles = [
    ...new Set(publicSourcePaths.flatMap(collectFiles)),
  ].sort();
  const findings = [];

  for (const filePath of publicFiles) {
    const text = readTextFile(filePath);
    findings.push(
      ...findRuleMatches({ label: repoPath(filePath), text }, [
        ...forbiddenTextRules,
        ...publicDataAccessRules,
      ]),
    );
  }

  for (const entry of extractSeedPublicContent()) {
    findings.push(...findRuleMatches(entry, forbiddenTextRules));
  }

  const toolContentEntries = extractToolContentJson();
  for (const entry of toolContentEntries) {
    findings.push(...findRuleMatches(entry, forbiddenTextRules));
  }

  const siteUrlArg = process.argv.find((arg) => arg.startsWith("--url="));
  const siteUrl =
    siteUrlArg?.slice("--url=".length) ?? process.env.PUBLIC_CONTENT_SAFETY_URL;
  let liveChecked = 0;
  if (siteUrl) {
    const liveResult = await auditLiveSite(siteUrl);
    liveChecked = liveResult.checked;
    findings.push(...liveResult.findings);
  }

  if (findings.length) {
    console.error("Public content safety check failed:");
    printFindings(findings);
    process.exit(1);
  }

  const liveSummary = siteUrl ? ` and ${liveChecked} live URLs` : "";
  console.log(
    `Public content safety check passed for ${publicFiles.length} source files, ${seedPublicFields.length} seed field groups, ${toolContentEntries.length} tool-content strings${liveSummary}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
