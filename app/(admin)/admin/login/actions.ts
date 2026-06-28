"use server";

import { redirect } from "next/navigation";

import { getAdminLoginUrl } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSafeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/admin";
  }

  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) {
    return "/admin";
  }

  return value;
}

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = getSafeNextPath(formData.get("next"));

  if (typeof email !== "string" || typeof password !== "string") {
    redirect(getAdminLoginUrl(nextPath, "missing_credentials"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(getAdminLoginUrl(nextPath, "invalid_credentials"));
  }

  const { data: isAdmin, error: roleError } =
    await supabase.rpc("has_admin_role");

  if (roleError || !isAdmin) {
    await supabase.auth.signOut();
    redirect(getAdminLoginUrl("/admin", "access_denied"));
  }

  redirect(nextPath);
}
