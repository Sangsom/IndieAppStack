import fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";

export function readEnvLocal(envPath = path.join(cwd(), ".env.local")) {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...valueParts] = line.split("=");
        return [key, valueParts.join("=")];
      }),
  );
}
