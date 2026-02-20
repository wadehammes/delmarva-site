import {
  type PageForNavigation,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  isTypeCta,
  type TypeCtaFields,
  type TypeCtaWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type CtaButtonVariantType = ExtractSymbolType<
  NonNullable<TypeCtaFields["buttonVariant"]>
>;

type CtaArrowType = ExtractSymbolType<NonNullable<TypeCtaFields["arrow"]>>;

export interface CtaType {
  id: string;
  text: string;
  pageLink?: PageForNavigation | null;
  externalLink?: string;
  buttonVariant?: CtaButtonVariantType;
  arrow?: CtaArrowType;
}

export type Cta = CtaType;

const _validateCtaCheck: ContentfulTypeCheck<CtaType, TypeCtaFields, "id"> =
  true;

export type CtaEntry = TypeCtaWithoutUnresolvableLinksResponse | undefined;

export function parseContentfulCta(cta: CtaEntry): CtaType | null {
  if (!cta || !isTypeCta(cta)) {
    return null;
  }

  const { arrow, externalLink, pageLink, text, buttonVariant } = cta.fields;

  return {
    arrow: arrow ?? "No Arrow",
    buttonVariant: buttonVariant ?? "Primary",
    externalLink: externalLink ?? "",
    id: cta.sys.id,
    pageLink: pageLink ? parseContentfulPageForNavigation(pageLink) : null,
    text: text ?? "",
  };
}
