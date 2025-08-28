import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFormJoinOurTeamFields {
  entryTitle?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  openJobs?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  formSubmitSuccessMessage: EntryFieldTypes.RichText;
}

export type TypeFormJoinOurTeamSkeleton = EntrySkeletonType<
  TypeFormJoinOurTeamFields,
  "formJoinOurTeam"
>;
export type TypeFormJoinOurTeam<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFormJoinOurTeamSkeleton, Modifiers, Locales>;
