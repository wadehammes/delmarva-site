import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface RequestAQuoteNotificationTemplateProps {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export const RequestAQuoteNotificationTemplate: React.FC<
  RequestAQuoteNotificationTemplateProps
> = ({ companyName, email, name, phone, projectDetails }) => (
  <Html>
    <Head />
    <Preview>New quote request from {companyName}</Preview>
    <Tailwind>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Inter, Arial" }}>
        <Container
          style={{ backgroundColor: "#ffffff", borderRadius: 8, padding: 24 }}
        >
          <Section>
            <Text style={{ fontSize: 20, fontWeight: 700 }}>
              New Quote Request
            </Text>
            <Hr />
            <Row>
              <Column>
                <Text>
                  <strong>Company:</strong> {companyName}
                </Text>
                <Text>
                  <strong>Name:</strong> {name}
                </Text>
                <Text>
                  <strong>Email:</strong>{" "}
                  <Link href={`mailto:${email}`}>{email}</Link>
                </Text>
                <Text>
                  <strong>Phone:</strong> {phone}
                </Text>
              </Column>
            </Row>
            <Hr />
            <Section>
              <Text style={{ fontWeight: 600 }}>Project details</Text>
              <Text>{projectDetails}</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
