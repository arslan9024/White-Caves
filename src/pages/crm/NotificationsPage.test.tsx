/**
 * NotificationsPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'New Lead Assigned', message: 'Ahmed assigned you a new lead', type: 'lead', read: false, created_at: '2025-01-15T10:00:00Z' },
  { id: '2', title: 'Commission Paid', message: 'Your commission has been paid', type: 'commission', read: true, created_at: '2025-01-10T10:00:00Z' },
];

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useNotifications', () => ({
  useNotifications: () => ({
    filteredNotifications: MOCK_NOTIFICATIONS,
    paginatedNotifications: MOCK_NOTIFICATIONS,
    unreadCount: 1,
    loading: false,
    error: null,
    typeFilter: 'all',
    readFilter: 'all',
    currentPage: 1,
    ITEMS_PER_PAGE: 10,
    handleMarkAsRead: vi.fn(),
    handleMarkAllAsRead: vi.fn(),
    handleDelete: vi.fn(),
    handleTypeFilterChange: vi.fn(),
    handleReadFilterChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: vi.fn(),
    getTimeAgo: (d: string) => '2 days ago',
    ...hookOverrides,
  }),
  TYPE_CONFIG: {
    info: { label: 'Info', icon: 'ℹ️', badgeVariant: 'info' },
    lead: { label: 'Lead', icon: '🎯', badgeVariant: 'primary' },
    property: { label: 'Property', icon: '🏠', badgeVariant: 'success' },
    commission: { label: 'Commission', icon: '💰', badgeVariant: 'warning' },
    system: { label: 'System', icon: '⚙️', badgeVariant: 'secondary' },
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

import NotificationsPage from './NotificationsPage';

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Notifications"', () => {
    render(<NotificationsPage />);
    expect(screen.getByText(/Notifications/)).toBeDefined();
  });

  it('renders mark all as read button', () => {
    render(<NotificationsPage />);
    expect(screen.getByText(/Mark All as Read/)).toBeDefined();
  });

  it('shows empty state when no notifications', () => {
    hookOverrides = { paginatedNotifications: [], filteredNotifications: [] };
    render(<NotificationsPage />);
    expect(screen.getByText(/No notifications yet/)).toBeDefined();
  });

  it('renders notification items when present', () => {
    render(<NotificationsPage />);
    expect(screen.getByText('New Lead Assigned')).toBeDefined();
    expect(screen.getByText('Commission Paid')).toBeDefined();
  });
});
