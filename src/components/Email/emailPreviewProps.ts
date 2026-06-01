/** Sample props for `pnpm email:dev` (logo loads from production CDN). */
const EMAIL_PREVIEW_BASE_URL = "https://www.delmarvasite.com";

export const joinOurTeamNotificationPreviewProps = {
  address: "123 Main Street",
  baseUrl: EMAIL_PREVIEW_BASE_URL,
  briefDescription:
    "I have 8 years of site development experience and am interested in joining the Delmarva team.",
  city: "Salisbury",
  coverLetter: "File attached",
  email: "jane.doe@example.com",
  name: "Jane Doe",
  phone: "(410) 555-0100",
  position: "Project Manager",
  resume: "File attached",
  state: "MD",
  workEligibility: "Authorized to work in the United States",
  zipCode: "21801",
} as const;

export const joinOurTeamConfirmationPreviewProps = {
  baseUrl: EMAIL_PREVIEW_BASE_URL,
  locale: "en",
  name: "Jane Doe",
  position: "Project Manager",
} as const;

/** Spanish preview — used by `JoinOurTeamConfirmationTemplateEs.tsx` in `pnpm email:dev`. */
export const joinOurTeamConfirmationPreviewPropsEs = {
  baseUrl: EMAIL_PREVIEW_BASE_URL,
  locale: "es",
  name: "María López",
  position: "Gerente de Proyecto",
} as const;

export const generalInquiryNotificationPreviewProps = {
  baseUrl: EMAIL_PREVIEW_BASE_URL,
  email: "alex@acme.com",
  message:
    "We are planning a new retail center and would like to discuss timeline and services.",
  name: "Alex Rivera",
  phone: "(302) 555-0199",
} as const;

export const requestAProposalNotificationPreviewProps = {
  baseUrl: EMAIL_PREVIEW_BASE_URL,
  companyName: "Acme Development",
  email: "alex@acme.com",
  name: "Alex Rivera",
  phone: "(302) 555-0199",
  projectDetails:
    "15-acre mixed-use site; grading, utilities, and paving needed. Target start Q3.",
} as const;
