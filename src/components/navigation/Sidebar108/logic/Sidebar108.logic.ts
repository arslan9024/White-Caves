/**
 * Sidebar108.logic.ts — Programming Hook & State Orchestrator
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useTheme } from '../../../../context/ThemeContext';
import { CORPORATE_DEPARTMENTS_12, SUPERVISORS_108 } from '../../../../data/assistants108Registry.data';
import { FOUNDER_EMAIL } from '../data/Sidebar108.data';

export function useSidebar108Logic() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  let isDark = false;
  try {
    const themeCtx = useTheme();
    if (themeCtx) isDark = themeCtx.isDark;
  } catch {}

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [isZoeExpanded, setIsZoeExpanded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  const toggleZoeFeatures = useCallback(() => {
    setIsZoeExpanded(prev => !prev);
  }, []);

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
    return (CORPORATE_DEPARTMENTS_12 || []).map(dept => ({
      ...dept,
      departmentId: dept.id,
      title: dept.name,
      accentColor: dept.color,
      supervisors: (SUPERVISORS_108 || []).filter(s => s.departmentId === dept.id)
    }));
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
    isZoeExpanded,
    toggleZoeFeatures,
    sidebarWidth,
    setSidebarWidth,
    currentPath: location.pathname,
    handleNavigate,
    handleLogout: logout,
  };
}
