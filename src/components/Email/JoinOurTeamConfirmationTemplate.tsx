import { Heading, Section, Text } from "react-email";
import type { Locales } from "src/i18n/routing";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import {
  getJoinOurTeamConfirmationCopy,
  type JoinOurTeamConfirmationCopy,
  parseEmailLocale,
} from "src/lib/emailTranslations";
import { EmailDivider } from "./EmailDivider";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { EmailLayout } from "./EmailLayout";
import { EmailSection } from "./EmailSection";
import { emailClasses } from "./emailClasses";
import { joinOurTeamConfirmationPreviewProps } from "./emailPreviewProps";

interface JoinOurTeamConfirmationTemplateProps {
  baseUrl?: string;
  copy?: JoinOurTeamConfirmationCopy;
  locale?: Locales | string;
  name?: string;
  position: string;
}

export const JoinOurTeamConfirmationTemplate = ({
  baseUrl = getEmailBaseUrl(),
  copy: copyProp,
  locale,
  name = "Jane Doe",
  position,
}: JoinOurTeamConfirmationTemplateProps) => {
  const copy =
    copyProp ??
    getJoinOurTeamConfirmationCopy(parseEmailLocale(locale), {
      name,
      position,
    });

  return (
    <EmailLayout preview={copy.preview} title={copy.title}>
      <EmailHeader baseUrl={baseUrl} />
      <Heading className={emailClasses.heading}>{copy.heading}</Heading>

      <Section className={emailClasses.content}>
        <Text className={emailClasses.applicantLead}>{copy.greeting}</Text>
        <Text className={emailClasses.paragraph}>
          {copy.paragraphIntro} <strong>{position}</strong>
          {copy.paragraphOutro}
        </Text>

        <EmailDivider />

        <EmailSection label={copy.sectionLabel}>
          <Text className={emailClasses.bullet}>{copy.bullet1}</Text>
          <Text className={emailClasses.bullet}>{copy.bullet2}</Text>
          <Text className={emailClasses.bulletLast}>{copy.bullet3}</Text>
        </EmailSection>

        <Text className={emailClasses.closing}>{copy.closing}</Text>
        <Text className={emailClasses.signoff}>{copy.signoff}</Text>
      </Section>

      <EmailFooter baseUrl={baseUrl} />
    </EmailLayout>
  );
};

JoinOurTeamConfirmationTemplate.PreviewProps =
  joinOurTeamConfirmationPreviewProps;

export default JoinOurTeamConfirmationTemplate;
