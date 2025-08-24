import dynamic from "next/dynamic";
import {
  type ContentRecentNewsEntry,
  parseContentRecentNews,
} from "src/contentful/getContentRecentNews";
import type { ContentCarouselEntry } from "src/contentful/parseContentCarousel";
import { parseContentCarousel } from "src/contentful/parseContentCarousel";
import {
  type ContentCopyMediaBlockEntry,
  parseContentCopyMediaBlock,
} from "src/contentful/parseContentCopyMediaBlock";
import {
  type ContentGridEntry,
  parseContentGrid,
} from "src/contentful/parseContentGrid";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import { parseContentHero } from "src/contentful/parseContentHero";
import {
  type ContentImageBlockEntry,
  parseContentImageBlock,
} from "src/contentful/parseContentImageBlock";
import {
  type ContentModuleEntry,
  parseContentModule,
} from "src/contentful/parseContentModules";
import {
  type ContentStatBlockEntry,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import {
  type ContentTestimonialEntry,
  parseContentTestimonial,
} from "src/contentful/parseContentTestimonial";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { parseCopyBlock } from "src/contentful/parseCopyBlock";
import {
  type FormJoinOurTeamEntry,
  parseFormJoinOurTeam,
} from "src/contentful/parseFormJoinOurTeam";
import type { ContentEntries } from "src/contentful/parseSections";

const ContentCarouselComponent = dynamic(
  () =>
    import("src/components/ContentCarousel/ContentCarousel.component").then(
      (module) => ({
        default: module.ContentCarouselComponent,
      }),
    ),
  { ssr: true },
);

const CopyBlock = dynamic(
  () =>
    import("src/components/ContentCopyBlock/ContentCopyBlock.component").then(
      (module) => ({
        default: module.ContentCopyBlock,
      }),
    ),
  { ssr: true },
);

const ContentCopyMediaBlock = dynamic(
  () =>
    import(
      "src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.component"
    ).then((module) => ({
      default: module.ContentCopyMediaBlock,
    })),
  { ssr: true },
);

const ContentGrid = dynamic(
  () =>
    import("src/components/ContentGrid/ContentGrid.component").then(
      (module) => ({
        default: module.ContentGrid,
      }),
    ),
  { ssr: true },
);

const ContentHeroComponent = dynamic(
  () =>
    import("src/components/ContentHero/ContentHero.component").then(
      (module) => ({
        default: module.ContentHeroComponent,
      }),
    ),
  { ssr: true },
);

const ContentImageBlock = dynamic(
  () =>
    import("src/components/ContentImageBlock/ContentImageBlock.component").then(
      (module) => ({
        default: module.ContentImageBlock,
      }),
    ),
  { ssr: true },
);

const ContentModules = dynamic(
  () =>
    import("src/components/ContentModules/ContentModules.component").then(
      (module) => ({
        default: module.ContentModules,
      }),
    ),
  { ssr: true },
);

const ContentTestimonial = dynamic(
  () =>
    import(
      "src/components/ContentTestimonial/ContentTestimonial.component"
    ).then((module) => ({
      default: module.ContentTestimonial,
    })),
  { ssr: true },
);

const Stat = dynamic(
  () =>
    import("src/components/Stat/Stat.component").then((module) => ({
      default: module.Stat,
    })),
  { ssr: true },
);

const ContentRecentNews = dynamic(
  () =>
    import("src/components/ContentRecentNews/ContentRecentNews.component").then(
      (module) => ({
        default: module.ContentRecentNews,
      }),
    ),
  { ssr: true },
);

const JoinOurTeamForm = dynamic(
  () =>
    import("src/components/JoinOurTeamForm/JoinOurTeamForm.component").then(
      (module) => ({
        default: module.JoinOurTeam,
      }),
    ),
  { ssr: true },
);

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
    case "contentCarousel": {
      const parsedCarousel = parseContentCarousel(
        content as ContentCarouselEntry,
      );

      if (!parsedCarousel) {
        return null;
      }

      return <ContentCarouselComponent carousel={parsedCarousel} />;
    }
    case "contentCopyMediaBlock": {
      const parsedCopyMediaBlock = parseContentCopyMediaBlock(
        content as ContentCopyMediaBlockEntry,
      );

      if (!parsedCopyMediaBlock) {
        return null;
      }

      return <ContentCopyMediaBlock fields={parsedCopyMediaBlock} />;
    }
    case "contentImageBlock": {
      const parsedImageBlock = parseContentImageBlock(
        content as ContentImageBlockEntry,
      );

      if (!parsedImageBlock) {
        return null;
      }

      return <ContentImageBlock fields={parsedImageBlock} />;
    }
    case "contentTestimonial": {
      const parsedTestimonial = parseContentTestimonial(
        content as ContentTestimonialEntry,
      );

      if (!parsedTestimonial) {
        return null;
      }

      return <ContentTestimonial testimonial={parsedTestimonial} />;
    }
    case "contentRecentNews": {
      const parsedRecentNews = parseContentRecentNews(
        content as ContentRecentNewsEntry,
      );

      if (!parsedRecentNews) {
        return null;
      }

      return <ContentRecentNews recentNews={parsedRecentNews} />;
    }
    case "formJoinOurTeam": {
      const parsedForm = parseFormJoinOurTeam(content as FormJoinOurTeamEntry);

      if (!parsedForm) {
        return null;
      }

      return <JoinOurTeamForm fields={parsedForm} />;
    }
    default: {
      return null;
    }
  }
};
