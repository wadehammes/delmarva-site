"use client";

import { MarketAccordion } from "src/components/MarketAccordion/MarketAccordion.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { MarketType } from "src/contentful/parseMarket";
import type { Locales } from "src/i18n/routing";
import styles from "./AllMarketsList.module.css";

interface AllMarketsListProps {
  locale: Locales;
  marketsWithProjects: Array<{
    market: MarketType;
    projects: ProjectType[];
  }>;
}

export const AllMarketsList = ({
  locale,
  marketsWithProjects,
}: AllMarketsListProps) => {
  return (
    <div className={styles.list}>
      {marketsWithProjects.map(({ market, projects }) => (
        <MarketAccordion
          key={market.id}
          locale={locale}
          market={market}
          projects={projects}
        />
      ))}
    </div>
  );
};
