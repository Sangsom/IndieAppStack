import path from "node:path";
import { exit } from "node:process";
import { pathToFileURL } from "node:url";

import { readEnvLocal } from "./env-local.mjs";

const POLL_INTERVAL_MS = 15_000;
const PUSH_WAIT_MS = 12 * 60 * 1000;
const DISPATCH_WAIT_MS = 60 * 1000;
const REVALIDATE_ATTEMPTS = 8;

const pendingStates = new Set(["in_progress", "pending", "queued", "waiting"]);

export function isProductionEnvironment(environment) {
  return environment === "Production";
}

export function latestDeploymentStatus(statuses) {
  return [...statuses].sort((left, right) => {
    const leftTime = Date.parse(left.created_at ?? left.updated_at ?? 0);
    const rightTime = Date.parse(right.created_at ?? right.updated_at ?? 0);
    return rightTime - leftTime;
  })[0];
}

export function productionDeploymentState(deployments, statusesById) {
  let sawPending = false;
  let failure = null;

  for (const deployment of deployments) {
    if (!isProductionEnvironment(deployment.environment ?? "")) {
      continue;
    }

    const latest = latestDeploymentStatus(
      statusesById.get(deployment.id) ?? [],
    );

    if (!latest || pendingStates.has(latest.state)) {
      sawPending = true;
      continue;
    }

    if (latest.state === "success" || latest.state === "inactive") {
      return { status: "success" };
    }

    if (latest.state === "failure" || latest.state === "error") {
      failure = {
        id: deployment.id,
        state: latest.state,
        status: "failure",
      };
    }
  }

  if (sawPending) {
    return { status: "pending" };
  }

  if (failure) {
    return failure;
  }

  return { status: "missing" };
}

export function redactSecrets(text, secrets) {
  let redacted = text;

  for (const secret of secrets) {
    if (typeof secret === "string" && secret.length > 0) {
      redacted = redacted.split(secret).join("[redacted]");
    }
  }

  return redacted;
}

export function revalidateEndpoint(siteUrl) {
  const url = new URL("/api/revalidate", siteUrl);

  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "Revalidation site URL must not include credentials or a query.",
    );
  }

  if (url.protocol !== "https:") {
    throw new Error("Revalidation site URL must use https.");
  }

  return url;
}

function secretValues() {
  return [
    process.env.GITHUB_TOKEN,
    process.env.REVALIDATE_SECRET,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ];
}

function logSafe(message) {
  console.log(redactSecrets(message, secretValues()));
}

function fail(message) {
  console.error(redactSecrets(message, secretValues()));
  exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function githubJson(context, pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${context.token}`,
      "user-agent": "indieappstack-seed-workflow",
      "x-github-api-version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub deployment lookup failed with status ${response.status}.`,
    );
  }

  return response.json();
}

async function waitForProductionDeployment(context) {
  if (!context.token || !context.repository || !context.sha) {
    if (context.eventName === "push") {
      throw new Error(
        "Missing GitHub deployment context. Cannot confirm the production deploy.",
      );
    }

    logSafe(
      "[revalidate] No GitHub deployment context. Revalidating the current site.",
    );
    return;
  }

  const deadline =
    Date.now() +
    (context.eventName === "workflow_dispatch"
      ? DISPATCH_WAIT_MS
      : PUSH_WAIT_MS);
  const encodedSha = encodeURIComponent(context.sha);

  while (Date.now() <= deadline) {
    const deployments = await githubJson(
      context,
      `/repos/${context.repository}/deployments?sha=${encodedSha}&per_page=100`,
    );
    const statusesById = new Map();

    for (const deployment of deployments) {
      if (!isProductionEnvironment(deployment.environment ?? "")) {
        continue;
      }

      const statuses = await githubJson(
        context,
        `/repos/${context.repository}/deployments/${deployment.id}/statuses`,
      );
      statusesById.set(deployment.id, statuses);
    }

    const state = productionDeploymentState(deployments, statusesById);

    if (state.status === "success") {
      logSafe("[revalidate] Production deployment for this commit is ready.");
      return;
    }

    if (state.status === "failure") {
      throw new Error(
        `Production deployment ${state.id} reported ${state.state}.`,
      );
    }

    logSafe(
      "[revalidate] Waiting for the production deployment of this commit.",
    );
    await sleep(POLL_INTERVAL_MS);
  }

  if (context.eventName === "workflow_dispatch") {
    logSafe(
      "[revalidate] No production deployment is in progress. Revalidating the current site.",
    );
    return;
  }

  throw new Error(
    "Timed out waiting for the production deployment of this commit.",
  );
}

async function postRevalidate(endpoint, secret) {
  let response;

  try {
    response = await fetch(endpoint, {
      body: "{}",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      method: "POST",
      redirect: "manual",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "request failed";
    throw new Error(`Revalidation request failed: ${message}`);
  }

  if (response.status >= 300 && response.status < 400) {
    throw new Error(
      `Revalidation request was redirected with status ${response.status}.`,
    );
  }

  return response.status;
}

async function revalidateUntilReady(endpoint, secret) {
  for (let attempt = 1; attempt <= REVALIDATE_ATTEMPTS; attempt += 1) {
    const status = await postRevalidate(endpoint, secret);
    logSafe(`[revalidate] status=${status} attempt=${attempt}`);

    if (status === 200) {
      logSafe("[revalidate] Production cache marked for refresh.");
      return;
    }

    if (status === 401) {
      throw new Error(
        "Revalidation was rejected. Check the REVALIDATE_SECRET value in GitHub Actions and Vercel.",
      );
    }

    if (status === 503) {
      throw new Error(
        "Revalidation is not configured. Set REVALIDATE_SECRET on the Vercel production environment.",
      );
    }

    const retryable = status === 404 || status === 502 || status === 504;

    if (!retryable || attempt === REVALIDATE_ATTEMPTS) {
      throw new Error(`Revalidation failed with status ${status}.`);
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

export async function runRevalidation(env = process.env) {
  const envLocal = readEnvLocal();
  const secret = env.REVALIDATE_SECRET ?? envLocal.REVALIDATE_SECRET;
  const runningInActions = env.GITHUB_ACTIONS === "true";

  if (!secret) {
    if (runningInActions) {
      throw new Error("Missing GitHub Actions secret: REVALIDATE_SECRET.");
    }

    logSafe(
      "[revalidate] REVALIDATE_SECRET is unset. Skipped cache refresh. Public pages refresh within their one hour cache window.",
    );
    return;
  }

  const siteUrl =
    env.NEXT_PUBLIC_SITE_URL ??
    envLocal.NEXT_PUBLIC_SITE_URL ??
    "https://indieappstack.com";
  const endpoint = revalidateEndpoint(siteUrl);

  await waitForProductionDeployment({
    eventName: env.GITHUB_EVENT_NAME ?? "",
    repository: env.GITHUB_REPOSITORY ?? "",
    sha: env.GITHUB_SHA ?? "",
    token: env.GITHUB_TOKEN ?? "",
  });
  await revalidateUntilReady(endpoint, secret);
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  runRevalidation().catch((error) => {
    const message =
      error instanceof Error ? error.message : "Revalidation failed.";
    fail(message);
  });
}
