import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import styles from "src/components/MarketTemplate/MarketTemplate.module.css";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
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

  return (
    <>
      <Section
        className={styles.marketHeaderSection}
        id={`market-${market.slug}-header`}
        section={{
          backgroundColor: "Black",
          contentGap: "More Gap",
          contentLayout: "2-column",
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
        <div className={styles.marketPhotos}>
          {(marketPhotos ?? []).length > 0 && (
            <Carousel autoplay>
              {(marketPhotos ?? []).map((media) => (
                <ContentfulAssetRenderer asset={media} key={media.id} />
              ))}
            </Carousel>
          )}
        </div>
      </Section>
      <Section
        id={`market-${market.slug}-projects`}
        section={{
          backgroundColor: "Black",
          contentLayout: "4-column",
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
