import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type { ContentEntries } from "src/contentful/parseSections";
import {
  isTypeContentMarquee,
  type TypeContentMarqueeFields,
  type TypeContentMarqueeWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentMarquee";

export interface ContentMarquee {
  id: string;
  items: (ContentEntries | null)[];
}

const _validateContentMarqueeCheck: ContentfulTypeCheck<
  ContentMarquee,
  TypeContentMarqueeFields,
  "id" | "items"
> = true;

export type ContentMarqueeEntry =
  | TypeContentMarqueeWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentMarquee = (
  contentMarquee: ContentMarqueeEntry,
): ContentMarquee | null => {
  if (!contentMarquee || !isTypeContentMarquee(contentMarquee)) {
    return null;
  }

  const { items } = contentMarquee.fields;

  return {
    id: contentMarquee.sys.id,
    items: items?.map((entry) => entry as ContentEntries) ?? [],
  };
};
