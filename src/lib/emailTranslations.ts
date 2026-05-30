import enMessages from "src/i18n/messages/en.json";
import esMessages from "src/i18n/messages/es.json";
import { defaultLocale, type Locales, locales } from "src/i18n/routing";

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
} as const;

type ConfirmationMessages =
  (typeof messagesByLocale)["en"]["JoinOurTeamConfirmationEmail"];

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export function parseEmailLocale(value: unknown): Locales {
  if (typeof value === "string" && locales.includes(value as Locales)) {
    return value as Locales;
  }
  return defaultLocale;
}

export interface JoinOurTeamConfirmationCopy {
  bullet1: string;
  bullet2: string;
  bullet3: string;
  closing: string;
  greeting: string;
  heading: string;
  paragraphIntro: string;
  paragraphOutro: string;
  preview: string;
  sectionLabel: string;
  signoff: string;
  subject: string;
  title: string;
}

function buildConfirmationCopy(
  messages: ConfirmationMessages,
  values: { name: string; position: string },
): JoinOurTeamConfirmationCopy {
  const withPosition = { position: values.position };
  const withName = { name: values.name };

  return {
    bullet1: messages.bullet1,
    bullet2: messages.bullet2,
    bullet3: messages.bullet3,
    closing: messages.closing,
    greeting: interpolate(messages.greeting, withName),
    heading: messages.heading,
    paragraphIntro: messages.paragraphIntro,
    paragraphOutro: messages.paragraphOutro,
    preview: interpolate(messages.preview, withPosition),
    sectionLabel: messages.sectionLabel,
    signoff: messages.signoff,
    subject: interpolate(messages.subject, withPosition),
    title: messages.title,
  };
}

export function getJoinOurTeamConfirmationCopy(
  locale: Locales,
  values: { name: string; position: string },
): JoinOurTeamConfirmationCopy {
  const messages = messagesByLocale[locale].JoinOurTeamConfirmationEmail;
  return buildConfirmationCopy(messages, values);
}
