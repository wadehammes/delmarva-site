import { draftMode } from "next/headers";
import { fetchProjectsByService } from "src/contentful/getProjects";
import { fetchServices } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { AllServicesList } from "./AllServicesList.component";

interface AllServicesListServerProps {
  locale?: string;
}

// Server component that fetches data and passes it to the client component
export const AllServicesListServer = async (
  props?: AllServicesListServerProps,
) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const services = await fetchServices({
    locale,
    preview: draft.isEnabled,
  });

  // Fetch projects for each service
  const servicesWithProjects = await Promise.all(
    services.map(async (service) => {
      const projects = await fetchProjectsByService({
        locale: locale as Locales,
        preview: draft.isEnabled,
        serviceSlug: service.slug,
      });
      return { projects, service };
    }),
  );

  return (
    <AllServicesList
      locale={locale}
      servicesWithProjects={servicesWithProjects}
    />
  );
};
