import { cn } from "@/lib/utils";

export type ArticleTocItem = {
  href: string;
  label: string;
};

type ArticleTocProps = {
  className?: string;
  items: ArticleTocItem[];
  title?: string;
};

export function ArticleToc({
  className,
  items,
  title = "In this guide",
}: ArticleTocProps) {
  return (
    <nav
      aria-label={title}
      className={cn(
        "rounded-card border border-rule bg-surface p-4 shadow-field lg:sticky lg:top-24",
        className,
      )}
    >
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </p>
      <ol className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              className="block rounded-button px-2 py-1.5 text-sm font-semibold text-pine transition-colors hover:bg-accent-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
