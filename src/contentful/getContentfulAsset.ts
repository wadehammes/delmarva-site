import { unstable_cache } from "next/cache";
import { contentfulClient } from "src/contentful/client";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { Locales } from "src/i18n/routing";
import { REVALIDATE_SECONDS } from "src/utils/constants";

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

const getCachedAsset = unstable_cache(
  (assetId: string, locale: string) =>
    getContentfulAssetUncached(assetId, {
      locale: locale as Locales,
      preview: false,
    }),
  ["asset"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getContentfulAsset(
  assetId: string,
  opts: GetContentfulAssetOptions = {},
): Promise<ContentfulAsset | null> {
  const { preview = false, locale = "en" } = opts;
  return preview
    ? getContentfulAssetUncached(assetId, opts)
    : getCachedAsset(assetId, locale as string);
}
