import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  DepartmentNodeItem,
  DepartmentFormData,
} from '../components/crm/DepartmentManager/DepartmentManager.types';
import type { SupervisorDef } from '../data/assistants108Registry.data';
import {
  FALLBACK_12_DEPARTMENTS,
  buildFixed12Slots,
  getDepartmentSubItems,
  getUnassignedSquadPool,
  convertDepartmentToSubDept,
  convertSubDeptToDepartment,
} from '../components/crm/DepartmentManager/DepartmentManager.data';
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
};

export function useCorporateDepartmentsState(): CorporateDepartmentsContextType {
  const [departments, setDepartments] = useState<DepartmentNodeItem[]>(FALLBACK_12_DEPARTMENTS);
  const [unassignedPool, setUnassignedPool] = useState<SupervisorDef[]>(getUnassignedSquadPool());
  const [subDeptsMap, setSubDeptsMap] = useState<Record<string, SupervisorDef[]>>({});
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          setDepartments(data.data);
          return;
        }
      }
      setDepartments(FALLBACK_12_DEPARTMENTS);
    } catch {
      setDepartments(FALLBACK_12_DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const slots = useMemo(() => buildFixed12Slots(departments), [departments]);
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

  const handleDemoteDepartment = useCallback(
    (slotIndex: number) => {
      const targetSlot = slots[slotIndex];
      if (!targetSlot?.dept) return;
      const targetDept = targetSlot.dept;

      setUnassignedPool(prev => [convertDepartmentToSubDept(targetDept), ...prev]);
      setDepartments(prev => prev.filter(d => d._id !== targetDept._id));

      if (token && !targetDept._id.startsWith('canonical-')) {
        fetch('/api/corporate-departments/demote-to-subdept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ departmentId: targetDept._id }),
        }).catch(() => {});
      }
    },
    [slots, token]
  );

  const handleAssignPoolItemToSlot = useCallback(
    (poolItemId: string, targetSlotIndex: number) => {
      const poolItem = unassignedPool.find(p => p.id === poolItemId);
      if (!poolItem) return;

      setUnassignedPool(prev => prev.filter(p => p.id !== poolItemId));
      const targetSlot = slots[targetSlotIndex];
      const prevOccupant = targetSlot?.dept;

      setDepartments(prev => {
        let filtered = prev;
        if (prevOccupant) {
          setUnassignedPool(p => [convertDepartmentToSubDept(prevOccupant), ...p]);
          filtered = prev.filter(d => d._id !== prevOccupant._id);
        }
        const newDept = convertSubDeptToDepartment(poolItem, targetSlotIndex + 1);
        const next = [...filtered];
        next.splice(targetSlotIndex, 0, newDept);
        return next.slice(0, 12).map((d, i) => ({
          ...d,
          order: i + 1,
          code: `DEPT-${String(i + 1).padStart(2, '0')}`,
        }));
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

  const handleSlotDragLeave = (e: React.DragEvent, slotIndex: number) => {
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
        const sDept = sSlot?.dept;
        const tDept = tSlot?.dept;
        if (sDept && tDept) {
          const sIdx = next.findIndex(d => d._id === sDept._id);
          const tIdx = next.findIndex(d => d._id === tDept._id);
          if (sIdx !== -1 && tIdx !== -1) {
            next[sIdx] = { ...tDept, order: sourceSlotIndex + 1, code: sSlot.fixedCode };
            next[tIdx] = { ...sDept, order: targetSlotIndex + 1, code: tSlot.fixedCode };
          }
        }
        return next.map((d, i) => ({
          ...d,
          order: i + 1,
          code: `DEPT-${String(i + 1).padStart(2, '0')}`,
        }));
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
    if (!activeDepartment) return;

    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;
    let payload: DragPayload;
    try {
      payload = JSON.parse(rawData);
    } catch {
      return;
    }

    const deptKey = activeDepartment._id || activeDepartment.slug;
    const currentSubs = [...activeSubDepts];

    if (payload.type === 'pool-item' && payload.poolItemId) {
      const poolItem = unassignedPool.find(p => p.id === payload.poolItemId);
      if (!poolItem) return;
      setUnassignedPool(prev => prev.filter(p => p.id !== payload.poolItemId));
      const oldSub = currentSubs[targetSubIndex];
      if (oldSub) setUnassignedPool(prev => [oldSub, ...prev]);
      currentSubs[targetSubIndex] = {
        ...poolItem,
        code: `SQ-${String(targetSubIndex + 1).padStart(2, '0')}`,
        supervisorIndex: targetSubIndex + 1,
      };
      setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
      return;
    }

    if (payload.type === 'sub-slot' && payload.subIndex !== undefined) {
      const sourceSubIndex = payload.subIndex;
      if (sourceSubIndex === targetSubIndex) return;
      const itemA = currentSubs[sourceSubIndex];
      const itemB = currentSubs[targetSubIndex];
      if (!itemA || !itemB) return;
      currentSubs[targetSubIndex] = {
        ...itemA,
        code: `SQ-${String(targetSubIndex + 1).padStart(2, '0')}`,
        supervisorIndex: targetSubIndex + 1,
      };
      currentSubs[sourceSubIndex] = {
        ...itemB,
        code: `SQ-${String(sourceSubIndex + 1).padStart(2, '0')}`,
        supervisorIndex: sourceSubIndex + 1,
      };
      setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
    }
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

  const handleAssignPoolItemToSubSlot = (poolItemId: string, targetSubIndex: number) => {
    if (!activeDepartment) return;
    const poolItem = unassignedPool.find(p => p.id === poolItemId);
    if (!poolItem) return;
    setUnassignedPool(prev => prev.filter(p => p.id !== poolItemId));
    const deptKey = activeDepartment._id || activeDepartment.slug;
    const currentSubs = [...activeSubDepts];
    currentSubs[targetSubIndex] = {
      ...poolItem,
      code: `SQ-${String(targetSubIndex + 1).padStart(2, '0')}`,
      supervisorIndex: targetSubIndex + 1,
    };
    setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;
    let payload: DragPayload;
    try {
      payload = JSON.parse(rawData);
    } catch {
      const idx = parseInt(rawData, 10);
      payload = { type: 'dept-slot', slotIndex: isNaN(idx) ? undefined : idx };
    }
    if (payload.type === 'dept-slot' && payload.slotIndex !== undefined) {
      handleDemoteDepartment(payload.slotIndex);
    } else if (payload.type === 'sub-slot' && payload.subIndex !== undefined) {
      handleDemoteSubDept(payload.subIndex);
    }
  };

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
    });
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNodeId(null);
    setFormData(INITIAL_FORM);
  };
  const handleFormChange = (field: keyof DepartmentFormData, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingNodeId) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (!prev.code) next.code = `DEPT-${value.slice(0, 3).toUpperCase()}`;
      }
      return next;
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim() || !formData.slug.trim()) {
      setError('Title, Code, and Slug are strictly required.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      if (editingNodeId) {
        setDepartments(prev =>
          prev.map(d => (d._id === editingNodeId ? { ...d, ...formData } : d))
        );
      } else {
        const slotCode = `DEPT-${String(departments.length + 1).padStart(2, '0')}`;
        const newDept: DepartmentNodeItem = {
          _id: `dept-${Date.now()}`,
          ...formData,
          code: slotCode,
          level: 'DEPARTMENT',
          order: departments.length + 1,
          subDeptsCount: 9,
          squadsCount: 9,
          headcount: 18,
          directorOrManagerId: { fullName: 'Appointed Lead', role: 'Department Director' },
        };
        setDepartments(prev => [...prev, newDept]);
      }
      handleCloseForm();
    } catch {
      setError('Failed to save corporate department changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSubItemsModal = (dept: DepartmentNodeItem) => setSelectedDeptForModal(dept);
  const handleCloseSubItemsModal = () => setSelectedDeptForModal(null);

  return useMemo(
    () => ({
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
    }),
    [
      slots,
      departments,
      selectedSlotIndex,
      activeDepartment,
      activeSubDepts,
      unassignedPool,
      loading,
      error,
      searchTerm,
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
      handleDemoteDepartment,
      handleAssignPoolItemToSlot,
      handleDemoteSubDept,
    ]
  );
}
