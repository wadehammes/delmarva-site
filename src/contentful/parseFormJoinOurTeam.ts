import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { TypeFormJoinOurTeamSkeleton } from "src/contentful/types";

// Our simplified version of an form join our team entry.
// We don't need all the data that Contentful gives us.
export interface FormJoinOurTeam {
  id: string;
  openJobs: string[] | undefined;
  description: Document | undefined;
}

export type FormJoinOurTeamEntry =
  | Entry<TypeFormJoinOurTeamSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful form join our team entry
export function parseFormJoinOurTeam(
  entry: FormJoinOurTeamEntry,
): FormJoinOurTeam | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    description: entry.fields.description,
    id: entry.sys.id,
    openJobs: entry.fields.openJobs,
  };
}
