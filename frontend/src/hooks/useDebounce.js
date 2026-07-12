import { useState, useEffect } from 'react';

/**
 * Delays updating the returned value until the user stops typing.
 * @param {any} value - Value to debounce
 * @param {number} delay - Milliseconds to wait (default 400ms)
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
