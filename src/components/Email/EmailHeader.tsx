import type * as React from "react";
import { Img, Link, Section } from "react-email";
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
    <Section className="py-3 text-center">
      <Link className="no-underline" href={baseUrl}>
        <Img
          alt={SITE_NAME}
          className="mx-auto inline-block max-w-[115px]"
          height={21}
          src={logoUrl}
          width={115}
        />
      </Link>
    </Section>
  );
};
