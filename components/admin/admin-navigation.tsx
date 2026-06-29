"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  adminNavigationItems,
  type AdminNavigationItem,
} from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item }: { item: AdminNavigationItem }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center rounded-button border px-3 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        active
          ? "border-accent-soft bg-accent-soft text-ink"
          : "border-transparent text-accent-soft hover:border-accent-soft/40 hover:bg-paper/10 hover:text-paper",
      )}
      href={item.href}
    >
      {item.label}
    </Link>
  );
}

export function AdminNavigation() {
  const overviewItem: AdminNavigationItem = {
    description: "Admin workspace overview.",
    href: "/admin",
    label: "Overview",
  };

  return (
    <nav aria-label="Admin navigation" className="grid gap-2">
      <NavLink item={overviewItem} />
      {adminNavigationItems.map((item) => (
        <NavLink item={item} key={item.href} />
      ))}
    </nav>
  );
}
