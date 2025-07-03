import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  CSSColorAdjustScale,
  DelmarvaColors,
  OverlayStyle,
  Placement,
} from "src/contentful/interfaces";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeContentHeroSkeleton } from "src/contentful/types";

export enum HeroHeight {
  EightyPercent = "80% Height",
  FullScreen = "Full Screen",
  Small = "Small",
}

// Our simplified version of an copy block entry.
// We don't need all the data that Contentful gives us.
export interface ContentHero {
  entryTitle: string;
  copy: Document | undefined;
  cta?: Cta | null;
  heroHeight: HeroHeight;
  id: string;
  copyPlacement: Placement;
  backgroundMedia: ContentfulAsset[];
  backgroundMediaSaturation: CSSColorAdjustScale;
  overlayColor: DelmarvaColors;
  overlayOpacity: CSSColorAdjustScale;
  overlayStyle: OverlayStyle;
}

export type ContentHeroEntry =
  | Entry<TypeContentHeroSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentHero(entry: ContentHeroEntry): ContentHero | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    backgroundMedia:
      entry.fields.backgroundMedia
        ?.map((asset) => parseContentfulAsset(asset))
        .filter((asset): asset is ContentfulAsset => asset !== null) ?? [],
    backgroundMediaSaturation: entry.fields
      .backgroundMediaSaturation as CSSColorAdjustScale,
    copy: entry.fields.copy,
    copyPlacement: entry.fields.copyPlacement as Placement,
    cta: entry.fields.cta ? parseContentfulCta(entry.fields.cta) : null,
    entryTitle: entry.fields.entryTitle ?? "",
    heroHeight: entry.fields.heroHeight as HeroHeight,
    id: entry.sys.id,
    overlayColor: entry.fields.overlayColor as DelmarvaColors,
    overlayOpacity: entry.fields.overlayOpacity as CSSColorAdjustScale,
    overlayStyle: entry.fields.overlayStyle as OverlayStyle,
  };
}
