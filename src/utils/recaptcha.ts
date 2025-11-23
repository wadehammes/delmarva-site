/**
 * Verifies a reCAPTCHA token with Google's verification API
 * @param token - The reCAPTCHA token to verify
 * @returns Promise<boolean> - true if verification succeeds, false otherwise
 */
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
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
    };

    // For reCAPTCHA v3, also check the score (typically > 0.5 is considered human)
    // For v2, we just check success
    if (data.success) {
      // If score exists (v3), require it to be above 0.5
      if (data.score !== undefined) {
        return data.score > 0.5;
      }
      // For v2, success is enough
      return true;
    }

    return false;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
