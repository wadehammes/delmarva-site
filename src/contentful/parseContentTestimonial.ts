import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeContentTestimonialSkeleton } from "src/contentful/types/TypeContentTestimonial";

export interface ContentTestimonialType {
  id: string;
  quote: Document;
  quoterName: string;
  quoterTitle: string;
  companyLogo: ContentfulAsset | null;
  showQuoteIcon: boolean;
}

export type ContentTestimonialEntry =
  | Entry<TypeContentTestimonialSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentTestimonial = (
  testimonial: ContentTestimonialEntry,
): ContentTestimonialType | null => {
  if (!testimonial) {
    return null;
  }

  if (!("fields" in testimonial)) {
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
