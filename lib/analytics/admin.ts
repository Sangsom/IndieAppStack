import "server-only";

import type { AnalyticsPropertyValue } from "@/lib/analytics/events";

export type AdminAnalyticsEventName = "tool_created" | "tool_updated";

export async function emitAdminAnalyticsEvent(
  eventName: AdminAnalyticsEventName,
  properties: Record<string, AnalyticsPropertyValue>,
) {
  // Server-side analytics can be wired to a provider later. Keeping this
  // explicit makes admin mutations observable without exposing secrets.
  console.info("[admin_analytics]", eventName, properties);
}
