/**
 * Sidebar Resize Utilities
 * Helper functions for sidebar resize management
 */

export const SidebarDefaults = {
  MIN_WIDTH: 200,
  MAX_WIDTH: 500,
  DEFAULT_LEFT_WIDTH: 280,
  DEFAULT_RIGHT_WIDTH: 320,
  ANIMATION_DURATION: 300,
  STORAGE_PREFIX: 'sidebar_',
};

/**
 * Get sidebar width from localStorage with fallback to default
 */
export const getSidebarWidth = (
  side: 'left' | 'right',
  defaultWidth: number
): number => {
  if (typeof window === 'undefined') return defaultWidth;

  try {
    const key = `${SidebarDefaults.STORAGE_PREFIX}${side}`;
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : defaultWidth;
  } catch (error) {
    console.warn(`Failed to get sidebar width for ${side}:`, error);
    return defaultWidth;
  }
};

/**
 * Save sidebar width to localStorage
 */
export const setSidebarWidth = (side: 'left' | 'right', width: number): void => {
  if (typeof window === 'undefined') return;

  try {
    const key = `${SidebarDefaults.STORAGE_PREFIX}${side}`;
    localStorage.setItem(key, Math.round(width).toString());
  } catch (error) {
    console.warn(`Failed to save sidebar width for ${side}:`, error);
  }
};

/**
 * Constrain width to min/max bounds
 */
export const constrainWidth = (
  width: number,
  min: number = SidebarDefaults.MIN_WIDTH,
  max: number = SidebarDefaults.MAX_WIDTH
): number => {
  return Math.max(min, Math.min(max, width));
};

/**
 * Calculate resize delta based on mouse movement
 */
export const calculateResizeDelta = (
  start: number,
  current: number,
  side: 'left' | 'right'
): number => {
  return side === 'right' ? current - start : start - current;
};

/**
 * Reset sidebar to default width
 */
export const resetSidebarWidth = (side: 'left' | 'right'): number => {
  const defaultWidth =
    side === 'left'
      ? SidebarDefaults.DEFAULT_LEFT_WIDTH
      : SidebarDefaults.DEFAULT_RIGHT_WIDTH;
  setSidebarWidth(side, defaultWidth);
  return defaultWidth;
};

export default {
  getSidebarWidth,
  setSidebarWidth,
  constrainWidth,
  calculateResizeDelta,
  resetSidebarWidth,
  SidebarDefaults,
};
