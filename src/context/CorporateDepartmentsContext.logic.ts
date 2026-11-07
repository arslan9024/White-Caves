import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  DepartmentNodeItem,
  DepartmentFormData,
} from '../components/crm/DepartmentManager/DepartmentManager.types';
import type { SupervisorDef } from '../data/assistants108Registry.data';
import {
  buildFixed12Slots,
  getDepartmentSubItems,
  getUnassignedSquadPool,
  convertDepartmentToSubDept,
  convertSubDeptToDepartment,
} from '../components/crm/DepartmentManager/DepartmentManager.data';
import {
  loadStoredDepartments,
  saveDepartments,
  resetStoredDepartmentsToCanonical,
  DEPTS_SYNC_EVENT,
} from '../components/crm/DepartmentManager/DepartmentManagementWorkspace.storage';
import type {
  DragPayload,
  CorporateDepartmentsContextType,
} from './CorporateDepartmentsContext.types';

export const INITIAL_FORM: DepartmentFormData = {
  title: '',
  code: '',
  slug: '',
  color: '#EF4444',
  icon: 'Briefcase',
  description: '',
  directorName: '',
  directorRole: 'Department Director',
};

export function useCorporateDepartmentsState(): CorporateDepartmentsContextType {
  const [departments, setDepartments] = useState<DepartmentNodeItem[]>(loadStoredDepartments);
  const [unassignedPool, setUnassignedPool] = useState<SupervisorDef[]>(getUnassignedSquadPool());
  const [subDeptsMap, setSubDeptsMap] = useState<Record<string, SupervisorDef[]>>({});
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(INITIAL_FORM);
  const [isSubmitting] = useState(false);
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<DepartmentNodeItem | null>(null);

  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState<number | null>(null);
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
          setDepartments(data.data.slice(0, 12));
          saveDepartments(data.data.slice(0, 12));
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

  const slots = useMemo(() => buildFixed12Slots(departments), [departments]);
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

  const handleInlineRename = useCallback((deptId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setDepartments(prev => {
      const updated = prev.map(d => (d._id === deptId ? { ...d, title: newTitle.trim() } : d));
      saveDepartments(updated);
      return updated;
    });
  }, []);

  const handleResetDefaults = useCallback(() => {
    setDepartments(resetStoredDepartmentsToCanonical());
  }, []);

  const handleDemoteDepartment = useCallback(
    (slotIndex: number) => {
      const targetDept = slots[slotIndex]?.dept;
      if (!targetDept) return;
      setUnassignedPool(prev => [convertDepartmentToSubDept(targetDept), ...prev]);
      setDepartments(prev => {
        const updated = prev
          .filter(d => d._id !== targetDept._id)
          .map((d, i) => ({
            ...d,
            order: i + 1,
            code: `DEPT-${String(i + 1).padStart(2, '0')}`,
          }));
        saveDepartments(updated);
        return updated;
      });
    },
    [slots]
  );

  const handleAssignPoolItemToSlot = useCallback(
    (poolItemId: string, targetSlotIndex: number) => {
      const poolItem = unassignedPool.find(p => p.id === poolItemId);
      if (!poolItem) return;
      setUnassignedPool(prev => prev.filter(p => p.id !== poolItemId));
      const prevOccupant = slots[targetSlotIndex]?.dept;

      setDepartments(prev => {
        let filtered = prev;
        if (prevOccupant) {
          setUnassignedPool(p => [convertDepartmentToSubDept(prevOccupant), ...p]);
          filtered = prev.filter(d => d._id !== prevOccupant._id);
        }
        const newDept = convertSubDeptToDepartment(poolItem, targetSlotIndex + 1);
        const next = [...filtered];
        next.splice(targetSlotIndex, 0, newDept);
        const updated = next.slice(0, 12).map((d, i) => ({
          ...d,
          order: i + 1,
          code: `DEPT-${String(i + 1).padStart(2, '0')}`,
        }));
        saveDepartments(updated);
        return updated;
      });
      setSelectedSlotIndex(targetSlotIndex);
    },
    [unassignedPool, slots]
  );

  const handleSlotDragStart = (e: React.DragEvent, slotIndex: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'dept-slot', slotIndex }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSlotIndex(slotIndex);
  };
  const handleSlotDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlotIndex !== slotIndex) setDragOverSlotIndex(slotIndex);
  };
  const handleSlotDragLeave = (_e: React.DragEvent, slotIndex: number) => {
    if (dragOverSlotIndex === slotIndex) setDragOverSlotIndex(null);
  };
  const handleSlotDrop = (e: React.DragEvent, targetSlotIndex: number) => {
    e.preventDefault();
    setDraggedSlotIndex(null);
    setDragOverSlotIndex(null);
    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;
    let payload: DragPayload;
    try {
      payload = JSON.parse(rawData);
    } catch {
      const idx = parseInt(rawData, 10);
      payload = { type: 'dept-slot', slotIndex: isNaN(idx) ? undefined : idx };
    }
    if (payload.type === 'pool-item' && payload.poolItemId) {
      handleAssignPoolItemToSlot(payload.poolItemId, targetSlotIndex);
      return;
    }
    if (payload.type === 'dept-slot' && payload.slotIndex !== undefined) {
      const sourceSlotIndex = payload.slotIndex;
      if (sourceSlotIndex === targetSlotIndex) return;
      const sSlot = slots[sourceSlotIndex];
      const tSlot = slots[targetSlotIndex];
      if (!sSlot?.dept && !tSlot?.dept) return;
      setDepartments(prev => {
        const next = [...prev];
        if (sSlot?.dept && tSlot?.dept) {
          const sIdx = next.findIndex(d => d._id === sSlot.dept!._id);
          const tIdx = next.findIndex(d => d._id === tSlot.dept!._id);
          if (sIdx !== -1 && tIdx !== -1) {
            next[sIdx] = { ...tSlot.dept, order: sourceSlotIndex + 1, code: sSlot.fixedCode };
            next[tIdx] = { ...sSlot.dept, order: targetSlotIndex + 1, code: tSlot.fixedCode };
          }
        }
        const updated = next.map((d, i) => ({
          ...d,
          order: i + 1,
          code: `DEPT-${String(i + 1).padStart(2, '0')}`,
        }));
        saveDepartments(updated);
        return updated;
      });
      setSelectedSlotIndex(targetSlotIndex);
    }
  };
  const handleSlotDragEnd = () => {
    setDraggedSlotIndex(null);
    setDragOverSlotIndex(null);
  };
  const handleSubDragStart = (e: React.DragEvent, subIndex: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'sub-slot', subIndex }));
    setDraggedSubIndex(subIndex);
  };
  const handleSubDragOver = (e: React.DragEvent, subIndex: number) => {
    e.preventDefault();
    if (dragOverSubIndex !== subIndex) setDragOverSubIndex(subIndex);
  };
  const handleSubDragLeave = (_e: React.DragEvent, subIndex: number) => {
    if (dragOverSubIndex === subIndex) setDragOverSubIndex(null);
  };
  const handleSubDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedSubIndex(null);
    setDragOverSubIndex(null);
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
  const handleAssignPoolItemToSubSlot = () => {};
  const handleDropOnPool = (e: React.DragEvent) => e.preventDefault();
  const handleOpenCreate = () => {
    setEditingNodeId(null);
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (dept: DepartmentNodeItem) => {
    setEditingNodeId(dept._id);
    setFormData({
      title: dept.title,
      code: dept.code,
      slug: dept.slug,
      color: dept.color || '#EF4444',
      icon: dept.icon || 'Briefcase',
      description: dept.description || '',
      directorName: dept.directorOrManagerId?.fullName || 'Managing Director',
      directorRole: dept.directorOrManagerId?.role || 'Department Director',
    });
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNodeId(null);
    setFormData(INITIAL_FORM);
  };
  const handleFormChange = (field: keyof DepartmentFormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    handleCloseForm();
  };
  const handleOpenSubItemsModal = (dept: DepartmentNodeItem) => setSelectedDeptForModal(dept);
  const handleCloseSubItemsModal = () => setSelectedDeptForModal(null);

  return {
    slots,
    departments,
    selectedSlotIndex,
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
    draggedSlotIndex,
    dragOverSlotIndex,
    draggedSubIndex,
    dragOverSubIndex,
    selectSlot,
    handleInlineRename,
    handleResetDefaults,
    handleSlotDragStart,
    handleSlotDragOver,
    handleSlotDragLeave,
    handleSlotDrop,
    handleSlotDragEnd,
    handleDemoteDepartment,
    handleAssignPoolItemToSlot,
    handleSubDragStart,
    handleSubDragOver,
    handleSubDragLeave,
    handleSubDrop,
    handleSubDragEnd,
    handleDemoteSubDept,
    handleAssignPoolItemToSubSlot,
    handleDropOnPool,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmitForm,
    handleOpenSubItemsModal,
    handleCloseSubItemsModal,
  };
}
