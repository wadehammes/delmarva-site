import { cached } from "src/contentful/cache";
import { cacheKeys } from "src/contentful/cacheKeys";
import { contentfulClient } from "src/contentful/client";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { Locales } from "src/i18n/routing";

export const FALLBACK_PROJECT_MEDIA_ID = "1DRrYhrBzLGZhWW3BahZjY";

interface GetContentfulAssetOptions {
  locale?: Locales;
  preview?: boolean;
}

async function getContentfulAssetUncached(
  assetId: string,
  { preview = false, locale = "en" }: GetContentfulAssetOptions = {},
): Promise<ContentfulAsset | null> {
  const contentful = contentfulClient({ preview });
  try {
    const asset = await contentful.getAsset(assetId, { locale });
    return parseContentfulAsset(asset);
  } catch {
    return null;
  }
}

export async function getContentfulAsset(
  assetId: string,
  opts: GetContentfulAssetOptions = {},
): Promise<ContentfulAsset | null> {
  const { preview = false, locale = "en" } = opts;
  const { key, tags } = cacheKeys.asset(assetId, locale, preview);
  return cached({
    fn: () => getContentfulAssetUncached(assetId, { locale, preview }),
    key,
    tags,
  });
}
