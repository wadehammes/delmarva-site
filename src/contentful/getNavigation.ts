import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeNavigationSkeleton } from "src/contentful/types";

export interface Navigation {
  id: string;
  slug: string;
  links: (Cta | null)[];
  ctaButton: Cta | null;
}

export type NavigationEntry =
  | Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseNavigation(entry: NavigationEntry): Navigation | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    id: entry.sys.id,
    slug: entry.fields.slug ?? "",
    links: entry.fields.links?.map((link) => parseContentfulCta(link)) ?? [],
    ctaButton: parseContentfulCta(entry.fields.ctaButton) ?? null,
  };
}

interface FetchNavigationOptions {
  slug: string;
  locale: string;
}

export const fetchNavigation = async ({
  slug,
  locale,
}: FetchNavigationOptions) => {
  const contentful = contentfulClient({ preview: false });

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
