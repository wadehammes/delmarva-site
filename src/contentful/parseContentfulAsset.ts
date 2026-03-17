import type { Asset, AssetLink } from "contentful";
import { createMediaUrl } from "src/utils/helpers";

const CONTENTFUL_IMAGES_HOST = "images.ctfassets.net";

const withContentfulWebp = (url: string): string => {
  if (!url.includes(CONTENTFUL_IMAGES_HOST)) {
    return url;
  }

  const parsed = new URL(url);

  if (parsed.pathname.toLowerCase().endsWith(".svg")) {
    return url;
  }

  parsed.searchParams.set("fm", "webp");
  return parsed.toString();
};

export interface ContentfulAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type ContentfulAssetEntry =
  | Asset<"WITHOUT_UNRESOLVABLE_LINKS", string>
  | { sys: AssetLink };

export function parseContentfulAsset(
  asset?: ContentfulAssetEntry,
): ContentfulAsset | null {
  if (!asset) {
    return null;
  }

  if (!("fields" in asset)) {
    return null;
  }

  const url = createMediaUrl(asset.fields.file?.url ?? "");
  const webpUrl = withContentfulWebp(url);

  return {
    alt: asset.fields?.description || "",
    height: asset.fields.file?.details?.image?.height || 0,
    id: asset.sys.id,
    src: webpUrl,
    width: asset.fields.file?.details?.image?.width || 0,
  };
}
