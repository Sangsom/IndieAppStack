import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CategoryCardProps = {
  className?: string;
  description: string;
  href: string;
  name: string;
  stat?: string;
  toolsLabel?: string;
  children?: ReactNode;
};

export function CategoryCard({
  children,
  className,
  description,
  href,
  name,
  stat,
  toolsLabel = "Explore category",
}: CategoryCardProps) {
  return (
    <article
      className={cn(
        "rounded-card border border-rule bg-surface p-5 shadow-field",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-2xl font-semibold text-ink">{name}</h3>
        {stat ? (
          <p className="rounded-badge border border-rule px-2 py-1 font-mono text-label-sm font-semibold uppercase text-muted">
            {stat}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-body-md text-muted">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <a
        className="mt-5 inline-flex rounded-button text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        href={href}
      >
        {toolsLabel}
      </a>
    </article>
  );
}
