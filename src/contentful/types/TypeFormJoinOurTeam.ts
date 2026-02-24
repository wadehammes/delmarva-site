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
  emailsToSendNotification?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypeFormJoinOurTeamSkeleton = EntrySkeletonType<
  TypeFormJoinOurTeamFields,
  "formJoinOurTeam"
>;
export type TypeFormJoinOurTeam<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFormJoinOurTeamSkeleton, Modifiers, Locales>;

export function isTypeFormJoinOurTeam<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeFormJoinOurTeam<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "formJoinOurTeam";
}

export type TypeFormJoinOurTeamWithoutLinkResolutionResponse =
  TypeFormJoinOurTeam<"WITHOUT_LINK_RESOLUTION">;
export type TypeFormJoinOurTeamWithoutUnresolvableLinksResponse =
  TypeFormJoinOurTeam<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFormJoinOurTeamWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFormJoinOurTeam<"WITH_ALL_LOCALES", Locales>;
export type TypeFormJoinOurTeamWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFormJoinOurTeam<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeFormJoinOurTeamWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFormJoinOurTeam<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
