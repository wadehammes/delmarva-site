import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import type { SectionType } from "src/contentful/parseSections";

interface SectionRendererProps {
  sections: (SectionType | null)[];
  noPadding?: boolean;
  locale?: string;
}

export const SectionRenderer = (props: SectionRendererProps) => {
  const { sections, locale } = props;

  if (sections.length === 0) {
    return null;
  }

  return sections.map((section) => {
    if (!section) {
      return null;
    }

    const sectionId = `${section.slug}-${section.id}`;

    return (
      <Section id={sectionId} key={section.id} section={section}>
        {section?.content?.map((content) => {
          if (!content) {
            return null;
          }

          return (
            <ContentRenderer
              content={content}
              key={content.sys.id}
              locale={locale}
            />
          );
        })}
      </Section>
    );
  });
};
