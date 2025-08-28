import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface JoinOurTeamNotificationTemplateProps {
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
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Job Application Received</Heading>

        <Section style={section}>
          <Text style={text}>
            <strong>📋 Application Summary</strong>
          </Text>
          <Text style={text}>
            <strong>{name}</strong> has applied for the{" "}
            <strong>{position}</strong> position.
          </Text>
          <Text style={text}>
            <strong>Location:</strong>{" "}
            {city &&
            city !== "No city provided." &&
            state &&
            state !== "No state provided."
              ? `${city}, ${state}`
              : "Location not specified"}
          </Text>
          <Text style={text}>
            <strong>Work Eligibility:</strong> {workEligibility}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>Applicant:</strong> {name}
          </Text>
          <Text style={text}>
            <strong>Position:</strong> {position}
          </Text>
          <Text style={text}>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${email}`}
              style={{ color: colors.blue, textDecoration: "underline" }}
            >
              {email}
            </a>
          </Text>
          <Text style={text}>
            <strong>Phone:</strong>{" "}
            {phone && phone !== "No phone number provided." ? (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                style={{ color: colors.blue, textDecoration: "underline" }}
              >
                {phone}
              </a>
            ) : (
              "No phone number provided"
            )}
          </Text>
          <Text style={text}>
            <strong>Work Eligibility:</strong> {workEligibility}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>Address:</strong>
          </Text>
          <Text style={text}>
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

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>Brief Description:</strong>
          </Text>
          <Text style={text}>{briefDescription}</Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>🚀 Quick Actions</strong>
          </Text>
          <Text style={text}>
            <a
              href={`mailto:${email}?subject=Re: Your application for ${position}`}
              style={{
                color: colors.blue,
                fontWeight: "bold",
                marginRight: "20px",
                textDecoration: "underline",
              }}
            >
              📧 Reply to Applicant
            </a>
            {phone && phone !== "No phone number provided." && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                style={{
                  color: colors.blue,
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                📞 Call Applicant
              </a>
            )}
          </Text>
          <Text
            style={{
              ...text,
              color: colors.gray,
              fontSize: "14px",
              fontStyle: "italic",
            }}
          >
            Click any link above to take action immediately
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>Resume:</strong>
          </Text>
          <Text style={text}>
            {resume === "File attached" ? (
              <span style={{ color: colors.green, fontWeight: "bold" }}>
                ✓ Resume file attached to this email
              </span>
            ) : (
              resume
            )}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            <strong>Cover Letter:</strong>
          </Text>
          <Text style={text}>
            {coverLetter === "File attached" ? (
              <span style={{ color: colors.green, fontWeight: "bold" }}>
                ✓ Cover letter file attached to this email
              </span>
            ) : coverLetter === "No cover letter provided." ? (
              <span style={{ color: colors.gray, fontStyle: "italic" }}>
                No cover letter provided
              </span>
            ) : (
              coverLetter
            )}
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

// Additional color variables for the email template
const colors = {
  blue: "#007bff",
  gray: "#6c757d",
  green: "#28a745",
  orange: "#fd7e14",
};

export default JoinOurTeamNotificationTemplate;
