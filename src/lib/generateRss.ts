import fs from "node:fs";

const baseUrl = "https://www.delmarvasite.com";

export interface RSSType {
  title: string;
  description: string;
  postPath: string;
  pubDate: string;
}

const generateRssItem = (post: RSSType): string => `
      <item>
        <guid>${baseUrl}${post.postPath}</guid>
        <title>${post.title}</title>
        <link>${baseUrl}${post.postPath}</link>
        <description>${post.description}</description>
        <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      </item>
`;

export const generateRss = ({
  posts,
  rssTitle,
  rssDescription,
  rssPath,
}: {
  posts: RSSType[];
  rssTitle: string;
  rssDescription: string;
  rssPath: string;
}): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${rssTitle}</title>
      <link>${baseUrl}${rssPath}</link>
      <description>${rssDescription}</description>
      <language>en-US</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(post)).join("")}
    </channel>
  </rss>
`;

export const outputRss = ({
  posts,
  rssTitle,
  rssDescription,
  rssPath,
  type,
}: {
  posts: RSSType[];
  rssTitle: string;
  rssDescription: string;
  rssPath: string;
  type: "blog";
}) => {
  if (!posts) {
    // eslint-disable-next-line no-console -- consoles out an error for missing posts
    return console.error("Missing posts");
  }

  const rss = generateRss({
    posts,
    rssDescription,
    rssPath,
    rssTitle,
  });

  return fs.writeFileSync(`./public/rss-${type}.xml`, rss);
};
