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
import { EMAIL_NO_DETAILS } from "./emailDocumentConstants";
import { requestAProposalNotificationPreviewProps } from "./emailPreviewProps";

interface RequestAProposalNotificationTemplateProps {
  baseUrl?: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export const RequestAProposalNotificationTemplate = ({
  baseUrl = getEmailBaseUrl(),
  companyName,
  email,
  name,
  phone,
  projectDetails,
}: RequestAProposalNotificationTemplateProps) => (
  <EmailLayout
    preview={`Request for Proposal from ${companyName}`}
    title="Request for Proposal"
  >
    <EmailHeader baseUrl={baseUrl} />
    <Heading className={emailClasses.heading}>Request for Proposal</Heading>

    <Section className={emailClasses.content}>
      <EmailSection first label="Client">
        <Text className={emailClasses.applicantLead}>
          {companyName} · {name}
        </Text>
        <EmailContactLinks
          className={emailClasses.applicantContact}
          email={email}
          phone={phone}
        />
      </EmailSection>

      {projectDetails && projectDetails !== EMAIL_NO_DETAILS && (
        <>
          <EmailDivider />
          <EmailFieldBlock label="Project details">
            {projectDetails}
          </EmailFieldBlock>
        </>
      )}
    </Section>

    <EmailQuickActions
      email={email}
      phone={phone}
      replySubject={`Re: Proposal request from ${companyName}`}
    />

    <EmailFooter baseUrl={baseUrl} />
  </EmailLayout>
);

RequestAProposalNotificationTemplate.PreviewProps =
  requestAProposalNotificationPreviewProps;

export default RequestAProposalNotificationTemplate;
