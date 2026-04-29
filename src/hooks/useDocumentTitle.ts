import { useEffect, useRef } from 'react';

const BASE_TITLE = 'White Caves Real Estate';

/**
 * Sets the browser tab title on mount and restores the previous title on
 * unmount (SPA-friendly). Appends " | White Caves Real Estate" suffix.
 *
 * @example
 *   useDocumentTitle('Properties');
 *   // tab reads: "Properties | White Caves Real Estate"
 */
export function useDocumentTitle(title: string): void {
  const prevTitle = useRef(document.title);

  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    return () => {
      document.title = prevTitle.current;
    };
  }, [title]);
}

export default useDocumentTitle;
