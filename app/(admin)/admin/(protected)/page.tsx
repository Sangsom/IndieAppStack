import { siteConfig } from "@/lib/site";

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col justify-center py-12">
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-soft">
        Private workspace
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-accent-soft">
        The admin shell is protected by Supabase Auth, middleware redirects, and
        an explicit admin role check.
      </p>
    </main>
  );
}
