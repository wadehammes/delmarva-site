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

const formatAttachmentLine = (
  resume: string,
  coverLetter: string,
): string[] => {
  const parts: string[] = [];
  if (resume === "File attached") parts.push("Resume attached");
  else if (resume && resume !== "No resume provided.") parts.push(resume);

  if (coverLetter === "File attached") parts.push("Cover letter attached");
  else if (coverLetter && coverLetter !== "No cover letter provided.") {
    parts.push("Cover letter included");
  }

  return parts;
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
  const locationLabel = hasCityState(city, state) ? `${city}, ${state}` : null;
  const addressLine = formatAddress(address, city, state, zipCode);
  const metaParts = [locationLabel, workEligibility].filter(Boolean);
  const attachments = formatAttachmentLine(resume, coverLetter);
  const coverLetterIsText =
    coverLetter &&
    coverLetter !== "File attached" &&
    coverLetter !== "No cover letter provided.";

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
        <Text className={emailClasses.lead}>
          {name} · {position}
        </Text>
        {metaParts.length > 0 && (
          <Text className={emailClasses.meta}>{metaParts.join(" · ")}</Text>
        )}

        <EmailContactLinks email={email} phone={phone} />

        {addressLine && (
          <Text className={emailClasses.meta}>{addressLine}</Text>
        )}

        {briefDescription && briefDescription !== "No message provided." && (
          <>
            <Text className={emailClasses.label}>About</Text>
            <Text className={emailClasses.textBlockLast}>
              {briefDescription}
            </Text>
          </>
        )}

        {coverLetterIsText && (
          <>
            <Text className={emailClasses.label}>Cover letter</Text>
            <Text className={emailClasses.textBlockLast}>{coverLetter}</Text>
          </>
        )}

        {attachments.length > 0 && (
          <Text className={emailClasses.meta}>
            {attachments.map((part, index) => (
              <span key={part}>
                {index > 0 && " · "}
                {part.includes("attached") ? (
                  <span className={emailClasses.success}>{part}</span>
                ) : (
                  part
                )}
              </span>
            ))}
          </Text>
        )}
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
