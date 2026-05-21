/**
 * useLeadManagement — Custom hook for Lead CRUD operations
 * Extracts all business logic, state, and Redux interactions from LeadManagementPage.
 * Makes the page component a pure rendering layer and this hook independently testable.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../../utils';
import { isValidEmail, isValidPhone } from '../../../utils/validation';
import { createLogger } from '../../../utils/logger';

const log = createLogger('useLeadManagement');
import type { AppDispatch } from '../../../store/store';
import {
  selectAllLeads,
  selectLeadsLoading,
  selectLeadsError,
  fetchLeadsFromAPI,
  createLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  addActivity,
} from '../../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────

export interface Lead {
  id: string | number;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  score?: number | null;
  budget?: number;
  value?: number;
  assigned_to?: string;
  agent_id?: string | number;
  notes?: string;
  created_at?: string;
  last_activity?: string;
  [key: string]: unknown;
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  budget: string;
  notes: string;
}

type LeadBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: LeadBadgeVariant }
> = {
  new: { label: 'New', color: '#10B981', badgeVariant: 'success' },
  contacted: { label: 'Contacted', color: '#8B5CF6', badgeVariant: 'primary' },
  qualified: { label: 'Qualified', color: '#EC4899', badgeVariant: 'primary' },
  viewing: { label: 'Viewing', color: '#3B82F6', badgeVariant: 'info' },
  offered: { label: 'Offered', color: '#F59E0B', badgeVariant: 'warning' },
  negotiating: { label: 'Negotiating', color: '#F97316', badgeVariant: 'warning' },
  won: { label: 'Won', color: '#10B981', badgeVariant: 'success' },
  lost: { label: 'Lost', color: '#6B7280', badgeVariant: 'secondary' },
};

export const SOURCE_LABELS: Record<string, string> = {
  direct: '👤 Direct',
  website: '🌐 Website',
  referral: '🤝 Referral',
  social: '📱 Social',
  portal: '🏢 Portal',
  cold_call: '📞 Cold Call',
  event: '🎤 Event',
  other: '🧩 Other',
};

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM: LeadFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'direct',
  budget: '',
  notes: '',
};

// ─── Hook ───────────────────────────────────────────────────────────────

export function useLeadManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allLeads = useSelector(selectAllLeads) as Lead[];
  const loading = useSelector(selectLeadsLoading);
  const error = useSelector(selectLeadsError);

  // Fetch on mount
  useEffect(() => {
    const promise = dispatch(fetchLeadsFromAPI({}));
    return () => {
      promise.abort?.();
    };
  }, [dispatch]);

  // ─── Local state ────────────────────────────────────────────────

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>({ ...EMPTY_FORM });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead: Lead) => {
      const matchesSearch =
        !search ||
        [lead.name, lead.company, lead.email, lead.phone].some(field =>
          field?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [allLeads, search, statusFilter, sourceFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allLeads.length };
    allLeads.forEach((lead: Lead) => {
      const status = lead.status || 'unknown';
      // eslint-disable-next-line security/detect-object-injection
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [allLeads]);

  // ─── Actions ────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
    setErrorMessage(null);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    resetForm();
  }, [resetForm]);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedLead(null);
    resetForm();
  }, [resetForm]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteConfirm(false);
    setSelectedLead(null);
  }, []);

  const handleCreate = useCallback(() => {
    if (!formData.name.trim()) return;
    if (formData.email && !isValidEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      setErrorMessage('Please enter a valid UAE phone number.');
      return;
    }
    if (formData.budget && Number(formData.budget) < 0) {
      setErrorMessage('Budget cannot be negative.');
      return;
    }

    setErrorMessage(null);

    const leadData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      budget: formData.budget ? Number(formData.budget) : undefined,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    };

    dispatch(createLeadAPI(leadData))
      .then(result => {
        if (createLeadAPI.fulfilled.match(result)) {
          dispatch(
            addActivity({
              id: Date.now(),
              type: 'lead',
              description: `New lead created: ${formData.name} (${formData.company || 'No company'})`,
              timestamp: new Date().toISOString(),
            })
          );
          setShowCreateModal(false);
          resetForm();
        } else if (createLeadAPI.rejected.match(result)) {
          const msg = (result.payload as string) || 'Failed to create lead. Please try again.';
          setErrorMessage(msg);
        }
      })
      .catch((error: unknown) => {
        log.error('Failed to create lead:', error instanceof Error ? error.message : String(error));
        setErrorMessage('An unexpected error occurred. Please try again.');
      });
  }, [dispatch, formData, resetForm]);

  const handleEdit = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name || '',
      company: lead.company || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'new',
      source: lead.source || 'direct',
      budget: lead.budget?.toString() || lead.value?.toString() || '',
      notes: lead.notes || '',
    });
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!formData.name.trim()) {
      setErrorMessage('Lead name is required.');
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      setErrorMessage('Please enter a valid UAE phone number.');
      return;
    }
    if (formData.budget && Number(formData.budget) < 0) {
      setErrorMessage('Budget cannot be negative.');
      return;
    }

    setErrorMessage(null);
    if (selectedLead) {
      const nameSnapshot = formData.name;
      dispatch(
        updateLeadAPI({
          id: selectedLead.id,
          ...formData,
          budget: formData.budget ? Number(formData.budget) : undefined,
          last_activity: new Date().toISOString(),
        })
      )
        .then(result => {
          if (updateLeadAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'lead',
                description: `Lead updated: ${nameSnapshot}`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowEditModal(false);
            setSelectedLead(null);
            resetForm();
          } else if (updateLeadAPI.rejected.match(result)) {
            const msg = (result.payload as string) || 'Failed to update lead. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to update lead:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedLead, formData, resetForm]);

  const handleDelete = useCallback(() => {
    if (selectedLead) {
      dispatch(deleteLeadAPI(selectedLead.id))
        .then(result => {
          if (deleteLeadAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'lead',
                description: `Lead deleted: ${selectedLead.name}`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowDeleteConfirm(false);
            setSelectedLead(null);
          } else if (deleteLeadAPI.rejected.match(result)) {
            const msg = (result.payload as string) || 'Failed to delete lead. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to delete lead:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedLead]);

  const confirmDelete = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setErrorMessage(null);
    setShowDeleteConfirm(true);
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    // eslint-disable-next-line security/detect-object-injection
    return STATUS_CONFIG[status]?.badgeVariant || 'secondary';
  }, []);

  const formatCurrency = useCallback(
    (amount: number | undefined) => formatCurrencyUtil(amount),
    []
  );
  const formatDate = useCallback((dateStr: string | undefined) => formatDateUtil(dateStr), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSourceFilterChange = useCallback((value: string) => {
    setSourceFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    dispatch(fetchLeadsFromAPI({}));
  }, [dispatch]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allLeads,
    filteredLeads,
    paginatedLeads,
    statusCounts,
    totalPages,
    loading,
    error,
    // State
    search,
    statusFilter,
    sourceFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedLead,
    formData,
    setFormData,
    errorMessage,
    setErrorMessage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    handleCreate,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    confirmDelete,
    handleSearchChange,
    handleStatusFilterChange,
    handleSourceFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    // Formatters
    getStatusBadgeVariant,
    formatCurrency,
    formatDate,
  };
}
