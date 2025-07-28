import { useEffect, useState } from "react";

/**
 * Hook to determine if the component is running in the browser
 * Useful for preventing SSR issues when accessing browser APIs
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

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
};
