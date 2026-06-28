import fs from "node:fs";
import path from "node:path";
import { cwd, env, exit } from "node:process";

function readEnvLocal(name) {
  const envLocalPath = path.join(cwd(), ".env.local");

  if (!fs.existsSync(envLocalPath)) {
    return undefined;
  }

  const line = fs
    .readFileSync(envLocalPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  return line?.slice(name.length + 1);
}

const serviceRoleKey =
  env.SUPABASE_SERVICE_ROLE_KEY ?? readEnvLocal("SUPABASE_SERVICE_ROLE_KEY");
const clientBundleRoot = path.join(cwd(), ".next", "static");

if (!serviceRoleKey) {
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY is not set; skipping client bundle scan.",
  );
  exit(0);
}

if (!fs.existsSync(clientBundleRoot)) {
  console.error("Missing .next/static. Run `npm run build` before scanning.");
  exit(1);
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }

    return entry.isFile() ? [entryPath] : [];
  });
}

const leaks = walkFiles(clientBundleRoot).filter((filePath) =>
  fs.readFileSync(filePath, "utf8").includes(serviceRoleKey),
);

if (leaks.length > 0) {
  console.error("SUPABASE_SERVICE_ROLE_KEY was found in client bundle files:");
  leaks.forEach((filePath) => console.error(`- ${filePath}`));
  exit(1);
}

console.log("SUPABASE_SERVICE_ROLE_KEY was not found in .next/static.");
