import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeFooterSkeleton } from "src/contentful/types";

export interface FooterType {
  id: string;
  slug?: string;
  copyright?: string;
  addresscompanyInfo?: Document;
  links?: (Cta | null)[];
  linksTitle?: string;
  linkedInUrl?: string;
}

export type FooterEntry =
  | Entry<TypeFooterSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseFooter(entry: FooterEntry): FooterType | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    addresscompanyInfo: entry.fields.addresscompanyInfo,
    copyright: entry.fields.copyright,
    id: entry.sys.id,
    linkedInUrl: entry.fields.linkedInUrl ?? "",
    links: entry.fields.links?.map((link) => parseContentfulCta(link)) ?? [],
    linksTitle: entry.fields.linksTitle ?? "",
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
