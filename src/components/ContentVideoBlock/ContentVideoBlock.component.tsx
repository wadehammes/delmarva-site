import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import type { ContentVideoBlockType } from "src/contentful/parseContentVideoBlock";
import { createMediaUrl } from "src/utils/helpers";

interface ContentVideoBlockProps {
  fields: ContentVideoBlockType;
}

export const ContentVideoBlock = (props: ContentVideoBlockProps) => {
  const { fields } = props;

  const video = fields.videoUpload?.src || fields.videoUrl;

  if (!video) {
    return null;
  }

  return (
    <VideoPlayer controls={true} rounded={true} src={createMediaUrl(video)} />
  );
};
