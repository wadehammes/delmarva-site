export const WORDPRESS_TO_CONTENTFUL_SLUG: Record<string, string> = {
  "beech-tree": "beechtree",
  "glenn-dale-commons": "glenn-dale-crossing",
};

export const resolveProjectSlug = (wordpressSlug: string): string =>
  WORDPRESS_TO_CONTENTFUL_SLUG[wordpressSlug] ?? wordpressSlug;
