import fs from "node:fs";
import { randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");

        if (separatorIndex === -1) {
          return null;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^"|"$/g, "");

        return [key, value];
      })
      .filter(Boolean),
  );
}

const envLocal = loadEnvFile(".env.local");
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? envLocal.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? envLocal.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2]?.trim().toLowerCase();

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
}

if (!email) {
  throw new Error("Usage: npm run subscribers:delete -- email@example.com");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});

const now = new Date().toISOString();
const anonymizedEmail = `deleted+${randomUUID()}@indieappstack.invalid`;

const { data, error } = await supabase
  .from("subscribers")
  .update({
    deleted_at: now,
    email: anonymizedEmail,
    provider: null,
    provider_id: null,
    status: "unsubscribed",
    unsubscribed_at: now,
  })
  .eq("email", email)
  .select("id")
  .maybeSingle();

if (error) {
  throw error;
}

if (!data) {
  console.log("No subscriber found for that email.");
} else {
  console.log(`Subscriber ${data.id} anonymized.`);
}
