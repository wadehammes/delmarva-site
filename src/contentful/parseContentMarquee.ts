import type { Entry } from "contentful";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type { ContentEntries } from "src/contentful/parseSections";
import type {
  TypeContentMarqueeFields,
  TypeContentMarqueeSkeleton,
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
  | Entry<TypeContentMarqueeSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentMarquee = (
  contentMarquee: ContentMarqueeEntry,
): ContentMarquee | null => {
  if (!contentMarquee) {
    return null;
  }

  if (!("fields" in contentMarquee)) {
    return null;
  }

  const { items } = contentMarquee.fields;

  return {
    id: contentMarquee.sys.id,
    items: items?.map((entry) => entry as ContentEntries) ?? [],
  };
};
