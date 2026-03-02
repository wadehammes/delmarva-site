import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { HeaderPhotoGallery } from "src/components/HeaderPhotoGallery/HeaderPhotoGallery.component";
import styles from "src/components/MarketTemplate/MarketTemplate.module.css";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import { ProjectsCarousel } from "src/components/ProjectsCarousel/ProjectsCarousel.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Section } from "src/components/Section/Section.component";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import type { MarketType } from "src/contentful/parseMarket";
import type { Locales } from "src/i18n/routing";
import { filterSectionsByStaleRecentNews } from "src/utils/sectionVisibility";

interface MarketTemplateProps {
  locale?: Locales;
  market: MarketType;
  marketPhotos: ContentfulAsset[];
  projects: ProjectType[];
}

export const MarketTemplate = async (props: MarketTemplateProps) => {
  const { locale, market, marketPhotos, projects } = props;
  const t = await getTranslations("MarketTemplate");
  const draft = await draftMode();
  const filteredSections = await filterSectionsByStaleRecentNews(
    market.sections ?? [],
    locale ?? "en",
    draft.isEnabled,
  );

  const hasMarketPhotos = (marketPhotos ?? []).length > 0;

  return (
    <>
      <Section
        className={styles.marketHeaderSection}
        id={`market-${market.slug}-header`}
        section={{
          backgroundColor: "Black",
          contentGap: "More Gap",
          contentLayout: hasMarketPhotos ? "2-column" : "Single Column",
          id: `market-${market.slug}-header`,
          sectionBackgroundStyle: "Microdot",
          sectionPadding: "Regular Padding",
          slug: market.slug,
        }}
      >
        <header className={styles.marketHeader}>
          <p className={styles.marketHeaderEyebrow}>
            <span className={styles.marketHeaderEyebrowText}>
              {t("eyebrow")}
            </span>
          </p>
          <h1 className={styles.marketHeaderTitle}>{market.marketTitle}</h1>
          <div className={styles.marketHeaderDescription}>
            <RichText document={market.description} />
          </div>
        </header>
        {hasMarketPhotos && (
          <HeaderPhotoGallery assets={marketPhotos ?? []} autoplay />
        )}
      </Section>
      {(projects ?? []).length > 0 &&
        ((projects ?? []).length > 5 ? (
          <Section
            className={styles.marketProjectsSection}
            id={`market-${market.slug}-projects`}
            section={{
              backgroundColor: "Black",
              contentLayout: "Full Width",
              id: `market-${market.slug}-projects`,
              sectionEyebrow: t("projects"),
              sectionPadding: "Regular Padding",
              slug: market.slug,
            }}
          >
            <ProjectsCarousel projects={projects ?? []} />
          </Section>
        ) : (
          <Section
            id={`market-${market.slug}-projects`}
            section={{
              backgroundColor: "Black",
              contentLayout: "3-column",
              id: `market-${market.slug}-projects`,
              sectionEyebrow: t("projects"),
              sectionPadding: "Regular Padding",
              slug: market.slug,
            }}
          >
            {(projects ?? []).map((project) => (
              <ProjectCard key={project.id} project={project} />
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
