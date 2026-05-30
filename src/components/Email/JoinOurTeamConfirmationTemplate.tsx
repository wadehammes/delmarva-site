import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { emailClasses } from "./emailClasses";
import { joinOurTeamConfirmationPreviewProps } from "./emailPreviewProps";

interface JoinOurTeamConfirmationTemplateProps {
  baseUrl?: string;
  name: string;
  position: string;
}

export const JoinOurTeamConfirmationTemplate = ({
  baseUrl = getEmailBaseUrl(),
  name,
  position,
}: JoinOurTeamConfirmationTemplateProps) => (
  <EmailLayout
    preview={`We received your application for ${position}`}
    title="Application Received"
  >
    <EmailHeader baseUrl={baseUrl} />
    <Heading className={emailClasses.heading}>Application Received</Heading>

    <Section className={emailClasses.content}>
      <Text className={emailClasses.lead}>Hi {name},</Text>
      <Text className={emailClasses.paragraph}>
        Thanks for applying for the <strong>{position}</strong> role. We've
        received your application and will be in touch after our team reviews
        it.
      </Text>

      <Text className={emailClasses.label}>What happens next?</Text>
      <Text className={emailClasses.bullet}>
        • We'll review your application and materials
      </Text>
      <Text className={emailClasses.bullet}>
        • If you're a good fit, we'll reach out to schedule an interview
      </Text>
      <Text className={emailClasses.bulletLast}>
        • We'll keep you updated throughout the process
      </Text>

      <Text className={emailClasses.closing}>
        Questions? Reply to this email.
      </Text>
      <Text className={emailClasses.signoff}>— The Delmarva Team</Text>
    </Section>

    <EmailFooter baseUrl={baseUrl} />
  </EmailLayout>
);

JoinOurTeamConfirmationTemplate.PreviewProps =
  joinOurTeamConfirmationPreviewProps;

export default JoinOurTeamConfirmationTemplate;
