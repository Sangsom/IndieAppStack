import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
  tone?: "empty" | "error" | "loading";
};

const toneClasses: Record<NonNullable<AdminStateProps["tone"]>, string> = {
  empty: "border-rule bg-surface",
  error: "border-danger bg-surface",
  loading: "border-pine bg-accent-soft",
};

export function AdminState({
  action,
  className,
  description,
  title,
  tone = "empty",
}: AdminStateProps) {
  return (
    <section
      className={cn(
        "rounded-card border p-5 shadow-field",
        toneClasses[tone],
        className,
      )}
    >
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
        {tone}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-body-md text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
