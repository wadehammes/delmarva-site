import { unstable_cache } from "next/cache";
import {
  CONTENTFUL_CACHE_REVALIDATE_SECONDS,
  sanitizeForCache,
} from "src/contentful/cacheUtils";

interface CachedOptions<T> {
  key: string[];
  fn: () => Promise<T>;
  revalidateSeconds?: number;
  tags?: string[];
}

export function cached<T>({
  key,
  fn,
  revalidateSeconds = CONTENTFUL_CACHE_REVALIDATE_SECONDS,
  tags,
}: CachedOptions<T>): Promise<T> {
  return unstable_cache(() => fn().then(sanitizeForCache), key, {
    revalidate: revalidateSeconds,
    ...(tags?.length ? { tags } : {}),
  })();
}
