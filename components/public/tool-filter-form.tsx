"use client";

import type { FormHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";

import { analytics } from "@/lib/analytics/client";

type ToolFilterFormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "children" | "onChange"
> & {
  children: ReactNode;
  resultCount?: number;
  searchLocation?: string;
};

export function ToolFilterForm({
  children,
  resultCount,
  searchLocation = "tools_filter",
  ...props
}: ToolFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function trackFilterUse() {
    analytics.track("search_submitted", {
      result_count: resultCount,
      search_location: searchLocation,
    });
  }

  return (
    <form
      ref={formRef}
      onChange={(event) => {
        const target = event.target;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          formRef.current?.requestSubmit();
        }
      }}
      onSubmit={() => {
        trackFilterUse();
      }}
      {...props}
    >
      {children}
    </form>
  );
}
