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
