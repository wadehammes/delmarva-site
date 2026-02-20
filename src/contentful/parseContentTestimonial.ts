import type { Document } from "@contentful/rich-text-types";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  isTypeContentTestimonial,
  type TypeContentTestimonialFields,
  type TypeContentTestimonialWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentTestimonial";

export interface ContentTestimonialType {
  id: string;
  quote: Document;
  quoterName?: string;
  quoterTitle?: string;
  companyLogo?: ContentfulAsset | null;
  showQuoteIcon?: boolean;
}

const _validateContentTestimonialCheck: ContentfulTypeCheck<
  ContentTestimonialType,
  TypeContentTestimonialFields,
  "id"
> = true;

export type ContentTestimonialEntry =
  | TypeContentTestimonialWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentTestimonial = (
  testimonial: ContentTestimonialEntry,
): ContentTestimonialType | null => {
  if (!testimonial || !isTypeContentTestimonial(testimonial)) {
    return null;
  }

  const { quote, quoterName, quoterTitle, companyLogo, showQuoteIcon } =
    testimonial.fields;

  return {
    companyLogo: parseContentfulAsset(companyLogo) || null,
    id: testimonial.sys.id,
    quote,
    quoterName: quoterName || "",
    quoterTitle: quoterTitle || "",
    showQuoteIcon: !!showQuoteIcon,
  };
};
