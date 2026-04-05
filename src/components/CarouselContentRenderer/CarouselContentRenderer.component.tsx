"use client";

import {
  ContentCopyBlock,
  ContentCopyMediaBlock,
  ContentHeroComponent,
  ContentImageBlock,
  ContentTestimonial,
  ContentVideoBlock,
  Stat,
} from "src/components/CarouselContentRenderer/CarouselContentRendererRegistry";
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
import {
  isTypeContentCopyMediaBlock,
  isTypeContentHero,
  isTypeContentImageBlock,
  isTypeContentStatBlock,
  isTypeContentTestimonial,
  isTypeContentVideoBlock,
  isTypeCopyBlock,
} from "src/contentful/types";

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

  if (isTypeContentStatBlock(content)) {
    const parsedStatBlock = parseContentStatBlock(
      content as ContentStatBlockEntry,
    );

    if (!parsedStatBlock) {
      return null;
    }

    return <Stat stat={parsedStatBlock} />;
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

  if (isTypeContentVideoBlock(content)) {
    const parsedVideoBlock = parseContentfulVideoBlock(
      content as ContentVideoBlockEntry,
    );

    if (!parsedVideoBlock) {
      return null;
    }

    return <ContentVideoBlock fields={parsedVideoBlock} />;
  }

  return null;
};
