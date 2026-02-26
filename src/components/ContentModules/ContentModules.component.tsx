import { AllProjectsListServer } from "src/components/AllProjectsList/AllProjectsListServer.component";
import {
  AllServicesListServer,
  AreasServicedListServer,
  AreasServicedServer,
  ContentRecentNewsList,
  FeaturedServices,
} from "src/components/ContentModules/ContentModulesRegistry";
import type { ContentModule } from "src/contentful/parseContentModules";

interface ContentModulesProps {
  contentLayout?: string;
  fields: ContentModule;
  locale?: string;
  searchParams?: { project?: string };
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
    case "All Projects": {
      return <AllProjectsListServer locale={locale} />;
    }
    default: {
      return null;
    }
  }
};
