import dynamic from "next/dynamic";
import { AreasServiced } from "src/components/AreasServiced/AreasServiced.component";
import type { ContentModule } from "src/contentful/parseContentModules";

const FeaturedServices = dynamic(
  () =>
    import("src/components/FeaturedServices/FeaturedServices.component").then(
      (module) => ({
        default: module.FeaturedServices,
      }),
    ),
  { ssr: true },
);

const ContentRecentNewsList = dynamic(
  () =>
    import(
      "src/components/ContentRecentNewsList/ContentRecentNewsList.component"
    ).then((module) => ({
      default: module.ContentRecentNewsList,
    })),
  { ssr: true },
);

const RequestAQuoteForm = dynamic(
  () =>
    import("src/components/RequestAQuoteForm/RequestAQuoteForm.component").then(
      (module) => ({
        default: module.RequestAQuoteForm,
      }),
    ),
  { ssr: true },
);

const AllServicesListServer = dynamic(
  () =>
    import(
      "src/components/AllServicesList/AllServicesListServer.component"
    ).then((module) => ({
      default: module.AllServicesListServer,
    })),
  { ssr: true },
);

const _AreasServicedMap = dynamic(
  () =>
    import("src/components/AreasServiced/AreasServiced.component").then(
      (module) => ({
        default: module.AreasServiced,
      }),
    ),
  { ssr: true },
);

interface ContentModulesProps {
  fields: ContentModule;
}

export const ContentModules = (props: ContentModulesProps) => {
  const { fields } = props;

  switch (fields.module) {
    case "Featured Services List": {
      return <FeaturedServices />;
    }
    case "Recent News List": {
      return <ContentRecentNewsList />;
    }
    case "Request a Quote Form": {
      return <RequestAQuoteForm />;
    }
    case "All Services List": {
      return <AllServicesListServer />;
    }
    case "Areas Serviced Map": {
      return <AreasServiced zipCodes={["20772"]} />;
    }
    default: {
      return null;
    }
  }
};

export default ContentModules;
