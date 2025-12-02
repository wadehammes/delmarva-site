import { draftMode } from "next/headers";
import { ServiceAccordion } from "src/components/ServiceAccordion/ServiceAccordion.component";
import { fetchProjectsByService } from "src/contentful/getProjects";
import { fetchFeaturedServices } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";

interface FeaturedServicesProps {
  locale?: string;
}

export const FeaturedServices = async (props?: FeaturedServicesProps) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

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
          locale={locale}
          projects={projects}
          service={service}
        />
      ))}
    </>
  );
};
