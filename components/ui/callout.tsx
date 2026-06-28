import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "disclosure";

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  variant?: CalloutVariant;
  children: ReactNode;
};

const variants: Record<CalloutVariant, string> = {
  info: "border-pine bg-accent-soft text-ink",
  disclosure: "border-gold bg-surface text-ink",
};

export function Callout({
  children,
  className,
  title,
  variant = "info",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-card border p-4 shadow-field",
        variants[variant],
        className,
      )}
      {...props}
    >
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em]">
        {title}
      </p>
      <div className="mt-2 text-body-md text-muted">{children}</div>
    </div>
  );
}
