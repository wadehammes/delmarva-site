import { envUrl } from "src/utils/helpers";

export const getEmailBaseUrl = () => envUrl();

const isLocalEnv = () => process.env.ENVIRONMENT === "local";

export const getEmailAssetBaseUrl = () => {
  const override = process.env.EMAIL_ASSET_BASE_URL?.trim();
  if (isLocalEnv() && override) return override;
  return getEmailBaseUrl();
};

export const EMAIL_LOGO_PATH = "/email-logo.png";
export const SITE_NAME = "Delmarva";
