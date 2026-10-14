import { spawn } from "node:child_process";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  getDraftPreviewUrl,
  openBrowser,
  resolveEnvForScripts,
} from "./lib/preview-local.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const nextBin = path.join(
  repoRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const DEFAULT_ORIGIN = "http://localhost:5656";
const DEV_ARGS = ["dev", "-p", "5656"];

const PING_INTERVAL_MS = 300;
const PING_TIMEOUT_MS = 5_000;
const SERVER_READY_TIMEOUT_MS = 120_000;

const isPreviewOpenDisabled = (env) => {
  const v = env.OPEN_PREVIEW_LOCAL;

  return v === "0" || v === "false" || v === "no";
};

const pingDevServer = (origin) => {
  const url = new URL(`${origin.replace(/\/$/, "")}/`);
  const lib = url.protocol === "https:" ? https : http;
  const requestOptions =
    url.protocol === "https:" ? { rejectUnauthorized: false } : {};

  return new Promise((resolve, reject) => {
    let timeoutId;

    const req = lib.get(url, requestOptions, (res) => {
      clearTimeout(timeoutId);
      res.resume();
      resolve();
    });

    timeoutId = setTimeout(() => {
      req.destroy();
      reject(new Error("ping timeout"));
    }, PING_TIMEOUT_MS);

    req.on("error", (err) => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
};

const waitUntilDevServerReady = async (origin) => {
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      await pingDevServer(origin);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, PING_INTERVAL_MS));
    }
  }
  throw new Error(
    `No response from ${origin} within ${SERVER_READY_TIMEOUT_MS}ms`,
  );
};

const main = async () => {
  const child = spawn(process.execPath, [nextBin, ...DEV_ARGS], {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error("[dev:preview] Failed to start Next.js:", err);
    process.exit(1);
  });

  const stopChild = (signal) => {
    if (child.pid) {
      child.kill(signal);
    }
  };
  process.on("SIGINT", () => stopChild("SIGINT"));
  process.on("SIGTERM", () => stopChild("SIGTERM"));

  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(1);
    }
    process.exit(code ?? 0);
  });

  const env = resolveEnvForScripts(repoRoot);
  const secret = env.CONTENTFUL_PREVIEW_SECRET;
  const origin = env.PREVIEW_LOCAL_ORIGIN ?? DEFAULT_ORIGIN;

  if (isPreviewOpenDisabled(env) || !secret) {
    if (!secret) {
      console.info(
        "\n[dev:preview] Tip: set CONTENTFUL_PREVIEW_SECRET in .env.local to auto-open draft preview after the server is ready.\n",
      );
    }
    return;
  }

  try {
    await waitUntilDevServerReady(origin);
  } catch (e) {
    console.error(
      "[dev:preview] Dev server not reachable; skipping draft preview open.",
      e,
    );
    return;
  }

  const url = getDraftPreviewUrl(secret, origin);
  console.info(`\n[dev:preview] Opening draft preview: ${url}\n`);
  try {
    openBrowser(url);
  } catch (e) {
    console.error(
      "[dev:preview] Could not open browser; open this URL manually:",
      url,
      e,
    );
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
