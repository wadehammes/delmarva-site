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

interface JoinOurTeamNotificationTemplateProps {
  baseUrl?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  briefDescription: string;
  workEligibility: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coverLetter: string;
  resume: string;
}

export const JoinOurTeamNotificationTemplate: React.FC<
  JoinOurTeamNotificationTemplateProps
> = ({
  baseUrl = getEmailBaseUrl(),
  name,
  email,
  phone,
  position,
  briefDescription,
  workEligibility,
  address,
  city,
  state,
  zipCode,
  coverLetter,
  resume,
}) => (
  <Html>
    <Head />
    <Preview>
      New Job Application: {name} for {position}
    </Preview>
    <Body style={emailTheme.main}>
      <Container style={emailTheme.container}>
        <EmailHeader baseUrl={baseUrl} />
        <Heading style={emailTheme.heading}>
          New Job Application Received
        </Heading>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>📋 Application Summary</strong>
          </Text>
          <Text style={emailTheme.text}>
            <strong>{name}</strong> has applied for the{" "}
            <strong>{position}</strong> position.
          </Text>
          <Text style={emailTheme.text}>
            <strong>Location:</strong>{" "}
            {city &&
            city !== "No city provided." &&
            state &&
            state !== "No state provided."
              ? `${city}, ${state}`
              : "Location not specified"}
          </Text>
          <Text style={emailTheme.text}>
            <strong>Work Eligibility:</strong> {workEligibility}
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>Applicant:</strong> {name}
          </Text>
          <Text style={emailTheme.text}>
            <strong>Position:</strong> {position}
          </Text>
          <Text style={emailTheme.text}>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${email}`} style={emailTheme.link}>
              {email}
            </a>
          </Text>
          <Text style={emailTheme.text}>
            <strong>Phone:</strong>{" "}
            {phone && phone !== "No phone number provided." ? (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                style={emailTheme.link}
              >
                {phone}
              </a>
            ) : (
              "No phone number provided"
            )}
          </Text>
          <Text style={emailTheme.text}>
            <strong>Work Eligibility:</strong> {workEligibility}
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>Address:</strong>
          </Text>
          <Text style={emailTheme.text}>
            {address && address !== "No address provided." ? (
              <>
                {address}
                <br />
                {city &&
                city !== "No city provided." &&
                state &&
                state !== "No state provided." &&
                zipCode &&
                zipCode !== "No zip code provided."
                  ? `${city}, ${state} ${zipCode}`
                  : "Address information incomplete"}
              </>
            ) : (
              "No address provided"
            )}
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>Brief Description:</strong>
          </Text>
          <Text style={emailTheme.text}>{briefDescription}</Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>🚀 Quick Actions</strong>
          </Text>
          <Text style={emailTheme.text}>
            <a
              href={`mailto:${email}?subject=Re: Your application for ${position}`}
              style={{
                ...emailTheme.link,
                fontWeight: "bold",
                marginRight: "20px",
              }}
            >
              📧 Reply to Applicant
            </a>
            {phone && phone !== "No phone number provided." && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                style={{
                  ...emailTheme.link,
                  fontWeight: "bold",
                }}
              >
                📞 Call Applicant
              </a>
            )}
          </Text>
          <Text
            style={{
              ...emailTheme.text,
              color: emailTheme.colors.gray,
              fontStyle: "italic",
            }}
          >
            Click any link above to take action immediately
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>Resume:</strong>
          </Text>
          <Text style={emailTheme.text}>
            {resume === "File attached" ? (
              <span
                style={{ color: emailTheme.colors.green, fontWeight: "bold" }}
              >
                ✓ Resume file attached to this email
              </span>
            ) : (
              resume
            )}
          </Text>
        </Section>

        <Section style={emailTheme.section}>
          <Text style={emailTheme.text}>
            <strong>Cover Letter:</strong>
          </Text>
          <Text style={emailTheme.text}>
            {coverLetter === "File attached" ? (
              <span
                style={{ color: emailTheme.colors.green, fontWeight: "bold" }}
              >
                ✓ Cover letter file attached to this email
              </span>
            ) : coverLetter === "No cover letter provided." ? (
              <span
                style={{ color: emailTheme.colors.gray, fontStyle: "italic" }}
              >
                No cover letter provided
              </span>
            ) : (
              coverLetter
            )}
          </Text>
        </Section>
        <EmailFooter baseUrl={baseUrl} />
      </Container>
    </Body>
  </Html>
);
