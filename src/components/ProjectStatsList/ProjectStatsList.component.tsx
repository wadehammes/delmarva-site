import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ProjectStatsList.module.css";

interface MarketForDisplay {
  id: string;
  marketTitle?: string;
  name?: string;
}

interface ProjectStatsListProps {
  markets?: (MarketForDisplay | null)[];
  marketsLabel?: string;
  stats: (ContentStatBlock | null)[];
}

export const ProjectStatsList = (props: ProjectStatsListProps) => {
  const { markets = [], marketsLabel = "Markets", stats } = props;

  const allMarkets =
    markets?.filter((m): m is MarketForDisplay => m != null) ?? [];
  const marketNames = allMarkets
    .map((m) => m.marketTitle ?? m.name)
    .filter(Boolean);
  const hasStats = stats?.length;
  const hasMarkets = marketNames.length > 0;

  if (!hasStats && !hasMarkets) {
    return null;
  }

  return (
    <dl className={styles.statsList}>
      {stats?.map((stat) => {
        if (!stat) {
          return null;
        }

        return (
          <div className={styles.stat} key={stat.id}>
            <dt className={styles.statDescription}>{stat.statDescription}</dt>
            <dd className={styles.statValue}>
              {formatNumber({
                decorator: stat.decorator,
                keepInitialValue: true,
                num: stat.stat ?? 0,
                type: stat.statType,
              })}
            </dd>
          </div>
        );
      })}
      {hasMarkets && (
        <div className={styles.stat}>
          <dt className={styles.statDescription}>{marketsLabel}</dt>
          <dd className={styles.statValue}>{marketNames.join(", ")}</dd>
        </div>
      )}
    </dl>
  );
};
