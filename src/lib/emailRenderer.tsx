import { render } from "@react-email/render";
import { GeneralInquiryNotificationTemplate } from "../components/Email/GeneralInquiryNotificationTemplate";
import { JoinOurTeamConfirmationTemplate } from "../components/Email/JoinOurTeamConfirmationTemplate";
import { JoinOurTeamNotificationTemplate } from "../components/Email/JoinOurTeamNotificationTemplate";
import { RequestAProposalNotificationTemplate } from "../components/Email/RequestAProposalNotificationTemplate";
import { getEmailBaseUrl } from "./emailConstants";

export interface NotificationEmailData {
  name: string;
  email: string;
  phone: string;
  position: string;
  briefDescription: string;
  workEligibility: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coverLetter: string;
  resume: string;
}

export interface ConfirmationEmailData {
  name: string;
  position: string;
}

export async function renderNotificationEmail(
  data: NotificationEmailData,
): Promise<string> {
  const baseUrl = getEmailBaseUrl();
  return await render(
    <JoinOurTeamNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}

export async function renderConfirmationEmail(
  data: ConfirmationEmailData,
): Promise<string> {
  const baseUrl = getEmailBaseUrl();
  return await render(
    <JoinOurTeamConfirmationTemplate {...data} baseUrl={baseUrl} />,
  );
}

export interface GeneralInquiryNotificationEmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function renderGeneralInquiryNotificationEmail(
  data: GeneralInquiryNotificationEmailData,
): Promise<string> {
  const baseUrl = getEmailBaseUrl();
  return await render(
    <GeneralInquiryNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}

export interface RequestAProposalNotificationEmailData {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export async function renderRequestAProposalNotificationEmail(
  data: RequestAProposalNotificationEmailData,
): Promise<string> {
  const baseUrl = getEmailBaseUrl();
  return await render(
    <RequestAProposalNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}
