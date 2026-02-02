import clsx from "clsx";
import styles from "src/components/ContentGrid/ContentGrid.module.css";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import type { ContentGrid as ContentGridType } from "src/contentful/parseContentGrid";

interface ContentGridProps {
  fields: ContentGridType;
  locale?: string;
}

export const ContentGrid = (props: ContentGridProps) => {
  const { fields, locale } = props;

  return (
    <div
      className={clsx(styles["content-grid"], {
        [styles["two-column"]]: fields.gridLayout === "Two Column",
        [styles["three-column"]]: fields.gridLayout === "Three Column",
        [styles["four-column"]]: fields.gridLayout === "Four Column",
      })}
    >
      {(fields.content ?? []).map((content) => {
        if (!content) {
          return null;
        }

        return (
          <ContentRenderer
            content={content}
            key={content.sys.id}
            locale={locale}
          />
        );
      })}
    </div>
  );
};
