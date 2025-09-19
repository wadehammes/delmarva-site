import { useCallback, useEffect, useRef } from "react";

interface UseScrollOptimizedOptions {
  throttleMs?: number;
  passive?: boolean;
}

/**
 * Optimized scroll hook that uses requestAnimationFrame for better performance
 * Combines multiple scroll handlers into a single optimized handler
 */
export const useScrollOptimized = (
  callback: (scrollY: number, deltaY: number) => void,
  options: UseScrollOptimizedOptions = {},
) => {
  const { passive = true } = options;
  const callbackRef = useRef(callback);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Update callback ref when callback changes
  callbackRef.current = callback;

  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      callbackRef.current(currentScrollY, deltaY);
      lastScrollY.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, passive]);

  return {
    scrollY: lastScrollY.current,
  };
};
