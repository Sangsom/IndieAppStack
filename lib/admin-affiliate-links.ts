import "server-only";

import { getAffiliateRedirectPath } from "@/lib/affiliate-links";
import { requireAdmin } from "@/lib/auth/admin";
import type { Enums, Tables } from "@/lib/database.types";

export type AffiliateLinkStatus = Enums<"affiliate_link_status">;
export type AffiliateLinkFilter = AffiliateLinkStatus | "attention";

type ToolOptionRow = Pick<Tables<"tools">, "id" | "name" | "slug">;
type ProgramOptionRow = Pick<
  Tables<"affiliate_programs">,
  "id" | "name" | "network" | "status"
>;

export type AdminAffiliateLink = Tables<"affiliate_links"> & {
  programName: string | null;
  redirectPath: string;
  needsAttention: boolean;
  toolName: string | null;
};

export type AdminAffiliateLinkOptions = {
  programs: ProgramOptionRow[];
  tools: ToolOptionRow[];
};

export const affiliateLinkStatusOptions: Array<{
  label: string;
  value: AffiliateLinkStatus;
}> = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Broken", value: "broken" },
];

export function parseAffiliateLinkFilter(
  value: string | undefined,
): AffiliateLinkFilter | undefined {
  if (value === "attention") {
    return value;
  }

  const allowed = affiliateLinkStatusOptions.map((option) => option.value);
  return allowed.includes(value as AffiliateLinkStatus)
    ? (value as AffiliateLinkStatus)
    : undefined;
}

function mapLink(
  link: Tables<"affiliate_links">,
  toolById: Map<string, ToolOptionRow>,
  programById: Map<string, ProgramOptionRow>,
): AdminAffiliateLink {
  const tool = link.tool_id ? toolById.get(link.tool_id) : undefined;
  const program = link.affiliate_program_id
    ? programById.get(link.affiliate_program_id)
    : undefined;

  return {
    ...link,
    needsAttention:
      link.status === "broken" ||
      link.status === "inactive" ||
      !tool ||
      !program,
    programName: program?.name ?? null,
    redirectPath: getAffiliateRedirectPath(link.slug),
    toolName: tool?.name ?? null,
  };
}

export async function getAdminAffiliateLinkOptions(): Promise<AdminAffiliateLinkOptions> {
  const { supabase } = await requireAdmin();

  const [toolsResult, programsResult] = await Promise.all([
    supabase
      .from("tools")
      .select("id,name,slug")
      .neq("status", "archived")
      .order("name", { ascending: true }),
    supabase
      .from("affiliate_programs")
      .select("id,name,network,status")
      .order("name", { ascending: true }),
  ]);

  const firstError = [toolsResult.error, programsResult.error].find(Boolean);

  if (firstError) {
    throw new Error(
      `Admin affiliate link options query failed: ${firstError.message}`,
    );
  }

  return {
    programs: (programsResult.data ?? []) as ProgramOptionRow[],
    tools: (toolsResult.data ?? []) as ToolOptionRow[],
  };
}

export async function getAdminAffiliateLinkList(
  filter?: AffiliateLinkFilter,
): Promise<AdminAffiliateLink[]> {
  const { supabase } = await requireAdmin();

  let linksQuery = supabase
    .from("affiliate_links")
    .select("*")
    .order("updated_at", { ascending: false });

  if (filter && filter !== "attention") {
    linksQuery = linksQuery.eq("status", filter);
  }

  const [linksResult, options] = await Promise.all([
    linksQuery,
    getAdminAffiliateLinkOptions(),
  ]);

  if (linksResult.error) {
    throw new Error(
      `Admin affiliate links query failed: ${linksResult.error.message}`,
    );
  }

  const toolById = new Map(options.tools.map((tool) => [tool.id, tool]));
  const programById = new Map(
    options.programs.map((program) => [program.id, program]),
  );

  const links = ((linksResult.data ?? []) as Tables<"affiliate_links">[]).map(
    (link) => mapLink(link, toolById, programById),
  );

  return filter === "attention"
    ? links.filter((link) => link.needsAttention)
    : links;
}

export async function getAdminAffiliateLinkEditor(
  linkId: string,
): Promise<AdminAffiliateLink | null> {
  const { supabase } = await requireAdmin();

  const [linkResult, options] = await Promise.all([
    supabase.from("affiliate_links").select("*").eq("id", linkId).maybeSingle(),
    getAdminAffiliateLinkOptions(),
  ]);

  if (linkResult.error) {
    throw new Error(
      `Admin affiliate link query failed: ${linkResult.error.message}`,
    );
  }

  if (!linkResult.data) {
    return null;
  }

  const toolById = new Map(options.tools.map((tool) => [tool.id, tool]));
  const programById = new Map(
    options.programs.map((program) => [program.id, program]),
  );

  return mapLink(
    linkResult.data as Tables<"affiliate_links">,
    toolById,
    programById,
  );
}
