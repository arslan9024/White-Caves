/**
 * ClientManagementPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_CLIENTS = [
  { id: '1', name: 'Ahmed Al Rashid', email: 'ahmed@co.ae', phone: '+971501234567', type: 'buyer', company: 'Global LLC', status: 'active', tags: ['high-value'], notes: '' },
  { id: '2', name: 'Sarah Khan', email: 'sarah@co.ae', phone: '+971502345678', type: 'seller', company: 'Star Corp', status: 'vip', tags: ['returning'], notes: '' },
];

const defaultFormData = {
  name: '', email: '', phone: '', type: 'buyer',
  company: '', status: 'active', tags: '', notes: '',
};

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useClientManagement', () => ({
  useClientManagement: () => ({
    filteredClients: MOCK_CLIENTS,
    paginatedClients: MOCK_CLIENTS,
    typeCounts: { all: 2, buyer: 1, seller: 1, owner: 0, investor: 0 },
    loading: false,
    error: null,
    search: '',
    typeFilter: 'all',
    statusFilter: 'all',
    currentPage: 1,
    showCreateModal: false,
    showEditModal: false,
    showDeleteConfirm: false,
    selectedClient: null,
    formData: defaultFormData,
    setFormData: vi.fn(),
    ITEMS_PER_PAGE: 10,
    openCreateModal: vi.fn(),
    closeCreateModal: vi.fn(),
    closeEditModal: vi.fn(),
    closeDeleteModal: vi.fn(),
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleSaveEdit: vi.fn(),
    handleDelete: vi.fn(),
    confirmDelete: vi.fn(),
    handleSearchChange: vi.fn(),
    handleTypeFilterChange: vi.fn(),
    handleStatusFilterChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: vi.fn(),
    getTypeBadgeVariant: (t: string) => t === 'buyer' ? 'info' : 'primary',
    getStatusBadgeVariant: (s: string) => s === 'active' ? 'success' : 'secondary',
    formatDate: (v: string | undefined) => v ? new Date(v).toLocaleDateString() : 'N/A',
    ...hookOverrides,
  }),
  TYPE_CONFIG: {
    buyer: { label: 'Buyer', icon: '🏠', badgeVariant: 'info' },
    seller: { label: 'Seller', icon: '💼', badgeVariant: 'primary' },
    owner: { label: 'Owner', icon: '🔑', badgeVariant: 'success' },
    investor: { label: 'Investor', icon: '📈', badgeVariant: 'warning' },
  },
  STATUS_CONFIG: {
    active: { label: 'Active', color: '#10B981', badgeVariant: 'success' },
    inactive: { label: 'Inactive', color: '#6B7280', badgeVariant: 'secondary' },
    vip: { label: 'VIP', color: '#F59E0B', badgeVariant: 'warning' },
  },
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

import ClientManagementPage from './ClientManagementPage';

describe('ClientManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Client Management"', () => {
    render(<ClientManagementPage />);
    expect(screen.getByText(/Client Management/)).toBeDefined();
  });

  it('renders type tabs (All, Buyers, Sellers, Owners, Investors)', () => {
    render(<ClientManagementPage />);
    expect(screen.getByText(/All \(2\)/)).toBeDefined();
    expect(screen.getByText(/Buyer \(1\)/)).toBeDefined();
    expect(screen.getByText(/Seller \(1\)/)).toBeDefined();
    expect(screen.getByText(/Owner \(0\)/)).toBeDefined();
    expect(screen.getByText(/Investor \(0\)/)).toBeDefined();
  });

  it('renders table headers', () => {
    render(<ClientManagementPage />);
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Phone')).toBeDefined();
    expect(screen.getByText('Type')).toBeDefined();
    expect(screen.getByText('Company')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Tags')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('shows empty state when no clients', () => {
    hookOverrides = { paginatedClients: [], filteredClients: [] };
    render(<ClientManagementPage />);
    expect(screen.getByText('No clients yet — add your first one!')).toBeDefined();
  });
});
