/**
 * Throttle function to limit the rate at which a function can be called
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns A throttled version of the function
 */
export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number,
): T => {
  let inThrottle = false;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
};

/**
 * Debounce function to delay the execution of a function
 * @param func - The function to debounce
 * @param wait - The wait time in milliseconds
 * @returns A debounced version of the function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): T => {
  let timeout: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};
