"use client";

import type { FormHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";

type ToolFilterFormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "children" | "onChange"
> & {
  children: ReactNode;
};

export function ToolFilterForm({ children, ...props }: ToolFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onChange={(event) => {
        const target = event.target;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          formRef.current?.requestSubmit();
        }
      }}
      {...props}
    >
      {children}
    </form>
  );
}
