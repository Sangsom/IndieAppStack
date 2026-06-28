import { getSupabaseHealthcheck } from "@/lib/supabase/healthcheck";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabaseHealthcheck = await getSupabaseHealthcheck();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-pine">
        Field Guide
      </p>
      <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
        {siteConfig.name}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
        {siteConfig.description}
      </p>
      <div className="mt-10 inline-flex w-fit items-center gap-3 rounded-card border border-rule bg-surface px-4 py-3 text-sm font-medium text-pine shadow-field">
        <span className="size-2 rounded-full bg-pine" />
        Foundation ready
      </div>
      <div className="mt-4 inline-flex w-fit items-center gap-3 rounded-card border border-rule bg-surface px-4 py-3 text-sm font-medium text-muted shadow-field">
        <span
          className={`size-2 rounded-full ${
            supabaseHealthcheck.status === "ok" ? "bg-pine" : "bg-rule"
          }`}
        />
        {supabaseHealthcheck.message}
      </div>
    </main>
  );
}
