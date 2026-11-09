/**
 * TreeNavigationContext.tsx
 * White Caves Real Estate LLC — AEGIS V5.0
 * 
 * Jack Sparrow Navigation Protocol (JSP-NAV-001 / TURING-NAV-TREE-009)
 * Hierarchical Tree-State Navigation & Leaf-Task Return Standard
 */

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type NavLevel = 'root' | 'floor' | 'dept' | 'group' | 'entity' | 'leafTask';

export interface TreeBreadcrumb {
  id: string;
  label: string;
  level: NavLevel;
  floor?: number;
  deptCode?: string | null;
  groupId?: string | null;
  entityId?: string | null;
  leafTaskId?: string | null;
}

export interface TreeNavState {
  // Activity Bars (Level 2)
  activeLeftActivity: string;
  activeRightActivity: string | null;
  isLeftDrawerOpen: boolean;
  isRightDrawerOpen: boolean;

  // Hierarchy Lineage (Levels 3 - 5)
  activeFloor: number;
  activeDepartment: string | null;
  activeGroupId: string | null;
  activeEntityId: string | null;
  activeLeafTask: string | null;

  // Tree expanded groups
  expandedNodeIds: string[];
}

export interface TreeNavigationContextType {
  navState: TreeNavState;
  breadcrumbs: TreeBreadcrumb[];

  // Activity Bar Controls
  setLeftActivity: (activityId: string, openDrawer?: boolean) => void;
  setRightActivity: (activityId: string | null, openDrawer?: boolean) => void;
  toggleLeftDrawer: (force?: boolean) => void;
  toggleRightDrawer: (force?: boolean) => void;

  // Tree Navigation
  navigateTo: (params: {
    floor?: number;
    deptCode?: string | null;
    groupId?: string | null;
    entityId?: string | null;
    leafTaskId?: string | null;
  }) => void;

  // Tree Expansion
  toggleNodeExpansion: (nodeId: string) => void;
  isNodeExpanded: (nodeId: string) => boolean;
  expandNodes: (nodeIds: string[]) => void;
  collapseAllNodes: () => void;

  // Leaf Task Return (JSP-NAV-001 Core)
  openLeafTask: (taskId: string, entityId?: string | null) => void;
  completeLeafTask: (options?: { refreshParent?: boolean }) => void;
  cancelLeafTask: () => void;
}

export const TreeNavigationContext = createContext<TreeNavigationContextType | undefined>(undefined);

interface TreeNavigationProviderProps {
  children: React.ReactNode;
  defaultFloor?: number;
  defaultDept?: string;
}

