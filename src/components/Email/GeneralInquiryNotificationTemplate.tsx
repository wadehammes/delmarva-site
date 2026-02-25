import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { emailTheme } from "./emailTheme";

interface GeneralInquiryNotificationTemplateProps {
  baseUrl?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const GeneralInquiryNotificationTemplate: React.FC<
  GeneralInquiryNotificationTemplateProps
> = ({ baseUrl = getEmailBaseUrl(), email, message, name, phone }) => (
  <Html>
    <Head />
    <Preview>General inquiry from {name}</Preview>
    <Body style={emailTheme.main}>
      <Container style={emailTheme.container}>
        <EmailHeader baseUrl={baseUrl} />
        <Section style={emailTheme.section}>
          <Text style={emailTheme.heading}>General Inquiry</Text>
          <Text style={emailTheme.textBlock}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={emailTheme.textBlock}>
            <strong>Email:</strong>{" "}
            <Link href={`mailto:${email}`} style={emailTheme.link}>
              {email}
            </Link>
          </Text>
          <Text style={emailTheme.textBlock}>
            <strong>Phone:</strong>{" "}
            <Link href={`tel:${phone}`} style={emailTheme.link}>
              {phone}
            </Link>
          </Text>
          <Text style={emailTheme.label}>Message</Text>
          <Text style={emailTheme.textBlockLast}>{message}</Text>
        </Section>
        <EmailFooter baseUrl={baseUrl} />
      </Container>
    </Body>
  </Html>
);
