import { unstable_cache } from "next/cache";
import { sanitizeForCache } from "src/contentful/cacheUtils";
import { APP_REVALIDATE } from "src/utils/revalidate";

interface CachedOptions<T> {
  key: string[];
  fn: () => Promise<T>;
  revalidate?: number | false;
  tags?: string[];
}

export const cached = <T>({
  key,
  fn,
  revalidate = APP_REVALIDATE,
  tags,
}: CachedOptions<T>): Promise<T> => {
  return unstable_cache(() => fn().then(sanitizeForCache), key, {
    revalidate,
    ...(tags?.length ? { tags } : {}),
  })();
};
