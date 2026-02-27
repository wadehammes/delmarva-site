import type { Document } from "@contentful/rich-text-types";
import {
  type ProjectType,
  parseProjectForNavigation,
} from "src/contentful/getProjects";
import {
  parseServiceForNavigation,
  type ServiceType,
} from "src/contentful/getServices";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  isTypeContentImageBlock,
  type TypeContentImageBlockFields,
  type TypeContentImageBlockWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentImageBlock";

type ImageStyleType = ExtractSymbolType<
  NonNullable<TypeContentImageBlockFields["imageStyle"]>
>;

export interface ContentImageBlockType {
  id: string;
  image: ContentfulAsset | null;
  caption?: Document;
  captionPlacement: "Above" | "Below";
  imageStyle: ImageStyleType;
  imageMaxWidth?: number;
  imageMaxWidthMobile?: number;
  projects?: (Partial<ProjectType> | null)[];
  services?: (Partial<ServiceType> | null)[];
}

const _validateContentImageBlockCheck: ContentfulTypeCheck<
  ContentImageBlockType,
  TypeContentImageBlockFields,
  "id"
> = true;

export type ContentImageBlockEntry =
  | TypeContentImageBlockWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentImageBlock(
  imageBlock?: ContentImageBlockEntry,
): ContentImageBlockType | null {
  if (!imageBlock || !isTypeContentImageBlock(imageBlock)) {
    return null;
  }

  const {
    caption,
    captionPlacement,
    image,
    imageMaxWidth,
    imageMaxWidthMobile,
    imageStyle,
    projects,
    services,
  } = imageBlock.fields;

  return {
    caption,
    captionPlacement,
    id: imageBlock.sys.id,
    image: parseContentfulAsset(image),
    imageMaxWidth,
    imageMaxWidthMobile,
    imageStyle: imageStyle as ImageStyleType,
    projects: projects?.map(parseProjectForNavigation),
    services: services?.map(parseServiceForNavigation),
  };
}
