"use client";

import { useState } from "react";

type CopyAffiliateLinkButtonProps = {
  value: string;
};

export function CopyAffiliateLinkButton({
  value,
}: CopyAffiliateLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-button border border-rule px-3 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft"
      onClick={copyValue}
      type="button"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
