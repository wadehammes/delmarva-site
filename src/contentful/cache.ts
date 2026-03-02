import { unstable_cache } from "next/cache";
import { REVALIDATE_SECONDS } from "src/utils/constants";

interface CachedOptions<T> {
  key: string[];
  fn: () => Promise<T>;
  revalidateSeconds?: number;
  tags?: string[];
}

export function cached<T>({
  key,
  fn,
  revalidateSeconds = REVALIDATE_SECONDS,
  tags,
}: CachedOptions<T>): Promise<T> {
  return unstable_cache(fn, key, {
    revalidate: revalidateSeconds,
    ...(tags?.length ? { tags } : {}),
  })();
}
