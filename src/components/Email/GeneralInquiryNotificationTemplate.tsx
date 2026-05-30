import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailContactLinks } from "./EmailContactLinks";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { EmailQuickActions } from "./EmailQuickActions";
import { emailClasses } from "./emailClasses";
import { generalInquiryNotificationPreviewProps } from "./emailPreviewProps";

interface GeneralInquiryNotificationTemplateProps {
  baseUrl?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const GeneralInquiryNotificationTemplate = ({
  baseUrl = getEmailBaseUrl(),
  email,
  message,
  name,
  phone,
}: GeneralInquiryNotificationTemplateProps) => (
  <EmailLayout preview={`General inquiry from ${name}`} title="General Inquiry">
    <EmailHeader baseUrl={baseUrl} />
    <Heading className={emailClasses.heading}>General Inquiry</Heading>

    <Section className={emailClasses.content}>
      <Text className={emailClasses.lead}>{name}</Text>
      <EmailContactLinks email={email} phone={phone} />
      {message && message !== "No message provided." && (
        <>
          <Text className={emailClasses.label}>Message</Text>
          <Text className={emailClasses.textBlockLast}>{message}</Text>
        </>
      )}
    </Section>

    <EmailQuickActions
      email={email}
      phone={phone}
      replySubject={`Re: General inquiry from ${name}`}
    />

    <EmailFooter baseUrl={baseUrl} />
  </EmailLayout>
);

GeneralInquiryNotificationTemplate.PreviewProps =
  generalInquiryNotificationPreviewProps;

export default GeneralInquiryNotificationTemplate;
