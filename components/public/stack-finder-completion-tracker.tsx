"use client";

import { useEffect, useRef } from "react";

import { analytics } from "@/lib/analytics/client";

type StackFinderCompletionTrackerProps = {
  resultUrl: string;
  stackSlug: string;
  toolCount: number;
};

export function StackFinderCompletionTracker({
  resultUrl,
  stackSlug,
  toolCount,
}: StackFinderCompletionTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    analytics.track("stack_finder_completion", {
      result_url: resultUrl,
      stack_slug: stackSlug,
      tool_count: toolCount,
    });
  }, [resultUrl, stackSlug, toolCount]);

  return null;
}
