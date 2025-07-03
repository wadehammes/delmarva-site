import ContentHeroComponent from "src/components/ContentHero/ContentHero.component";
import { ContentModules } from "src/components/ContentModules/ContentModules.component";
import CopyBlock from "src/components/CopyBlock/CopyBlock.component";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import { parseContentHero } from "src/contentful/parseContentHero";
import {
  type ContentModuleEntry,
  parseContentModule,
} from "src/contentful/parseContentModules";
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
    case "contentModules": {
      const parsedModule = parseContentModule(content as ContentModuleEntry);

      if (!parsedModule) {
        return null;
      }

      return <ContentModules fields={parsedModule} />;
    }
    default:
      return null;
  }
};
