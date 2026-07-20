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
    // gtag.js, injected by components/analytics/google-analytics.tsx. Absent
    // until GA4 is configured, so every call site guards with `?.`.
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetOrEventName: string,
      params?: Record<string, AnalyticsPropertyValue>,
    ) => void;
    dataLayer?: unknown[];
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
    // GA4 also auto-records pageviews via the `config` call and Enhanced
    // Measurement; this manual forward keeps parity for any explicit call.
    window.gtag?.("event", "page_view", url ? { page_location: url } : {});
  },

  track<EventName extends AnalyticsEventName>(
    eventName: EventName,
    properties: AnalyticsEventProperties[EventName],
  ) {
    if (typeof window === "undefined") {
      return;
    }

    const props = cleanProperties(properties);

    window.plausible?.(eventName, { props });
    // Event names are already snake_case, matching GA4's convention, and the
    // cleaned props (string | number | boolean) are valid GA4 event params.
    window.gtag?.("event", eventName, props);
  },
};
