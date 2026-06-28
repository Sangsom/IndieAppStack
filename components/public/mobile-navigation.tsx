"use client";

import { useState } from "react";
import Link from "next/link";

import { primaryNavigation } from "@/lib/public-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="inline-flex size-10 items-center justify-center rounded-button border border-rule bg-surface text-ink shadow-field transition-colors hover:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="grid gap-1" aria-hidden="true">
          <span className="block h-0.5 w-5 rounded-badge bg-ink" />
          <span className="block h-0.5 w-5 rounded-badge bg-ink" />
          <span className="block h-0.5 w-5 rounded-badge bg-ink" />
        </span>
      </button>

      <nav
        aria-label="Mobile primary"
        className={`${
          isOpen ? "grid" : "hidden"
        } absolute left-4 right-4 top-full z-20 mt-3 gap-1 rounded-card border border-rule bg-surface p-2 shadow-field`}
        id="mobile-navigation"
      >
        {primaryNavigation.map((item) => (
          <Link
            className="rounded-button px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-soft hover:text-pine"
            href={item.href}
            key={item.href}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
