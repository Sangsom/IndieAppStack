"use client";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
  AnalyticsPropertyValue,
} from "@/lib/analytics/events";

type PlausibleOptions = {
  callback?: (result?: { error?: unknown; status?: number }) => void;
  interactive?: boolean;
  props?: Record<string, AnalyticsPropertyValue>;
  url?: string;
};

declare global {
  interface Window {
    plausible?: (
      eventName: AnalyticsEventName | "pageview",
      options?: PlausibleOptions,
    ) => void;
  }
}

function cleanProperties(
  properties: Record<string, AnalyticsPropertyValue | null | undefined>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(
      (entry): entry is [string, AnalyticsPropertyValue] =>
        entry[1] !== null && entry[1] !== undefined,
    ),
  );
}

export const analytics = {
  pageview(url?: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.plausible?.("pageview", url ? { url } : undefined);
  },

  track<EventName extends AnalyticsEventName>(
    eventName: EventName,
    properties: AnalyticsEventProperties[EventName],
  ) {
    if (typeof window === "undefined") {
      return;
    }

    window.plausible?.(eventName, {
      props: cleanProperties(properties),
    });
  },
};
