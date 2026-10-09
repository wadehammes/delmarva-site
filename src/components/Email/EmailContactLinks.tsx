import { Link, Text } from "react-email";
import { emailClasses } from "./emailClasses";
import { getPhoneDigits, hasPhone } from "./emailHelpers";

interface EmailContactLinksProps {
  className?: string;
  email: string;
  phone: string;
}

export const EmailContactLinks = ({
  className = emailClasses.applicantContact,
  email,
  phone,
}: EmailContactLinksProps) => (
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
