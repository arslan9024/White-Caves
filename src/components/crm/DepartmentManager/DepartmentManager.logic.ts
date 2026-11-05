import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DepartmentNodeItem, DepartmentFormData } from './DepartmentManager.types';

const INITIAL_FORM: DepartmentFormData = {
  title: '',
  code: '',
  slug: '',
  color: '#EF4444',
  icon: 'Briefcase',
  description: '',
};

export function useDepartmentManagerLogic() {
  const [departments, setDepartments] = useState<DepartmentNodeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/corporate-departments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDepartments(data.data);
      } else {
        setError(data.message || 'Failed to load corporate departments');
      }
    } catch {
      setError('Network communication failed with /api/corporate-departments');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

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
        if (!prev.code) {
          next.code = `DEPT-${value.slice(0, 3).toUpperCase()}`;
        }
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
        // PUT update
        const res = await fetch(`/api/corporate-departments/${editingNodeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            color: formData.color,
            icon: formData.icon,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to update department');
      } else {
        // POST create
        const res = await fetch('/api/corporate-departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to create department');
      }
      handleCloseForm();
      await fetchDepartments();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deptId: string, deptName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${deptName}? Nested sub-departments and squads will also be cleaned up.`
      )
    ) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/corporate-departments/${deptId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete department');
      await fetchDepartments();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    const query = searchTerm.toLowerCase();
    return departments.filter(
      d =>
        d.title.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.slug.toLowerCase().includes(query)
    );
  }, [departments, searchTerm]);

  return {
    departments: filteredDepartments,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
    refetch: fetchDepartments,
  };
}
