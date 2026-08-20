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

export const parseDeployTarget = (
  value: string | null | undefined,
): DeployTarget | null => {
  if (value === "staging" || value === "production") {
    return value;
  }

  return null;
};

export const parseDeployHookUrl = (
  hookUrl: string,
): { deployHookId: string; projectId: string } | null => {
  const match = hookUrl.match(/\/integrations\/deploy\/([^/]+)\/([^/?#]+)/);

  if (!match) {
    return null;
  }

  return {
    deployHookId: match[2],
    projectId: match[1],
  };
};

export const getDeployHookUrl = (target: DeployTarget): string | null => {
  if (target === "staging") {
    return process.env.VERCEL_DEPLOY_HOOK_STAGING?.trim() || null;
  }

  return process.env.VERCEL_DEPLOY_HOOK_PRODUCTION?.trim() || null;
};

export const resolveDeployHookMetadata = (
  target: DeployTarget,
): { deployHookId: string; projectId: string } | null => {
  const hookUrl = getDeployHookUrl(target);

  if (!hookUrl) {
    return null;
  }

  return parseDeployHookUrl(hookUrl);
};
