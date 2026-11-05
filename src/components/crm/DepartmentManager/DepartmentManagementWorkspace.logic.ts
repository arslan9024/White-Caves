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
  type DragPayload,
} from './DepartmentManagementWorkspace.dnd';

const INITIAL_FORM: DepartmentFormData = {
  title: '',
  code: '',
  slug: '',
  color: '#EF4444',
  icon: 'Briefcase',
  description: '',
};

export function useDepartmentManagementWorkspaceLogic() {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleDelete = (nodeId: string) => {
    const targetDept = departments.find(d => d._id === nodeId);
    if (!targetDept) return;

    setUnassignedPool(prev => [convertDepartmentToSubDept(targetDept), ...prev]);
    setDepartments(prev =>
      prev
        .filter(d => d._id !== nodeId)
        .map((d, idx) => ({
          ...d,
          order: idx + 1,
          code: `DEPT-${String(idx + 1).padStart(2, '0')}`,
        }))
    );

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
    setDepartments(prev => [...prev, promotedDept]);

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
    const rawData = e.dataTransfer.getData('text/plain');
    setDraggedDeptIndex(null);
    setDragOverDeptIndex(null);
    if (!rawData) return;

    let payload: DragPayload;
    try {
      payload = JSON.parse(rawData);
    } catch {
      const idx = parseInt(rawData, 10);
      payload = { type: 'dept-slot', slotIndex: isNaN(idx) ? undefined : idx };
    }

    if (
      payload.type === 'dept-slot' &&
      payload.slotIndex !== undefined &&
      departments[payload.slotIndex]
    ) {
      handleDelete(departments[payload.slotIndex]._id);
    } else if (payload.type === 'sub-slot' && payload.subIndex !== undefined) {
      handleDemoteSubDept(payload.subIndex);
    }
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

  const metrics = useMemo(
    () => ({
      totalDepartments: departments.length,
      totalSubDepts: departments.reduce((acc, d) => acc + (d.subDeptsCount || 9), 0),
      totalSquads: departments.reduce((acc, d) => acc + (d.squadsCount || 9), 0),
      totalHeadcount: departments.reduce((acc, d) => acc + (d.headcount || 0), 0),
    }),
    [departments]
  );

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    const term = searchTerm.toLowerCase();
    return departments.filter(
      d =>
        d.title.toLowerCase().includes(term) ||
        d.code.toLowerCase().includes(term) ||
        d.slug.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term))
    );
  }, [departments, searchTerm]);

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
