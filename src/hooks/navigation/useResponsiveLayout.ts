/**
 * useResponsiveLayout — Responsive breakpoint detection & layout mode
 *
 * Breakpoints:
 *  - Mobile: < 768px (hidden sidebar, bottom nav)
 *  - Tablet: 768px–1023px (64px rail + flyout)
 *  - Desktop: >= 1024px (280px full sidebar)
 */

import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  mobile: 0,      // < 768px
  tablet: 768,    // 768px – 1023px
  desktop: 1024,  // >= 1024px
};

export type SidebarMode = 'hidden' | 'rail' | 'sidebar';
export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveLayout {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: ScreenSize;
  sidebarMode: SidebarMode;
  sidebarWidth: number; // 0 (hidden), 64 (rail), 280 (full)
  width: number;
}

export function useResponsiveLayout(): ResponsiveLayout {
  const [width, setWidth] = useState<number>(() => {
    // Server-side render safe default
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth;
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 100); // debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const screenSize: ScreenSize = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  const sidebarMode: SidebarMode = isMobile ? 'hidden' : isTablet ? 'rail' : 'sidebar';
  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 280;

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    sidebarMode,
    sidebarWidth,
    width,
  };
}
