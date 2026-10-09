import type { Locales } from "src/i18n/routing";
import { parseEmailLocale } from "src/lib/emailTranslations";
import {
  type JoinOurTeamApiInput,
  joinOurTeamApiSchema,
} from "src/lib/forms/joinOurTeamForm.schema";
import {
  type JoinOurTeamMultipartFields,
  parseJoinOurTeamFormData,
  toJoinOurTeamApiCandidate,
} from "src/lib/forms/joinOurTeamFormData";

type JoinOurTeamPostRequest = {
  api: JoinOurTeamApiInput;
  coverLetter: File | null;
  resume: File;
};

const readJoinOurTeamFieldsFromUnknown = (
  json: unknown,
): JoinOurTeamMultipartFields | null => {
  if (typeof json !== "object" || json === null) {
    return null;
  }

  const record = json as Record<string, unknown>;
  const workEligibility = record.workEligibility === true;
  const formStartedAt =
    typeof record.formStartedAt === "number" ? record.formStartedAt : undefined;
  const localeRaw =
    typeof record.locale === "string" ? record.locale : undefined;
  const locale = localeRaw ? parseEmailLocale(localeRaw) : undefined;

  return {
    address: typeof record.address === "string" ? record.address : "",
    briefDescription:
      typeof record.briefDescription === "string"
        ? record.briefDescription
        : "",
    city: typeof record.city === "string" ? record.city : "",
    coverLetter: record.coverLetter instanceof File ? record.coverLetter : null,
    email: typeof record.email === "string" ? record.email : "",
    formId: typeof record.formId === "string" ? record.formId : undefined,
    formStartedAt,
    locale: locale as Locales | undefined,
    name: typeof record.name === "string" ? record.name : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    position: typeof record.position === "string" ? record.position : "",
    recaptchaToken:
      typeof record.recaptchaToken === "string" ? record.recaptchaToken : "",
    resume: record.resume instanceof File ? record.resume : null,
    state: typeof record.state === "string" ? record.state : "",
    website: typeof record.website === "string" ? record.website : undefined,
    workEligibility,
    zipCode: typeof record.zipCode === "string" ? record.zipCode : "",
  };
};

export type JoinOurTeamPostParseResult =
  | { success: true; data: JoinOurTeamPostRequest }
  | { success: false; error: string; status: 400 };

export const validateJoinOurTeamMultipartFields = (
  fields: JoinOurTeamMultipartFields | null,
): JoinOurTeamPostParseResult => {
  if (!fields) {
    return { error: "Invalid request body", status: 400, success: false };
  }

  const parsed = joinOurTeamApiSchema.safeParse(
    toJoinOurTeamApiCandidate(fields),
  );

  if (!parsed.success) {
    return { error: "Invalid request body", status: 400, success: false };
  }

  if (!(fields.resume instanceof File)) {
    return { error: "Resume is required", status: 400, success: false };
  }

  return {
    data: {
      api: parsed.data,
      coverLetter: fields.coverLetter,
      resume: fields.resume,
    },
    success: true,
  };
};

export const parseJoinOurTeamPostRequest = async (
  request: Request,
): Promise<JoinOurTeamPostParseResult> => {
  const contentType = request.headers.get("content-type") ?? "";
  const fields = contentType.includes("multipart/form-data")
    ? parseJoinOurTeamFormData(await request.formData())
    : readJoinOurTeamFieldsFromUnknown(await request.json());

  return validateJoinOurTeamMultipartFields(fields);
};
