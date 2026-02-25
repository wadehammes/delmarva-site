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

interface RequestAQuoteNotificationTemplateProps {
  baseUrl?: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export const RequestAQuoteNotificationTemplate: React.FC<
  RequestAQuoteNotificationTemplateProps
> = ({
  baseUrl = getEmailBaseUrl(),
  companyName,
  email,
  name,
  phone,
  projectDetails,
}) => (
  <Html>
    <Head />
    <Preview>Request for Proposal from {companyName}</Preview>
    <Body style={emailTheme.main}>
      <Container style={emailTheme.container}>
        <EmailHeader baseUrl={baseUrl} />
        <Section style={emailTheme.section}>
          <Text style={emailTheme.heading}>Request for Proposal</Text>
          <Text style={emailTheme.textBlock}>
            <strong>Company:</strong> {companyName}
          </Text>
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
          <Text style={emailTheme.label}>Project details</Text>
          <Text style={emailTheme.textBlockLast}>{projectDetails}</Text>
        </Section>
        <EmailFooter baseUrl={baseUrl} />
      </Container>
    </Body>
  </Html>
);
