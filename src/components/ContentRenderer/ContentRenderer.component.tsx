import CopyBlock from "src/components/CopyBlock/CopyBlock.component";
import { parseCopyBlock } from "src/contentful/parseCopyBlock";
import type { ContentEntries } from "src/contentful/parseSections";

interface ContentRendererProps {
  content: ContentEntries;
}

export const ContentRenderer = (props: ContentRendererProps) => {
  const { content } = props;

  if (!content) {
    return null;
  }

  const contentType = content.sys.contentType.sys.id;

  switch (contentType) {
    case "copyBlock":
      return <CopyBlock fields={parseCopyBlock(content)} />;
    default:
      console.warn(`Unknown content type: ${contentType}`);
      return null;
  }
};
