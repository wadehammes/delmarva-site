import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailContactLinks } from "./EmailContactLinks";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { EmailQuickActions } from "./EmailQuickActions";
import { emailClasses } from "./emailClasses";
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
      <Text className={emailClasses.lead}>{companyName}</Text>
      <Text className={emailClasses.meta}>{name}</Text>
      <EmailContactLinks email={email} phone={phone} />
      {projectDetails && projectDetails !== "No details provided." && (
        <>
          <Text className={emailClasses.label}>Project details</Text>
          <Text className={emailClasses.textBlockLast}>{projectDetails}</Text>
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
