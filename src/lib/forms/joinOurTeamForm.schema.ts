import {
  createContactFieldsSchema,
  formSubmissionMetaSchema,
} from "src/lib/forms/formFieldSchemas";
import { z } from "zod";

export type JoinOurTeamFormMessages = {
  fieldRequired: string;
  invalidEmail: string;
  invalidPhone: string;
  positionRequired: string;
  resumeRequired: string;
  workEligibilityRequired: string;
};

export const createJoinOurTeamFormSchema = (
  messages: JoinOurTeamFormMessages,
) =>
  createContactFieldsSchema(messages).extend({
    address: z.string(),
    briefDescription: z.string(),
    city: z.string(),
    coverLetter: z.union([z.instanceof(File), z.null()]),
    position: z.string().min(1, messages.positionRequired),
    recaptchaToken: z.string().optional(),
    resume: z
      .union([z.instanceof(File), z.null()])
      .refine(
        (file): file is File => file instanceof File,
        messages.resumeRequired,
      ),
    state: z.string(),
    website: z.string().optional(),
    workEligibility: z
      .boolean()
      .refine(Boolean, messages.workEligibilityRequired),
    zipCode: z.string(),
  });

export type JoinOurTeamFormInput = z.input<
  ReturnType<typeof createJoinOurTeamFormSchema>
>;

export type JoinOurTeamFormValues = z.output<
  ReturnType<typeof createJoinOurTeamFormSchema>
>;

export const joinOurTeamApiSchema = formSubmissionMetaSchema.extend({
  address: z.string().optional(),
  briefDescription: z.string().optional(),
  city: z.string().optional(),
  email: z.string().min(1),
  locale: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().optional(),
  position: z.string().min(1),
  state: z.string().optional(),
  workEligibility: z.literal(true),
  zipCode: z.string().optional(),
});

export type JoinOurTeamApiInput = z.infer<typeof joinOurTeamApiSchema>;

export type JoinOurTeamClientSubmit = JoinOurTeamFormValues &
  Pick<
    JoinOurTeamApiInput,
    "formId" | "formStartedAt" | "recaptchaToken" | "website"
  > & {
    locale?: string;
  };
