import {
  logObservabilityError,
  logObservabilityWarning,
} from "src/utils/observabilityLogger";

const DEFAULT_ALLOWED_HOSTNAMES = [
  "delmarvasite.com",
  "www.delmarvasite.com",
  "staging.delmarvasite.com",
  "localhost",
];

const RECAPTCHA_V3_MIN_SCORE = 0.7;

const getAllowedHostnames = (): string[] => {
  const fromEnv = process.env.RECAPTCHA_ALLOWED_HOSTNAMES;

  if (!fromEnv) {
    return DEFAULT_ALLOWED_HOSTNAMES;
  }

  return fromEnv
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
};

const isAllowedHostname = (hostname: string | undefined): boolean => {
  if (!hostname) {
    return false;
  }

  const normalizedHostname = hostname.toLowerCase();

  if (getAllowedHostnames().includes(normalizedHostname)) {
    return true;
  }

  if (
    normalizedHostname.endsWith(".delmarvasite.com") ||
    normalizedHostname.endsWith(".vercel.app")
  ) {
    return true;
  }

  return false;
};

export const verifyRecaptchaToken = async (
  token: string | null | undefined,
): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    logObservabilityError({
      event: "recaptcha_misconfigured",
      message: "RECAPTCHA_SECRET_KEY is not configured",
    });
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        body: `secret=${secretKey}&response=${token}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      hostname?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return false;
    }

    if (!isAllowedHostname(data.hostname)) {
      logObservabilityWarning({
        event: "recaptcha_hostname_mismatch",
        hostname: data.hostname,
      });
      return false;
    }

    if (data.score !== undefined) {
      return data.score >= RECAPTCHA_V3_MIN_SCORE;
    }

    return true;
  } catch (error) {
    logObservabilityError({
      event: "recaptcha_verification_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
};
