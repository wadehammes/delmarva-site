import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import type { SectionType } from "src/contentful/parseSections";

interface SectionRendererProps {
  locale?: string;
  noPadding?: boolean;
  searchParams?: { project?: string };
  sections: (SectionType | null)[];
}

export const SectionRenderer = (props: SectionRendererProps) => {
  const { locale, searchParams, sections } = props;

  if (sections.length === 0) {
    return null;
  }

  return sections.map((section, index) => {
    if (!section) {
      return null;
    }

    const sectionId = `${section.slug}-${section.id}`;
    const hasHero = section.content?.some(
      (c) => c?.sys?.contentType?.sys?.id === "contentHero",
    );
    const isFirstSectionWithHero = index === 0 && !!hasHero;

    return (
      <Section
        id={sectionId}
        isFirstSectionWithHero={isFirstSectionWithHero}
        key={section.id}
        section={section}
      >
        {section?.content?.map((content) => {
          if (!content) {
            return null;
          }

          return (
            <ContentRenderer
              content={content}
              contentLayout={section.contentLayout}
              key={content.sys.id}
              locale={locale}
              searchParams={searchParams}
            />
          );
        })}
      </Section>
    );
  });
};
