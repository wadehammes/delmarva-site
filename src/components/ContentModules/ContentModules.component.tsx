import dynamic from "next/dynamic";
import { AllServicesListServer } from "src/components/AllServicesList/AllServicesListServer.component";
import { AreasServicedListServer } from "src/components/AreasServiced/AreasServicedListServer.component";
import { AreasServicedServer } from "src/components/AreasServiced/AreasServicedServer.component";
import { ContentRecentNewsList } from "src/components/ContentRecentNewsList/ContentRecentNewsList.component";
import { FeaturedServices } from "src/components/FeaturedServices/FeaturedServices.component";
import type { ContentModule } from "src/contentful/parseContentModules";

const RequestAQuoteForm = dynamic(
  () =>
    import("src/components/RequestAQuoteForm/RequestAQuoteForm.component").then(
      (mod) => mod.RequestAQuoteForm,
    ),
  { ssr: true },
);

interface ContentModulesProps {
  contentLayout?: string;
  fields: ContentModule;
  locale?: string;
}

export const ContentModules = (props: ContentModulesProps) => {
  const { contentLayout, fields, locale } = props;

  switch (fields.module) {
    case "Featured Services List": {
      return <FeaturedServices locale={locale} />;
    }
    case "Recent News List": {
      return <ContentRecentNewsList locale={locale} />;
    }
    case "Request a Quote Form": {
      return <RequestAQuoteForm />;
    }
    case "All Services List": {
      return <AllServicesListServer locale={locale} />;
    }
    case "Areas Serviced Map": {
      return (
        <AreasServicedServer contentLayout={contentLayout} locale={locale} />
      );
    }
    case "Areas Serviced List": {
      return <AreasServicedListServer locale={locale} />;
    }
    default: {
      return null;
    }
  }
};

export default ContentModules;
