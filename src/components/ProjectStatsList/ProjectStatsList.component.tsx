import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ProjectStatsList.module.css";

interface ProjectStatsListProps {
  stats: (ContentStatBlock | null)[];
}

export const ProjectStatsList = (props: ProjectStatsListProps) => {
  const { stats } = props;

  if (!stats?.length) {
    return null;
  }

  return (
    <dl className={styles.statsList}>
      {stats.map((stat) => {
        if (!stat) {
          return null;
        }

        return (
          <div className={styles.stat} key={stat.id}>
            <dt className={styles.statDescription}>
              {stat.description ?? stat.statDescription}
            </dt>
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
    </dl>
  );
};
