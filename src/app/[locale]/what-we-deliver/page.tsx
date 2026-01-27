import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PageComponent from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SchemaScript } from "src/components/SchemaScript/SchemaScript.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { fetchPage } from "src/contentful/getPages";
import {
  FOOTER_ID,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import {
  createPageMetadata,
  generatePageSchemaGraph,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

interface WhatWeDeliverParams {
  locale: string;
}

interface WhatWeDeliverProps {
  params: Promise<WhatWeDeliverParams>;
}

export async function generateMetadata(
  props: WhatWeDeliverProps,
): Promise<Metadata> {
  const { locale } = await props.params;

  const validLocale = await validateAndSetLocale(locale);
  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const page = await fetchPage({
    locale: validLocale,
    preview: draft.isEnabled,
    slug: SERVICES_PAGE_SLUG,
  });

  if (!page) {
    return notFound();
  }

  return createPageMetadata(page, `${envUrl()}/${SERVICES_PAGE_SLUG}`);
}

const WhatWeDeliverPage = async (props: WhatWeDeliverProps) => {
  const { locale } = await props.params;

  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const [page, navigation, footer] = await Promise.all([
    fetchPage({
      locale: validLocale,
      preview: draft.isEnabled,
      slug: "what-we-deliver",
    }),
    fetchNavigation({
      locale: validLocale,
      preview: draft.isEnabled,
      slug: NAVIGATION_ID,
    }),
    fetchFooter({
      locale: validLocale,
      preview: draft.isEnabled,
      slug: FOOTER_ID,
    }),
  ]);

  if (!page || !navigation || !footer) {
    return notFound();
  }

  const schemaGraph = await generatePageSchemaGraph(
    page,
    SERVICES_PAGE_SLUG,
    validLocale,
    draft.isEnabled,
  );

  return (
    <PageLayout footer={footer} navigation={navigation} page={page}>
      <SchemaScript schema={schemaGraph} />
      <PageComponent fields={page} locale={validLocale} />
    </PageLayout>
  );
};

export default WhatWeDeliverPage;
