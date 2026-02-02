"use client";

import { ServiceAccordion } from "src/components/ServiceAccordion/ServiceAccordion.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ServiceType } from "src/contentful/getServices";
import type { Locales } from "src/i18n/routing";

// Client component that receives data as props
interface AllServicesListProps {
  servicesWithProjects: Array<{
    projects: ProjectType[];
    service: ServiceType;
  }>;
  locale: Locales;
}

export const AllServicesList = ({
  servicesWithProjects,
  locale,
}: AllServicesListProps) => {
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
