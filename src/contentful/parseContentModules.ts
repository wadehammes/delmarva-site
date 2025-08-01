import type { Entry } from "contentful";
import type { TypeContentModulesSkeleton } from "src/contentful/types";

// Our simplified version of an copy block entry.
// We don't need all the data that Contentful gives us.
export interface ContentModule {
  id: string;
  module:
    | "Featured Services List"
    | "Join Our Team Form"
    | "Request a Quote Form"
    | "Recent News List";
}

export type ContentModuleEntry =
  | Entry<TypeContentModulesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful copy block entry
export function parseContentModule(
  entry: ContentModuleEntry,
): ContentModule | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    id: entry.sys.id,
    module: entry.fields.module,
  };
}
