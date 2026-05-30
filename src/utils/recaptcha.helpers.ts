import type ReCAPTCHA from "react-google-recaptcha";
import { Environments } from "src/interfaces/common.interfaces";
import { parseEnvBoolean } from "src/utils/env.helpers";

const LOCAL_BYPASS_TOKEN = "local-bypass";

/** True only on local dev when explicitly enabled in `.env.local` — never on Vercel. */
export const isRecaptchaBypassEnabled = (): boolean => {
  return (
    process.env.ENVIRONMENT === Environments.Local &&
    parseEnvBoolean(process.env.RECAPTCHA_BYPASS_LOCAL)
  );
};

const getRecaptchaNetworkErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : "reCAPTCHA failed";
  if (message.includes("Failed to fetch")) {
    return "Could not verify reCAPTCHA. Check your connection and try again.";
  }
  return `Could not verify reCAPTCHA: ${message}`;
};

export const getRecaptchaTokenForForm = async (
  recaptchaRef: React.RefObject<ReCAPTCHA | null>,
): Promise<string | null> => {
  if (isRecaptchaBypassEnabled()) {
    return LOCAL_BYPASS_TOKEN;
  }

  const siteKey = process.env.RECAPTCHA_SITE_KEY?.trim();
  if (!siteKey) {
    throw new Error(
      "reCAPTCHA is not configured. Set RECAPTCHA_SITE_KEY in .env.local.",
    );
  }

  if (!recaptchaRef.current) {
    throw new Error(
      "reCAPTCHA is not ready. Please refresh the page and try again.",
    );
  }

  try {
    return (await recaptchaRef.current.executeAsync()) ?? null;
  } catch (error) {
    throw new Error(getRecaptchaNetworkErrorMessage(error));
  }
};
