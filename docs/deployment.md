# Deployment Runbook

IndieAppStack deploys to Vercel from GitHub.

## Vercel Project

Repository: `Sangsom/IndieAppStack`

Current Vercel project: `rinalds-domanovs-projects/indie-app-stack`

Git repository: connected to `Sangsom/IndieAppStack`

Expected Vercel settings:

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Development command: `npm run dev`
- Production branch: `main`
- Preview deployments: enabled for pull requests and non-production branches

Vercel's Git integration creates preview deployments for PR branches and production deployments from the configured production branch.

Preview deployments are currently protected by Vercel SSO (`all_except_custom_domains`). Keep this for private review links, or disable SSO protection if anonymous preview sharing is required.

Local `.env` files are excluded from deployment uploads by `.vercelignore`; use Vercel Project Settings as the source of deployed environment variables.

## Environment Variables

Configure these in Vercel Project Settings for Production and Preview. Do not commit real values.

| Variable                        | Production                  | Preview                          | Notes                                                      |
| ------------------------------- | --------------------------- | -------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://indieappstack.com` | Vercel preview URL or branch URL | Used for metadata and canonical links.                     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL        | Supabase project URL             | Public anon client URL.                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key           | Supabase anon key                | Public browser key.                                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key            | Service role key                 | Server-only. Never expose to client code.                  |
| `SUPABASE_PROJECT_ID`           | Supabase project ref        | Supabase project ref             | Used by maintenance scripts.                               |
| `AI_DRAFT_WEBHOOK_SECRET`       | Random server secret        | Random server secret             | Authenticates `/api/ai/drafts`. Server-only.               |
| `ANTHROPIC_API_KEY`             | Anthropic API key           | Anthropic API key                | Server-only key for AI brief/draft flow.                   |
| `ANTHROPIC_MODEL`               | Current Claude model ID     | Current Claude model ID          | Keep current with Anthropic model docs.                    |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX`              | Optional (own property)          | GA4 analytics. Inlined at build — redeploy after changing. |

## Database migrations

SQL files in `supabase/migrations/` are applied to the hosted Supabase project by hand. GitHub Actions does not run them, and `npm run seed:prod` only upserts content.

After a migration lands on `main`, apply it with `supabase db push` or the Supabase SQL editor before relying on it. `20261022050000_updated_at_only_on_change.sql` keeps `updated_at` still unless a column other than `updated_at` changed. The seed also skips unchanged rows, so a reseed keeps sitemap `lastmod` even if that function has not been replaced yet. Apply the function so admin saves and one-off upserts follow the same rule.

## CI

GitHub Actions runs on pushes to `main` and pull requests:

- `npm ci`
- `npm run format`
- `npm run lint`
- `npm run typecheck`
- `npm run design:contrast`
- `npm run build`
- `npm run security:check-supabase-key`

This keeps PRs aligned with the same checks expected before Vercel deployment.

## Google Search Console

Reserve a Domain property for `indieappstack.com`. Complete DNS TXT verification after the domain is live and DNS is under the final provider.

Record the TXT token here once created:

```text
google-site-verification=
```

## Custom Domain Cut-Over

Target domain: `indieappstack.com`

1. Add `indieappstack.com` and `www.indieappstack.com` to the Vercel project domains.
2. Keep the Vercel-generated deployment URL as a fallback during setup.
3. In DNS, point the apex domain to Vercel's apex record and `www` to Vercel's CNAME target shown in the Vercel dashboard.
4. Wait for Vercel domain verification and certificate issuance.
5. Set `NEXT_PUBLIC_SITE_URL=https://indieappstack.com` in Production.
6. Verify homepage, Supabase healthcheck, GA4 page views (Realtime), and Search Console ownership.
7. Set the preferred domain redirect in Vercel once both apex and `www` resolve.

## Launch Verification

Run the launch gate before go-live and after production deployment:

```bash
npm run launch:verify
LAUNCH_VERIFY_URL=https://indieappstack.com npm run launch:verify
```

Keep the detailed checklist in `docs/launch-checklist.md`.
