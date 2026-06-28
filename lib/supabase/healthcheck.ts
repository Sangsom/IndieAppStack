import "server-only";

import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerConfig,
} from "./server";

type SupabaseHealthcheck =
  | {
      status: "ok";
      message: string;
      value: number;
    }
  | {
      status: "missing-env" | "error";
      message: string;
    };

export async function getSupabaseHealthcheck(): Promise<SupabaseHealthcheck> {
  if (!hasSupabaseServerConfig()) {
    return {
      status: "missing-env",
      message: "Supabase env pending",
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.rpc("healthcheck");

  if (error) {
    return {
      status: "error",
      message: `Supabase read failed: ${error.message}`,
    };
  }

  return {
    status: "ok",
    message: `Supabase read ok: ${data}`,
    value: data,
  };
}
