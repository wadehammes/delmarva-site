import type { ContentRecentNewsType } from "src/contentful/getContentRecentNews";
import type { Locales } from "src/contentful/interfaces";
import { getLocale } from "src/i18n/getLocale";
import { Link } from "src/i18n/routing";
import styles from "./ContentRecentNews.module.css";

const learnMoreText: Record<Locales, string> = {
  en: "Learn more",
  es: "Más información",
};

interface ContentRecentNewsProps {
  recentNews: ContentRecentNewsType;
}

export const ContentRecentNews = async (props: ContentRecentNewsProps) => {
  const { recentNews } = props;
  const date = new Date(recentNews.date);

  const locale = await getLocale();

  return (
    <div className={styles.recentNews}>
      <time className={styles.date} dateTime={date.toISOString()}>
        {date.toLocaleDateString(locale)}
      </time>
      <h3>{recentNews.linkTitle}</h3>
      <p>{recentNews.linkDescription}</p>
      {recentNews.linkUrl ? (
        <Link className={styles.learnMoreLink} href={recentNews.linkUrl}>
          <span>
            {learnMoreText[locale]} <span className={styles.arrow}>→</span>
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default ContentRecentNews;
