import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailContactLinks } from "./EmailContactLinks";
import { EmailDivider } from "./EmailDivider";
import { EmailFieldBlock } from "./EmailFieldBlock";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { EmailQuickActions } from "./EmailQuickActions";
import { EmailSection } from "./EmailSection";
import { emailClasses } from "./emailClasses";
import { EMAIL_NO_MESSAGE } from "./emailDocumentConstants";
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
      <EmailSection first label="From">
        <Text className={emailClasses.applicantLead}>{name}</Text>
        <EmailContactLinks
          className={emailClasses.applicantContact}
          email={email}
          phone={phone}
        />
      </EmailSection>

      {message && message !== EMAIL_NO_MESSAGE && (
        <>
          <EmailDivider />
          <EmailFieldBlock label="Message">{message}</EmailFieldBlock>
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
