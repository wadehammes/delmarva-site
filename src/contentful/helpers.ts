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

type ContentfulRequiredSet<TFields, TAdditionalKeys extends string> =
  | ContentfulRequiredKeys<TFields>
  | TAdditionalKeys;

type ContentfulTypeCheckMissingFields<
  TFields,
  TAdditionalKeys extends string,
  TParsedType,
> = Exclude<keyof TFields | TAdditionalKeys, keyof TParsedType | "entryTitle">;

type ContentfulTypeCheckMissingRequired<
  TFields,
  TAdditionalKeys extends string,
  TParsedType,
> = Exclude<
  ContentfulRequiredSet<TFields, TAdditionalKeys>,
  RequiredKeys<TParsedType>
>;

type ContentfulTypeCheckExtraRequired<
  TFields,
  TAdditionalKeys extends string,
  TParsedType,
> = Exclude<
  RequiredKeys<TParsedType>,
  ContentfulRequiredSet<TFields, TAdditionalKeys>
>;

export type ContentfulTypeCheck<
  TParsedType,
  TFields,
  TAdditionalKeys extends string = never,
> = [
  ContentfulTypeCheckMissingFields<TFields, TAdditionalKeys, TParsedType>,
] extends [never]
  ? [
      ContentfulTypeCheckMissingRequired<TFields, TAdditionalKeys, TParsedType>,
    ] extends [never]
    ? [
        ContentfulTypeCheckExtraRequired<TFields, TAdditionalKeys, TParsedType>,
      ] extends [never]
      ? true
      : {
          extraRequired: ContentfulTypeCheckExtraRequired<
            TFields,
            TAdditionalKeys,
            TParsedType
          >;
        }
    : {
        missingRequired: ContentfulTypeCheckMissingRequired<
          TFields,
          TAdditionalKeys,
          TParsedType
        >;
      }
  : {
      missingFields: ContentfulTypeCheckMissingFields<
        TFields,
        TAdditionalKeys,
        TParsedType
      >;
    };
