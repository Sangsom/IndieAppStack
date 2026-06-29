import type { ReactNode } from "react";

type AdminPageShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function AdminPageShell({
  actions,
  children,
  description,
  eyebrow = "Admin",
  title,
}: AdminPageShellProps) {
  return (
    <main className="grid gap-6">
      <header className="flex flex-col gap-4 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-ink">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-body-md text-muted">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}
