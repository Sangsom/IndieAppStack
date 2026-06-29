import type { FormHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminFormProps = FormHTMLAttributes<HTMLFormElement> & {
  actions?: ReactNode;
  description?: string;
  title: string;
};

type AdminFieldProps = {
  children: ReactNode;
  description?: string;
  label: string;
};

export function AdminForm({
  actions,
  children,
  className,
  description,
  title,
  ...props
}: AdminFormProps) {
  return (
    <form
      className={cn(
        "rounded-card border border-rule bg-surface p-5 shadow-field",
        className,
      )}
      {...props}
    >
      <div className="border-b border-rule pb-4">
        <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-5 grid gap-5">{children}</div>
      {actions ? (
        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
          {actions}
        </div>
      ) : null}
    </form>
  );
}

export function AdminField({ children, description, label }: AdminFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      <span>{label}</span>
      {children}
      {description ? (
        <span className="text-sm font-normal leading-6 text-muted">
          {description}
        </span>
      ) : null}
    </label>
  );
}
