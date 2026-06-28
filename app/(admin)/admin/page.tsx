import { siteConfig } from "@/lib/site";

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col justify-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">
        Admin
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-stone-300">
        The private workspace shell is in place for future editorial and
        affiliate operations.
      </p>
    </main>
  );
}
