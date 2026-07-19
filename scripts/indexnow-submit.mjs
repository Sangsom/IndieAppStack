// Submit URLs to IndexNow (Bing, Yandex, and other participating engines) so
// they re-crawl changed pages quickly. Google does NOT participate in IndexNow
// and its "Request indexing" action has no public API, so Google is still a
// manual Search Console step (see docs/seo-indexing-request.md).
//
// Usage:
//   node scripts/indexnow-submit.mjs                 # submit every URL in the live sitemap
//   node scripts/indexnow-submit.mjs <url> [<url>…]  # submit only the given URLs
//   npm run seo:indexnow
//
// The key file (public/<key>.txt) must be deployed and reachable at
// https://<host>/<key>.txt before submitting, so engines can verify ownership.

import fs from "node:fs";
import path from "node:path";
import { cwd, argv, exit } from "node:process";

const ENDPOINT = "https://api.indexnow.org/indexnow";

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
        const [key, ...rest] = line.split("=");
        return [key, rest.join("=")];
      }),
  );
}

const envLocal = readEnvLocal();
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  envLocal.NEXT_PUBLIC_SITE_URL ??
  "https://indieappstack.com"
).replace(/\/$/, "");
const host = new URL(siteUrl).host;

// The IndexNow key lives in its own public file: public/<key>.txt. Deriving the
// key from that file keeps a single source of truth and the correct keyLocation.
function resolveKey() {
  const publicDir = path.join(cwd(), "public");
  const keyFile = fs
    .readdirSync(publicDir)
    .find((name) => /^[a-f0-9]{8,128}\.txt$/i.test(name));

  if (!keyFile) {
    console.error(
      "No IndexNow key file found in public/ (expected <key>.txt with a hex key).",
    );
    exit(1);
  }

  const key = fs.readFileSync(path.join(publicDir, keyFile), "utf8").trim();
  const expected = keyFile.replace(/\.txt$/i, "");

  if (key !== expected) {
    console.error(
      `IndexNow key mismatch: ${keyFile} must contain exactly "${expected}".`,
    );
    exit(1);
  }

  return { key, keyLocation: `${siteUrl}/${keyFile}` };
}

async function urlsFromSitemap() {
  const response = await fetch(`${siteUrl}/sitemap.xml`, {
    headers: { "user-agent": "IndieAppStack IndexNow submitter" },
  });
  if (!response.ok) {
    throw new Error(`Could not fetch sitemap: ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

async function main() {
  const { key, keyLocation } = resolveKey();

  const argUrls = argv.slice(2).filter((arg) => arg.startsWith("http"));
  const urlList = argUrls.length ? argUrls : await urlsFromSitemap();

  const onHost = urlList.filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });

  if (!onHost.length) {
    console.error(`No submittable ${host} URLs found.`);
    exit(1);
  }

  console.log(
    `Submitting ${onHost.length} URL(s) to IndexNow for ${host} (key ${keyLocation}).`,
  );

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ host, key, keyLocation, urlList: onHost }),
  });

  // IndexNow returns 200 (OK) or 202 (accepted, key validation pending) on
  // success. Anything else is an error worth surfacing.
  const body = await response.text();
  if (response.status === 200 || response.status === 202) {
    console.log(`IndexNow accepted the submission (HTTP ${response.status}).`);
  } else {
    console.error(`IndexNow rejected the submission (HTTP ${response.status}).`);
    if (body) {
      console.error(body.slice(0, 500));
    }
    exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  exit(1);
});
