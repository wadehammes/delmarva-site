import type { ReactNode } from "react";
import { Heading, Section, Text } from "react-email";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailContactLinks } from "./EmailContactLinks";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { EmailQuickActions } from "./EmailQuickActions";
import { emailClasses } from "./emailClasses";
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

const FILE_ATTACHED = "File attached";
const NO_COVER_LETTER = "No cover letter provided.";
const NO_RESUME = "No resume provided.";
const NO_MESSAGE = "No message provided.";

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

function DocumentSection({
  emptyLabel,
  label,
  value,
}: {
  label: string;
  value: string;
  emptyLabel: string;
}): ReactNode {
  return (
    <>
      <Text className={emailClasses.label}>{label}</Text>
      {value === FILE_ATTACHED ? (
        <Text className={emailClasses.textBlockLast}>
          <span className={emailClasses.success}>Attached to this email</span>
        </Text>
      ) : value === emptyLabel ? (
        <Text className={emailClasses.muted}>Not provided</Text>
      ) : (
        <Text className={emailClasses.textBlockLast}>{value}</Text>
      )}
    </>
  );
}

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
  const addressLine = formatAddress(address, city, state, zipCode);
  const locationOnly =
    hasCityState(city, state) && !addressLine ? `${city}, ${state}` : null;
  const locationLine = addressLine ?? locationOnly;
  const showAbout = briefDescription && briefDescription !== NO_MESSAGE;

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
        <Text className={emailClasses.labelFirst}>Applicant</Text>
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

        {workEligibility && (
          <>
            <Text className={emailClasses.eligibilityLabel}>
              Work eligibility
            </Text>
            <Text className={emailClasses.eligibilityValue}>
              {workEligibility}
            </Text>
          </>
        )}

        {showAbout && (
          <>
            <Text className={emailClasses.label}>About</Text>
            <Text className={emailClasses.textBlockLast}>
              {briefDescription}
            </Text>
          </>
        )}

        <DocumentSection emptyLabel={NO_RESUME} label="Resume" value={resume} />
        <DocumentSection
          emptyLabel={NO_COVER_LETTER}
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
