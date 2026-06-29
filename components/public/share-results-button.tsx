"use client";

import { useState } from "react";

type ShareResultsButtonProps = {
  path: string;
};

export function ShareResultsButton({ path }: ShareResultsButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    const url = new URL(path, window.location.origin).toString();

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 2200);
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      onClick={copyUrl}
      type="button"
    >
      {copied ? "Copied" : "Copy results URL"}
    </button>
  );
}
