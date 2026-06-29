import "server-only";

import { requireAdmin } from "@/lib/auth/admin";

export type ClickAnalyticsRange = "7" | "30" | "90";

export type ClickAnalyticsGroupType =
  "overview" | "placement" | "source_page" | "tool";

export type ClickAnalyticsRow = {
  clickCount: number;
  groupKey: string;
  groupType: ClickAnalyticsGroupType;
  label: string;
  lastClickedAt: string | null;
};

export type ClickAnalyticsData = {
  byPlacement: ClickAnalyticsRow[];
  bySourcePage: ClickAnalyticsRow[];
  byTool: ClickAnalyticsRow[];
  range: ClickAnalyticsRange;
  startAt: string;
  totalClicks: number;
};

export const clickAnalyticsRangeOptions: Array<{
  label: string;
  value: ClickAnalyticsRange;
}> = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

export function parseClickAnalyticsRange(
  value: string | undefined,
): ClickAnalyticsRange {
  return clickAnalyticsRangeOptions.some((option) => option.value === value)
    ? (value as ClickAnalyticsRange)
    : "30";
}

function startAtForRange(range: ClickAnalyticsRange) {
  const startAt = new Date();
  startAt.setUTCDate(startAt.getUTCDate() - Number(range));
  return startAt.toISOString();
}

function isClickAnalyticsGroupType(
  value: string,
): value is ClickAnalyticsGroupType {
  return ["overview", "placement", "source_page", "tool"].includes(value);
}

export async function getAdminClickAnalytics(
  range: ClickAnalyticsRange,
): Promise<ClickAnalyticsData> {
  const { supabase } = await requireAdmin();
  const startAt = startAtForRange(range);
  const { data, error } = await supabase.rpc("admin_click_analytics", {
    p_start_at: startAt,
  });

  if (error) {
    throw new Error(`Admin click analytics query failed: ${error.message}`);
  }

  const rows = (data ?? [])
    .filter((row) => isClickAnalyticsGroupType(row.group_type))
    .map((row) => ({
      clickCount: Number(row.click_count),
      groupKey: row.group_key,
      groupType: row.group_type as ClickAnalyticsGroupType,
      label: row.label,
      lastClickedAt: row.last_clicked_at,
    }));

  return {
    byPlacement: rows.filter((row) => row.groupType === "placement"),
    bySourcePage: rows.filter((row) => row.groupType === "source_page"),
    byTool: rows.filter((row) => row.groupType === "tool"),
    range,
    startAt,
    totalClicks:
      rows.find((row) => row.groupType === "overview")?.clickCount ?? 0,
  };
}
