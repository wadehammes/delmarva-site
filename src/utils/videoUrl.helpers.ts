const VIDEO_EMBED_DOMAIN_SUBSTRINGS = [
  "dailymotion.com",
  "youtu.be",
  "youtube.com",
  "vimeo.com",
] as const;

const VIDEO_FILE_EXTENSION_SUBSTRINGS = [
  ".avi",
  ".flv",
  ".mkv",
  ".mov",
  ".mp4",
  ".ogg",
  ".webm",
  ".wmv",
] as const;

const hasVideoEmbedDomain = (lowerUrl: string): boolean =>
  VIDEO_EMBED_DOMAIN_SUBSTRINGS.some((domain) => lowerUrl.includes(domain));

const hasVideoFileExtension = (lowerUrl: string): boolean =>
  VIDEO_FILE_EXTENSION_SUBSTRINGS.some((ext) => lowerUrl.includes(ext));

export const isDirectVideoFile = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (hasVideoEmbedDomain(lower)) return false;
  if (hasVideoFileExtension(lower)) return true;
  if (lower.includes("ctfassets.net")) return true;
  return false;
};

export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return hasVideoFileExtension(lower) || hasVideoEmbedDomain(lower);
};

export const isVimeoUrl = (url: string): boolean => {
  if (!url) return false;
  return url.toLowerCase().includes("vimeo.com");
};

export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes("youtube.com") || lower.includes("youtu.be");
};
