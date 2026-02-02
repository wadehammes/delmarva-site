import type { EntryFieldTypes } from "contentful";

export type ExtractSymbolType<T> =
  T extends EntryFieldTypes.Symbol<infer U> ? U : never;

type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends { [P in K]: T[K] }
    ? never
    : K;
}[keyof T];

export type ContentfulRequiredKeys<TFields> = Exclude<
  RequiredKeys<TFields>,
  "entryTitle"
>;

type ContentfulMissingKeys<TRequired, TPresent> = Exclude<TRequired, TPresent>;

type ContentfulExtraKeys<TPresent, TAllowed> = Exclude<TPresent, TAllowed>;

type ContentfulRequiredSet<TFields, TAdditionalKeys extends string> =
  | ContentfulRequiredKeys<TFields>
  | TAdditionalKeys;

type ContentfulAllowedSet<TFields, TAdditionalKeys extends string> =
  | keyof TFields
  | TAdditionalKeys;

type ContentfulTypeCheckMissing<
  TFields,
  TAdditionalKeys extends string,
  TParsedType,
> = ContentfulMissingKeys<
  ContentfulRequiredSet<TFields, TAdditionalKeys>,
  RequiredKeys<TParsedType>
>;

type ContentfulTypeCheckExtra<
  TFields,
  TAdditionalKeys extends string,
  TParsedType,
> = ContentfulExtraKeys<
  RequiredKeys<TParsedType>,
  ContentfulAllowedSet<TFields, TAdditionalKeys>
>;

export type ContentfulTypeCheck<
  TParsedType,
  TFields,
  TAdditionalKeys extends string = never,
> = [ContentfulRequiredSet<TFields, TAdditionalKeys>] extends [never]
  ? [RequiredKeys<TParsedType>] extends [never]
    ? true
    : { extra: ContentfulTypeCheckExtra<TFields, TAdditionalKeys, TParsedType> }
  : ContentfulRequiredSet<
        TFields,
        TAdditionalKeys
      > extends RequiredKeys<TParsedType>
    ? RequiredKeys<TParsedType> extends ContentfulAllowedSet<
        TFields,
        TAdditionalKeys
      >
      ? true
      : {
          extra: ContentfulTypeCheckExtra<
            TFields,
            TAdditionalKeys,
            TParsedType
          >;
        }
    : {
        missing: ContentfulTypeCheckMissing<
          TFields,
          TAdditionalKeys,
          TParsedType
        >;
      };
