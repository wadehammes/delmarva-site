import { logObservabilityWarning } from "src/utils/observabilityLogger";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

export const MIN_FORM_DURATION_MS = 3000;

const SPAM_BLOCKED_BODY = {
  id: "spam-blocked",
  message: "success",
} as const;

export const createSpamBlockedResponse = () => {
  return Response.json(SPAM_BLOCKED_BODY);
};

type FormSpamLayer = "honeypot" | "recaptcha" | "timing" | "content";

export type FormSpamCheckInput = {
  honeypot?: string;
  recaptchaToken?: string | null;
  formStartedAt?: number;
  spamContent: {
    email: string;
    message: string;
    name?: string;
    companyName?: string;
  };
};

export type FormSpamCheckResult =
  | { allowed: true }
  | { allowed: false; layer: FormSpamLayer; reason: string };

const isFormSubmittedTooQuickly = (formStartedAt?: number): boolean => {
  if (formStartedAt === undefined || Number.isNaN(formStartedAt)) {
    return true;
  }

  const elapsedMs = Date.now() - formStartedAt;

  return elapsedMs < MIN_FORM_DURATION_MS;
};

export const checkFormSubmissionSpam = async (
  input: FormSpamCheckInput,
): Promise<FormSpamCheckResult> => {
  const { honeypot, recaptchaToken, formStartedAt, spamContent } = input;

  if (honeypot && honeypot.trim() !== "") {
    return {
      allowed: false,
      layer: "honeypot",
      reason: "Honeypot field filled",
    };
  }

  if (isFormSubmittedTooQuickly(formStartedAt)) {
    return {
      allowed: false,
      layer: "timing",
      reason: "Form submitted too quickly",
    };
  }

  const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);

  if (!isRecaptchaValid) {
    return {
      allowed: false,
      layer: "recaptcha",
      reason: "reCAPTCHA verification failed",
    };
  }

  const spamCheck = isSpam(spamContent);

  if (spamCheck.isSpam) {
    return {
      allowed: false,
      layer: "content",
      reason: spamCheck.reasons.join("; "),
    };
  }

  return { allowed: true };
};

export const logBlockedFormSubmission = (
  formName: string,
  result: Extract<FormSpamCheckResult, { allowed: false }>,
  context: { email?: string; name?: string; position?: string },
) => {
  logObservabilityWarning({
    email: context.email,
    event: "form_spam_blocked",
    form: formName,
    layer: result.layer,
    name: context.name,
    position: context.position,
    reason: result.reason,
  });
};
