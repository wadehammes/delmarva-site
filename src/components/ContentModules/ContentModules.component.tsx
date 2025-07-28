import dynamic from "next/dynamic";
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

    default: {
      return null;
    }
  }
};
