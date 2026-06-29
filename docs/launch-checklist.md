# MVP Launch Checklist

Run this gate before production cut-over and after each launch-critical deployment.

```bash
npm run format
npm run lint
npm run typecheck
npm run design:contrast
npm run build
npm run security:check-supabase-key
npm run launch:verify
```

For production URL probes:

```bash
LAUNCH_VERIFY_URL=https://indieappstack.com npm run launch:verify
```

## Content Gate

Automated by `npm run launch:verify`:

- 25+ published tools.
- 5+ published categories.
- 8+ published guide/comparison pages.
- 4+ published comparison pages.
- Active affiliate link records.
- No published AI-assisted draft without `human_reviewed = true`.

## Product Gate

Automated by source/build checks:

- Home page and tool directory routes exist.
- Tool detail, guide detail, comparison detail, category detail routes exist.
- Stack Finder quiz and results routes exist.
- Newsletter capture route exists.
- `/go/[slug]` redirect handler exists.
- Admin tool/article/category/affiliate-link management routes exist.
- Sitemap and robots routes exist.
- Analytics component exists.
- Affiliate disclosure and privacy policy pages exist.

## Manual Production Gate

Confirm these in production:

- Domain opens at `https://indieappstack.com` and redirects consistently between apex and `www`.
- Vercel shows valid configuration and SSL certificate for apex and `www`.
- Google Search Console domain property is verified.
- Submit `https://indieappstack.com/sitemap.xml` in Google Search Console.
- Plausible page view appears for a production page visit.
- Newsletter capture creates a subscriber row and returns to the source page.
- `/go/[slug]` redirects to the destination and writes a click event.
- Mobile walkthrough passes for browse -> tool -> `/go`, comparison -> CTA, and quiz -> results -> email.
- Lighthouse mobile pass for home, a tool page, a comparison page, and a guide page.
