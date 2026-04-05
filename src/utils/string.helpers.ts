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
