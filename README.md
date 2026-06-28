# IndieAppStack

Content and affiliate site for solo mobile developers.

## Local Setup

1. Use Node from `.nvmrc`: `nvm use`
2. Install dependencies: `npm install`
3. Copy environment defaults: `cp .env.example .env.local`
4. Start the app: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Checks

- `npm run lint`
- `npm run format`
- `npm run typecheck`
- `npm run design:contrast`
- `npm run build`
- `npm run security:check-supabase-key`

## Structure

- `app/(public)/` public site routes
- `app/(admin)/` admin routes
- `components/` shared UI
- `lib/` shared TypeScript helpers
- `content/` editorial content
- `supabase/` database and edge function assets

## Supabase

Add these values to `.env.local` after creating the Supabase project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`

Useful commands:

- `npm run supabase:types` regenerates hosted database types.
- `npm run supabase:types:local` regenerates local database types.
- `npm run security:check-supabase-key` verifies the service-role key is absent from client bundles.

## Deployment and Analytics

- [Deployment runbook](docs/deployment.md)
- [Analytics baseline](docs/analytics.md)
