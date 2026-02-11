import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import { type CtaType, parseContentfulCta } from "src/contentful/parseCta";
import {
  isTypeNavigation,
  type TypeNavigationFields,
  type TypeNavigationSkeleton,
  type TypeNavigationWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export interface NavigationType {
  id: string;
  slug: string;
  links: (CtaType | null)[];
  ctaButton: CtaType | null;
}

const _validateNavigationCheck: ContentfulTypeCheck<
  NavigationType,
  TypeNavigationFields,
  "id" | "slug" | "links" | "ctaButton"
> = true;

export type NavigationEntry =
  | TypeNavigationWithoutUnresolvableLinksResponse
  | undefined;

export function parseNavigation(entry: NavigationEntry): NavigationType | null {
  if (!entry || !isTypeNavigation(entry)) {
    return null;
  }

  return {
    ctaButton: parseContentfulCta(entry.fields.ctaButton) ?? null,
    id: entry.sys.id,
    links: entry.fields.links?.map((link) => parseContentfulCta(link)) ?? [],
    slug: entry.fields.slug ?? "",
  };
}

interface FetchNavigationOptions {
  slug: string;
  locale: string;
  preview: boolean;
}

export const fetchNavigation = async ({
  slug,
  locale,
  preview,
}: FetchNavigationOptions) => {
  const contentful = contentfulClient({ preview });

  const navigationResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeNavigationSkeleton>(
      {
        content_type: "navigation",
        "fields.slug": slug,
        include: 10,
        locale,
      },
    );

  return parseNavigation(navigationResult.items[0]);
};
