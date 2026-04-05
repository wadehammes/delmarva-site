export const envUrl = () => {
  if (process.env.ENVIRONMENT === "local") {
    return "http://localhost:5656";
  }

  if (process.env.ENVIRONMENT === "staging") {
    return "https://staging.delmarvasite.com";
  }

  return "https://www.delmarvasite.com";
};
