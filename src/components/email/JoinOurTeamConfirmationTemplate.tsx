import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface JoinOurTeamConfirmationTemplateProps {
  name: string;
  position: string;
}

export const JoinOurTeamConfirmationTemplate: React.FC<
  JoinOurTeamConfirmationTemplateProps
> = ({ name, position }) => (
  <Html>
    <Head />
    <Preview>We received your application for {position}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Application Received</Heading>

        <Section style={section}>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for your interest in joining our team! We've received your
            application for the <strong>{position}</strong> position.
          </Text>
          <Text style={text}>
            Our team will review your application and get back to you soon. We
            appreciate your patience during this process.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>
          <Text style={text}>
            • We'll review your application and materials
            <br />• If you're a good fit, we'll reach out to schedule an
            interview
            <br />• We'll keep you updated throughout the process
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            If you have any questions about your application, feel free to reply
            to this email.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Delmarva Team
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={footerText}>
            <Link href="https://www.delmarvasite.com" style={link}>
              delmarvasite.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "var(--colors-white)",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "20px 0 48px",
};

const h1 = {
  color: "var(--colors-black)",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const section = {
  backgroundColor: "var(--colors-lightgray)",
  borderRadius: "8px",
  margin: "16px 0",
  padding: "24px",
};

const text = {
  color: "var(--colors-black)",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const hr = {
  borderColor: "var(--colors-silver)",
  margin: "42px 0",
};

const footerText = {
  color: "var(--colors-gray)",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  textDecoration: "underline",
};

export default JoinOurTeamConfirmationTemplate;
