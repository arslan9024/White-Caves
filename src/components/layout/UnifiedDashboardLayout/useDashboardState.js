/**
 * useDashboardState - Custom Hook for Dashboard UI State
 * 
 * Manages:
 * - Sidebar collapsed/expanded
 * - Right panel open/closed
 * - Theme (light/dark)
 * - Responsive viewport detection
 * - LocalStorage persistence
 */

import { useState, useEffect } from 'react';

const useDashboardState = () => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('dashboard-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Right panel state
  const [rightPanelOpen, setRightPanelOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Don't auto-open on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return false;
    }
    const saved = localStorage.getItem('dashboard-right-panel-open');
    return saved ? JSON.parse(saved) : false;
  });

  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('dashboard-theme');
    if (saved) return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Responsive detection
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1200;
  });

  // Persist state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('dashboard-right-panel-open', JSON.stringify(rightPanelOpen));
  }, [rightPanelOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelOpen,
    setRightPanelOpen,
    theme,
    setTheme,
    isMobile,
    isTablet
  };
};

export default useDashboardState;
