/**
 * DepartmentManagementWorkspace.form.ts
 * White Caves Real Estate LLC - Department Form & Drawer Sub-Hook (12-Slot CRUD)
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic Layer)
 * Single Purpose File Law: < 350 lines
 */

import { useState } from 'react';
import type { DepartmentNodeItem, DepartmentFormData } from './DepartmentManager.types';
import { saveDepartments } from './DepartmentManagementWorkspace.storage';

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

export function useDepartmentForm(
  departments: DepartmentNodeItem[],
  setDepartments: React.Dispatch<React.SetStateAction<DepartmentNodeItem[]>>,
  setError: (msg: string | null) => void
) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingNodeId(null);
    const nextSlotNum = Math.min(departments.length + 1, 12);
    setFormData({
      ...INITIAL_FORM,
      code: `DEPT-${String(nextSlotNum).padStart(2, '0')}`,
    });
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
        setDepartments(prev => {
          const updated = prev.map(d =>
            d._id === editingNodeId
              ? {
                  ...d,
                  title: formData.title.trim(),
                  code: formData.code.trim(),
                  slug: formData.slug.trim(),
                  color: formData.color,
                  icon: formData.icon,
                  description: formData.description,
                  directorOrManagerId: {
                    fullName:
                      formData.directorName?.trim() ||
                      d.directorOrManagerId?.fullName ||
                      'Appointed Lead',
                    role:
                      formData.directorRole?.trim() ||
                      d.directorOrManagerId?.role ||
                      'Department Director',
                  },
                }
              : d
          );
          saveDepartments(updated);
          return updated;
        });
      } else {
        if (departments.length >= 12) {
          setError(
            'All 12 corporate department slots are currently filled. Edit an existing slot or demote one to the pool first.'
          );
          setIsSubmitting(false);
          return;
        }
        const slotOrder = departments.length + 1;
        const slotCode = formData.code.trim() || `DEPT-${String(slotOrder).padStart(2, '0')}`;
        const newDept: DepartmentNodeItem = {
          _id: `dept-${Date.now()}`,
          title: formData.title.trim(),
          code: slotCode,
          slug: formData.slug.trim(),
          color: formData.color || '#EF4444',
          icon: formData.icon || 'Briefcase',
          description: formData.description || '',
          level: 'DEPARTMENT',
          order: slotOrder,
          subDeptsCount: 9,
          squadsCount: 9,
          headcount: 18,
          directorOrManagerId: {
            fullName: formData.directorName?.trim() || 'Appointed Lead',
            role: formData.directorRole?.trim() || 'Department Director',
          },
        };
        setDepartments(prev => {
          const updated = [...prev, newDept].slice(0, 12);
          saveDepartments(updated);
          return updated;
        });
      }
      handleCloseForm();
    } catch {
      setError('Failed to save corporate department changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
  };
}
