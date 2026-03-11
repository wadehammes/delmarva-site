import safeJsonStringify from "safe-json-stringify";

export const CONTENTFUL_CACHE_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

export function sanitizeForCache<T>(value: T): T {
  return safeJsonStringify.ensureProperties(value) as T;
}
