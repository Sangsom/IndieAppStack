# Admin Authentication

Admin access uses Supabase Auth sessions plus an explicit `admin_users` role table.

## Create An Admin

1. Create a Supabase Auth user in the Supabase dashboard.
2. Grant that user the admin role:

```bash
npm run admin:grant -- admin@example.com
```

The helper uses `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` and only runs server-side.

## Route Protection

- `proxy.ts` matches `/admin/:path*`, refreshes Supabase SSR cookies, and redirects unauthenticated users to `/admin/login`. This is Next.js 16's renamed middleware convention.
- `app/(admin)/admin/(protected)/layout.tsx` calls `requireAdmin()` as a per-route server guard.
- `public.has_admin_role()` checks the authenticated user's role in Postgres.
- Non-admin authenticated users are signed out and redirected to the login page with a generic access error.

## Manual Checks

1. Visit `/admin` logged out. It should redirect to `/admin/login`.
2. Sign in as an admin. `/admin` should load.
3. Sign in as a non-admin user. Access should be denied.
4. Sign out. `/admin` should redirect to `/admin/login` again.
