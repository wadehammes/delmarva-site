import type { Document } from "@contentful/rich-text-types";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import { type CtaType, parseContentfulCta } from "src/contentful/parseCta";
import {
  isTypeContentHero,
  type TypeContentHeroFields,
  type TypeContentHeroWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type HeroHeightType = ExtractSymbolType<
  NonNullable<TypeContentHeroFields["heroHeight"]>
>;

export const HeroHeight = {
  EightyPercent: "80% Height",
  FullScreen: "Full Screen",
  Regular: "Regular",
  Small: "Small",
} as const satisfies Record<string, HeroHeightType>;
type PlacementType = ExtractSymbolType<
  NonNullable<TypeContentHeroFields["copyPlacement"]>
>;
type DelmarvaColorsType = ExtractSymbolType<
  NonNullable<TypeContentHeroFields["overlayColor"]>
>;
type OverlayStyleType = ExtractSymbolType<
  NonNullable<TypeContentHeroFields["overlayStyle"]>
>;
type CSSColorAdjustScaleType =
  | NonNullable<TypeContentHeroFields["backgroundMediaSaturation"]>
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;

export interface ContentHero {
  entryTitle?: string;
  copy?: Document | undefined;
  cta?: CtaType | null;
  heroHeight?: HeroHeightType;
  id: string;
  copyPlacement?: PlacementType;
  backgroundMedia?: ContentfulAsset[];
  backgroundMediaSaturation?: CSSColorAdjustScaleType;
  overlayColor?: DelmarvaColorsType;
  overlayOpacity?: CSSColorAdjustScaleType;
  overlayStyle?: OverlayStyleType;
  showHeaderStyledBorder?: boolean;
}

const _validateContentHeroCheck: ContentfulTypeCheck<
  ContentHero,
  TypeContentHeroFields,
  "id"
> = true;

export type ContentHeroEntry =
  | TypeContentHeroWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentHero(entry: ContentHeroEntry): ContentHero | null {
  if (!entry || !isTypeContentHero(entry)) {
    return null;
  }

  return {
    backgroundMedia:
      entry.fields.backgroundMedia
        ?.map((asset) => parseContentfulAsset(asset))
        .filter((asset): asset is ContentfulAsset => asset !== null) ?? [],
    backgroundMediaSaturation: entry.fields
      .backgroundMediaSaturation as CSSColorAdjustScaleType,
    copy: entry.fields.copy,
    copyPlacement: entry.fields.copyPlacement as PlacementType,
    cta: entry.fields.cta ? parseContentfulCta(entry.fields.cta) : null,
    entryTitle: entry.fields.entryTitle ?? "",
    heroHeight: entry.fields.heroHeight as HeroHeightType,
    id: entry.sys.id,
    overlayColor: entry.fields.overlayColor as DelmarvaColorsType,
    overlayOpacity: entry.fields.overlayOpacity as CSSColorAdjustScaleType,
    overlayStyle: entry.fields.overlayStyle as OverlayStyleType,
    showHeaderStyledBorder: Boolean(entry.fields.showHeaderStyledBorder),
  };
}
