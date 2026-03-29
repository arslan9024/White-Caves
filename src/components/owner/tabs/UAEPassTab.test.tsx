/**
 * UAEPassTab Component Tests
 * Tests: rendering, loading state, stats display, user table, search,
 *        status/role badges, action callbacks
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UAEPassTab from './UAEPassTab';
import type { UAEPassData } from './types';

const sampleStats = {
  totalUsers: 150,
  verifiedUsers: 120,
  pendingVerification: 20,
  thisMonth: 15,
  conversionRate: 80,
};

const sampleUsers = [
  { id: 1, name: 'Ali Mohammed', emiratesId: '784-1234-5678901-1', email: 'ali@example.com', phone: '+971501234567', status: 'verified', role: 'buyer', registeredAt: '2025-01-15', lastLogin: '2025-01-20' },
  { id: 2, name: 'Sara Ahmed', emiratesId: '784-9876-5432101-2', email: 'sara@example.com', phone: '+971509876543', status: 'pending', role: 'seller', registeredAt: '2025-01-18', lastLogin: null },
  { id: 3, name: 'Omar Hassan', emiratesId: '784-5555-1234567-3', email: 'omar@example.com', phone: '+971505555555', status: 'rejected', role: 'landlord', registeredAt: '2025-01-10', lastLogin: '2025-01-12' },
];

const defaultData: UAEPassData = {
  uaepassStats: sampleStats,
  uaepassUsers: sampleUsers,
};

describe('UAEPassTab', () => {
  const onAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Loading ────────────────────────────────────────────
  describe('loading state', () => {
    it('renders loading spinner when loading=true', () => {
      render(<UAEPassTab data={{}} loading={true} onAction={onAction} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading UAE Pass data...')).toBeInTheDocument();
    });
  });

  // ─── Header ─────────────────────────────────────────────
  describe('header', () => {
    it('renders section title', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('UAE Pass Users')).toBeInTheDocument();
    });

    it('renders UAE Pass Integration label', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('UAE Pass Integration')).toBeInTheDocument();
    });

    it('renders Export button', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/Export/)).toBeInTheDocument();
    });

    it('renders Configure button', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/Configure/)).toBeInTheDocument();
    });
  });

  // ─── Stats ──────────────────────────────────────────────
  describe('stats', () => {
    it('displays total users count', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Total UAE Pass Users')).toBeInTheDocument();
    });

    it('displays verified users count', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('120')).toBeInTheDocument();
      // 'Verified' appears in both stat label and filter dropdown, use getAllByText
      const verifiedElements = screen.getAllByText('Verified');
      expect(verifiedElements.length).toBeGreaterThanOrEqual(1);
    });

    it('displays pending count', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Pending Verification')).toBeInTheDocument();
    });

    it('displays new this month', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('New This Month')).toBeInTheDocument();
    });

    it('displays verification rate', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('Verification Rate')).toBeInTheDocument();
    });

    it('shows zero stats when data is empty', () => {
      render(<UAEPassTab data={{}} onAction={onAction} />);
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ─── Integration Status ────────────────────────────────
  describe('integration status', () => {
    it('shows active integration status', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('UAE Pass Integration Active')).toBeInTheDocument();
    });

    it('shows connected environment', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/Connected to UAE Pass Production/)).toBeInTheDocument();
    });
  });

  // ─── User Table ─────────────────────────────────────────
  describe('user table', () => {
    it('renders table with headers', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      const table = screen.getByRole('table');
      expect(within(table).getByText('User')).toBeInTheDocument();
      expect(within(table).getByText('Emirates ID')).toBeInTheDocument();
      expect(within(table).getByText('Contact')).toBeInTheDocument();
      expect(within(table).getByText('Role')).toBeInTheDocument();
      expect(within(table).getByText('Status')).toBeInTheDocument();
    });

    it('renders user names', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('Ali Mohammed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ahmed')).toBeInTheDocument();
    });

    it('renders emirates IDs', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('784-1234-5678901-1')).toBeInTheDocument();
    });

    it('renders user emails', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('ali@example.com')).toBeInTheDocument();
    });

    it('renders user initials as avatar', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('A')).toBeInTheDocument(); // Ali
      expect(screen.getByText('S')).toBeInTheDocument(); // Sara
      expect(screen.getByText('O')).toBeInTheDocument(); // Omar
    });

    it('shows dash for null lastLogin', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  // ─── Status Badges ─────────────────────────────────────
  describe('status badges', () => {
    it('renders verified badge', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('✓ Verified')).toBeInTheDocument();
    });

    it('renders pending badge', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    });

    it('renders rejected badge', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('✕ Rejected')).toBeInTheDocument();
    });
  });

  // ─── Role Badges ────────────────────────────────────────
  describe('role badges', () => {
    it('renders buyer role', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('buyer')).toBeInTheDocument();
    });

    it('renders seller role', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('seller')).toBeInTheDocument();
    });

    it('renders landlord role', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('landlord')).toBeInTheDocument();
    });
  });

  // ─── Search ────────────────────────────────────────────
  describe('search', () => {
    it('renders search input', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    });

    it('filters users by name', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search users...'), { target: { value: 'Ali' } });
      expect(screen.getByText('Ali Mohammed')).toBeInTheDocument();
      expect(screen.queryByText('Sara Ahmed')).not.toBeInTheDocument();
    });

    it('filters users by email', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search users...'), { target: { value: 'sara@' } });
      expect(screen.getByText('Sara Ahmed')).toBeInTheDocument();
      expect(screen.queryByText('Ali Mohammed')).not.toBeInTheDocument();
    });
  });

  // ─── Actions ────────────────────────────────────────────
  describe('actions', () => {
    it('calls onAction exportUsers on Export click', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      fireEvent.click(screen.getByText(/Export/));
      expect(onAction).toHaveBeenCalledWith('exportUsers');
    });

    it('calls onAction configureUAEPass on Configure click', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      fireEvent.click(screen.getByText(/Configure/));
      expect(onAction).toHaveBeenCalledWith('configureUAEPass');
    });

    it('calls onAction viewUser on view button', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      const viewBtns = screen.getAllByTitle('View Profile');
      fireEvent.click(viewBtns[0]);
      expect(onAction).toHaveBeenCalledWith('viewUser', 1);
    });

    it('calls onAction verifyUser on verify button', () => {
      render(<UAEPassTab data={defaultData} onAction={onAction} />);
      const verifyBtns = screen.getAllByTitle('Verify');
      fireEvent.click(verifyBtns[0]);
      expect(onAction).toHaveBeenCalledWith('verifyUser', 1);
    });
  });

  // ─── Empty State ────────────────────────────────────────
  describe('empty state', () => {
    it('renders empty table when no users', () => {
      render(<UAEPassTab data={{ uaepassUsers: [], uaepassStats: sampleStats }} onAction={onAction} />);
      const table = screen.getByRole('table');
      const rows = within(table).queryAllByRole('row');
      // Only header row
      expect(rows.length).toBe(1);
    });
  });
});
