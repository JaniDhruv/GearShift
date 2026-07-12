import { useEffect } from 'react';

/**
 * Reusable hook to dynamically update the document title for SEO & UX.
 * @param {string} title - Page title
 */
export default function useTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | GearShift` : 'GearShift | Dealership Management System';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
