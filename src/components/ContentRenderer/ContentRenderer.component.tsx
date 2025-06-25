import ContentHeroComponent from "src/components/ContentHero/ContentHero.component";
import CopyBlock from "src/components/CopyBlock/CopyBlock.component";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import { parseContentHero } from "src/contentful/parseContentHero";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
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
      return <CopyBlock fields={parseCopyBlock(content as CopyBlockEntry)} />;
    case "contentHero":
      return (
        <ContentHeroComponent
          fields={parseContentHero(content as ContentHeroEntry)}
        />
      );
    default:
      console.warn(`Unknown content type: ${contentType}`);
      return null;
  }
};
