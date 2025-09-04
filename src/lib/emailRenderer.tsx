import { render } from "@react-email/render";
import { JoinOurTeamConfirmationTemplate } from "../components/email/JoinOurTeamConfirmationTemplate";
import { JoinOurTeamNotificationTemplate } from "../components/email/JoinOurTeamNotificationTemplate";
import { RequestAQuoteNotificationTemplate } from "../components/email/RequestAQuoteNotificationTemplate";

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
  return await render(<JoinOurTeamNotificationTemplate {...data} />);
}

export async function renderConfirmationEmail(
  data: ConfirmationEmailData,
): Promise<string> {
  return await render(<JoinOurTeamConfirmationTemplate {...data} />);
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
  return await render(<RequestAQuoteNotificationTemplate {...data} />);
}
