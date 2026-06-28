"use client";

import { useEffect, useState } from "react";

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
  const [activeHref, setActiveHref] = useState(items[0]?.href);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (!headings.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .at(0);

        if (visibleEntry?.target.id) {
          setActiveHref(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

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
              aria-current={activeHref === item.href ? "location" : undefined}
              className={cn(
                "block rounded-button px-2 py-1.5 text-sm font-semibold text-pine transition-colors hover:bg-accent-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                activeHref === item.href && "bg-accent-soft text-ink",
              )}
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
