import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DepartmentNodeItem, DepartmentFormData } from './DepartmentManager.types';
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
  type DragPayload,
} from './DepartmentManagementWorkspace.dnd';
import {
  loadStoredDepartments,
  saveDepartments,
  computeDepartmentMetrics,
  filterDepartmentsBySearch,
} from './DepartmentManagementWorkspace.storage';
import { useDepartmentForm, INITIAL_FORM } from './DepartmentManagementWorkspace.form';

export function useDepartmentManagementWorkspaceLogic() {
  const [departments, setDepartments] = useState<DepartmentNodeItem[]>(loadStoredDepartments);
  const [unassignedPool, setUnassignedPool] = useState<SupervisorDef[]>(getUnassignedSquadPool());
  const [subDeptsMap, setSubDeptsMap] = useState<Record<string, SupervisorDef[]>>({});
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<DepartmentNodeItem | null>(null);

  const {
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
  } = useDepartmentForm(departments, setDepartments, setError);

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
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDepartments(data.data);
          saveDepartments(data.data);
          return;
        }
      }
      // If backend call doesn't succeed, load from localStorage first
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

  const slots: DepartmentSlotDef[] = useMemo(() => buildFixed12Slots(departments), [departments]);
  const activeSlot = slots[selectedSlotIndex] || slots[0];
  const activeDepartment = activeSlot?.dept || null;

  const activeSubDepts = useMemo(() => {
    if (!activeDepartment) return [];
    const deptKey = activeDepartment._id || activeDepartment.slug;
    if (subDeptsMap[deptKey]) return subDeptsMap[deptKey];
    return getDepartmentSubItems(activeDepartment.slug || activeDepartment._id);
  }, [activeDepartment, subDeptsMap]);

  const selectSlot = useCallback((index: number) => {
    if (index >= 0 && index < 12) setSelectedSlotIndex(index);
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

    if (token && !nodeId.startsWith('canonical-')) {
      fetch('/api/corporate-departments/demote-to-subdept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ departmentId: nodeId }),
      }).catch(() => {});
    }
  };

  const handlePromoteSubDept = (subId: string) => {
    const targetSub = unassignedPool.find(s => s.id === subId);
    if (!targetSub) return;

    setUnassignedPool(prev => prev.filter(s => s.id !== subId));
    const nextOrder = departments.length + 1;
    const promotedDept = convertSubDeptToDepartment(targetSub, nextOrder);
    setDepartments(prev => {
      const updated = [...prev, promotedDept];
      saveDepartments(updated);
      return updated;
    });

    if (token && !subId.startsWith('sub-from-dept-canonical-')) {
      fetch('/api/corporate-departments/promote-to-dept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subDeptId: subId, targetOrder: nextOrder }),
      }).catch(() => {});
    }
  };

  const handleOpenSubItems = (dept: DepartmentNodeItem) => setSelectedDeptForModal(dept);
  const handleCloseSubItems = () => setSelectedDeptForModal(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'dept-slot', slotIndex: index }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDeptIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDeptIndex !== index) setDragOverDeptIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (dragOverDeptIndex === index) setDragOverDeptIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
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
  };

  const handleDragEnd = () => {
    setDraggedDeptIndex(null);
    setDragOverDeptIndex(null);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedDeptIndex(null);
    setDragOverDeptIndex(null);
    const rawData = e.dataTransfer.getData('text/plain');
    handleDropOnPoolHelper(rawData, departments, handleDelete, handleDemoteSubDept);
  };

  const handleSubDragStart = (e: React.DragEvent, subIndex: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'sub-slot', subIndex }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSubIndex(subIndex);
  };

  const handleSubDragOver = (e: React.DragEvent, subIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSubIndex !== subIndex) setDragOverSubIndex(subIndex);
  };

  const handleSubDragLeave = (e: React.DragEvent, subIndex: number) => {
    if (dragOverSubIndex === subIndex) setDragOverSubIndex(null);
  };

  const handleSubDrop = (e: React.DragEvent, targetSubIndex: number) => {
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
  };

  const handleSubDragEnd = () => {
    setDraggedSubIndex(null);
    setDragOverSubIndex(null);
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

  const metrics = useMemo(() => computeDepartmentMetrics(departments), [departments]);

  const filteredDepartments = useMemo(
    () => filterDepartmentsBySearch(departments, searchTerm),
    [departments, searchTerm]
  );

  return {
    slots,
    departments,
    filteredDepartments,
    selectedSlotIndex,
    activeSlot,
    activeDepartment,
    activeSubDepts,
    unassignedPool,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    selectedDeptForModal,
    draggedDeptIndex,
    dragOverDeptIndex,
    draggedSubIndex,
    dragOverSubIndex,
    metrics,
    selectSlot,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
    handlePromoteSubDept,
    handleOpenSubItems,
    handleCloseSubItems,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleDropOnPool,
    handleSubDragStart,
    handleSubDragOver,
    handleSubDragLeave,
    handleSubDrop,
    handleSubDragEnd,
    handleDemoteSubDept,
  };
}
