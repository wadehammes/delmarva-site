import {
  contactApiFieldsSchema,
  createContactFieldsSchema,
  formSubmissionMetaSchema,
  type RequiredFieldMessages,
} from "src/lib/forms/formFieldSchemas";
import { z } from "zod";

export type GeneralInquiryFormMessages = RequiredFieldMessages;

export const createGeneralInquiryFormSchema = (
  messages: GeneralInquiryFormMessages,
) =>
  createContactFieldsSchema(messages).extend({
    message: z.string().min(1, messages.fieldRequired),
    recaptchaToken: z.string().optional(),
    website: z.string().optional(),
  });

export type GeneralInquiryFormValues = z.infer<
  ReturnType<typeof createGeneralInquiryFormSchema>
>;

export const generalInquiryApiSchema = contactApiFieldsSchema
  .extend({
    message: z.string().min(1),
  })
  .merge(formSubmissionMetaSchema);

export type GeneralInquiryApiInput = z.infer<typeof generalInquiryApiSchema>;
