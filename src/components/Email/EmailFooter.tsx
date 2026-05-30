import type * as React from "react";
import { Link, Section, Text } from "react-email";
import { getEmailBaseUrl, SITE_NAME } from "src/lib/emailConstants";
import { emailClasses } from "./emailClasses";

interface EmailFooterProps {
  baseUrl?: string;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({
  baseUrl = getEmailBaseUrl(),
}) => (
  <Section className={emailClasses.footerWrapper}>
    <Text className={emailClasses.footerText}>
      <Link className={emailClasses.link} href={baseUrl}>
        {baseUrl.replace(/^https?:\/\//, "")}
      </Link>
      {" · "}
      {SITE_NAME} Site Development
    </Text>
  </Section>
);
