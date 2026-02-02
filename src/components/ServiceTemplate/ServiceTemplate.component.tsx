import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Section } from "src/components/Section/Section.component";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import styles from "src/components/ServiceTemplate/ServiceTemplate.module.css";
import type { ProjectType } from "src/contentful/getProjects";
import type { ServiceType } from "src/contentful/getServices";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";

interface ServiceTemplateProps {
  service: ServiceType;
  servicePhotos: ContentfulAsset[];
  projects: ProjectType[];
}

export const ServiceTemplate = async (props: ServiceTemplateProps) => {
  const { service, servicePhotos, projects } = props;

  return (
    <>
      <Section
        id={`service-${service.slug}-header`}
        section={{
          backgroundColor: "Black",
          contentGap: "More Gap",
          contentLayout: "2-column",
          id: `service-${service.slug}-header`,
          sectionBackgroundStyle: "Microdot",
          slug: service.slug,
        }}
      >
        <header className={styles.serviceHeader}>
          <h1 className={styles.serviceHeaderTitle}>{service.serviceName}</h1>
          <RichText document={service.description} />
        </header>
        <div className={styles.servicePhotos}>
          <Carousel>
            {servicePhotos.map((media) => (
              <ContentfulAssetRenderer asset={media} key={media.id} />
            ))}
          </Carousel>
        </div>
      </Section>
      <Section
        id={`service-${service.slug}-projects`}
        section={{
          contentLayout: "4-column",
          id: `service-${service.slug}-projects`,
          sectionEyebrow: "Projects",
          slug: service.slug,
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Section>
      {service.sections?.map((section) => {
        if (!section) {
          return null;
        }

        return <SectionRenderer key={section.id} sections={[section]} />;
      })}
    </>
  );
};
