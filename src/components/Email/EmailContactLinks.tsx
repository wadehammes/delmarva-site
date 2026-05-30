import type * as React from "react";
import { Link, Text } from "react-email";
import { emailClasses } from "./emailClasses";
import { getPhoneDigits, hasPhone } from "./emailHelpers";

interface EmailContactLinksProps {
  email: string;
  phone: string;
}

export const EmailContactLinks: React.FC<EmailContactLinksProps> = ({
  email,
  phone,
}) => (
  <Text className={emailClasses.contact}>
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
