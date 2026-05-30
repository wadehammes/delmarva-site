import type { ReactElement } from "react";
import { render } from "react-email";
import { GeneralInquiryNotificationTemplate } from "../components/Email/GeneralInquiryNotificationTemplate";
import { JoinOurTeamConfirmationTemplate } from "../components/Email/JoinOurTeamConfirmationTemplate";
import { JoinOurTeamNotificationTemplate } from "../components/Email/JoinOurTeamNotificationTemplate";
import { RequestAProposalNotificationTemplate } from "../components/Email/RequestAProposalNotificationTemplate";
import { getEmailBaseUrl } from "./emailConstants";

export interface RenderedEmail {
  html: string;
  text: string;
}

async function renderEmail(template: ReactElement): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([
    render(template),
    render(template, { plainText: true }),
  ]);
  return { html, text };
}

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
): Promise<RenderedEmail> {
  const baseUrl = getEmailBaseUrl();
  return renderEmail(
    <JoinOurTeamNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}

export async function renderConfirmationEmail(
  data: ConfirmationEmailData,
): Promise<RenderedEmail> {
  const baseUrl = getEmailBaseUrl();
  return renderEmail(
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
): Promise<RenderedEmail> {
  const baseUrl = getEmailBaseUrl();
  return renderEmail(
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
): Promise<RenderedEmail> {
  const baseUrl = getEmailBaseUrl();
  return renderEmail(
    <RequestAProposalNotificationTemplate {...data} baseUrl={baseUrl} />,
  );
}
