import type { Document } from "@contentful/rich-text-types";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  type ContentStatBlock,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import {
  parseContentfulSection,
  type SectionType,
} from "src/contentful/parseSections";
import {
  isTypeMarket,
  type TypeMarketFields,
  type TypeMarketWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export interface MarketType {
  id: string;
  marketTitle?: string;
  slug: string;
  metadataTitle?: string;
  metadataDescription?: string;
  description?: Document;
  sections?: (SectionType | null)[];
  socialImage?: ContentfulAsset | null;
  stats?: (ContentStatBlock | null)[];
  enableIndexing?: boolean;
}

const _validateMarketCheck: ContentfulTypeCheck<
  MarketType,
  TypeMarketFields,
  "id"
> = true;

export type MarketEntry =
  | TypeMarketWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentfulMarket(market: MarketEntry): MarketType | null {
  if (!market || !isTypeMarket(market)) {
    return null;
  }

  const {
    marketTitle,
    metadataTitle,
    metadataDescription,
    description,
    sections,
    socialImage,
    stats,
    enableIndexing,
    slug,
  } = market.fields;

  return {
    description,
    enableIndexing,
    id: market.sys.id,
    marketTitle,
    metadataDescription,
    metadataTitle,
    sections: sections?.map(parseContentfulSection),
    slug,
    socialImage: socialImage ? parseContentfulAsset(socialImage) : undefined,
    stats: stats?.map(parseContentStatBlock),
  };
}
