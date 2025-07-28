import type { Entry } from "contentful";
import {
  type PageForNavigation,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import type { TypeCtaSkeleton } from "src/contentful/types";

export interface Cta {
  id: string;
  text: string;
  pageLink?: PageForNavigation | null;
  externalLink?: string;
  variant?: "Primary" | "Secondary";
  arrow?: "No Arrow" | "Right Arrow" | "Right-Up Arrow";
}

export type CtaEntry =
  | Entry<TypeCtaSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulCta(cta: CtaEntry): Cta | null {
  if (!cta) {
    return null;
  }

  return {
    arrow: cta.fields.arrow ?? "No Arrow",
    externalLink: cta.fields.externalLink ?? "",
    id: cta.sys.id,
    pageLink: cta.fields.pageLink
      ? parseContentfulPageForNavigation(cta.fields.pageLink)
      : null,
    text: cta.fields.text ?? "",
    variant: cta.fields.buttonVariant ?? "Primary",
  };
}
