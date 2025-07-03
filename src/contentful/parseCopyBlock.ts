import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { Alignment } from "src/contentful/interfaces";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeCopyBlockSkeleton } from "src/contentful/types";

// Our simplified version of an copy block entry.
// We don't need all the data that Contentful gives us.
export interface CopyBlock {
  alignment: Alignment;
  copy: Document | undefined;
  cta?: Cta | null;
  id: string;
  mobileAlignment: Alignment;
  slug: string;
}

export type CopyBlockEntry =
  | Entry<TypeCopyBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful copy block entry
export function parseCopyBlock(entry: CopyBlockEntry): CopyBlock | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    alignment: (entry.fields.alignment ?? "Left") as Alignment,
    copy: entry.fields.copy,
    cta: entry.fields.cta ? parseContentfulCta(entry.fields.cta) : null,
    id: entry.sys.id,
    mobileAlignment: (entry.fields?.mobileAlignment ?? "Left") as Alignment,
    slug: entry.fields.slug,
  };
}
