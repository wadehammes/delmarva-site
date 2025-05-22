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

export const createImageUrl = (src: string) => {
  if (!src) {
    return "";
  }

  if (src.startsWith("http")) {
    return src;
  }

  return `https:${src}`;
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
