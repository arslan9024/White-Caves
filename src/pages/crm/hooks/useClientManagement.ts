/**
 * useClientManagement — Custom hook for Client CRUD operations
 * Extracts all business logic, state, and Redux interactions from ClientManagementPage.
 * Makes the page component a pure rendering layer and this hook independently testable.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate as formatDateUtil } from '../../../utils';
import { isValidEmail, isValidPhone } from '../../../utils/validation';
import { createLogger } from '../../../utils/logger';
import type { AppDispatch } from '../../../store/store';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
  fetchClientsFromAPI,
  createClientAPI,
  updateClientAPI,
  deleteClientAPI,
  addActivity,
} from '../../../store/crmDataSlice';

const log = createLogger('useClientManagement');

// ─── Types ──────────────────────────────────────────────────────────────

export interface Client {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  company?: string;
  status?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  company: string;
  status: string;
  tags: string;
  notes: string;
}

type ClientBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; badgeVariant: ClientBadgeVariant }
> = {
  buyer: { label: 'Buyer', icon: '🏠', badgeVariant: 'info' },
  seller: { label: 'Seller', icon: '💼', badgeVariant: 'primary' },
  owner: { label: 'Owner', icon: '🔑', badgeVariant: 'success' },
  investor: { label: 'Investor', icon: '📈', badgeVariant: 'warning' },
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: ClientBadgeVariant }
> = {
  active: { label: 'Active', color: '#10B981', badgeVariant: 'success' },
  inactive: { label: 'Inactive', color: '#6B7280', badgeVariant: 'secondary' },
  vip: { label: 'VIP', color: '#F59E0B', badgeVariant: 'warning' },
};

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  type: 'buyer',
  company: '',
  status: 'active',
  tags: '',
  notes: '',
};

// ─── Hook ───────────────────────────────────────────────────────────────

export function useClientManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allClients = useSelector(selectAllClients) as Client[];
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchClientsFromAPI({}));
  }, [dispatch]);

  // ─── Local state ────────────────────────────────────────────────

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({ ...EMPTY_FORM });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredClients = useMemo(() => {
    return allClients.filter((c: Client) => {
      const matchesSearch =
        !search ||
        [c.name, c.email, c.phone, c.company].some(field =>
          field?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesType = typeFilter === 'all' || c.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allClients, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allClients.length };
    allClients.forEach((c: Client) => {
      const type = c.type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [allClients]);

  // ─── Actions ────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
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
    setSelectedClient(null);
    resetForm();
  }, [resetForm]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteConfirm(false);
    setSelectedClient(null);
  }, []);

  const handleCreate = useCallback(() => {
    if (!formData.name.trim()) return;
    if (formData.email && !isValidEmail(formData.email)) return;
    if (formData.phone && !isValidPhone(formData.phone)) return;

    const clientData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      type: formData.type,
      company: formData.company.trim(),
      status: formData.status,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
        : [],
      notes: formData.notes.trim(),
      created_at: new Date().toISOString(),
    };

    dispatch(createClientAPI(clientData))
      .then(result => {
        if (createClientAPI.fulfilled.match(result)) {
          dispatch(
            addActivity({
              id: Date.now(),
              type: 'client',
              description: `New client added: ${formData.name}`,
              timestamp: new Date().toISOString(),
            })
          );
          setShowCreateModal(false);
          resetForm();
        } else if (createClientAPI.rejected.match(result)) {
          const msg = (result.payload as string) || 'Failed to create client. Please try again.';
          setErrorMessage(msg);
        }
      })
      .catch((error: unknown) => {
        log.error(
          'Failed to create client:',
          error instanceof Error ? error.message : String(error)
        );
        setErrorMessage('An unexpected error occurred. Please try again.');
      });
  }, [dispatch, formData, resetForm]);

  const handleEdit = useCallback((client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      type: client.type || 'buyer',
      company: client.company || '',
      status: client.status || 'active',
      tags: client.tags?.join(', ') || '',
      notes: client.notes || '',
    });
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!formData.name.trim()) {
      setErrorMessage('Client name is required.');
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (selectedClient) {
      const nameSnapshot = formData.name;
      dispatch(
        updateClientAPI({
          id: String(selectedClient.id),
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          type: formData.type,
          company: formData.company.trim(),
          status: formData.status,
          tags: formData.tags
            ? formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            : [],
          notes: formData.notes.trim(),
          updated_at: new Date().toISOString(),
        })
      )
        .then(result => {
          if (updateClientAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'client',
                description: `Client updated: ${nameSnapshot}`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowEditModal(false);
            setSelectedClient(null);
            resetForm();
          } else if (updateClientAPI.rejected.match(result)) {
            const msg = (result.payload as string) || 'Failed to update client. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to update client:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedClient, formData, resetForm]);

  const handleDelete = useCallback(() => {
    if (selectedClient) {
      dispatch(deleteClientAPI(String(selectedClient.id)))
        .then(result => {
          if (deleteClientAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'client',
                description: `Client deleted: ${selectedClient.name}`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowDeleteConfirm(false);
            setSelectedClient(null);
          } else if (deleteClientAPI.rejected.match(result)) {
            const msg = (result.payload as string) || 'Failed to delete client. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to delete client:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedClient]);

  const confirmDelete = useCallback((client: Client) => {
    setSelectedClient(client);
    setShowDeleteConfirm(true);
  }, []);

  const getTypeBadgeVariant = useCallback((type: string) => {
    return TYPE_CONFIG[type]?.badgeVariant || 'secondary';
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    return STATUS_CONFIG[status]?.badgeVariant || 'secondary';
  }, []);

  const formatDate = useCallback((dateStr: string | undefined) => formatDateUtil(dateStr), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    dispatch(fetchClientsFromAPI({}));
  }, [dispatch]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allClients,
    filteredClients,
    paginatedClients,
    typeCounts,
    totalPages,
    loading,
    error,
    // State
    search,
    typeFilter,
    statusFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedClient,
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
    handleTypeFilterChange,
    handleStatusFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    // Formatters
    getTypeBadgeVariant,
    getStatusBadgeVariant,
    formatDate,
  };
}
