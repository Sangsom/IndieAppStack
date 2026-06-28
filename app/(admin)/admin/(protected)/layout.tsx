import { logoutAdmin } from "./actions";
import { requireAdmin } from "@/lib/auth/admin";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await requireAdmin();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/25 pb-5">
        <div>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Admin
          </p>
          <p className="mt-1 text-sm text-accent-soft/80">{user.email}</p>
        </div>
        <form action={logoutAdmin}>
          <button
            className="inline-flex h-10 items-center justify-center rounded-button border border-accent-soft/40 px-4 text-sm font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>
      {children}
    </>
  );
}
