import type { Document } from "@contentful/rich-text-types";
import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import { type CtaType, parseContentfulCta } from "src/contentful/parseCta";
import {
  isTypeFooter,
  type TypeFooterFields,
  type TypeFooterSkeleton,
  type TypeFooterWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export interface FooterType {
  id: string;
  slug?: string;
  copyright?: string;
  addresscompanyInfo?: Document;
  links?: (CtaType | null)[];
  linksTitle?: string;
  linkedInUrl?: string;
  otherLinks?: (CtaType | null)[];
  otherLinksTitle?: string;
}

const _validateFooterCheck: ContentfulTypeCheck<
  FooterType,
  TypeFooterFields,
  "id"
> = true;

export type FooterEntry =
  | TypeFooterWithoutUnresolvableLinksResponse
  | undefined;

export function parseFooter(entry: FooterEntry): FooterType | null {
  if (!entry || !isTypeFooter(entry)) {
    return null;
  }

  return {
    addresscompanyInfo: entry.fields.addresscompanyInfo,
    copyright: entry.fields.copyright,
    id: entry.sys.id,
    linkedInUrl: entry.fields.linkedInUrl ?? "",
    links: entry.fields.links?.map((link) => parseContentfulCta(link)) ?? [],
    linksTitle: entry.fields.linksTitle ?? "",
    otherLinks:
      entry.fields.otherLinks?.map((link) => parseContentfulCta(link)) ?? [],
    otherLinksTitle: entry.fields.otherLinksTitle ?? "",
    slug: entry.fields.slug ?? "",
  };
}

interface FetchFooterOptions {
  slug: string;
  locale: string;
  preview: boolean;
}

export const fetchFooter = async ({
  slug,
  locale,
  preview,
}: FetchFooterOptions) => {
  const contentful = contentfulClient({ preview });

  const footerResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeFooterSkeleton>({
      content_type: "footer",
      "fields.slug": slug,
      include: 10,
      locale,
    });

  return parseFooter(footerResult.items[0]);
};
