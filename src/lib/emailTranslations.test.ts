import enMessages from "src/i18n/messages/en.json";
import esMessages from "src/i18n/messages/es.json";
import {
  getJoinOurTeamConfirmationCopy,
  parseEmailLocale,
} from "./emailTranslations";

const confirmationKeys = Object.keys(
  enMessages.JoinOurTeamConfirmationEmail,
).sort();

const sample = { name: "María López", position: "Project Manager" };

describe("emailTranslations", () => {
  describe("parseEmailLocale", () => {
    it("returns es when locale is es", () => {
      expect(parseEmailLocale("es")).toBe("es");
    });

    it("returns en when locale is en", () => {
      expect(parseEmailLocale("en")).toBe("en");
    });

    it("defaults to en for unknown or missing values", () => {
      expect(parseEmailLocale(undefined)).toBe("en");
      expect(parseEmailLocale(null)).toBe("en");
      expect(parseEmailLocale("fr")).toBe("en");
      expect(parseEmailLocale(42)).toBe("en");
    });
  });

  describe("getJoinOurTeamConfirmationCopy", () => {
    it("keeps en and es message keys in sync", () => {
      expect(
        Object.keys(esMessages.JoinOurTeamConfirmationEmail).sort(),
      ).toEqual(confirmationKeys);
    });

    it("interpolates English copy", () => {
      const copy = getJoinOurTeamConfirmationCopy("en", sample);

      expect(copy.greeting).toBe("Hi María López,");
      expect(copy.preview).toBe(
        "We received your application for Project Manager",
      );
      expect(copy.subject).toBe("Application Received for Project Manager");
      expect(copy.heading).toBe("Application Received");
      expect(copy.sectionLabel).toBe("What happens next?");
    });

    it("interpolates Spanish copy", () => {
      const copy = getJoinOurTeamConfirmationCopy("es", sample);

      expect(copy.greeting).toBe("Hola María López,");
      expect(copy.preview).toBe("Recibimos tu solicitud para Project Manager");
      expect(copy.subject).toBe("Solicitud recibida para Project Manager");
      expect(copy.heading).toBe("Solicitud recibida");
      expect(copy.sectionLabel).toBe("¿Qué sigue?");
      expect(copy.signoff).toBe("— El equipo de Delmarva");
    });
  });
});
