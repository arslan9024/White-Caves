/**
 * useTransactionManagement — Custom hook for Transaction CRUD operations
 * Extracts all business logic, state, and Redux interactions from TransactionManagementPage.
 * Makes the page component a pure rendering layer and this hook independently testable.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import type { AppDispatch } from '../../../store/store';
import {
  selectAllTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
  fetchTransactionsFromAPI,
  createTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
  addActivity,
} from '../../../store/crmDataSlice';

const log = createLogger('useTransactionManagement');
// ─── Types ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string | number;
  type?: string;
  status?: string;
  amount?: number;
  property_id?: string | number;
  property_title?: string;
  client_name?: string;
  agent_name?: string;
  closing_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface TransactionFormData {
  type: string;
  status: string;
  amount: string;
  property_title: string;
  client_name: string;
  agent_name: string;
  closing_date: string;
  notes: string;
}

type TransactionBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: TransactionBadgeVariant }
> = {
  draft: { label: 'Draft', color: '#6B7280', badgeVariant: 'secondary' },
  pending: { label: 'Pending', color: '#F59E0B', badgeVariant: 'warning' },
  in_progress: { label: 'In Progress', color: '#3B82F6', badgeVariant: 'info' },
  completed: { label: 'Completed', color: '#10B981', badgeVariant: 'success' },
  cancelled: { label: 'Cancelled', color: '#EF4444', badgeVariant: 'error' },
};

export const TYPE_LABELS: Record<string, string> = {
  sale: '🏠 Sale',
  rental: '🔑 Rental',
  lease: '📋 Lease',
};

export const PIPELINE_STAGES = ['draft', 'pending', 'in_progress', 'completed'];

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM: TransactionFormData = {
  type: 'sale',
  status: 'draft',
  amount: '',
  property_title: '',
  client_name: '',
  agent_name: '',
  closing_date: '',
  notes: '',
};

// ─── Hook ───────────────────────────────────────────────────────────────

export function useTransactionManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allTransactions = useSelector(selectAllTransactions) as Transaction[];
  const loading = useSelector(selectTransactionsLoading);
  const error = useSelector(selectTransactionsError);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchTransactionsFromAPI({}));
  }, [dispatch]);

  // ─── Local state ────────────────────────────────────────────────

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({ ...EMPTY_FORM });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Derived data ───────────────────────────────────────────────

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t: Transaction) => {
      const matchesSearch =
        !search ||
        [t.property_title, t.client_name, t.agent_name, t.notes].some(field =>
          field?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allTransactions, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const summaryStats = useMemo(() => {
    const total = allTransactions.length;
    const pending = allTransactions.filter(t => t.status === 'pending').length;
    const completed = allTransactions.filter(t => t.status === 'completed').length;
    const totalValue = allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    return { total, pending, completed, totalValue };
  }, [allTransactions]);

  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_STAGES.forEach(stage => {
      counts[stage] = allTransactions.filter(t => t.status === stage).length;
    });
    return counts;
  }, [allTransactions]);

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
    setSelectedTransaction(null);
    resetForm();
  }, [resetForm]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteConfirm(false);
    setSelectedTransaction(null);
  }, []);

  const handleCreate = useCallback(() => {
    if (!formData.amount || Number(formData.amount) <= 0) return;

    const transactionData = {
      type: formData.type,
      status: formData.status,
      amount: Number(formData.amount),
      property_title: formData.property_title.trim(),
      client_name: formData.client_name.trim(),
      agent_name: formData.agent_name.trim(),
      closing_date: formData.closing_date || undefined,
      notes: formData.notes.trim(),
      created_at: new Date().toISOString(),
    };

    dispatch(createTransactionAPI(transactionData))
      .then(result => {
        if (createTransactionAPI.fulfilled.match(result)) {
          dispatch(
            addActivity({
              id: Date.now(),
              type: 'transaction',
              description: `New ${formData.type} transaction created`,
              timestamp: new Date().toISOString(),
            })
          );
          setShowCreateModal(false);
          resetForm();
        } else if (createTransactionAPI.rejected.match(result)) {
          const msg =
            (result.payload as string) || 'Failed to create transaction. Please try again.';
          setErrorMessage(msg);
        }
      })
      .catch((error: unknown) => {
        log.error(
          'Failed to create transaction:',
          error instanceof Error ? error.message : String(error)
        );
        setErrorMessage('An unexpected error occurred. Please try again.');
      });
  }, [dispatch, formData, resetForm]);

  const handleEdit = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type || 'sale',
      status: transaction.status || 'draft',
      amount: transaction.amount?.toString() || '',
      property_title: transaction.property_title || '',
      client_name: transaction.client_name || '',
      agent_name: transaction.agent_name || '',
      closing_date: transaction.closing_date || '',
      notes: transaction.notes || '',
    });
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMessage('Transaction amount is required.');
      return;
    }
    if (selectedTransaction) {
      const typeSnapshot = formData.type;
      dispatch(
        updateTransactionAPI({
          id: String(selectedTransaction.id),
          type: formData.type,
          status: formData.status,
          amount: Number(formData.amount) || 0,
          closingDate: formData.closing_date || undefined,
          notes: formData.notes.trim(),
        })
      )
        .then(result => {
          if (updateTransactionAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'transaction',
                description: `Transaction updated: ${typeSnapshot}`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowEditModal(false);
            setSelectedTransaction(null);
            resetForm();
          } else if (updateTransactionAPI.rejected.match(result)) {
            const msg =
              (result.payload as string) || 'Failed to update transaction. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to update transaction:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedTransaction, formData, resetForm]);

  const handleDelete = useCallback(() => {
    if (selectedTransaction) {
      dispatch(deleteTransactionAPI(String(selectedTransaction.id)))
        .then(result => {
          if (deleteTransactionAPI.fulfilled.match(result)) {
            dispatch(
              addActivity({
                id: Date.now(),
                type: 'transaction',
                description: `Transaction deleted`,
                timestamp: new Date().toISOString(),
              })
            );
            setShowDeleteConfirm(false);
            setSelectedTransaction(null);
          } else if (deleteTransactionAPI.rejected.match(result)) {
            const msg =
              (result.payload as string) || 'Failed to delete transaction. Please try again.';
            setErrorMessage(msg);
          }
        })
        .catch((error: unknown) => {
          log.error(
            'Failed to delete transaction:',
            error instanceof Error ? error.message : String(error)
          );
          setErrorMessage('An unexpected error occurred. Please try again.');
        });
    }
  }, [dispatch, selectedTransaction]);

  const confirmDelete = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteConfirm(true);
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
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

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    dispatch(fetchTransactionsFromAPI({}));
  }, [dispatch]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    allTransactions,
    filteredTransactions,
    paginatedTransactions,
    summaryStats,
    pipelineCounts,
    totalPages,
    loading,
    error,
    // State
    search,
    statusFilter,
    typeFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedTransaction,
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
    handleTypeFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    // Formatters
    getStatusBadgeVariant,
    formatCurrency,
    formatDate,
  };
}
