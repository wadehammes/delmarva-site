import "server-only";

import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import type { Locales } from "src/i18n/routing";
import { parseEmailLocale } from "src/lib/emailTranslations";

/** Multipart when the client attaches files; JSON otherwise (no attachments). */
export const parseJoinOurTeamRequest = async (
  request: Request,
): Promise<JoinOurTeamInputs> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (
    contentType.includes("multipart/form-data") &&
    contentType.includes("boundary=")
  ) {
    return fromFormData(await request.formData());
  }

  return fromJson(await request.json());
};

const fromFormData = (formData: FormData): JoinOurTeamInputs => {
  const get = (key: string) => formData.get(key);
  const text = (key: string) => String(get(key) ?? "");

  const emailsRaw = get("emailsToSendNotification");
  let emailsToSendNotification: string[] | undefined;
  if (typeof emailsRaw === "string" && emailsRaw.trim()) {
    try {
      const parsed = JSON.parse(emailsRaw) as unknown;
      emailsToSendNotification = Array.isArray(parsed)
        ? parsed.filter((e): e is string => typeof e === "string")
        : undefined;
    } catch {
      emailsToSendNotification = undefined;
    }
  }

  const localeRaw = text("locale");

  return {
    address: text("address"),
    briefDescription: text("briefDescription"),
    city: text("city"),
    coverLetter: (get("coverLetter") as File | null) ?? null,
    email: text("email"),
    emailsToSendNotification,
    locale: localeRaw ? parseEmailLocale(localeRaw) : undefined,
    name: text("name"),
    phone: text("phone"),
    position: text("position"),
    recaptchaToken: text("recaptchaToken"),
    resume: (get("resume") as File | null) ?? null,
    state: text("state"),
    website: text("website") || undefined,
    workEligibility: text("workEligibility") === "true",
    zipCode: text("zipCode"),
  };
};

const fromJson = (body: unknown): JoinOurTeamInputs => {
  const data =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const str = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string) : "";

  const emails = data.emailsToSendNotification;
  const emailsToSendNotification = Array.isArray(emails)
    ? emails.filter((e): e is string => typeof e === "string")
    : undefined;

  const localeRaw = data.locale;
  const locale =
    typeof localeRaw === "string"
      ? parseEmailLocale(localeRaw as Locales)
      : undefined;

  return {
    address: str("address"),
    briefDescription: str("briefDescription"),
    city: str("city"),
    coverLetter: null,
    email: str("email"),
    emailsToSendNotification,
    locale,
    name: str("name"),
    phone: str("phone"),
    position: str("position"),
    recaptchaToken: str("recaptchaToken"),
    resume: null,
    state: str("state"),
    website: str("website") || undefined,
    workEligibility: Boolean(data.workEligibility),
    zipCode: str("zipCode"),
  };
};
