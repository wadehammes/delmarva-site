import {
  contactApiFieldsSchema,
  createContactFieldsSchema,
  formSubmissionMetaSchema,
  type RequiredFieldMessages,
} from "src/lib/forms/formFieldSchemas";
import { z } from "zod";

export type RequestAProposalFormMessages = RequiredFieldMessages;

export const createRequestAProposalFormSchema = (
  messages: RequestAProposalFormMessages,
) =>
  createContactFieldsSchema(messages).extend({
    companyName: z.string().min(1, messages.fieldRequired),
    projectDetails: z.string(),
    recaptchaToken: z.string().optional(),
    website: z.string().optional(),
  });

export type RequestAProposalFormValues = z.infer<
  ReturnType<typeof createRequestAProposalFormSchema>
>;

export const requestAProposalApiSchema = contactApiFieldsSchema
  .extend({
    companyName: z.string().min(1),
    projectDetails: z.string().optional(),
  })
  .merge(formSubmissionMetaSchema);

export type RequestAProposalApiInput = z.infer<
  typeof requestAProposalApiSchema
>;
