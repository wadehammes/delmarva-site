export type Locales = "en" | "es";

export type ContentfulLocaleObject<T> =
  | { [x in Locales | string]: T | undefined }
  | undefined;

export enum DelmarvaColors {
  Black = "Black",
  Red = "Red",
  Silver = "Silver",
  White = "White",
  SystemDefault = "System Default",
}

export enum Placement {
  Center = "Center",
  LeftAligned = "Left Aligned",
  RightAligned = "Right Aligned",
}

export enum VerticalAlignment {
  Top = "Top",
  Center = "Center",
  Bottom = "Bottom",
  Stretch = "Stretch",
}

export enum OverlayStyle {
  Microdot = "Microdot",
  Blueprint = "Blueprint",
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
  NoTopPadding = "No Top Padding",
  NoBottomPadding = "No Bottom Padding",
  MoreTopPadding = "More Top Padding",
  LessTopPadding = "Less Top Padding",
  LessBottomPadding = "Less Bottom Padding",
  MoreBottomPadding = "More Bottom Padding",
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

export enum MediaBackgroundStyle {
  BlackBackground = "Black Background",
  Bordered = "Bordered",
  MicrodotBackground = "Microdot Background",
  None = "None",
  WhiteBackground = "White Background",
}

export enum ContentGap {
  Regular = "Regular",
  NoGap = "No Gap",
  MoreGap = "More Gap",
}
