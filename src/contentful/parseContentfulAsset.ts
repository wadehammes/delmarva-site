import type { Asset, AssetLink } from "contentful";
import { createMediaUrl } from "src/utils/helpers";

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

  return {
    alt: asset.fields?.description || "",
    height: asset.fields.file?.details?.image?.height || 0,
    id: asset.sys.id,
    src: asset.fields.file?.url ? createMediaUrl(asset.fields.file.url) : "",
    width: asset.fields.file?.details?.image?.width || 0,
  };
}
