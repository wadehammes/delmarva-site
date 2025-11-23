import dynamic from "next/dynamic";
import { ContentCard } from "src/components/ContentCard/ContentCard.component";
import { ContentCarouselComponent } from "src/components/ContentCarousel/ContentCarousel.component";
import { ContentCopyBlock } from "src/components/ContentCopyBlock/ContentCopyBlock.component";
import { ContentCopyMediaBlock } from "src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.component";
import { ContentGrid } from "src/components/ContentGrid/ContentGrid.component";
import { ContentHeroComponent } from "src/components/ContentHero/ContentHero.component";
import { ContentImageBlock } from "src/components/ContentImageBlock/ContentImageBlock.component";
import { ContentMarquee } from "src/components/ContentMarquee/ContentMarquee.component";
import { ContentModules } from "src/components/ContentModules/ContentModules.component";
import { ContentRecentNews } from "src/components/ContentRecentNews/ContentRecentNews.component";
import { ContentTestimonial } from "src/components/ContentTestimonial/ContentTestimonial.component";
import { Stat } from "src/components/Stat/Stat.component";

const JoinOurTeam = dynamic(
  () => import("src/components/JoinOurTeamForm/JoinOurTeamForm.component"),
  { ssr: true },
);

import {
  type ContentRecentNewsEntry,
  parseContentRecentNews,
} from "src/contentful/getContentRecentNews";
import type { ContentCardEntry } from "src/contentful/parseContentCard";
import { parseContentCard } from "src/contentful/parseContentCard";
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
  type ContentMarqueeEntry,
  parseContentMarquee,
} from "src/contentful/parseContentMarquee";
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

interface ContentRendererProps {
  content: ContentEntries;
  locale?: string;
}

export const ContentRenderer = (props: ContentRendererProps) => {
  const { content, locale } = props;

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

      return <ContentCopyBlock fields={parsedCopyBlock} />;
    }
    case "contentHero": {
      const parsedHero = parseContentHero(content as ContentHeroEntry);

      if (!parsedHero) {
        return null;
      }

      return <ContentHeroComponent fields={parsedHero} />;
    }
    case "contentMarquee": {
      const parsedMarquee = parseContentMarquee(content as ContentMarqueeEntry);

      if (!parsedMarquee) {
        return null;
      }

      return <ContentMarquee entries={parsedMarquee.items} />;
    }
    case "contentModules": {
      const parsedModule = parseContentModule(content as ContentModuleEntry);

      if (!parsedModule) {
        return null;
      }

      return <ContentModules fields={parsedModule} locale={locale} />;
    }
    case "contentGrid": {
      const parsedGrid = parseContentGrid(content as ContentGridEntry);

      if (!parsedGrid) {
        return null;
      }

      return <ContentGrid fields={parsedGrid} locale={locale} />;
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
    case "contentCard": {
      const parsedCard = parseContentCard(content as ContentCardEntry);

      if (!parsedCard) {
        return null;
      }

      return <ContentCard card={parsedCard} />;
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

      return (
        <ContentRecentNews locale={locale} recentNews={parsedRecentNews} />
      );
    }
    case "formJoinOurTeam": {
      const parsedForm = parseFormJoinOurTeam(content as FormJoinOurTeamEntry);

      if (!parsedForm) {
        return null;
      }

      return <JoinOurTeam fields={parsedForm} />;
    }
    default: {
      return null;
    }
  }
};
