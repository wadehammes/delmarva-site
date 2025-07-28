export type Locales = "en" | "es";

export type ContentfulLocaleObject<T> =
  | { [x in Locales | string]: T | undefined }
  | undefined;

export enum DelmarvaColors {
  Black = "Black",
  Red = "Red",
  Silver = "Silver",
  White = "White",
}

export enum Placement {
  Center = "Center",
  LeftAligned = "Left Aligned",
  RightAligned = "Right Aligned",
}

export enum OverlayStyle {
  Microdot = "Microdot",
  SolidColor = "Solid Color",
}

export enum ContentLayout {
  FourColumn = "4-column",
  FullWidth = "Full Width",
  SingleColumn = "Single Column",
  ThreeColumn = "3-column",
  TwoColumn = "2-column",
  FiveColumn = "5-column",
  SixColumn = "6-column",
}

export enum Padding {
  LessPadding = "Less Padding",
  MorePadding = "More Padding",
  NoPadding = "No Padding",
  RegularPadding = "Regular Padding",
}

export type CSSColorAdjustScale =
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;

export enum Alignment {
  Left = "Left",
  Center = "Center",
  Right = "Right",
}
