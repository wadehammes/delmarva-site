import type { PageEntityType } from "src/lib/schema/types";

export const inferPageSchemaType = (slug: string): PageEntityType => {
  if (slug === "contact-us" || slug === "request-a-proposal") {
    return "ContactPage";
  }

  if (slug === "our-people") {
    return "AboutPage";
  }

  return "WebPage";
};
