import { beforeEach, describe, expect, it } from "@jest/globals";
import { EmailTemplatesPO } from "./EmailTemplates.po";

describe("EmailTemplates", () => {
  let po: EmailTemplatesPO;

  beforeEach(() => {
    po = new EmailTemplatesPO();
  });

  it("renders English join-team confirmation with spaced position and role", () => {
    po.renderJoinOurTeamConfirmation();

    expect(po.joinOurTeamConfirmationIntroText()).toBe(
      "Thanks for applying for the Project Manager role. We've received your application and will be in touch after our team reviews it.",
    );
    expect(po.documentText()).toContain("What happens next?");
    expect(po.documentText()).toContain("Hi Jane Doe,");
  });

  it("renders Spanish join-team confirmation with position before the outro period", () => {
    po.renderJoinOurTeamConfirmationEs();

    expect(po.joinOurTeamConfirmationIntroText()).toBe(
      "Gracias por postularte al puesto de Gerente de Proyecto. Hemos recibido tu solicitud y nos pondremos en contacto después de que nuestro equipo la revise.",
    );
    expect(po.documentText()).toContain("¿Qué sigue?");
  });

  it("renders join-team staff notification with applicant and role", () => {
    po.renderJoinOurTeamNotification();

    expect(po.documentText()).toContain("New Job Application Received");
    expect(po.documentText()).toContain("Jane Doe · Project Manager");
    expect(po.documentText()).toContain("jane.doe@example.com");
  });

  it("renders general inquiry notification", () => {
    po.renderGeneralInquiryNotification();

    expect(po.documentText()).toContain("Alex Rivera");
    expect(po.documentText()).toContain("alex@acme.com");
    expect(po.documentText()).toContain(
      "We are planning a new retail center and would like to discuss timeline and services.",
    );
  });

  it("renders request-a-proposal notification", () => {
    po.renderRequestAProposalNotification();

    expect(po.documentText()).toContain("Acme Development");
    expect(po.documentText()).toContain("Alex Rivera");
    expect(po.documentText()).toContain("15-acre mixed-use site");
  });
});
