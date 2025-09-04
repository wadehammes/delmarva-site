import type { Entry } from "contentful";
import {
  type ProjectType,
  parseProjectForNavigation,
} from "src/contentful/getProjects";
import {
  parseServiceForNavigation,
  type ServiceType,
} from "src/contentful/getServices";
import type { MediaBackgroundStyle } from "src/contentful/interfaces";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeContentVideoBlockSkeleton } from "src/contentful/types/TypeContentVideoBlock";

export interface ContentVideoBlockType {
  id: string;
  videoUrl?: string;
  videoBackgroundStyle?: MediaBackgroundStyle;
  videoUpload?: ContentfulAsset | null;
  services?: (Partial<ServiceType> | null)[];
  projects?: (Partial<ProjectType> | null)[];
}

export type ContentVideoBlockEntry =
  | Entry<TypeContentVideoBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulVideoBlock(
  videoBlock?: ContentVideoBlockEntry,
): ContentVideoBlockType | null {
  if (!videoBlock) {
    return null;
  }

  return {
    id: videoBlock.sys.id,
    projects: videoBlock.fields.projects?.map(parseProjectForNavigation),
    services: videoBlock.fields.services?.map(parseServiceForNavigation),
    videoBackgroundStyle: videoBlock.fields
      .videoBackgroundStyle as MediaBackgroundStyle,
    videoUpload: parseContentfulAsset(videoBlock.fields.videoUpload),
    videoUrl: videoBlock.fields.videoUrl,
  };
}
