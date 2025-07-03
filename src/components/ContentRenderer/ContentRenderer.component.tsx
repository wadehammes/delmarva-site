import { ContentGrid } from "src/components/ContentGrid/ContentGrid.component";
import ContentHeroComponent from "src/components/ContentHero/ContentHero.component";
import { ContentModules } from "src/components/ContentModules/ContentModules.component";
import CopyBlock from "src/components/CopyBlock/CopyBlock.component";
import { Stat } from "src/components/Stat/Stat.component";
import {
  type ContentGridEntry,
  parseContentGrid,
} from "src/contentful/parseContentGrid";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import { parseContentHero } from "src/contentful/parseContentHero";
import {
  type ContentModuleEntry,
  parseContentModule,
} from "src/contentful/parseContentModules";
import {
  type ContentStatBlockEntry,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
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
    case "copyBlock": {
      const parsedCopyBlock = parseCopyBlock(content as CopyBlockEntry);

      if (!parsedCopyBlock) {
        return null;
      }

      return <CopyBlock fields={parsedCopyBlock} />;
    }
    case "contentHero": {
      const parsedHero = parseContentHero(content as ContentHeroEntry);

      if (!parsedHero) {
        return null;
      }

      return <ContentHeroComponent fields={parsedHero} />;
    }
    case "contentModules": {
      const parsedModule = parseContentModule(content as ContentModuleEntry);

      if (!parsedModule) {
        return null;
      }

      return <ContentModules fields={parsedModule} />;
    }
    case "contentGrid": {
      const parsedGrid = parseContentGrid(content as ContentGridEntry);

      if (!parsedGrid) {
        return null;
      }

      return <ContentGrid fields={parsedGrid} />;
    }
    case "contentStatBlock": {
      const parsedStatBlock = parseContentStatBlock(
        content as ContentStatBlockEntry,
      );

      if (!parsedStatBlock) {
        return null;
      }

      return <Stat stat={parsedStatBlock} />;
    }
    default:
      return null;
  }
};
