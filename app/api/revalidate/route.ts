import { createHash, timingSafeEqual } from "node:crypto";

import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const MAX_SECRET_LENGTH = 256;

const literalPaths = [
  "/",
  "/categories",
  "/comparisons",
  "/guides",
  "/sitemap.xml",
  "/stack-finder/results",
  "/stacks",
  "/tools",
];

const pagePatterns = [
  "/categories/[slug]",
  "/comparisons/[slug]",
  "/guides/[slug]",
  "/stacks/[slug]",
  "/tools/[slug]",
];

function bearerToken(request: Request) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token || token.length > MAX_SECRET_LENGTH) {
    return null;
  }

  return token;
}

function secretsMatch(provided: string, expected: string) {
  const providedDigest = createHash("sha256").update(provided).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();

  return timingSafeEqual(providedDigest, expectedDigest);
}

function json(body: unknown, status: number) {
  return Response.json(body, {
    headers: { "cache-control": "no-store" },
    status,
  });
}

export function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return json({ error: "Revalidation is not configured." }, 503);
  }

  const provided = bearerToken(request);

  if (!provided || !secretsMatch(provided, expected)) {
    return json({ error: "Unauthorized." }, 401);
  }

  revalidatePath("/", "layout");

  for (const path of literalPaths) {
    revalidatePath(path);
  }

  for (const pattern of pagePatterns) {
    revalidatePath(pattern, "page");
  }

  return json(
    {
      revalidated: true,
      paths: literalPaths.length + pagePatterns.length + 1,
    },
    200,
  );
}
