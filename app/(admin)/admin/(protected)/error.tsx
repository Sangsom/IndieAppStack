"use client";

import { AdminState } from "@/components/admin/admin-states";

type AdminErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <AdminState
      action={
        <button
          className="inline-flex h-10 items-center justify-center rounded-button border border-danger px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-surface"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      }
      description={error.message || "Something went wrong in the admin area."}
      title="Admin route failed"
      tone="error"
    />
  );
}
