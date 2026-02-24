import { Link, Section, Text } from "@react-email/components";
import type * as React from "react";
import { getEmailBaseUrl, SITE_NAME } from "src/lib/emailConstants";
import { emailTheme } from "./emailTheme";

interface EmailFooterProps {
  baseUrl?: string;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({
  baseUrl = getEmailBaseUrl(),
}) => (
  <Section style={emailTheme.footerWrapper}>
    <Text style={emailTheme.footerText}>
      <Link href={baseUrl} style={emailTheme.link}>
        {baseUrl.replace(/^https?:\/\//, "")}
      </Link>
      {" · "}
      {SITE_NAME} Site Development
    </Text>
  </Section>
);