export const TreeNavigationProvider: React.FC<TreeNavigationProviderProps> = ({
  children,
  defaultFloor = 1,
  defaultDept = 'WC-CX'
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Activity bars state
  const [activeLeftActivity, setActiveLeftActivityState] = useState<string>('floors');
  const [activeRightActivity, setActiveRightActivityState] = useState<string | null>(null);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(true);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);

  // Expanded nodes cache
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(['root-floor-1']);

  // Extract hierarchy parameters from URL
  const activeFloor = useMemo(() => {
    const raw = searchParams.get('floor');
    return raw ? parseInt(raw, 10) || defaultFloor : defaultFloor;
  }, [searchParams, defaultFloor]);

  const activeDepartment = useMemo(() => {
    return searchParams.get('dept') || defaultDept;
  }, [searchParams, defaultDept]);

  const activeGroupId = useMemo(() => {
    return searchParams.get('group');
  }, [searchParams]);

  const activeEntityId = useMemo(() => {
    return searchParams.get('entity');
  }, [searchParams]);

  const activeLeafTask = useMemo(() => {
    return searchParams.get('task');
  }, [searchParams]);

  // Activity Bar Handlers
  const setLeftActivity = useCallback((activityId: string, openDrawer = true) => {
    setActiveLeftActivityState(activityId);
    if (openDrawer) setIsLeftDrawerOpen(true);
  }, []);

  const setRightActivity = useCallback((activityId: string | null, openDrawer = true) => {
    setActiveRightActivityState(activityId);
    setIsRightDrawerOpen(activityId !== null && openDrawer);
  }, []);

  const toggleLeftDrawer = useCallback((force?: boolean) => {
    setIsLeftDrawerOpen(prev => (typeof force === 'boolean' ? force : !prev));
  }, []);

  const toggleRightDrawer = useCallback((force?: boolean) => {
    setIsRightDrawerOpen(prev => (typeof force === 'boolean' ? force : !prev));
  }, []);

  // Tree Navigation Dispatcher (updates URL search parameters cleanly)
  const navigateTo = useCallback(({
    floor,
    deptCode,
    groupId,
    entityId,
    leafTaskId
  }: {
    floor?: number;
    deptCode?: string | null;
    groupId?: string | null;
    entityId?: string | null;
    leafTaskId?: string | null;
  }) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      if (floor !== undefined) next.set('floor', String(floor));
      if (deptCode !== undefined) {
        if (deptCode) next.set('dept', deptCode); else next.delete('dept');
      }
      if (groupId !== undefined) {
        if (groupId) next.set('group', groupId); else next.delete('group');
      }
      if (entityId !== undefined) {
        if (entityId) next.set('entity', entityId); else next.delete('entity');
      }
      if (leafTaskId !== undefined) {
        if (leafTaskId) next.set('task', leafTaskId); else next.delete('task');
      }

      return next;
    }, { replace: false });
  }, [setSearchParams]);

  // Tree Expansion Helpers
  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev =>
      prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
    );
  }, []);

  const isNodeExpanded = useCallback((nodeId: string) => {
    return expandedNodeIds.includes(nodeId);
  }, [expandedNodeIds]);

  const expandNodes = useCallback((nodeIds: string[]) => {
    setExpandedNodeIds(prev => Array.from(new Set([...prev, ...nodeIds])));
  }, []);

  const collapseAllNodes = useCallback(() => {
    setExpandedNodeIds([]);
  }, []);

  // Leaf Task Actions (JSP-NAV-001)
  const openLeafTask = useCallback((taskId: string, entityId?: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('task', taskId);
      if (entityId) next.set('entity', entityId);
      return next;
    });
  }, [setSearchParams]);

  const completeLeafTask = useCallback((_options?: { refreshParent?: boolean }) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('task'); // Removes leaf task and drops back to parent entity/group
      return next;
    });
  }, [setSearchParams]);

  const cancelLeafTask = useCallback(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('task');
      return next;
    });
  }, [setSearchParams]);

  // Dynamic Breadcrumb Computation
  const breadcrumbs = useMemo<TreeBreadcrumb[]>(() => {
    const crumbs: TreeBreadcrumb[] = [
      {
        id: 'floor-root',
        label: `Floor ${activeFloor}`,
        level: 'floor',
        floor: activeFloor
      }
    ];

    if (activeDepartment) {
      crumbs.push({
        id: `dept-${activeDepartment}`,
        label: activeDepartment,
        level: 'dept',
        floor: activeFloor,
        deptCode: activeDepartment
      });
    }

    if (activeGroupId) {
      crumbs.push({
        id: `group-${activeGroupId}`,
        label: activeGroupId,
        level: 'group',
        floor: activeFloor,
        deptCode: activeDepartment,
        groupId: activeGroupId
      });
    }

    if (activeEntityId) {
      crumbs.push({
        id: `entity-${activeEntityId}`,
        label: activeEntityId,
        level: 'entity',
        floor: activeFloor,
        deptCode: activeDepartment,
        groupId: activeGroupId,
        entityId: activeEntityId
      });
    }

    if (activeLeafTask) {
      crumbs.push({
        id: `leaf-${activeLeafTask}`,
        label: `⚡ ${activeLeafTask}`,
        level: 'leafTask',
        floor: activeFloor,
        deptCode: activeDepartment,
        groupId: activeGroupId,
        entityId: activeEntityId,
        leafTaskId: activeLeafTask
      });
    }

    return crumbs;
  }, [activeFloor, activeDepartment, activeGroupId, activeEntityId, activeLeafTask]);

  const navState = useMemo<TreeNavState>(() => ({
    activeLeftActivity,
    activeRightActivity,
    isLeftDrawerOpen,
    isRightDrawerOpen,
    activeFloor,
    activeDepartment,
    activeGroupId,
    activeEntityId,
    activeLeafTask,
    expandedNodeIds
  }), [
    activeLeftActivity,
    activeRightActivity,
    isLeftDrawerOpen,
    isRightDrawerOpen,
    activeFloor,
    activeDepartment,
    activeGroupId,
    activeEntityId,
    activeLeafTask,
    expandedNodeIds
  ]);

  const value = useMemo<TreeNavigationContextType>(() => ({
    navState,
    breadcrumbs,
    setLeftActivity,
    setRightActivity,
    toggleLeftDrawer,
    toggleRightDrawer,
    navigateTo,
    toggleNodeExpansion,
    isNodeExpanded,
    expandNodes,
    collapseAllNodes,
    openLeafTask,
    completeLeafTask,
    cancelLeafTask
  }), [
    navState,
    breadcrumbs,
    setLeftActivity,
    setRightActivity,
    toggleLeftDrawer,
    toggleRightDrawer,
    navigateTo,
    toggleNodeExpansion,
    isNodeExpanded,
    expandNodes,
    collapseAllNodes,
    openLeafTask,
    completeLeafTask,
    cancelLeafTask
  ]);

  return (
    <TreeNavigationContext.Provider value={value}>
      {children}
    </TreeNavigationContext.Provider>
  );
};

export const useTreeNavigation = (): TreeNavigationContextType => {
  const context = useContext(TreeNavigationContext);
  if (!context) {
    throw new Error('useTreeNavigation must be used within a TreeNavigationProvider');
  }
  return context;
};
