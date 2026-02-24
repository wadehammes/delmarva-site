import clsx from "clsx";
import styles from "src/components/ContentMarquee/ContentMarquee.module.css";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import type { ContentEntries } from "src/contentful/parseSections";

interface ContentMarqueeProps {
  entries: (ContentEntries | null)[];
  reverse?: boolean;
  searchParams?: { project?: string };
}

export const ContentMarquee = (props: ContentMarqueeProps) => {
  const { entries, reverse, searchParams } = props;

  if (!entries || entries.length === 0) {
    return null;
  }

  const filteredEntries = entries.filter((entry) => !!entry);

  return (
    <div className={clsx(styles.marquee, { [styles.reverse]: reverse })}>
      <ul className={styles.marqueeContent}>
        {filteredEntries.map((entry) => (
          <li key={entry.sys.id}>
            <ContentRenderer content={entry} searchParams={searchParams} />
          </li>
        ))}
      </ul>
      <ul aria-hidden="true" className={styles.marqueeContent}>
        {filteredEntries.map((entry) => (
          <li key={entry.sys.id}>
            <ContentRenderer content={entry} searchParams={searchParams} />
          </li>
        ))}
      </ul>
      <ul aria-hidden="true" className={styles.marqueeContent}>
        {filteredEntries.map((entry) => (
          <li key={entry.sys.id}>
            <ContentRenderer content={entry} searchParams={searchParams} />
          </li>
        ))}
      </ul>
    </div>
  );
};
