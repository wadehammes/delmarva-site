import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeNavigationSkeleton } from "src/contentful/types";

export interface NavigationType {
  id: string;
  slug: string;
  links: (Cta | null)[];
  ctaButton: Cta | null;
}

export type NavigationEntry =
  | Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseNavigation(entry: NavigationEntry): NavigationType | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
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
