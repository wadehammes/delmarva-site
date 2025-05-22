import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import type { SectionType } from "src/contentful/parseSections";

interface SectionRendererProps {
  sections: (SectionType | null)[];
  noPadding?: boolean;
}

export const SectionRenderer = (props: SectionRendererProps) => {
  const { sections } = props;

  if (sections.length === 0) {
    return null;
  }

  return sections.map((section) => {
    if (!section) {
      return null;
    }

    const sectionId = `${section.slug}-${section.id}`;

    return (
      <Section key={section.id} id={sectionId} section={section}>
        {section?.content?.map((content) => {
          if (!content) {
            return null;
          }

          return <ContentRenderer key={content.sys.id} content={content} />;
        })}
      </Section>
    );
  });
};
