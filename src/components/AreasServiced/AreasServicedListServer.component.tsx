import { draftMode } from "next/headers";
import { fetchServices } from "src/contentful/getServices";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { parseServicesToServiceAreas } from "src/utils/serviceAreaUtils";
import { AreasServicedList } from "./AreasServicedList.component";

interface AreasServicedListServerProps {
  className?: string;
  locale?: string;
}

/**
 * Server component that fetches services from Contentful and passes them to AreasServicedList
 */
export const AreasServicedListServer = async (
  props?: AreasServicedListServerProps,
) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const services = await fetchServices({
    locale,
    preview: draft.isEnabled,
  });

  const serviceAreas = await parseServicesToServiceAreas(services);

  const sortedServiceAreas = serviceAreas
    .map((area) => ({
      ...area,
      counties: [...area.counties].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      ),
    }))
    .sort((a, b) => a.serviceName.localeCompare(b.serviceName));

  return (
    <AreasServicedList
      className={props?.className}
      serviceAreas={sortedServiceAreas}
    />
  );
};
