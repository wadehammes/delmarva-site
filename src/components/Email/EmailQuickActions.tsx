import type * as React from "react";
import { Button, Column, Row, Section } from "react-email";
import { emailClasses } from "./emailClasses";
import { getPhoneDigits, hasPhone } from "./emailHelpers";

interface EmailQuickActionsProps {
  email: string;
  phone: string;
  replySubject?: string;
}

const buttonStyle = {
  boxSizing: "border-box" as const,
  display: "block",
  textAlign: "center" as const,
  width: "100%",
};

export const EmailQuickActions: React.FC<EmailQuickActionsProps> = ({
  email,
  phone,
  replySubject,
}) => {
  const mailtoHref = replySubject
    ? `mailto:${email}?subject=${encodeURIComponent(replySubject)}`
    : `mailto:${email}`;
  const showCall = hasPhone(phone);
  const columnWidth = showCall ? "50%" : "100%";

  return (
    <Section className={emailClasses.callout}>
      <Row>
        <Column
          align="center"
          className={emailClasses.buttonCol}
          style={{ width: columnWidth }}
        >
          <Button
            className={emailClasses.button}
            href={mailtoHref}
            style={buttonStyle}
          >
            Reply
          </Button>
        </Column>
        {showCall && (
          <Column
            align="center"
            className={emailClasses.buttonCol}
            style={{ width: columnWidth }}
          >
            <Button
              className={emailClasses.button}
              href={`tel:${getPhoneDigits(phone)}`}
              style={buttonStyle}
            >
              Call
            </Button>
          </Column>
        )}
      </Row>
    </Section>
  );
};
