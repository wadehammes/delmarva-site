import { draftMode } from "next/headers";
import type { HTMLAttributes } from "react";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { Page } from "src/contentful/getPages";
import type { Locales } from "src/i18n/routing";
import { filterSectionsByStaleRecentNews } from "src/utils/sectionVisibility";

interface PageComponentProps extends HTMLAttributes<HTMLDivElement> {
  fields: Page;
  locale?: string;
}

export const PageComponent = async (props: PageComponentProps) => {
  const { fields, children, locale } = props;
  const { sections } = fields;
  const draft = await draftMode();
  const filteredSections = await filterSectionsByStaleRecentNews(
    sections,
    (locale as Locales) ?? "en",
    draft.isEnabled,
  );

  return (
    <>
      {children}
      <SectionRenderer locale={locale} sections={filteredSections} />
    </>
  );
};

export default PageComponent;
