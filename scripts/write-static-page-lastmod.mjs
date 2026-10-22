import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { staticPageLastmodMap } from "../lib/static-page-lastmod.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const dates = staticPageLastmodMap();
const output = path.join(repoRoot, "lib/static-page-lastmod.generated.json");
const ordered = {};

for (const pagePath of Object.keys(dates)) {
  ordered[pagePath] = dates[pagePath];
}

fs.writeFileSync(output, `${JSON.stringify(ordered, null, 2)}\n`);
console.log(
  `[sitemap] wrote static lastmod for ${Object.keys(ordered).length} pages`,
);
