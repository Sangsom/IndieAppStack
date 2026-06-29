import "server-only";

import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Tables } from "@/lib/database.types";

export type AffiliateProgramStatus = Enums<"affiliate_program_status">;

export type AdminAffiliateProgram = Tables<"affiliate_programs"> & {
  linkCount: number;
};

type AffiliateLinkRow = Pick<Tables<"affiliate_links">, "affiliate_program_id">;

export const affiliateProgramStatusOptions: Array<{
  label: string;
  value: AffiliateProgramStatus;
}> = [
  { label: "Not applied", value: "not_applied" },
  { label: "Applied", value: "applied" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Paused", value: "paused" },
];

export const affiliateNetworkOptions = [
  "direct",
  "PartnerStack",
  "Impact",
  "Rewardful",
  "FirstPromoter",
  "Tolt",
  "AppSumo",
  "ShareASale",
  "CJ Affiliate",
];

export function parseAffiliateProgramStatus(
  value: string | undefined,
): AffiliateProgramStatus | undefined {
  const allowed = affiliateProgramStatusOptions.map((option) => option.value);
  return allowed.includes(value as AffiliateProgramStatus)
    ? (value as AffiliateProgramStatus)
    : undefined;
}

export async function getAdminAffiliateProgramList(
  status?: AffiliateProgramStatus,
): Promise<AdminAffiliateProgram[]> {
  const { supabase } = await requireAdmin();

  let programsQuery = supabase
    .from("affiliate_programs")
    .select("*")
    .order("updated_at", { ascending: false });

  if (status) {
    programsQuery = programsQuery.eq("status", status);
  }

  const [programsResult, linksResult] = await Promise.all([
    programsQuery,
    supabase.from("affiliate_links").select("affiliate_program_id"),
  ]);

  const firstError = [programsResult.error, linksResult.error].find(Boolean);

  if (firstError) {
    throw new Error(
      `Admin affiliate programs query failed: ${firstError.message}`,
    );
  }

  const linkCountByProgramId = new Map<string, number>();

  ((linksResult.data ?? []) as AffiliateLinkRow[]).forEach((row) => {
    if (!row.affiliate_program_id) {
      return;
    }

    linkCountByProgramId.set(
      row.affiliate_program_id,
      (linkCountByProgramId.get(row.affiliate_program_id) ?? 0) + 1,
    );
  });

  return ((programsResult.data ?? []) as Tables<"affiliate_programs">[]).map(
    (program) => ({
      ...program,
      linkCount: linkCountByProgramId.get(program.id) ?? 0,
    }),
  );
}

export async function getAdminAffiliateProgramEditor(
  programId: string,
): Promise<AdminAffiliateProgram | null> {
  const { supabase } = await requireAdmin();

  const { data: program, error: programError } = await supabase
    .from("affiliate_programs")
    .select("*")
    .eq("id", programId)
    .maybeSingle();

  if (programError) {
    throw new Error(
      `Admin affiliate program query failed: ${programError.message}`,
    );
  }

  if (!program) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("affiliate_links")
    .select("affiliate_program_id")
    .eq("affiliate_program_id", program.id);

  if (linksError) {
    throw new Error(
      `Admin affiliate program links query failed: ${linksError.message}`,
    );
  }

  return {
    ...(program as Tables<"affiliate_programs">),
    linkCount: links?.length ?? 0,
  };
}
