import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  parseGitCommitDate,
  readGitCommitDate,
  resolveStaticPageLastmod,
  STATIC_PAGE_LASTMOD_FALLBACK,
  STATIC_PAGE_SOURCES,
  staticPageLastmodMap,
} from "../lib/static-page-lastmod.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("a commit timestamp becomes a UTC calendar date", () => {
  assert.equal(parseGitCommitDate("2026-10-15T13:35:48+00:00\n"), "2026-10-15");
  assert.equal(parseGitCommitDate("2026-10-15T23:30:00-05:00\n"), "2026-10-16");
  assert.equal(parseGitCommitDate(""), null);
  assert.equal(parseGitCommitDate("not-a-date"), null);
});

test("a git date replaces the hand-maintained fallback", () => {
  assert.equal(resolveStaticPageLastmod("/about", "2026-10-15"), "2026-10-15");
});

test("a missing git date keeps the hand-maintained fallback", () => {
  assert.equal(
    resolveStaticPageLastmod("/about", null),
    STATIC_PAGE_LASTMOD_FALLBACK["/about"],
  );
  assert.equal(
    resolveStaticPageLastmod("/about", "yesterday"),
    STATIC_PAGE_LASTMOD_FALLBACK["/about"],
  );
});

test("baked build dates are used when live git history is missing", () => {
  const dates = staticPageLastmodMap({
    generated: { "/about": "2026-10-15" },
    readCommitDate: () => null,
  });

  assert.equal(dates["/about"], "2026-10-15");
  assert.equal(dates["/terms"], STATIC_PAGE_LASTMOD_FALLBACK["/terms"]);
});

test("live git history wins over a stale baked date", () => {
  const dates = staticPageLastmodMap({
    generated: { "/about": "2026-01-01" },
    readCommitDate: () => "2026-10-15",
  });

  assert.equal(dates["/about"], "2026-10-15");
});

test("every fallback page has a source file that exists", () => {
  for (const pagePath of Object.keys(STATIC_PAGE_LASTMOD_FALLBACK)) {
    const source = STATIC_PAGE_SOURCES[pagePath];

    assert.equal(typeof source, "string");
    assert.equal(fs.existsSync(path.join(repoRoot, source)), true, source);
  }
});

test("about page lastmod follows the source file when git history is present", () => {
  const source = STATIC_PAGE_SOURCES["/about"];
  let expected = null;

  try {
    expected = parseGitCommitDate(
      execFileSync("git", ["log", "-1", "--format=%cI", "--", source], {
        cwd: repoRoot,
        encoding: "utf8",
        env: { ...process.env, TZ: "UTC" },
      }),
    );
  } catch {
    expected = null;
  }

  const dates = staticPageLastmodMap({
    readCommitDate: (filePath) => readGitCommitDate(filePath, repoRoot),
  });

  if (expected) {
    assert.equal(dates["/about"], expected);
    assert.equal(readGitCommitDate(source, repoRoot), expected);
  } else {
    assert.equal(dates["/about"], STATIC_PAGE_LASTMOD_FALLBACK["/about"]);
  }
});

test("CI checks out full history and the build records static lastmod", () => {
  const workflow = fs.readFileSync(
    path.join(repoRoot, ".github/workflows/ci.yml"),
    "utf8",
  );
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
  );

  assert.match(workflow, /fetch-depth:\s*0/);
  assert.match(packageJson.scripts.build, /ensure-full-git-history/);
  assert.match(packageJson.scripts.build, /write-static-page-lastmod/);
});
