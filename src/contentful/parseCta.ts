import type { Entry } from "contentful";
import { type Page, parseContentfulPage } from "src/contentful/getPages";
import type { TypeCtaSkeleton } from "src/contentful/types";

export interface Cta {
  id: string;
  text: string;
  pageLink?: Page | null;
  externalLink?: string;
}

export type CtaEntry =
  | Entry<TypeCtaSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulCta(cta: CtaEntry): Cta | null {
  if (!cta) {
    return null;
  }

  return {
    id: cta.sys.id,
    text: cta.fields.text ?? "",
    pageLink: parseContentfulPage(cta.fields.pageLink),
    externalLink: cta.fields.externalLink ?? "",
  };
}
