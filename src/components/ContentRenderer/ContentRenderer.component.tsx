import "server-only";
import { ContentAreasServicedMapClient } from "src/components/ContentAreasServicedMap/ContentAreasServicedMapClient.component";
import { MapErrorBoundary } from "src/components/ContentAreasServicedMap/MapErrorBoundary.component";
import { ContentModules } from "src/components/ContentModules/ContentModules.component";
import {
  ContentCard,
  ContentCarouselComponent,
  ContentCopyBlock,
  ContentCopyMediaBlock,
  ContentGrid,
  ContentHeroComponent,
  ContentImageBlock,
  ContentMarquee,
  ContentRecentNews,
  ContentTestimonial,
  FormRenderer,
  JoinOurTeam,
  Stat,
} from "src/components/ContentRenderer/ContentRendererRegistry";
import {
  type ContentRecentNewsEntry,
  parseContentRecentNews,
} from "src/contentful/getContentRecentNews";
import {
  type ContentAreasServicedMapEntry,
  parseContentAreasServicedMap,
} from "src/contentful/parseContentAreasServicedMap";
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
import type { FormEntry } from "src/contentful/parseForm";
import { parseContentfulForm } from "src/contentful/parseForm";
import {
  type FormJoinOurTeamEntry,
  parseFormJoinOurTeam,
} from "src/contentful/parseFormJoinOurTeam";
import type { ContentEntries } from "src/contentful/parseSections";
import {
  isTypeContentAreasServicedMap,
  isTypeContentCard,
  isTypeContentCarousel,
  isTypeContentCopyMediaBlock,
  isTypeContentGrid,
  isTypeContentHero,
  isTypeContentImageBlock,
  isTypeContentMarquee,
  isTypeContentModules,
  isTypeContentRecentNews,
  isTypeContentStatBlock,
  isTypeContentTestimonial,
  isTypeCopyBlock,
  isTypeForm,
  isTypeFormJoinOurTeam,
} from "src/contentful/types";

interface ContentRendererProps {
  content: ContentEntries;
  contentLayout?: string;
  locale?: string;
  searchParams?: { project?: string };
}

export const ContentRenderer = (props: ContentRendererProps) => {
  const { content, contentLayout, locale, searchParams } = props;

  if (!content) {
    return null;
  }

  if (isTypeCopyBlock(content)) {
    const parsedCopyBlock = parseCopyBlock(content as CopyBlockEntry);

    if (!parsedCopyBlock) {
      return null;
    }

    return <ContentCopyBlock fields={parsedCopyBlock} />;
  }

  if (isTypeContentHero(content)) {
    const parsedHero = parseContentHero(content as ContentHeroEntry);

    if (!parsedHero) {
      return null;
    }

    return <ContentHeroComponent fields={parsedHero} />;
  }

  if (isTypeContentMarquee(content)) {
    const parsedMarquee = parseContentMarquee(content as ContentMarqueeEntry);

    if (!parsedMarquee) {
      return null;
    }

    return (
      <ContentMarquee
        entries={parsedMarquee.items ?? []}
        searchParams={searchParams}
      />
    );
  }

  if (isTypeContentAreasServicedMap(content)) {
    const parsedMap = parseContentAreasServicedMap(
      content as ContentAreasServicedMapEntry,
    );

    if (!parsedMap) {
      return null;
    }

    return (
      <MapErrorBoundary>
        <ContentAreasServicedMapClient fields={parsedMap} />
      </MapErrorBoundary>
    );
  }

  if (isTypeContentModules(content)) {
    const parsedModule = parseContentModule(content as ContentModuleEntry);

    if (!parsedModule) {
      return null;
    }

    return (
      <MapErrorBoundary>
        <ContentModules
          contentLayout={contentLayout}
          fields={parsedModule}
          locale={locale}
          searchParams={searchParams}
        />
      </MapErrorBoundary>
    );
  }

  if (isTypeContentGrid(content)) {
    const parsedGrid = parseContentGrid(content as ContentGridEntry);

    if (!parsedGrid) {
      return null;
    }

    return (
      <ContentGrid
        fields={parsedGrid}
        locale={locale}
        searchParams={searchParams}
      />
    );
  }

  if (isTypeContentStatBlock(content)) {
    const parsedStatBlock = parseContentStatBlock(
      content as ContentStatBlockEntry,
    );

    if (!parsedStatBlock) {
      return null;
    }

    return <Stat stat={parsedStatBlock} />;
  }

  if (isTypeContentCarousel(content)) {
    const parsedCarousel = parseContentCarousel(
      content as ContentCarouselEntry,
    );

    if (!parsedCarousel) {
      return null;
    }

    return <ContentCarouselComponent carousel={parsedCarousel} />;
  }

  if (isTypeContentCard(content)) {
    const parsedCard = parseContentCard(content as ContentCardEntry);

    if (!parsedCard) {
      return null;
    }

    return <ContentCard card={parsedCard} />;
  }

  if (isTypeContentCopyMediaBlock(content)) {
    const parsedCopyMediaBlock = parseContentCopyMediaBlock(
      content as ContentCopyMediaBlockEntry,
    );

    if (!parsedCopyMediaBlock) {
      return null;
    }

    return <ContentCopyMediaBlock fields={parsedCopyMediaBlock} />;
  }

  if (isTypeContentImageBlock(content)) {
    const parsedImageBlock = parseContentImageBlock(
      content as ContentImageBlockEntry,
    );

    if (!parsedImageBlock) {
      return null;
    }

    return <ContentImageBlock fields={parsedImageBlock} />;
  }

  if (isTypeContentTestimonial(content)) {
    const parsedTestimonial = parseContentTestimonial(
      content as ContentTestimonialEntry,
    );

    if (!parsedTestimonial) {
      return null;
    }

    return <ContentTestimonial testimonial={parsedTestimonial} />;
  }

  if (isTypeContentRecentNews(content)) {
    const parsedRecentNews = parseContentRecentNews(
      content as ContentRecentNewsEntry,
    );

    if (!parsedRecentNews) {
      return null;
    }

    return <ContentRecentNews locale={locale} recentNews={parsedRecentNews} />;
  }

  if (isTypeFormJoinOurTeam(content)) {
    const parsedForm = parseFormJoinOurTeam(content as FormJoinOurTeamEntry);

    if (!parsedForm) {
      return null;
    }

    return <JoinOurTeam fields={parsedForm} />;
  }

  if (isTypeForm(content)) {
    const parsedForm = parseContentfulForm(content as FormEntry);

    if (!parsedForm) {
      return null;
    }

    return <FormRenderer fields={parsedForm} />;
  }

  return null;
};
