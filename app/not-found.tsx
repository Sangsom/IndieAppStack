import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-paper px-4 py-16 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col justify-center">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
          This stack path does not exist.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          The page may have moved, or the tool, category, or guide is not
          published yet. Head back to the field guide and keep choosing with
          context.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-5 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href="/"
          >
            Go home
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-button border border-rule px-5 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href="/tools"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
