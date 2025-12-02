import type { HTMLAttributes } from "react";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { Page } from "src/contentful/getPages";

interface PageComponentProps extends HTMLAttributes<HTMLDivElement> {
  fields: Page;
  locale?: string;
}

export const PageComponent = async (props: PageComponentProps) => {
  const { fields, children, locale } = props;
  const { sections } = fields;

  return (
    <>
      {children}
      <SectionRenderer locale={locale} sections={sections} />
    </>
  );
};

export default PageComponent;
