"use server";

import { redirect } from "next/navigation";

import {
  affiliateProgramStatusOptions,
  type AffiliateProgramStatus,
} from "@/lib/admin-affiliate-programs";
import { requireAdmin } from "@/lib/auth/admin";
import type { TablesInsert } from "@/lib/database.types";

type AffiliateProgramFormResult = {
  errors: string[];
  payload?: TablesInsert<"affiliate_programs">;
};

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function nullableText(formData: FormData, name: string) {
  const value = textValue(formData, name);
  return value.length ? value : null;
}

function parseUrl(value: string | null, label: string, errors: string[]) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${label} must use http or https.`);
      return null;
    }

    return url.toString();
  } catch {
    errors.push(`${label} must be a valid URL.`);
    return null;
  }
}

function parseEmail(value: string | null, errors: string[]) {
  if (!value) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push("Contact email must be valid.");
    return null;
  }

  return value.toLowerCase();
}

function parseStatus(value: string, errors: string[]): AffiliateProgramStatus {
  const allowed = affiliateProgramStatusOptions.map((option) => option.value);

  if (allowed.includes(value as AffiliateProgramStatus)) {
    return value as AffiliateProgramStatus;
  }

  errors.push("Choose a valid application status.");
  return "not_applied";
}

function parseAffiliateProgramForm(
  formData: FormData,
): AffiliateProgramFormResult {
  const errors: string[] = [];
  const name = textValue(formData, "name");
  const network = textValue(formData, "network");

  if (!name) {
    errors.push("Name is required.");
  }

  if (!network) {
    errors.push("Network is required.");
  }

  const payload = {
    allowed_promotion_notes: nullableText(formData, "allowed_promotion_notes"),
    application_url: parseUrl(
      nullableText(formData, "application_url"),
      "Application URL",
      errors,
    ),
    commission_notes: nullableText(formData, "commission_notes"),
    contact_email: parseEmail(nullableText(formData, "contact_email"), errors),
    cookie_notes: nullableText(formData, "cookie_notes"),
    dashboard_url: parseUrl(
      nullableText(formData, "dashboard_url"),
      "Dashboard URL",
      errors,
    ),
    internal_notes: nullableText(formData, "internal_notes"),
    name,
    network,
    status: parseStatus(textValue(formData, "status"), errors),
  } satisfies TablesInsert<"affiliate_programs">;

  return {
    errors,
    payload,
  };
}

function adminProgramsUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/affiliate-programs?${query.toString()}`;
}

function isDuplicateNameError(message: string) {
  return (
    message.includes("affiliate_programs_name_key") ||
    message.includes("duplicate key")
  );
}

function redirectForValidation(errors: string[]): never {
  if (errors.some((error) => error.includes("URL"))) {
    redirect(adminProgramsUrl({ error: "invalid_url" }));
  }

  if (errors.some((error) => error.includes("email"))) {
    redirect(adminProgramsUrl({ error: "invalid_email" }));
  }

  redirect(adminProgramsUrl({ error: "invalid_program" }));
}

export async function createAffiliateProgram(formData: FormData) {
  const { supabase } = await requireAdmin();
  const result = parseAffiliateProgramForm(formData);

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { error } = await supabase
    .from("affiliate_programs")
    .insert(result.payload);

  if (error) {
    redirect(
      adminProgramsUrl({
        error: isDuplicateNameError(error.message)
          ? "duplicate_name"
          : "create_failed",
      }),
    );
  }

  redirect(adminProgramsUrl({ status: "created" }));
}

export async function updateAffiliateProgram(formData: FormData) {
  const { supabase } = await requireAdmin();
  const programId = textValue(formData, "program_id");
  const result = parseAffiliateProgramForm(formData);

  if (!programId) {
    redirect(adminProgramsUrl({ error: "missing_program" }));
  }

  if (result.errors.length || !result.payload) {
    redirectForValidation(result.errors);
  }

  const { error } = await supabase
    .from("affiliate_programs")
    .update(result.payload)
    .eq("id", programId);

  if (error) {
    redirect(
      adminProgramsUrl({
        error: isDuplicateNameError(error.message)
          ? "duplicate_name"
          : "update_failed",
      }),
    );
  }

  redirect(adminProgramsUrl({ status: "updated" }));
}
