import type { Locales } from "src/i18n/routing";
import { parseEmailLocale } from "src/lib/emailTranslations";
import type {
  JoinOurTeamClientSubmit,
  JoinOurTeamFormInput,
} from "src/lib/forms/joinOurTeamForm.schema";

export type JoinOurTeamMultipartFields = JoinOurTeamFormInput & {
  formId?: string;
  formStartedAt?: number;
  locale?: Locales;
  recaptchaToken: string;
  website?: string;
};

export const toJoinOurTeamApiCandidate = (
  fields: JoinOurTeamMultipartFields,
) => ({
  address: fields.address,
  briefDescription: fields.briefDescription,
  city: fields.city,
  email: fields.email,
  formId: fields.formId,
  formStartedAt: fields.formStartedAt,
  locale: fields.locale,
  name: fields.name,
  phone: fields.phone,
  position: fields.position,
  recaptchaToken: fields.recaptchaToken,
  state: fields.state,
  website: fields.website,
  workEligibility: fields.workEligibility,
  zipCode: fields.zipCode,
});

export function buildJoinOurTeamFormData(
  data: JoinOurTeamClientSubmit,
): FormData {
  const form = new FormData();
  form.append("address", data.address);
  form.append("briefDescription", data.briefDescription);
  form.append("city", data.city);
  form.append("email", data.email);
  if (data.formId) {
    form.append("formId", data.formId);
  }
  if (data.locale) {
    form.append("locale", data.locale);
  }
  form.append("name", data.name);
  form.append("phone", data.phone);
  form.append("position", data.position);
  form.append("recaptchaToken", data.recaptchaToken);
  form.append("formStartedAt", String(data.formStartedAt ?? ""));
  form.append("state", data.state);
  form.append("workEligibility", String(data.workEligibility));
  form.append("zipCode", data.zipCode);
  if (data.website !== undefined) {
    form.append("website", data.website);
  }
  if (data.resume instanceof File) {
    form.append("resume", data.resume);
  }
  if (data.coverLetter instanceof File) {
    form.append("coverLetter", data.coverLetter);
  }
  return form;
}

export function buildJoinOurTeamJsonBody(data: JoinOurTeamClientSubmit) {
  return {
    address: data.address,
    briefDescription: data.briefDescription,
    city: data.city,
    email: data.email,
    formId: data.formId,
    formStartedAt: data.formStartedAt,
    locale: data.locale,
    name: data.name,
    phone: data.phone,
    position: data.position,
    recaptchaToken: data.recaptchaToken,
    state: data.state,
    website: data.website,
    workEligibility: data.workEligibility,
    zipCode: data.zipCode,
  };
}

export function parseJoinOurTeamFormData(
  formData: FormData,
): JoinOurTeamMultipartFields {
  const get = (key: string) => formData.get(key);
  const getString = (key: string) => (get(key) as string | null) ?? "";
  const workEligibilityRaw = getString("workEligibility");
  const workEligibility = workEligibilityRaw === "true";
  const formStartedAtRaw = getString("formStartedAt");
  const formStartedAt = formStartedAtRaw
    ? Number.parseInt(formStartedAtRaw, 10)
    : undefined;
  return {
    address: getString("address"),
    briefDescription: getString("briefDescription"),
    city: getString("city"),
    coverLetter: (get("coverLetter") as File | null) ?? null,
    email: getString("email"),
    formId: getString("formId") || undefined,
    formStartedAt,
    locale: (() => {
      const localeRaw = getString("locale");
      return localeRaw ? parseEmailLocale(localeRaw) : undefined;
    })(),
    name: getString("name"),
    phone: getString("phone"),
    position: getString("position"),
    recaptchaToken: getString("recaptchaToken"),
    resume: (get("resume") as File | null) ?? null,
    state: getString("state"),
    website: getString("website") || undefined,
    workEligibility,
    zipCode: getString("zipCode"),
  };
}
