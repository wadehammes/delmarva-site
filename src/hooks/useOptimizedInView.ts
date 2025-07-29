import { useInView } from "react-intersection-observer";

interface UseOptimizedInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Optimized intersection observer hook for better scroll performance
 * Uses conservative defaults to reduce layout thrashing and improve FPS
 */
export const useOptimizedInView = (options: UseOptimizedInViewOptions = {}) => {
  const {
    threshold = 0.25,
    rootMargin = "50px 0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  return useInView({
    delay,
    rootMargin,
    threshold,
    triggerOnce,
  });
};
