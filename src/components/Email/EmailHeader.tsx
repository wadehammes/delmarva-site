import { Img, Link, Section } from "@react-email/components";
import type * as React from "react";
import {
  EMAIL_LOGO_PATH,
  getEmailAssetBaseUrl,
  getEmailBaseUrl,
  SITE_NAME,
} from "src/lib/emailConstants";

interface EmailHeaderProps {
  baseUrl?: string;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({
  baseUrl = getEmailBaseUrl(),
}) => {
  const assetBaseUrl = getEmailAssetBaseUrl();
  const logoUrl = `${assetBaseUrl}${EMAIL_LOGO_PATH}`;
  return (
    <Section style={wrapper}>
      <Link href={baseUrl} style={link}>
        <Img
          alt={SITE_NAME}
          height={21}
          src={logoUrl}
          style={logo}
          width={115}
        />
      </Link>
    </Section>
  );
};

const wrapper = {
  paddingBottom: 12,
  paddingTop: 12,
  textAlign: "center" as const,
};

const logo = {
  display: "inline-block",
  maxWidth: "115px",
};

const link = {
  textDecoration: "none",
};
