import { logoutAdmin } from "./actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { siteConfig } from "@/lib/site";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await requireAdmin();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-rule bg-ink text-paper lg:border-b-0 lg:border-r lg:border-ink">
        <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:min-h-dvh">
          <div>
            <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-soft">
              Admin
            </p>
            <p className="mt-2 font-serif text-2xl font-semibold">
              {siteConfig.name}
            </p>
            <p className="mt-1 break-words text-sm text-accent-soft/80">
              {user.email}
            </p>
          </div>

          <AdminNavigation />

          <form action={logoutAdmin} className="mt-auto">
            <button
              className="inline-flex h-10 w-full items-center justify-center rounded-button border border-accent-soft/40 px-4 text-sm font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
