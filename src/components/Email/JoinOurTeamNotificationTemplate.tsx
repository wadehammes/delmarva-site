import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailContactLinks } from "./EmailContactLinks";
import { EmailDivider } from "./EmailDivider";
import { EmailDocumentField } from "./EmailDocumentField";
import { EmailFieldBlock } from "./EmailFieldBlock";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailHighlightedField } from "./EmailHighlightedField";
import { EmailLayout } from "./EmailLayout";
import { EmailQuickActions } from "./EmailQuickActions";
import { EmailSection } from "./EmailSection";
import { emailClasses } from "./emailClasses";
import {
  EMAIL_NO_COVER_LETTER,
  EMAIL_NO_MESSAGE,
  EMAIL_NO_RESUME,
} from "./emailDocumentConstants";
import { joinOurTeamNotificationPreviewProps } from "./emailPreviewProps";

interface JoinOurTeamNotificationTemplateProps {
  baseUrl?: string;
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

const hasAddress = (address: string) =>
  address && address !== "No address provided.";

const hasCityState = (city: string, state: string) =>
  city &&
  city !== "No city provided." &&
  state &&
  state !== "No state provided.";

const formatAddress = (
  address: string,
  city: string,
  state: string,
  zipCode: string,
): string | null => {
  if (!hasAddress(address)) return null;
  const line2 =
    hasCityState(city, state) && zipCode && zipCode !== "No zip code provided."
      ? `${city}, ${state} ${zipCode}`
      : null;
  return line2 ? `${address}, ${line2}` : address;
};

export const JoinOurTeamNotificationTemplate = ({
  baseUrl = getEmailBaseUrl(),
  name,
  email,
  phone,
  position,
  briefDescription,
  workEligibility,
  address,
  city,
  state,
  zipCode,
  coverLetter,
  resume,
}: JoinOurTeamNotificationTemplateProps) => {
  const locationLine =
    formatAddress(address, city, state, zipCode) ??
    (hasCityState(city, state) ? `${city}, ${state}` : null);
  const showAbout = briefDescription && briefDescription !== EMAIL_NO_MESSAGE;

  return (
    <EmailLayout
      preview={`New Job Application: ${name} for ${position}`}
      title="New Job Application"
    >
      <EmailHeader baseUrl={baseUrl} />
      <Heading className={emailClasses.heading}>
        New Job Application Received
      </Heading>

      <Section className={emailClasses.content}>
        <EmailSection first label="Applicant">
          <Text className={emailClasses.applicantLead}>
            {name} · {position}
          </Text>
          <EmailContactLinks
            className={emailClasses.applicantContact}
            email={email}
            phone={phone}
          />
          {locationLine && (
            <Text className={emailClasses.applicantDetail}>{locationLine}</Text>
          )}
        </EmailSection>

        {workEligibility && (
          <>
            <EmailDivider />
            <EmailHighlightedField
              label="Work eligibility"
              value={workEligibility}
            />
          </>
        )}

        {showAbout && (
          <>
            <EmailDivider />
            <EmailFieldBlock label="About">{briefDescription}</EmailFieldBlock>
          </>
        )}

        <EmailDivider />
        <EmailDocumentField
          emptyLabel={EMAIL_NO_RESUME}
          label="Resume"
          value={resume}
        />
        <EmailDocumentField
          emptyLabel={EMAIL_NO_COVER_LETTER}
          label="Cover letter"
          value={coverLetter}
        />
      </Section>

      <EmailQuickActions
        email={email}
        phone={phone}
        replySubject={`Re: Your application for ${position}`}
      />

      <EmailFooter baseUrl={baseUrl} />
    </EmailLayout>
  );
};

JoinOurTeamNotificationTemplate.PreviewProps =
  joinOurTeamNotificationPreviewProps;

export default JoinOurTeamNotificationTemplate;
