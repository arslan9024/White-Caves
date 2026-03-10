/**
 * Resizable Sidebar Container Hook
 * Handles sidebar width management and localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';

const SIDEBAR_STORAGE_KEY = {
  LEFT: 'sidebar_width_left',
  RIGHT: 'sidebar_width_right',
};

const DEFAULT_WIDTHS = {
  LEFT: 280,
  RIGHT: 320,
};

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

export const useResizableSidebar = (side: 'left' | 'right') => {
  const storageKey = SIDEBAR_STORAGE_KEY[side.toUpperCase() as 'LEFT' | 'RIGHT'];
  const defaultWidth = DEFAULT_WIDTHS[side.toUpperCase() as 'LEFT' | 'RIGHT'];

  const [width, setWidth] = useState<number>(() => {
    // Try to get saved width from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : defaultWidth;
    }
    return defaultWidth;
  });

  const [isResizing, setIsResizing] = useState(false);

  // Save width to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, width.toString());
    }
  }, [width, storageKey]);

  // Handle resize with constraints
  const handleResize = useCallback((newWidth: number) => {
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidth(constrainedWidth);
  }, []);

  // Reset to default width
  const resetWidth = useCallback(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  return {
    width,
    setWidth: handleResize,
    isResizing,
    setIsResizing,
    resetWidth,
    MIN_WIDTH,
    MAX_WIDTH,
  };
};

export default useResizableSidebar;
