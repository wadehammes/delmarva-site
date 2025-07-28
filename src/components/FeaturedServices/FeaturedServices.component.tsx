import { draftMode } from "next/headers";
import { ServiceAccordion } from "src/components/ServiceAccordion/ServiceAccordion.component";
import { fetchProjectsByService } from "src/contentful/getProjects";
import { fetchFeaturedServices } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { getLocale } from "src/i18n/getLocale";

export const FeaturedServices = async () => {
  const draft = await draftMode();
  const locale = await getLocale();

  const services = await fetchFeaturedServices({
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
    <>
      {servicesWithProjects.map(({ service, projects }) => (
        <ServiceAccordion
          key={service.id}
          locale={locale as Locales}
          projects={projects}
          service={service}
        />
      ))}
    </>
  );
};
