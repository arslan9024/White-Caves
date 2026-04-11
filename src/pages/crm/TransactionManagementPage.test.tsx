/**
 * TransactionManagementPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  { id: '1', type: 'sale', status: 'pending', amount: 5000000, property_title: 'Palm Villa', client_name: 'Ahmed', agent_name: 'Sarah', closing_date: '2025-02-01', notes: '' },
  { id: '2', type: 'rental', status: 'completed', amount: 120000, property_title: 'Marina Apt', client_name: 'John', agent_name: 'Ali', closing_date: '2025-03-01', notes: '' },
];

const defaultFormData = {
  type: 'sale', status: 'draft', amount: '', property_title: '',
  client_name: '', agent_name: '', closing_date: '', notes: '',
};

const mockOpenCreateModal = vi.fn();
const mockGoBack = vi.fn();

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useTransactionManagement', () => ({
  useTransactionManagement: () => ({
    filteredTransactions: MOCK_TRANSACTIONS,
    paginatedTransactions: MOCK_TRANSACTIONS,
    summaryStats: { total: 2, pending: 1, completed: 1, totalValue: 5120000 },
    pipelineCounts: { draft: 0, pending: 1, in_progress: 0, completed: 1 },
    loading: false,
    error: null,
    search: '',
    statusFilter: 'all',
    typeFilter: 'all',
    currentPage: 1,
    showCreateModal: false,
    showEditModal: false,
    showDeleteConfirm: false,
    selectedTransaction: null,
    formData: defaultFormData,
    setFormData: vi.fn(),
    ITEMS_PER_PAGE: 10,
    openCreateModal: mockOpenCreateModal,
    closeCreateModal: vi.fn(),
    closeEditModal: vi.fn(),
    closeDeleteModal: vi.fn(),
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleSaveEdit: vi.fn(),
    handleDelete: vi.fn(),
    confirmDelete: vi.fn(),
    handleSearchChange: vi.fn(),
    handleStatusFilterChange: vi.fn(),
    handleTypeFilterChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: mockGoBack,
    getStatusBadgeVariant: (s: string) => s === 'completed' ? 'success' : 'warning',
    formatCurrency: (v: number | undefined) => v ? `AED ${v.toLocaleString()}` : '—',
    formatDate: (v: string | undefined) => v ? new Date(v).toLocaleDateString() : 'N/A',
    ...hookOverrides,
  }),
  STATUS_CONFIG: {
    draft: { label: 'Draft', color: '#6B7280', badgeVariant: 'secondary' },
    pending: { label: 'Pending', color: '#F59E0B', badgeVariant: 'warning' },
    in_progress: { label: 'In Progress', color: '#3B82F6', badgeVariant: 'info' },
    completed: { label: 'Completed', color: '#10B981', badgeVariant: 'success' },
    cancelled: { label: 'Cancelled', color: '#EF4444', badgeVariant: 'error' },
  },
  TYPE_LABELS: {
    sale: '🏠 Sale',
    rental: '🔑 Rental',
    lease: '📋 Lease',
  },
  PIPELINE_STAGES: ['draft', 'pending', 'in_progress', 'completed'],
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../components/ui', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
  Pagination: ({ currentPage, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>Page {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('../../shared/components/ui/Modal', () => ({
  Modal: ({ children, title, isOpen, onClose }: any) => isOpen ? (
    <div data-testid="modal" role="dialog">
      <h2>{title}</h2>
      <button onClick={onClose} data-testid="modal-close">Close</button>
      {children}
    </div>
  ) : null,
}));

import TransactionManagementPage from './TransactionManagementPage';

describe('TransactionManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Transaction Management"', () => {
    render(<TransactionManagementPage />);
    expect(screen.getByText(/Transaction Management/)).toBeDefined();
  });

  it('renders pipeline stage indicators', () => {
    render(<TransactionManagementPage />);
    // Pipeline labels also appear in filter dropdowns, so use getAllByText
    expect(screen.getAllByText('Draft').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });

  it('renders table headers', () => {
    render(<TransactionManagementPage />);
    expect(screen.getByText('Type')).toBeDefined();
    expect(screen.getByText('Property')).toBeDefined();
    expect(screen.getByText('Amount')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Client')).toBeDefined();
    expect(screen.getByText('Agent')).toBeDefined();
    expect(screen.getByText('Closing Date')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('shows empty state when no transactions', () => {
    hookOverrides = { paginatedTransactions: [], filteredTransactions: [] };
    render(<TransactionManagementPage />);
    expect(screen.getByText('No transactions yet — create your first one!')).toBeDefined();
  });

  it('calls openCreateModal on button click', () => {
    render(<TransactionManagementPage />);
    fireEvent.click(screen.getByText(/New Transaction/));
    expect(mockOpenCreateModal).toHaveBeenCalled();
  });
});
