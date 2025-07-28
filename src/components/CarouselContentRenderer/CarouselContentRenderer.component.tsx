import dynamic from "next/dynamic";
import {
  type ContentCopyMediaBlockEntry,
  parseContentCopyMediaBlock,
} from "src/contentful/parseContentCopyMediaBlock";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import { parseContentHero } from "src/contentful/parseContentHero";
import {
  type ContentImageBlockEntry,
  parseContentImageBlock,
} from "src/contentful/parseContentImageBlock";
import {
  type ContentStatBlockEntry,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import {
  type ContentTestimonialEntry,
  parseContentTestimonial,
} from "src/contentful/parseContentTestimonial";
import {
  type ContentVideoBlockEntry,
  parseContentfulVideoBlock,
} from "src/contentful/parseContentVideoBlock";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { parseCopyBlock } from "src/contentful/parseCopyBlock";
import type { ContentEntries } from "src/contentful/parseSections";

const CopyBlock = dynamic(
  () =>
    import("src/components/ContentCopyBlock/ContentCopyBlock.component").then(
      (mod) => mod.ContentCopyBlock,
    ),
  { ssr: false },
);

const ContentHero = dynamic(
  () =>
    import("src/components/ContentHero/ContentHero.component").then(
      (mod) => mod.ContentHeroComponent,
    ),
  { ssr: false },
);

const Stat = dynamic(
  () => import("src/components/Stat/Stat.component").then((mod) => mod.Stat),
  { ssr: false },
);

const ContentCopyMediaBlock = dynamic(
  () =>
    import(
      "src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.component"
    ).then((mod) => mod.ContentCopyMediaBlock),
  { ssr: false },
);

const ContentImageBlock = dynamic(
  () =>
    import("src/components/ContentImageBlock/ContentImageBlock.component").then(
      (mod) => mod.ContentImageBlock,
    ),
  { ssr: false },
);

const ContentTestimonial = dynamic(
  () =>
    import(
      "src/components/ContentTestimonial/ContentTestimonial.component"
    ).then((mod) => mod.ContentTestimonial),
  { ssr: false },
);

const ContentVideoBlock = dynamic(
  () =>
    import("src/components/ContentVideoBlock/ContentVideoBlock.component").then(
      (mod) => mod.ContentVideoBlock,
    ),
  { ssr: false },
);

interface CarouselContentRendererProps {
  content: ContentEntries;
}

export const CarouselContentRenderer = (
  props: CarouselContentRendererProps,
) => {
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

      return <ContentHero fields={parsedHero} />;
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
    case "contentVideoBlock": {
      const parsedVideoBlock = parseContentfulVideoBlock(
        content as ContentVideoBlockEntry,
      );

      if (!parsedVideoBlock) {
        return null;
      }

      return <ContentVideoBlock fields={parsedVideoBlock} />;
    }
    default:
      return null;
  }
};
