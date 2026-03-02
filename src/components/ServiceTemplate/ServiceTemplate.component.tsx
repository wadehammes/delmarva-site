import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { HeaderPhotoGallery } from "src/components/HeaderPhotoGallery/HeaderPhotoGallery.component";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import { ProjectsCarousel } from "src/components/ProjectsCarousel/ProjectsCarousel.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Section } from "src/components/Section/Section.component";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import styles from "src/components/ServiceTemplate/ServiceTemplate.module.css";
import type { ProjectType } from "src/contentful/getProjects";
import type { ServiceType } from "src/contentful/getServices";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import type { Locales } from "src/i18n/routing";
import { filterSectionsByStaleRecentNews } from "src/utils/sectionVisibility";

interface ServiceTemplateProps {
  locale?: Locales;
  projects: ProjectType[];
  service: ServiceType;
  servicePhotos: ContentfulAsset[];
}

export const ServiceTemplate = async (props: ServiceTemplateProps) => {
  const { locale, service, servicePhotos, projects } = props;
  const t = await getTranslations("ServiceTemplate");
  const draft = await draftMode();
  const filteredSections = await filterSectionsByStaleRecentNews(
    service.sections ?? [],
    locale ?? "en",
    draft.isEnabled,
  );

  const hasServicePhotos = servicePhotos.length > 0;

  return (
    <>
      <Section
        className={styles.serviceHeaderSection}
        id={`service-${service.slug}-header`}
        section={{
          backgroundColor: "Black",
          contentGap: "More Gap",
          contentLayout: hasServicePhotos ? "2-column" : "Single Column",
          id: `service-${service.slug}-header`,
          sectionBackgroundStyle: "Microdot",
          sectionPadding: "Regular Padding",
          slug: service.slug,
        }}
      >
        <header className={styles.serviceHeader}>
          <p className={styles.serviceHeaderEyebrow}>
            <span className={styles.serviceHeaderEyebrowText}>
              {t("eyebrow")}
            </span>
          </p>
          <h1 className={styles.serviceHeaderTitle}>{service.serviceName}</h1>
          <div className={styles.serviceHeaderDescription}>
            <RichText document={service.description} />
          </div>
        </header>
        {hasServicePhotos && (
          <HeaderPhotoGallery assets={servicePhotos} autoplay />
        )}
      </Section>
      {projects.length > 0 &&
        (projects.length > 5 ? (
          <Section
            className={styles.serviceProjectsSection}
            id={`service-${service.slug}-projects`}
            section={{
              backgroundColor: "Black",
              contentLayout: "Full Width",
              id: `service-${service.slug}-projects`,
              sectionEyebrow: t("projects"),
              sectionPadding: "Regular Padding",
              slug: service.slug,
            }}
          >
            <ProjectsCarousel
              projects={projects}
              selectedServiceSlug={service.slug ?? undefined}
            />
          </Section>
        ) : (
          <Section
            id={`service-${service.slug}-projects`}
            section={{
              backgroundColor: "Black",
              contentLayout: "3-column",
              id: `service-${service.slug}-projects`,
              sectionEyebrow: t("projects"),
              sectionPadding: "Regular Padding",
              slug: service.slug,
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selectedServiceSlug={service.slug ?? undefined}
              />
            ))}
          </Section>
        ))}
      {filteredSections.map((section) => {
        if (!section) {
          return null;
        }

        return (
          <SectionRenderer
            key={section.id}
            locale={locale}
            sections={[section]}
          />
        );
      })}
    </>
  );
};
