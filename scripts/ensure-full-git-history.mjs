import { execFileSync } from "node:child_process";

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

// Static sitemap lastmod reads the commit date of each page source file.
// Vercel clones shallow, which hides older edits. CI checks out with
// fetch-depth: 0, so this is a no-op there. A failed unshallow leaves the
// hand-maintained fallback dates in place.
let shallow = "false";

try {
  shallow = git(["rev-parse", "--is-shallow-repository"]);
} catch {
  console.warn(
    "[git] history unavailable; static sitemap lastmod will use the fallback dates.",
  );
  process.exit(0);
}

if (shallow !== "true") {
  process.exit(0);
}

try {
  execFileSync("git", ["fetch", "--unshallow", "--no-tags"], {
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    stdio: "inherit",
    timeout: 120000,
  });
} catch {
  console.warn(
    "[git] could not unshallow the checkout; static sitemap lastmod will use the fallback dates.",
  );
}
