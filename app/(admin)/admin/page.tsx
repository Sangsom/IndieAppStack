import { siteConfig } from "@/lib/site";

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col justify-center">
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-soft">
        Admin
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-accent-soft">
        The private workspace shell is in place for future editorial and
        affiliate operations.
      </p>
    </main>
  );
}
