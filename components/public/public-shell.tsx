import type { ReactNode } from "react";
import Link from "next/link";

import { MobileNavigation } from "@/components/public/mobile-navigation";
import { affiliateDisclosureCopy } from "@/lib/compliance";
import { footerNavigation, primaryNavigation } from "@/lib/public-navigation";
import { siteConfig } from "@/lib/site";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:border focus:border-pine focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-pine focus:shadow-field"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            className="font-serif text-xl font-semibold text-ink transition-colors hover:text-pine"
            href="/"
          >
            {siteConfig.name}
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {primaryNavigation.map((item) => (
              <Link
                className="rounded-button px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-accent-soft hover:text-pine"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileNavigation />
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="border-t border-rule bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="font-serif text-xl font-semibold text-ink">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-xl text-body-md text-muted">
              A practical field guide for choosing the tools, systems, and
              workflows behind durable indie mobile apps.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
              {affiliateDisclosureCopy}
            </p>
          </div>

          <nav aria-label="Footer" className="grid content-start gap-3">
            {footerNavigation.map((item) => (
              <Link
                className="text-sm font-semibold text-pine transition-colors hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
