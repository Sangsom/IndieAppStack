export type AdminNavigationItem = {
  description: string;
  href: string;
  label: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    description: "Tool records, positioning, and publishing status.",
    href: "/admin/tools",
    label: "Tools",
  },
  {
    description: "Guides, comparisons, reviews, and article workflow.",
    href: "/admin/articles",
    label: "Articles",
  },
  {
    description: "Public category pages and category metadata.",
    href: "/admin/categories",
    label: "Categories",
  },
  {
    description: "Partner programs, commission terms, and program status.",
    href: "/admin/affiliate-programs",
    label: "Affiliate programs",
  },
  {
    description: "Outbound affiliate and official destination links.",
    href: "/admin/links",
    label: "Links",
  },
  {
    description: "Click tracking, recent activity, and conversion signals.",
    href: "/admin/clicks",
    label: "Clicks",
  },
  {
    description: "SEO topic clusters and planned content coverage.",
    href: "/admin/topics",
    label: "Topics",
  },
  {
    description: "Admin defaults, integrations, and workspace settings.",
    href: "/admin/settings",
    label: "Settings",
  },
];
