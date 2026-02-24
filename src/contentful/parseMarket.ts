import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  isTypeMarket,
  type TypeMarketFields,
  type TypeMarketWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export interface MarketType {
  id: string;
  marketTitle?: string;
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

  const { marketTitle } = market.fields;

  return {
    id: market.sys.id,
    marketTitle,
  };
}
