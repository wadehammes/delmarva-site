export type Locales = "en" | "es";

export type ContentfulLocaleObject<T> =
  | { [x in Locales | string]: T | undefined }
  | undefined;
