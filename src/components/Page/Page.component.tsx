import type { HTMLAttributes } from "react";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { Page } from "src/contentful/getPages";

interface PageComponentProps extends HTMLAttributes<HTMLDivElement> {
  fields: Page;
}

export const PageComponent = async (props: PageComponentProps) => {
  const { fields, children } = props;
  const { sections } = fields;

  return (
    <PageLayout page={fields}>
      <SectionRenderer sections={sections} />
      {children}
    </PageLayout>
  );
};

export default PageComponent;
