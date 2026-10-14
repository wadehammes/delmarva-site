import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const out = {};

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }

  return out;
};

const envMode = () =>
  process.env.NODE_ENV === "production" ? "production" : "development";

const loadLocalEnv = (root = process.cwd()) => {
  const mode = envMode();

  return {
    ...loadEnvFile(path.join(root, ".env")),
    ...loadEnvFile(path.join(root, `.env.${mode}`)),
    ...loadEnvFile(path.join(root, ".env.local")),
    ...loadEnvFile(path.join(root, `.env.${mode}.local`)),
  };
};

export const resolveEnvForScripts = (root = process.cwd()) => ({
  ...loadLocalEnv(root),
  ...process.env,
});

export const getDraftPreviewUrl = (secret, base) => {
  const origin = base.replace(/\/$/, "");

  return `${origin}/api/draft?previewSecret=${encodeURIComponent(secret)}&redirect=/`;
};

export const openBrowser = (targetUrl) => {
  const platform = process.platform;

  if (platform === "darwin") {
    execFileSync("open", [targetUrl], { stdio: "ignore" });
  } else if (platform === "win32") {
    execFileSync("cmd", ["/c", "start", "", targetUrl], { stdio: "ignore" });
  } else {
    execFileSync("xdg-open", [targetUrl], { stdio: "ignore" });
  }
};
