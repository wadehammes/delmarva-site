export interface OptimizedInViewOptions {
  delay?: number;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

const DEFAULT_ROOT_MARGIN = "0px";
const DEFAULT_THRESHOLD = 0.2;

export function resolveInViewOptions(
  overrides: OptimizedInViewOptions = {},
): Pick<IntersectionObserverInit, "rootMargin" | "threshold"> & {
  delay?: number;
  triggerOnce: boolean;
} {
  return {
    delay: overrides.delay,
    rootMargin: overrides.rootMargin ?? DEFAULT_ROOT_MARGIN,
    threshold: overrides.threshold ?? DEFAULT_THRESHOLD,
    triggerOnce: overrides.triggerOnce ?? true,
  };
}
