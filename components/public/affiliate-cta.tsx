import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AffiliateCtaKind = "affiliate" | "official";

type AffiliateCtaProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "rel"
> & {
  href: string;
  kind: AffiliateCtaKind;
  label: string;
};

const variants: Record<AffiliateCtaKind, string> = {
  affiliate:
    "border-pine bg-pine text-surface shadow-field hover:border-ink hover:bg-ink",
  official:
    "border-rule bg-surface text-pine shadow-field hover:border-pine hover:bg-accent-soft",
};

export function AffiliateCta({
  className,
  href,
  kind,
  label,
  target,
  ...props
}: AffiliateCtaProps) {
  const isAffiliate = kind === "affiliate";

  return (
    <a
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-button border px-4 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        variants[kind],
        className,
      )}
      href={href}
      rel={isAffiliate ? "sponsored nofollow" : undefined}
      target={target}
      {...props}
    >
      {label}
    </a>
  );
}
