# Verify the site in Google Search Console + Bing and submit the sitemap

Checklist for the "Verify site in GSC + Bing and submit the sitemap" task.
Verification is a manual console action (proving ownership can't be automated),
but the codebase supports the meta-tag method via env vars, and `robots.txt`
already advertises the sitemap.

- Canonical host: `https://indieappstack.com`
- Sitemap: `https://indieappstack.com/sitemap.xml` (already listed in
  `https://indieappstack.com/robots.txt`)

## 1. Google Search Console

Open [Google Search Console](https://search.google.com/search-console/welcome).

### Recommended: Domain property (DNS) — no code, no redeploy

A domain property covers apex + `www` + `http`/`https` in one property, which
matches our www→apex redirect setup.

1. Choose **Add property → Domain**, enter `indieappstack.com`.
2. Google shows a `TXT` record (`google-site-verification=...`).
3. Add that `TXT` record at the DNS provider for `indieappstack.com` (Vercel
   Domains, or wherever the nameservers point).
4. Back in GSC, click **Verify** (DNS can take a few minutes to propagate).

### Alternative: URL-prefix property (HTML meta tag) — code path

Use this if DNS isn't accessible.

1. Choose **Add property → URL prefix**, enter `https://indieappstack.com`.
2. Pick the **HTML tag** method and copy the token (the `content` value of the
   `google-site-verification` meta tag).
3. Set it in the deployment environment and redeploy:
   `GOOGLE_SITE_VERIFICATION=<token>` (Vercel → Project → Settings → Environment
   Variables → Production). The root layout emits the meta tag from this env var
   (see `app/layout.tsx`).
4. After the deploy is live, click **Verify**.

### Submit the sitemap (GSC)

1. In the verified property, open **Sitemaps** (left nav).
2. Enter `sitemap.xml` and **Submit**.
3. Confirm status becomes **Success** and the discovered-URL count matches the
   published page count.

## 2. Bing Webmaster Tools

Open [Bing Webmaster Tools](https://www.bing.com/webmasters).

### Recommended: Import from GSC — one click, no code

1. **Add site → Import from Google Search Console**, authorize, pick
   `indieappstack.com`. Bing imports ownership and the sitemap automatically.

### Alternative: HTML meta tag — code path

1. **Add site manually**, enter `https://indieappstack.com`, choose the
   **Meta tag** option, copy the `msvalidate.01` token.
2. Set `BING_SITE_VERIFICATION=<token>` in the deployment env and redeploy
   (also wired in `app/layout.tsx`).
3. Click **Verify**.

### Submit the sitemap (Bing, if not imported)

1. Open **Sitemaps**, enter `https://indieappstack.com/sitemap.xml`, **Submit**.

### IndexNow — automated URL submission (Bing, Yandex, and others)

Unlike Google, Bing and Yandex accept programmatic crawl requests via
[IndexNow](https://www.indexnow.org/). This repo implements it:

- The verification key is a public file at `public/<key>.txt`, served at
  `https://indieappstack.com/<key>.txt`. It is not a secret — IndexNow keys are
  meant to be public.
- `npm run seo:indexnow` submits every URL in the live sitemap (which already
  excludes `noindex` tools). Pass URLs to submit only those, e.g.
  `node scripts/indexnow-submit.mjs https://indieappstack.com/tools/revenuecat`.
- Run it after a content deploy. The key file must already be live so the engines
  can verify ownership. Google does not participate in IndexNow, so Google still
  needs the manual Search Console step in `seo-indexing-request.md`.

**Automated on deploy.** `.github/workflows/indexnow.yml` runs the submission
automatically whenever Vercel reports a successful **Production** deployment
(`deployment_status`), so Bing/Yandex are pinged on every publish with no manual
step. It targets the canonical production URL and needs no secrets. You can also
run it on demand from the **Actions** tab (**Run workflow**) to verify it.

## 3. Success metric to watch

- **GSC → Pages**: indexed URL count climbs toward full coverage of the sitemap.
- **GSC → Performance**: organic impressions and query-level CTR become visible.
- **Bing → Site Explorer / Search Performance**: crawled + indexed counts rise.

## Notes

- Verification tokens are not secrets, but env vars keep them out of the repo and
  let prod differ from local. Leave the env vars empty if you verify via DNS.
- Both meta tags render server-side into the static `<head>`, so a redeploy is
  required for the token to appear — env changes alone won't update live HTML.
