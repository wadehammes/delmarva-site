/** Parses env flags; tolerates values copy-pasted with quotes (e.g. `"true"`). */
export const parseEnvBoolean = (value: string | undefined): boolean => {
  if (!value?.trim()) {
    return false;
  }
  const normalized = value.trim().replace(/^["']|["']$/g, "");
  return normalized.toLowerCase() === "true";
};

export const envUrl = () => {
  if (process.env.ENVIRONMENT === "local") {
    return "http://localhost:5656";
  }

  if (process.env.ENVIRONMENT === "staging") {
    return "https://staging.delmarvasite.com";
  }

  return "https://www.delmarvasite.com";
};
