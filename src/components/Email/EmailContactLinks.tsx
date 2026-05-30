import type * as React from "react";
import { Link, Text } from "react-email";
import { emailClasses } from "./emailClasses";
import { getPhoneDigits, hasPhone } from "./emailHelpers";

interface EmailContactLinksProps {
  className?: string;
  email: string;
  phone: string;
}

export const EmailContactLinks: React.FC<EmailContactLinksProps> = ({
  className = emailClasses.contact,
  email,
  phone,
}) => (
  <Text className={className}>
    <Link className={emailClasses.link} href={`mailto:${email}`}>
      {email}
    </Link>
    {hasPhone(phone) && (
      <>
        {" · "}
        <Link
          className={emailClasses.link}
          href={`tel:${getPhoneDigits(phone)}`}
        >
          {phone}
        </Link>
      </>
    )}
  </Text>
);
