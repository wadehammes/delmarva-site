export const getSafeRedirectPath = (
  redirect: string | null | undefined,
): string => {
  if (!redirect) {
    return "/";
  }

  const trimmed = redirect.trim();

  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://") ||
    trimmed.includes("\\")
  ) {
    return "/";
  }

  return trimmed;
};
