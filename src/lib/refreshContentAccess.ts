export const isRefreshContentAuthorized = (
  token: string | undefined,
): boolean => {
  const accessToken = process.env.REFRESH_CONTENT_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    return process.env.ENVIRONMENT === "local";
  }

  return token === accessToken;
};

export type DeployTarget = "staging" | "production";

export const getDeployHookUrl = (target: DeployTarget): string | null => {
  if (target === "staging") {
    return process.env.VERCEL_DEPLOY_HOOK_STAGING?.trim() || null;
  }

  return process.env.VERCEL_DEPLOY_HOOK_PRODUCTION?.trim() || null;
};
