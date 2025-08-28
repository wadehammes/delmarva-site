import type { Page } from "src/contentful/getPages";

export const isBrowser = () => {
  return Boolean(typeof window !== "undefined");
};

export const envUrl = () => {
  if (process.env.ENVIRONMENT === "local") {
    return "http://localhost:5656";
  }

  if (process.env.ENVIRONMENT === "staging") {
    return "https://staging.delmarvasite.com";
  }

  return "https://www.delmarvasite.com";
};

export const createMediaUrl = (src: string) => {
  if (!src) {
    return "";
  }

  if (src.startsWith("http")) {
    return src;
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  return `https://${src}`;
};

export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const replaceNbsp = (text: string): string => {
  if (!text) {
    return "";
  }

  return text.replace(/\u00a0/g, " ").replace(/\u2028/g, "");
};

export const isReactNodeEmptyArray = (node: React.ReactNode) => {
  return Array.isArray(node) && node.length === 0;
};

export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;

  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".wmv",
    ".flv",
    ".mkv",
  ];
  const videoDomains = [
    "youtube.com",
    "youtu.be",
    "vimeo.com",
    "dailymotion.com",
  ];

  const lowerUrl = url.toLowerCase();

  // Check for video file extensions
  if (videoExtensions.some((ext) => lowerUrl.includes(ext))) {
    return true;
  }

  // Check for video hosting domains
  if (videoDomains.some((domain) => lowerUrl.includes(domain))) {
    return true;
  }

  return false;
};

export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

/**
 * Checks if a content entry is of a specific content type
 * @param content - The content entry to check
 * @param contentType - The content type to check for (e.g., "contentHero", "copyBlock")
 * @returns true if the content is of the specified type, false otherwise
 */
export const isContentType = (
  content:
    | { sys?: { contentType?: { sys?: { id?: string } } } }
    | null
    | undefined,
  contentType: string,
): boolean => {
  return content?.sys?.contentType?.sys?.id === contentType;
};

/**
 * Checks if a page has a hero component as its first section
 * @param page - The page to check
 * @returns true if the first section contains a hero component, false otherwise
 */
export const hasHeroAsFirstSection = (page?: Page): boolean => {
  if (!page?.sections || page.sections.length === 0) {
    return false;
  }

  const firstSection = page.sections[0];
  if (!firstSection?.content || firstSection.content.length === 0) {
    return false;
  }

  // Check if the first content item in the first section is a hero
  const firstContent = firstSection.content[0];
  return isContentType(firstContent, "contentHero");
};
