"use client";

import type { AnchorHTMLAttributes } from "react";

import { analytics } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

type AffiliateCtaKind = "affiliate" | "official";

type AffiliateCtaProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "rel"
> & {
  analyticsLocation?: string;
  toolSlug?: string;
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
  analyticsLocation = "public_cta",
  className,
  href,
  kind,
  label,
  target,
  toolSlug = "unknown",
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
      onClick={(event) => {
        props.onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (isAffiliate) {
          analytics.track("affiliate_link_clicked", {
            location: analyticsLocation,
            tool_slug: toolSlug,
          });
        } else {
          analytics.track("outbound_link_clicked", {
            href,
            location: analyticsLocation,
          });
        }
      }}
    >
      {label}
    </a>
  );
}
