import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type {
  TypeFormJoinOurTeamFields,
  TypeFormJoinOurTeamSkeleton,
} from "src/contentful/types";

export interface FormJoinOurTeamType {
  id: string;
  openJobs: string[];
  description: Document | undefined;
  formSubmitSuccessMessage: Document;
}

const _validateFormJoinOurTeamCheck: ContentfulTypeCheck<
  FormJoinOurTeamType,
  TypeFormJoinOurTeamFields,
  "id" | "description" | "openJobs" | "formSubmitSuccessMessage"
> = true;

export type FormJoinOurTeamEntry =
  | Entry<TypeFormJoinOurTeamSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseFormJoinOurTeam(
  entry: FormJoinOurTeamEntry,
): FormJoinOurTeamType | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    description: entry.fields.description,
    formSubmitSuccessMessage: entry.fields.formSubmitSuccessMessage,
    id: entry.sys.id,
    openJobs: entry.fields.openJobs || [],
  };
}
