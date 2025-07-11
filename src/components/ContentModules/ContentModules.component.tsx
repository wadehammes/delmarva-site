import { FeaturedServices } from "src/components/FeaturedServices/FeaturedServices.component";
import type { ContentModule } from "src/contentful/parseContentModules";

interface ContentModulesProps {
  fields: ContentModule;
}

export const ContentModules = (props: ContentModulesProps) => {
  const { fields } = props;

  switch (fields.module) {
    case "Featured Services List":
      return <FeaturedServices />;
    default:
      return null;
  }
};
