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
- `npm run build`

## Structure

- `app/(public)/` public site routes
- `app/(admin)/` admin routes
- `components/` shared UI
- `lib/` shared TypeScript helpers
- `content/` editorial content
- `supabase/` database and edge function assets

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
