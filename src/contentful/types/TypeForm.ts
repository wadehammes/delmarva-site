import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFormFields {
  entryTitle?: EntryFieldTypes.Symbol;
  formType: EntryFieldTypes.Symbol<
    "General Inquiry Form" | "Request a Proposal Form"
  >;
  emailsToSendNotification: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  emailsToBcc?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypeFormSkeleton = EntrySkeletonType<TypeFormFields, "form">;
export type TypeForm<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFormSkeleton, Modifiers, Locales>;

export function isTypeForm<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeForm<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "form";
}

export type TypeFormWithoutLinkResolutionResponse =
  TypeForm<"WITHOUT_LINK_RESOLUTION">;
export type TypeFormWithoutUnresolvableLinksResponse =
  TypeForm<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFormWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeForm<"WITH_ALL_LOCALES", Locales>;
export type TypeFormWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeForm<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFormWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeForm<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
