/**
 * @file LeasesTab.test.tsx
 * @description Comprehensive tests for LeasesTab CRM component
 * Tests: rendering, search, lease data display, status badges, warning states, empty states
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: (props: any) => <svg data-testid="icon-search" {...props} />,
  Plus: (props: any) => <svg data-testid="icon-plus" {...props} />,
}));

import LeasesTab from '../LeasesTab';

const sampleLeases = [
  {
    id: '1',
    unit: 'Unit A-101',
    tenant: 'John Smith',
    rent: 2500,
    endDate: '2026-06-15',
    daysRemaining: 120,
    status: 'active',
  },
  {
    id: '2',
    unit: 'Unit B-205',
    tenant: 'Jane Doe',
    rent: 3200,
    endDate: '2026-02-28',
    daysRemaining: 30,
    status: 'expiring',
  },
  {
    id: '3',
    unit: 'Unit C-310',
    tenant: 'Bob Wilson',
    rent: 1800,
    endDate: '2025-12-31',
    daysRemaining: 0,
    status: 'expired',
  },
];

const defaultProps = {
  leases: sampleLeases,
  searchQuery: '',
  onSearchChange: vi.fn(),
};

describe('LeasesTab', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders the leases view', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      expect(container.querySelector('.leases-view')).toBeTruthy();
    });

    it('renders the search box', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      expect(container.querySelector('.search-box')).toBeTruthy();
    });

    it('renders add button', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const addBtn = container.querySelector('.add-btn');
      expect(addBtn).toBeTruthy();
    });

    it('renders the table', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      expect(container.querySelector('.leases-table')).toBeTruthy();
    });

    it('renders table header', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      expect(container.querySelector('.table-header')).toBeTruthy();
    });

    it('renders search icon', () => {
      render(<LeasesTab {...defaultProps} />);
      expect(screen.getByTestId('icon-search')).toBeInTheDocument();
    });

    it('renders plus icon in add button', () => {
      render(<LeasesTab {...defaultProps} />);
      expect(screen.getByTestId('icon-plus')).toBeInTheDocument();
    });
  });

  // ── Lease Data Display ─────────────────────────────────
  describe('Lease Data', () => {
    it('renders all lease rows', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const rows = container.querySelectorAll('.table-row');
      expect(rows.length).toBe(3);
    });

    it('displays unit names', () => {
      render(<LeasesTab {...defaultProps} />);
      expect(screen.getByText('Unit A-101')).toBeInTheDocument();
      expect(screen.getByText('Unit B-205')).toBeInTheDocument();
      expect(screen.getByText('Unit C-310')).toBeInTheDocument();
    });

    it('displays tenant names', () => {
      render(<LeasesTab {...defaultProps} />);
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('displays annual rent amounts (monthly * 12)', () => {
      render(<LeasesTab {...defaultProps} />);
      // rent * 12: 2500*12=30000, 3200*12=38400, 1800*12=21600
      expect(screen.getByText(/AED 30,000/)).toBeInTheDocument();
      expect(screen.getByText(/AED 38,400/)).toBeInTheDocument();
      expect(screen.getByText(/AED 21,600/)).toBeInTheDocument();
    });

    it('displays end dates', () => {
      render(<LeasesTab {...defaultProps} />);
      expect(screen.getByText('2026-06-15')).toBeInTheDocument();
      expect(screen.getByText('2026-02-28')).toBeInTheDocument();
      expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    });

    it('displays days remaining', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      // Check the days remaining values in their specific spans
      const rows = container.querySelectorAll('.table-row');
      expect(rows[0].textContent).toContain('120');
      expect(rows[1].textContent).toContain('30');
      expect(rows[2].textContent).toContain('0');
    });
  });

  // ── Status Badges ──────────────────────────────────────
  describe('Status Badges', () => {
    it('renders status badges for each lease', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const badges = container.querySelectorAll('[class*="status-badge"]');
      expect(badges.length).toBe(3);
    });

    it('applies active status class', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const activeBadge = container.querySelector('.status-badge.active');
      expect(activeBadge).toBeTruthy();
    });

    it('applies expiring status class', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const expiringBadge = container.querySelector('.status-badge.expiring');
      expect(expiringBadge).toBeTruthy();
    });

    it('applies expired status class', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const expiredBadge = container.querySelector('.status-badge.expired');
      expect(expiredBadge).toBeTruthy();
    });

    it('transforms underscores to spaces in status text', () => {
      const leases = [{
        ...sampleLeases[0],
        status: 'pending_renewal',
      }];
      render(<LeasesTab {...defaultProps} leases={leases} />);
      expect(screen.getByText('pending renewal')).toBeInTheDocument();
    });
  });

  // ── Warning States ─────────────────────────────────────
  describe('Warning States', () => {
    it('applies warning class to leases with < 60 days remaining', () => {
      const { container } = render(<LeasesTab {...defaultProps} />);
      const warningElements = container.querySelectorAll('.warning');
      // Lease 2 (30 days) and Lease 3 (0 days) should have warning
      expect(warningElements.length).toBeGreaterThanOrEqual(2);
    });

    it('does not apply warning class to leases with >= 60 days', () => {
      const leases = [{
        ...sampleLeases[0],
        daysRemaining: 120,
      }];
      const { container } = render(<LeasesTab {...defaultProps} leases={leases} />);
      // Only the non-warning row exists
      const rows = container.querySelectorAll('.table-row');
      expect(rows.length).toBe(1);
      // Check no warning on days remaining span for this lease
      const warningInRow = rows[0].querySelectorAll('.warning');
      expect(warningInRow.length).toBe(0);
    });
  });

  // ── Search ─────────────────────────────────────────────
  describe('Search', () => {
    it('renders search input with current query', () => {
      render(<LeasesTab {...defaultProps} searchQuery="Unit A" />);
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toHaveValue('Unit A');
    });

    it('calls onSearchChange when user types', () => {
      const onSearchChange = vi.fn();
      render(<LeasesTab {...defaultProps} onSearchChange={onSearchChange} />);
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'Unit B' } });
      expect(onSearchChange).toHaveBeenCalled();
    });
  });

  // ── Empty State ────────────────────────────────────────
  describe('Empty State', () => {
    it('renders with empty leases array', () => {
      const { container } = render(
        <LeasesTab {...defaultProps} leases={[]} />
      );
      const rows = container.querySelectorAll('.table-row');
      expect(rows.length).toBe(0);
    });

    it('still renders header and search when no leases', () => {
      const { container } = render(
        <LeasesTab {...defaultProps} leases={[]} />
      );
      expect(container.querySelector('.view-header')).toBeTruthy();
      expect(container.querySelector('.search-box')).toBeTruthy();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────
  describe('Edge Cases', () => {
    it('handles numeric lease ids', () => {
      const leases = [{ ...sampleLeases[0], id: 42 }];
      const { container } = render(<LeasesTab {...defaultProps} leases={leases} />);
      expect(container.querySelectorAll('.table-row').length).toBe(1);
    });

    it('handles very large rent amounts', () => {
      const leases = [{ ...sampleLeases[0], rent: 1000000 }];
      render(<LeasesTab {...defaultProps} leases={leases} />);
      // 1000000 * 12 = 12,000,000
      expect(screen.getByText(/AED 12,000,000/)).toBeInTheDocument();
    });

    it('handles exactly 60 days remaining (no warning)', () => {
      const leases = [{ ...sampleLeases[0], daysRemaining: 60 }];
      const { container } = render(<LeasesTab {...defaultProps} leases={leases} />);
      const rows = container.querySelectorAll('.table-row');
      const warningInRow = rows[0].querySelectorAll('.warning');
      expect(warningInRow.length).toBe(0);
    });

    it('handles 59 days remaining (warning)', () => {
      const leases = [{ ...sampleLeases[0], daysRemaining: 59 }];
      const { container } = render(<LeasesTab {...defaultProps} leases={leases} />);
      const warningElements = container.querySelectorAll('.warning');
      expect(warningElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
