import safeJsonStringify from "safe-json-stringify";

export const sanitizeForCache = <T>(value: T): T => {
  return safeJsonStringify.ensureProperties(value) as T;
};
