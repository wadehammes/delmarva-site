import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";
import { z } from "zod";

export type RequiredFieldMessages = {
  fieldRequired: string;
  invalidEmail: string;
  invalidPhone: string;
};

const createRequiredEmailSchema = (messages: RequiredFieldMessages) =>
  z
    .string()
    .min(1, messages.fieldRequired)
    .regex(EMAIL_VALIDATION_REGEX, messages.invalidEmail);

const createOptionalPhoneSchema = (
  messages: Pick<RequiredFieldMessages, "invalidPhone">,
) =>
  z
    .string()
    .refine(
      (value) => value === "" || PHONE_NUMBER_VALIDATION_REGEX.test(value),
      messages.invalidPhone,
    );

export const formSubmissionMetaSchema = z.object({
  formId: z.string().optional(),
  formStartedAt: z.number().optional(),
  recaptchaToken: z.string().min(1),
  website: z.string().optional(),
});

export const contactApiFieldsSchema = z.object({
  email: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().optional(),
});

export const createContactFieldsSchema = (messages: RequiredFieldMessages) =>
  z.object({
    email: createRequiredEmailSchema(messages),
    name: z.string().min(1, messages.fieldRequired),
    phone: createOptionalPhoneSchema(messages),
  });
