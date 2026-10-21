import assert from "node:assert/strict";
import test from "node:test";

import {
  productionDeploymentState,
  redactSecrets,
  revalidateEndpoint,
} from "./revalidate-production.mjs";

test("production deployment success wins over an older failure", () => {
  const state = productionDeploymentState(
    [
      { environment: "Preview", id: 1 },
      { environment: "Production", id: 2 },
      { environment: "Production", id: 3 },
    ],
    new Map([
      [2, [{ created_at: "2026-10-20T09:00:00Z", state: "failure" }]],
      [
        3,
        [
          { created_at: "2026-10-20T09:05:00Z", state: "success" },
          { created_at: "2026-10-20T09:01:00Z", state: "in_progress" },
        ],
      ],
    ]),
  );

  assert.deepEqual(state, { status: "success" });
});

test("a pending production deployment keeps the wait loop running", () => {
  const state = productionDeploymentState(
    [{ environment: "Production", id: 4 }],
    new Map([
      [4, [{ created_at: "2026-10-20T09:00:00Z", state: "in_progress" }]],
    ]),
  );

  assert.deepEqual(state, { status: "pending" });
});

test("secret values are removed from error text", () => {
  const secret = "super-secret-value";
  const text = redactSecrets(
    `Authorization bearer ${secret} failed for ${secret}`,
    [secret, ""],
  );

  assert.equal(text.includes(secret), false);
  assert.match(text, /\[redacted\]/);
});

test("revalidation URL rejects insecure and credentialed targets", () => {
  assert.equal(
    revalidateEndpoint("https://indieappstack.com").href,
    "https://indieappstack.com/api/revalidate",
  );
  assert.throws(() => revalidateEndpoint("http://indieappstack.com"), /https/);
  assert.throws(
    () => revalidateEndpoint("https://user:pass@indieappstack.com"),
    /credentials/,
  );
});
