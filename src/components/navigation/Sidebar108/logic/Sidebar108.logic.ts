/**
 * Sidebar108.logic.ts — Programming Hook & State Orchestrator
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../workspace/contexts/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { DEPARTMENTS_108_REGISTRY } from '../../../data/assistants108Registry.data';
import { FOUNDER_EMAIL } from '../data/Sidebar108.data';

export function useSidebar108Logic() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  let isDark = false;
  try {
    const themeCtx = useTheme();
    if (themeCtx) isDark = themeCtx.isDark;
  } catch {}

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const isFounder = useMemo(() => {
    return (
      user?.email?.toLowerCase().trim() === FOUNDER_EMAIL.toLowerCase() ||
      user?.role === 'managing_director' ||
      user?.clearance_level === 5
    );
  }, [user]);

  const departments = useMemo(() => {
    return DEPARTMENTS_108_REGISTRY || [];
  }, []);

  const toggleDepartment = useCallback((deptId: string) => {
    setExpandedDeptId(prev => (prev === deptId ? null : deptId));
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return {
    user,
    isFounder,
    isDark,
    isCollapsed,
    toggleCollapse,
    departments,
    expandedDeptId,
    toggleDepartment,
    currentPath: location.pathname,
    handleNavigate,
    handleLogout: logout,
  };
}
