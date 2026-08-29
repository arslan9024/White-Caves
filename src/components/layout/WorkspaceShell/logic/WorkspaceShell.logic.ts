/**
 * WorkspaceShell.logic.ts — Layout State Hook & Responsive Coordinates
 */

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { WORKSPACE_LAYOUT_CONFIG } from '../data/WorkspaceShell.data';

export function useWorkspaceShellLogic(isSidebarCollapsed = false) {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    if (themeCtx) isDark = themeCtx.isDark;
  } catch {}

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveSidebarWidth = useMemo(() => {
    if (isMobile) return 0;
    return isSidebarCollapsed
      ? WORKSPACE_LAYOUT_CONFIG.sidebarCollapsedWidthPx
      : WORKSPACE_LAYOUT_CONFIG.sidebarExpandedWidthPx;
  }, [isMobile, isSidebarCollapsed]);

  return {
    isDark,
    isMobile,
    sidebarWidth: effectiveSidebarWidth,
    headerHeight: WORKSPACE_LAYOUT_CONFIG.headerHeightPx,
    padding: isMobile ? 16 : WORKSPACE_LAYOUT_CONFIG.defaultPaddingPx,
  };
}
