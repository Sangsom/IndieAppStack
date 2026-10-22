import fs from "node:fs";
import { pathToFileURL } from "node:url";

// Keep this list aligned with the content paths in
// .github/workflows/seed-production.yml. Migration files are not content.
const CONTENT_FILES = new Set([
  ".github/workflows/seed-production.yml",
  "scripts/env-local.mjs",
  "scripts/revalidate-production.mjs",
  "scripts/seed-database.mjs",
  "scripts/seed-plan.mjs",
  "scripts/tool-content.json",
]);

export function isContentSeedPath(file) {
  return (
    CONTENT_FILES.has(file) ||
    file.startsWith("output/indieappstack/") ||
    file.startsWith("scripts/content/")
  );
}

export function contentSeedChanged(files) {
  return files.some((file) => isContentSeedPath(file));
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const files = [];
  const stdin = fs.readFileSync(0, "utf8");

  for (const line of stdin.split("\n")) {
    const file = line.trim();

    if (file) {
      files.push(file);
    }
  }

  process.stdout.write(contentSeedChanged(files) ? "true\n" : "false\n");
}
