import { draftMode } from "next/headers";
import { fetchProjectsByService } from "src/contentful/getProjects";
import { fetchServices } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { getLocale } from "src/i18n/getLocale";
import { AllServicesList } from "./AllServicesList.component";

// Server component that fetches data and passes it to the client component
export const AllServicesListServer = async () => {
  const draft = await draftMode();
  const locale = await getLocale();

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
      locale={locale as Locales}
      servicesWithProjects={servicesWithProjects}
    />
  );
};
