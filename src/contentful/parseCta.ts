import type { Entry } from "contentful";
import {
  type PageForNavigation,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { TypeCtaFields, TypeCtaSkeleton } from "src/contentful/types";

type CtaButtonVariantType = ExtractSymbolType<
  NonNullable<TypeCtaFields["buttonVariant"]>
>;

type CtaArrowType = ExtractSymbolType<NonNullable<TypeCtaFields["arrow"]>>;

export interface CtaType {
  id: string;
  text: string;
  pageLink?: PageForNavigation | null;
  externalLink?: string;
  variant?: CtaButtonVariantType;
  arrow?: CtaArrowType;
}

export type Cta = CtaType;

const _validateCtaCheck: ContentfulTypeCheck<CtaType, TypeCtaFields, "id"> =
  true;

export type CtaEntry =
  | Entry<TypeCtaSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulCta(cta: CtaEntry): CtaType | null {
  if (!cta) {
    return null;
  }

  if (!("fields" in cta)) {
    return null;
  }

  const { arrow, externalLink, pageLink, text, buttonVariant } = cta.fields;

  return {
    arrow: arrow ?? "No Arrow",
    externalLink: externalLink ?? "",
    id: cta.sys.id,
    pageLink: pageLink ? parseContentfulPageForNavigation(pageLink) : null,
    text: text ?? "",
    variant: buttonVariant ?? "Primary",
  };
}
