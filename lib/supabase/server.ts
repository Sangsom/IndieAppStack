import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

type SupabasePublicEnvName =
  "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

type SupabaseServerEnvName =
  SupabasePublicEnvName | "SUPABASE_SERVICE_ROLE_KEY";

function getEnv(name: SupabaseServerEnvName) {
  return process.env[name];
}

function requireEnv(name: SupabaseServerEnvName) {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`Missing required Supabase env var: ${name}`);
  }

  return value;
}

export function hasSupabaseServerConfig() {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server components cannot always write cookies. Middleware can refresh sessions.
          }
        },
      },
    },
  );
}

export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}
