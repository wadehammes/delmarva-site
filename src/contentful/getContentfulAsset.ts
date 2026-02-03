import { contentfulClient } from "src/contentful/client";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { Locales } from "src/i18n/routing";

export const FALLBACK_PROJECT_MEDIA_ID = "1DRrYhrBzLGZhWW3BahZjY";

interface GetContentfulAssetOptions {
  preview?: boolean;
  locale?: Locales;
}

export async function getContentfulAsset(
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
