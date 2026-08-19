import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLdScript } from "src/components/Page/JsonLdScript.component";
import { PageComponent } from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { fetchPage } from "src/contentful/getPages";
import { routing } from "src/i18n/routing";
import {
  FOOTER_ID,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
} from "src/utils/constants";
import { createPageMetadata } from "src/utils/metadata.helpers";
import {
  generatePageSchemaGraph,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

export const revalidate = 2592000;

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

interface WhatWeDeliverParams {
  locale: string;
}

interface WhatWeDeliverProps {
  params: Promise<WhatWeDeliverParams>;
}

export const generateMetadata = async (
  props: WhatWeDeliverProps,
): Promise<Metadata> => {
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

  return createPageMetadata(page, validLocale, {
    path: SERVICES_PAGE_SLUG,
  });
};

const WhatWeDeliverPage = async (props: WhatWeDeliverProps) => {
  try {
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
        {schemaGraph ? (
          <JsonLdScript id="schema-structured-data" json={schemaGraph} />
        ) : null}
        <PageComponent fields={page} locale={validLocale} />
      </PageLayout>
    );
  } catch (error) {
    console.error(
      "[what-we-deliver] Render failed:",
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined,
    );
    throw error;
  }
};

export default WhatWeDeliverPage;
