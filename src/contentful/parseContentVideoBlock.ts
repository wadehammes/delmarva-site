import type { Entry } from "contentful";
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
import type {
  TypeContentVideoBlockFields,
  TypeContentVideoBlockSkeleton,
} from "src/contentful/types/TypeContentVideoBlock";

type VideoBackgroundStyleType = ExtractSymbolType<
  NonNullable<TypeContentVideoBlockFields["videoBackgroundStyle"]>
>;

export interface ContentVideoBlockType {
  id: string;
  videoUrl?: string;
  videoBackgroundStyle?: VideoBackgroundStyleType;
  videoUpload?: ContentfulAsset | null;
  services?: (Partial<ServiceType> | null)[];
  projects?: (Partial<ProjectType> | null)[];
}

const _validateContentVideoBlockCheck: ContentfulTypeCheck<
  ContentVideoBlockType,
  TypeContentVideoBlockFields,
  "id"
> = true;

export type ContentVideoBlockEntry =
  | Entry<TypeContentVideoBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulVideoBlock(
  videoBlock?: ContentVideoBlockEntry,
): ContentVideoBlockType | null {
  if (!videoBlock) {
    return null;
  }

  if (!("fields" in videoBlock)) {
    return null;
  }

  const { projects, services, videoBackgroundStyle, videoUpload, videoUrl } =
    videoBlock.fields;

  return {
    id: videoBlock.sys.id,
    projects: projects?.map(parseProjectForNavigation),
    services: services?.map(parseServiceForNavigation),
    videoBackgroundStyle: videoBackgroundStyle as VideoBackgroundStyleType,
    videoUpload: parseContentfulAsset(videoUpload),
    videoUrl,
  };
}
