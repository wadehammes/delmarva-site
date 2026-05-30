import { isRecaptchaBypassEnabled } from "src/utils/recaptcha.helpers";

export async function verifyRecaptchaForForm(
  token: string | null | undefined,
): Promise<boolean> {
  if (isRecaptchaBypassEnabled()) {
    return true;
  }
  return verifyRecaptchaToken(token);
}

export async function verifyRecaptchaToken(
  token: string | null | undefined,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
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
        signal: AbortSignal.timeout(8_000),
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
    };

    if (data.success) {
      if (data.score !== undefined) {
        return data.score > 0.5;
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
