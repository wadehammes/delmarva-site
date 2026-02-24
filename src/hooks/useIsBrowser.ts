import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Hook to determine if the component is running in the browser
 * Useful for preventing SSR issues when accessing browser APIs
 * Uses useLayoutEffect so client-only content (e.g. modals) renders before first paint
 *
 * @returns boolean - true if running in browser, false during SSR
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const isBrowser = useIsBrowser();
 *
 *   if (!isBrowser) return null;
 *
 *   // Safe to use document, window, etc.
 *   return <div>Browser-only content</div>;
 * };
 * ```
 */
export const useIsBrowser = (): boolean => {
  const [isBrowser, setIsBrowser] = useState(false);

  useLayoutEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
};

/**
 * Hook to manage DOM cleanup during navigation and locale switching
 * Prevents DOM manipulation errors during React reconciliation
 */
export const useDOMCleanup = () => {
  const isMountedRef = useRef(false);
  const cleanupRefs = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Run all cleanup functions
      cleanupRefs.current.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.warn("Error during DOM cleanup:", error);
        }
      });
      cleanupRefs.current.clear();
    };
  }, []);

  const addCleanup = (cleanup: () => void) => {
    cleanupRefs.current.add(cleanup);
  };

  const removeCleanup = (cleanup: () => void) => {
    cleanupRefs.current.delete(cleanup);
  };

  return {
    addCleanup,
    isMounted: () => isMountedRef.current,
    removeCleanup,
  };
};
