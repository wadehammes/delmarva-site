import { ContentRecentNews } from "src/components/ContentRecentNews/ContentRecentNews.component";
import { fetchRecentNews } from "src/contentful/getContentRecentNews";
import styles from "./ContentRecentNewsList.module.css";

export const ContentRecentNewsList = async () => {
  const recentNews = await fetchRecentNews({ preview: false });

  if (recentNews.length === 0) {
    return null;
  }

  return (
    <ul className={styles.contentRecentNewsList}>
      {recentNews.map((news) => (
        <li className={styles.newsItem} key={news.id}>
          <ContentRecentNews recentNews={news} />
        </li>
      ))}
    </ul>
  );
};
