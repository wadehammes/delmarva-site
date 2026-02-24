import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";
import { getEmailBaseUrl } from "src/lib/emailConstants";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import { emailTheme } from "./emailTheme";

interface JoinOurTeamConfirmationTemplateProps {
  baseUrl?: string;
  name: string;
  position: string;
}

export const JoinOurTeamConfirmationTemplate: React.FC<
  JoinOurTeamConfirmationTemplateProps
> = ({ baseUrl = getEmailBaseUrl(), name, position }) => (
  <Html>
    <Head />
    <Preview>We received your application for {position}</Preview>
    <Body style={emailTheme.main}>
      <Container style={emailTheme.container}>
        <EmailHeader baseUrl={baseUrl} />
        <Heading style={emailTheme.heading}>Application Received</Heading>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>Hi {name},</Text>
          <Text style={emailTheme.text}>
            Thank you for your interest in joining our team! We've received your
            application for the <strong>{position}</strong> position.
          </Text>
          <Text style={emailTheme.text}>
            Our team will review your application and get back to you soon. We
            appreciate your patience during this process.
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>What happens next?</strong>
          </Text>
          <Text style={emailTheme.text}>
            • We'll review your application and materials
            <br />• If you're a good fit, we'll reach out to schedule an
            interview
            <br />• We'll keep you updated throughout the process
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            If you have any questions about your application, feel free to reply
            to this email.
          </Text>
          <Text style={emailTheme.text}>
            Best regards,
            <br />
            The Delmarva Team
          </Text>
        </Section>

        <EmailFooter baseUrl={baseUrl} />
      </Container>
    </Body>
  </Html>
);
