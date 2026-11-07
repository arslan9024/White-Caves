import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import {
  FALLBACK_12_DEPARTMENTS,
  buildFixed12Slots,
  getDepartmentSubItems,
  getUnassignedSquadPool,
  convertDepartmentToSubDept,
  convertSubDeptToDepartment,
  type DepartmentSlotDef,
} from './DepartmentManager.data';
import {
  handleDepartmentSlotDropHelper,
  handleSubDeptDropHelper,
  handleDropOnPoolHelper,
} from './DepartmentManagementWorkspace.dnd';
import {
  loadStoredDepartments,
  saveDepartments,
  resetStoredDepartmentsToCanonical,
  computeDepartmentMetrics,
  filterDepartmentsBySearch,
  DEPTS_SYNC_EVENT,
} from './DepartmentManagementWorkspace.storage';
import { useDepartmentForm } from './DepartmentManagementWorkspace.form';

export function useDepartmentManagementWorkspaceLogic() {
  const [departments, setDepartments] = useState<DepartmentNodeItem[]>(loadStoredDepartments);
  const [unassignedPool, setUnassignedPool] = useState<SupervisorDef[]>(getUnassignedSquadPool());
  const [subDeptsMap, setSubDeptsMap] = useState<Record<string, SupervisorDef[]>>({});
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<DepartmentNodeItem | null>(null);

  const form = useDepartmentForm(departments, setDepartments, setError);

  const [draggedDeptIndex, setDraggedDeptIndex] = useState<number | null>(null);
  const [dragOverDeptIndex, setDragOverDeptIndex] = useState<number | null>(null);
  const [draggedSubIndex, setDraggedSubIndex] = useState<number | null>(null);
  const [dragOverSubIndex, setDragOverSubIndex] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/corporate-departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          if (data.data.length > 0) {
            setDepartments(data.data.slice(0, 12));
            saveDepartments(data.data.slice(0, 12));
            return;
          }
          setDepartments(FALLBACK_12_DEPARTMENTS);
          return;
        }
      }
      setDepartments(loadStoredDepartments());
    } catch {
      setDepartments(loadStoredDepartments());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    const onSync = (e: Event) => {
      const custom = e as CustomEvent<DepartmentNodeItem[]>;
      if (Array.isArray(custom.detail)) setDepartments(custom.detail);
    };
    window.addEventListener(DEPTS_SYNC_EVENT, onSync);
    return () => window.removeEventListener(DEPTS_SYNC_EVENT, onSync);
  }, []);

  const slots: DepartmentSlotDef[] = useMemo(() => buildFixed12Slots(departments), [departments]);
  const activeSlot = slots[selectedSlotIndex] || slots[0];
  const activeDepartment = activeSlot?.dept || null;

  const activeSubDepts = useMemo(() => {
    if (!activeDepartment) return [];
    const deptKey = activeDepartment._id || activeDepartment.slug;
    return subDeptsMap[deptKey] || getDepartmentSubItems(activeDepartment.slug || activeDepartment._id);
  }, [activeDepartment, subDeptsMap]);

  const selectSlot = useCallback((index: number) => {
    if (index >= 0 && index < 12) setSelectedSlotIndex(index);
  }, []);

  const handleInlineRename = useCallback(
    (deptId: string, newTitle: string, directorName?: string, code?: string) => {
      if (!newTitle.trim()) return;
      setDepartments(prev => {
        const updated = prev.map(d =>
          d._id !== deptId
            ? d
            : {
                ...d,
                title: newTitle.trim(),
                code: code?.trim() || d.code,
                directorOrManagerId: directorName
                  ? {
                      fullName: directorName.trim(),
                      role: d.directorOrManagerId?.role || 'Department Director',
                    }
                  : d.directorOrManagerId,
              }
        );
        saveDepartments(updated);
        return updated;
      });
    },
    []
  );

  const handleBatchSaveAll = useCallback(
    (updates: Record<string, { title: string; code: string; directorName: string }>) => {
      setDepartments(prev => {
        const updated = prev.map(d => {
          const u = updates[d._id];
          if (!u || !u.title.trim()) return d;
          return {
            ...d,
            title: u.title.trim(),
            code: u.code.trim() || d.code,
            directorOrManagerId: {
              fullName:
                u.directorName.trim() || d.directorOrManagerId?.fullName || 'Managing Director',
              role: d.directorOrManagerId?.role || 'Department Director',
            },
          };
        });
        saveDepartments(updated);
        return updated;
      });
    },
    []
  );

  const handleMoveDepartment = useCallback((fromIdx: number, toIdx: number) => {
    setDepartments(prev => {
      if (fromIdx < 0 || toIdx < 0 || fromIdx >= prev.length || toIdx >= prev.length) return prev;
      const next = [...prev];
      const itemA = next[fromIdx];
      const itemB = next[toIdx];
      if (!itemA || !itemB) return prev;
      const codeA = itemA.code || `DEPT-${String(fromIdx + 1).padStart(2, '0')}`;
      const codeB = itemB.code || `DEPT-${String(toIdx + 1).padStart(2, '0')}`;
      next[toIdx] = { ...itemA, code: codeB, order: toIdx + 1 };
      next[fromIdx] = { ...itemB, code: codeA, order: fromIdx + 1 };
      saveDepartments(next);
      return next;
    });
  }, []);

  const handleResetDefaults = useCallback(() => {
    setDepartments(resetStoredDepartmentsToCanonical());
  }, []);

  const handleDelete = (nodeId: string) => {
    const targetDept = departments.find(d => d._id === nodeId);
    if (!targetDept) return;
    setUnassignedPool(prev => [convertDepartmentToSubDept(targetDept), ...prev]);
    setDepartments(prev => {
      const updated = prev
        .filter(d => d._id !== nodeId)
        .map((d, idx) => ({
          ...d,
          order: idx + 1,
          code: `DEPT-${String(idx + 1).padStart(2, '0')}`,
        }));
      saveDepartments(updated);
      return updated;
    });
  };

  const handlePromoteSubDept = (subId: string) => {
    if (departments.length >= 12) {
      setError('All 12 corporate slots are occupied. Demote a slot before promoting from pool.');
      return;
    }
    const targetSub = unassignedPool.find(s => s.id === subId);
    if (!targetSub) return;
    setUnassignedPool(prev => prev.filter(s => s.id !== subId));
    const promotedDept = convertSubDeptToDepartment(targetSub, departments.length + 1);
    setDepartments(prev => {
      const updated = [...prev, promotedDept].slice(0, 12);
      saveDepartments(updated);
      return updated;
    });
  };

  const handleDemoteSubDept = (subIndex: number) => {
    if (!activeDepartment) return;
    const deptKey = activeDepartment._id || activeDepartment.slug;
    const currentSubs = [...activeSubDepts];
    const targetSub = currentSubs[subIndex];
    if (!targetSub) return;
    setUnassignedPool(prev => [targetSub, ...prev]);
    currentSubs.splice(subIndex, 1);
    setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
  };

  return {
    ...form,
    slots,
    departments,
    filteredDepartments: useMemo(
      () => filterDepartmentsBySearch(departments, searchTerm),
      [departments, searchTerm]
    ),
    selectedSlotIndex,
    activeSlot,
    activeDepartment,
    activeSubDepts,
    unassignedPool,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedDeptForModal,
    draggedDeptIndex,
    dragOverDeptIndex,
    draggedSubIndex,
    dragOverSubIndex,
    metrics: useMemo(() => computeDepartmentMetrics(departments), [departments]),
    selectSlot,
    handleInlineRename,
    handleBatchSaveAll,
    handleMoveDepartment,
    handleResetDefaults,
    handleDelete,
    handlePromoteSubDept,
    handleOpenSubItems: (dept: DepartmentNodeItem) => setSelectedDeptForModal(dept),
    handleCloseSubItems: () => setSelectedDeptForModal(null),
    handleDragStart: (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'dept-slot', slotIndex: index }));
      e.dataTransfer.effectAllowed = 'move';
      setDraggedDeptIndex(index);
    },
    handleDragOver: (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverDeptIndex !== index) setDragOverDeptIndex(index);
    },
    handleDragLeave: (_e: React.DragEvent, index: number) => {
      if (dragOverDeptIndex === index) setDragOverDeptIndex(null);
    },
    handleDrop: (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      setDraggedDeptIndex(null);
      setDragOverDeptIndex(null);
      handleDepartmentSlotDropHelper(
        e,
        targetIndex,
        departments,
        slots,
        unassignedPool,
        draggedDeptIndex,
        token,
        setDepartments,
        setUnassignedPool,
        setSelectedSlotIndex
      );
    },
    handleDragEnd: () => {
      setDraggedDeptIndex(null);
      setDragOverDeptIndex(null);
    },
    handleDropOnPool: (e: React.DragEvent) => {
      e.preventDefault();
      setDraggedDeptIndex(null);
      setDragOverDeptIndex(null);
      handleDropOnPoolHelper(
        e.dataTransfer.getData('text/plain'),
        departments,
        handleDelete,
        handleDemoteSubDept
      );
    },
    handleSubDragStart: (e: React.DragEvent, subIndex: number) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'sub-slot', subIndex }));
      e.dataTransfer.effectAllowed = 'move';
      setDraggedSubIndex(subIndex);
    },
    handleSubDragOver: (e: React.DragEvent, subIndex: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverSubIndex !== subIndex) setDragOverSubIndex(subIndex);
    },
    handleSubDragLeave: (_e: React.DragEvent, subIndex: number) => {
      if (dragOverSubIndex === subIndex) setDragOverSubIndex(null);
    },
    handleSubDrop: (e: React.DragEvent, targetSubIndex: number) => {
      e.preventDefault();
      setDraggedSubIndex(null);
      setDragOverSubIndex(null);
      handleSubDeptDropHelper(
        e,
        targetSubIndex,
        activeDepartment,
        activeSubDepts,
        unassignedPool,
        setUnassignedPool,
        setSubDeptsMap
      );
    },
    handleSubDragEnd: () => {
      setDraggedSubIndex(null);
      setDragOverSubIndex(null);
    },
    handleDemoteSubDept,
  };
}
