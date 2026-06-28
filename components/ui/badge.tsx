import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "category" | "platform" | "pricing";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  category: "border-pine bg-accent-soft text-pine",
  platform: "border-rule bg-surface text-ink",
  pricing: "border-gold bg-surface text-gold",
};

export function Badge({
  className,
  variant = "category",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-badge border px-2 py-1 font-mono text-label-sm font-semibold uppercase",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
