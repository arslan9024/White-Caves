/**
 * DepartmentHierarchy.logic.ts
 * 7-Category Architecture: Logic Layer
 * 3-Tier Bhakti Protocol State Management & Drag-and-Drop Interaction Hook
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  HierarchyTier,
  Hierarchy3TierState,
  DepartmentDirectorNode,
  DivisionManagerNode,
  SupervisorTeamNode,
} from './DepartmentHierarchy.types';
import { buildInitialHierarchyState } from './DepartmentHierarchy.data';
import {
  executeSwapDirectorSlotsWorkflow,
  executeSwapManagerSlotsWorkflow,
  executeDemoteEntityWorkflow,
  executeAssignPoolItemWorkflow,
} from './DepartmentHierarchy.workflow';

export function useDepartmentHierarchy() {
  const [hierarchyState, setHierarchyState] = useState<Hierarchy3TierState>(
    buildInitialHierarchyState
  );
  const [activeTier, setActiveTier] = useState<HierarchyTier>('DIRECTOR');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Drag-and-drop active tracking
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [draggedTier, setDraggedTier] = useState<HierarchyTier | null>(null);
  const [draggedPoolId, setDraggedPoolId] = useState<string | null>(null);

  // Drawer / modal edit state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<HierarchyTier | null>(null);
  const [editingNode, setEditingNode] = useState<any | null>(null);

  const showStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  // Navigation handlers
  const navigateToDirectors = useCallback(() => {
    setActiveTier('DIRECTOR');
    setSelectedDeptId(null);
    setSelectedManagerId(null);
  }, []);

  const handleSelectDepartment = useCallback((deptSlug: string) => {
    setSelectedDeptId(deptSlug);
    setActiveTier('MANAGER');
    setSelectedManagerId(null);
  }, []);

  const handleSelectManager = useCallback((mgrId: string) => {
    setSelectedManagerId(mgrId);
    setActiveTier('SUPERVISOR');
  }, []);

  // Tier 1 Director Content Swap (Bhakti Protocol)
  const handleSwapDirectors = useCallback(
    (sourceSlot: number, targetSlot: number) => {
      setHierarchyState(prev => {
        const res = executeSwapDirectorSlotsWorkflow(prev, sourceSlot, targetSlot);
        showStatus(res.message);
        return res.success ? res.state : prev;
      });
    },
    [showStatus]
  );

  // Tier 2 Division Manager Content Swap
  const handleSwapManagers = useCallback(
    (deptSlug: string, sourceSlot: number, targetSlot: number) => {
      setHierarchyState(prev => {
        const res = executeSwapManagerSlotsWorkflow(prev, deptSlug, sourceSlot, targetSlot);
        showStatus(res.message);
        return res.success ? res.state : prev;
      });
    },
    [showStatus]
  );

  // Zero-Delete Demotion Handler
  const handleDemoteEntity = useCallback(
    (tier: HierarchyTier, entityId: string, deptSlug?: string, mgrId?: string) => {
      setHierarchyState(prev => {
        const res = executeDemoteEntityWorkflow(prev, tier, entityId, deptSlug, mgrId);
        showStatus(res.message);
        return res.success ? res.state : prev;
      });
    },
    [showStatus]
  );

  // Pool Assignment Handler
  const handleAssignFromPool = useCallback(
    (
      tier: HierarchyTier,
      poolId: string,
      targetSlot: number,
      deptSlug?: string,
      mgrId?: string
    ) => {
      setHierarchyState(prev => {
        const res = executeAssignPoolItemWorkflow(prev, tier, poolId, targetSlot, deptSlug, mgrId);
        showStatus(res.message);
        return res.success ? res.state : prev;
      });
    },
    [showStatus]
  );

  // Drag and Drop Event Handlers
  const handleDragStart = useCallback((tier: HierarchyTier, slot: number) => {
    setDraggedTier(tier);
    setDraggedSlot(slot);
    setDraggedPoolId(null);
  }, []);

  const handleDragStartPool = useCallback((poolId: string) => {
    setDraggedPoolId(poolId);
    setDraggedTier(null);
    setDraggedSlot(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSlot(null);
    setDraggedTier(null);
    setDraggedPoolId(null);
  }, []);

  const handleDropOnDirectorSlot = useCallback(
    (targetSlot: number) => {
      if (draggedPoolId) {
        handleAssignFromPool('DIRECTOR', draggedPoolId, targetSlot);
      } else if (draggedTier === 'DIRECTOR' && draggedSlot !== null && draggedSlot !== targetSlot) {
        handleSwapDirectors(draggedSlot, targetSlot);
      }
      handleDragEnd();
    },
    [
      draggedPoolId,
      draggedTier,
      draggedSlot,
      handleAssignFromPool,
      handleSwapDirectors,
      handleDragEnd,
    ]
  );

  const handleDropOnManagerSlot = useCallback(
    (deptSlug: string, targetSlot: number) => {
      if (draggedPoolId) {
        handleAssignFromPool('MANAGER', draggedPoolId, targetSlot, deptSlug);
      } else if (draggedTier === 'MANAGER' && draggedSlot !== null && draggedSlot !== targetSlot) {
        handleSwapManagers(deptSlug, targetSlot, draggedSlot);
      }
      handleDragEnd();
    },
    [
      draggedPoolId,
      draggedTier,
      draggedSlot,
      handleAssignFromPool,
      handleSwapManagers,
      handleDragEnd,
    ]
  );

  // Drawer modal handlers
  const handleOpenEdit = useCallback((tier: HierarchyTier, node: any) => {
    setEditingTier(tier);
    setEditingNode(node);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingTier(null);
    setEditingNode(null);
  }, []);

  const handleSaveEdit = useCallback(
    (updatedNode: any) => {
      setHierarchyState(prev => {
        if (editingTier === 'DIRECTOR') {
          const directors = prev.directors.map(d =>
            d._id === updatedNode._id ? { ...d, ...updatedNode } : d
          );
          return { ...prev, directors };
        }
        if (editingTier === 'MANAGER' && selectedDeptId) {
          const managers = (prev.managersByDeptId[selectedDeptId] || []).map(m =>
            m._id === updatedNode._id ? { ...m, ...updatedNode } : m
          );
          return {
            ...prev,
            managersByDeptId: { ...prev.managersByDeptId, [selectedDeptId]: managers },
          };
        }
        if (editingTier === 'SUPERVISOR' && selectedManagerId) {
          const teams = (prev.teamsByManagerId[selectedManagerId] || []).map(t =>
            t._id === updatedNode._id ? { ...t, ...updatedNode } : t
          );
          return {
            ...prev,
            teamsByManagerId: { ...prev.teamsByManagerId, [selectedManagerId]: teams },
          };
        }
        return prev;
      });
      handleCloseDrawer();
      showStatus('Entity updated successfully.');
    },
    [editingTier, selectedDeptId, selectedManagerId, handleCloseDrawer, showStatus]
  );

  // Filtered views
  const filteredDirectors = useMemo(() => {
    if (!searchQuery.trim()) return hierarchyState.directors;
    const q = searchQuery.toLowerCase();
    return hierarchyState.directors.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.directorName.toLowerCase().includes(q) ||
        d.fixedCode.toLowerCase().includes(q)
    );
  }, [hierarchyState.directors, searchQuery]);

  const activeDepartment = useMemo(() => {
    if (!selectedDeptId) return null;
    return hierarchyState.directors.find(d => d.slug === selectedDeptId) || null;
  }, [hierarchyState.directors, selectedDeptId]);

  const activeManagers = useMemo(() => {
    if (!selectedDeptId) return [];
    const list = hierarchyState.managersByDeptId[selectedDeptId] || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      m => m.title.toLowerCase().includes(q) || m.managerName.toLowerCase().includes(q)
    );
  }, [hierarchyState.managersByDeptId, selectedDeptId, searchQuery]);

  const activeManager = useMemo(() => {
    if (!selectedDeptId || !selectedManagerId) return null;
    const list = hierarchyState.managersByDeptId[selectedDeptId] || [];
    return list.find(m => m._id === selectedManagerId) || null;
  }, [hierarchyState.managersByDeptId, selectedDeptId, selectedManagerId]);

  const activeTeams = useMemo(() => {
    if (!selectedManagerId) return [];
    return hierarchyState.teamsByManagerId[selectedManagerId] || [];
  }, [hierarchyState.teamsByManagerId, selectedManagerId]);

  return {
    hierarchyState,
    activeTier,
    selectedDeptId,
    selectedManagerId,
    searchQuery,
    setSearchQuery,
    statusMessage,
    draggedSlot,
    draggedTier,
    draggedPoolId,
    isDrawerOpen,
    editingTier,
    editingNode,
    filteredDirectors,
    activeDepartment,
    activeManagers,
    activeManager,
    activeTeams,
    navigateToDirectors,
    handleSelectDepartment,
    handleSelectManager,
    handleSwapDirectors,
    handleSwapManagers,
    handleDemoteEntity,
    handleAssignFromPool,
    handleDragStart,
    handleDragStartPool,
    handleDragEnd,
    handleDropOnDirectorSlot,
    handleDropOnManagerSlot,
    handleOpenEdit,
    handleCloseDrawer,
    handleSaveEdit,
  };
}
