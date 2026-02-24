import { render } from "@react-email/render";
import { JoinOurTeamConfirmationTemplate } from "../components/Email/JoinOurTeamConfirmationTemplate";
import { JoinOurTeamNotificationTemplate } from "../components/Email/JoinOurTeamNotificationTemplate";
import { RequestAQuoteNotificationTemplate } from "../components/Email/RequestAQuoteNotificationTemplate";
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

export interface RequestAQuoteNotificationEmailData {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export async function renderRequestAQuoteNotificationEmail(
  data: RequestAQuoteNotificationEmailData,
): Promise<string> {
  const baseUrl = getEmailBaseUrl();
  return await render(
    <RequestAQuoteNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}
