import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PageComponent from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SchemaScript } from "src/components/SchemaScript/SchemaScript.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { fetchPage } from "src/contentful/getPages";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import {
  createPageMetadata,
  generatePageSchemaGraph,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

interface HomeParams {
  locale: string;
}

interface HomeProps {
  params: Promise<HomeParams>;
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
  const { locale } = await props.params;

  const validLocale = await validateAndSetLocale(locale);
  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const page = await fetchPage({
    locale: validLocale,
    preview: draft.isEnabled,
    slug: "home",
  });

  if (!page) {
    return notFound();
  }

  return createPageMetadata(page, envUrl());
}

const Home = async (props: HomeProps) => {
  const { locale } = await props.params;

  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const page = await fetchPage({
    locale: validLocale,
    preview: draft.isEnabled,
    slug: "home",
  });

  const navigation = await fetchNavigation({
    locale: validLocale,
    preview: draft.isEnabled,
    slug: NAVIGATION_ID,
  });

  const footer = await fetchFooter({
    locale: validLocale,
    preview: draft.isEnabled,
    slug: FOOTER_ID,
  });

  if (!page || !navigation || !footer) {
    return notFound();
  }

  const schemaGraph = await generatePageSchemaGraph(
    page,
    "home",
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

export default Home;
