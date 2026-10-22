import { execFileSync } from "node:child_process";

// Hand-maintained dates. Used when git history is missing (shallow clone,
// no .git in the serverless bundle). Meaningful page edits still show up
// through the commit date of the source file when history is available.
export const STATIC_PAGE_LASTMOD_FALLBACK = {
  "/": "2026-07-19",
  "/about": "2026-10-09",
  "/affiliate-disclosure": "2026-07-19",
  "/editorial-policy": "2026-10-09",
  "/privacy-policy": "2026-06-29",
  "/terms": "2026-06-29",
};

export const STATIC_PAGE_SOURCES = {
  "/": "app/(public)/page.tsx",
  "/about": "app/(public)/about/page.tsx",
  "/affiliate-disclosure": "app/(public)/affiliate-disclosure/page.tsx",
  "/editorial-policy": "app/(public)/editorial-policy/page.tsx",
  "/privacy-policy": "app/(public)/privacy-policy/page.tsx",
  "/terms": "app/(public)/terms/page.tsx",
};

const commitDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function parseGitCommitDate(stdout) {
  const line = stdout.trim().split("\n")[0]?.trim() ?? "";

  if (!line) {
    return null;
  }

  const parsed = Date.parse(line);

  if (Number.isNaN(parsed)) {
    if (commitDatePattern.test(line)) {
      return line;
    }

    return null;
  }

  return new Date(parsed).toISOString().slice(0, 10);
}

export function resolveStaticPageLastmod(
  pagePath,
  gitDate,
  fallback = STATIC_PAGE_LASTMOD_FALLBACK,
) {
  if (gitDate && commitDatePattern.test(gitDate)) {
    return gitDate;
  }

  return fallback[pagePath];
}

export function readGitCommitDate(filePath, repoRoot = process.cwd()) {
  try {
    const stdout = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", filePath],
      {
        cwd: repoRoot,
        encoding: "utf8",
        env: { ...process.env, TZ: "UTC" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    return parseGitCommitDate(stdout);
  } catch {
    return null;
  }
}

// Live git wins. The JSON written at build is the next choice, because the
// production sitemap re-renders after a reseed on a machine without .git.
// The hand list covers both being unavailable.
export function staticPageLastmodMap({
  fallback = STATIC_PAGE_LASTMOD_FALLBACK,
  generated = {},
  readCommitDate = readGitCommitDate,
} = {}) {
  const dates = {};

  for (const pagePath of Object.keys(fallback)) {
    const source = STATIC_PAGE_SOURCES[pagePath];
    const live = source ? readCommitDate(source) : null;
    const baked = generated[pagePath];
    const resolved = resolveStaticPageLastmod(
      pagePath,
      live ?? (typeof baked === "string" ? baked : null),
      fallback,
    );

    if (resolved) {
      dates[pagePath] = resolved;
    }
  }

  return dates;
}
