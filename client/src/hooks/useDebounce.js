import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value.
 * Commonly used for search inputs, autocomplete, and live filters.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (defaults to 300ms)
 * @returns {any} debouncedValue - The value after the delay has passed
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
