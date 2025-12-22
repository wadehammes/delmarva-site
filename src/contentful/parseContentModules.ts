import type { Entry } from "contentful";
import type { TypeContentModulesSkeleton } from "src/contentful/types";

// Our simplified version of an content module entry.
// We don't need all the data that Contentful gives us.
export interface ContentModule {
  id: string;
  module:
    | "All Services List"
    | "Areas Serviced Map"
    | "Areas Serviced List"
    | "Featured Services List"
    | "Request a Quote Form"
    | "Recent News List";
}

export type ContentModuleEntry =
  | Entry<TypeContentModulesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful content module entry
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
