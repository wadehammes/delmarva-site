import { draftMode } from "next/headers";
import { ContentRecentNews } from "src/components/ContentRecentNews/ContentRecentNews.component";
import { fetchRecentNews } from "src/contentful/getContentRecentNews";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import styles from "./ContentRecentNewsList.module.css";

interface ContentRecentNewsListProps {
  locale?: string;
}

export const ContentRecentNewsList = async (
  props?: ContentRecentNewsListProps,
) => {
  const locale = await getServerLocaleSafe(props?.locale);
  const draft = await draftMode();

  const recentNews = await fetchRecentNews({
    locale,
    preview: draft.isEnabled,
  });

  if (recentNews.length === 0) {
    return null;
  }

  return (
    <ul className={styles.contentRecentNewsList}>
      {recentNews.map((news) => (
        <li className={styles.newsItem} key={news.id}>
          <ContentRecentNews locale={locale} recentNews={news} />
        </li>
      ))}
    </ul>
  );
};
