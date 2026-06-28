import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const adminLoginPath = "/admin/login";

export function getAdminLoginUrl(nextPath = "/admin", error?: string) {
  const params = new URLSearchParams();

  if (nextPath.startsWith("/admin") && nextPath !== adminLoginPath) {
    params.set("next", nextPath);
  }

  if (error) {
    params.set("error", error);
  }

  const query = params.toString();
  return query ? `${adminLoginPath}?${query}` : adminLoginPath;
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getAdminLoginUrl());
  }

  const { data: isAdmin, error } = await supabase.rpc("has_admin_role");

  if (error || !isAdmin) {
    redirect(getAdminLoginUrl("/admin", "access_denied"));
  }

  return {
    supabase,
    user,
  };
}
