/**
 * NotificationCenter.tsx — Comprehensive Unit Tests
 * Batch 36 | Bell icon with notification dropdown
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */
vi.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      text: { primary: '#1a1a1a', secondary: '#6b7280', disabled: '#9ca3af' },
      primary: '#E31E24',
      border: '#e5e7eb',
      background: { primary: '#ffffff', secondary: '#f9fafb' },
    },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    typography: {
      sizes: { xs: '12px', sm: '14px' },
      weights: { medium: 500, semibold: 600 },
    },
    transitions: {
      create: () => 'all 0.2s ease',
      durations: { standard: 200 },
    },
    shadows: { lg: '0 4px 6px rgba(0,0,0,.1)' },
    zIndex: { dropdown: 1000 },
  },
}));

vi.mock('../design-system', () => ({
  Badge: ({ children, ...rest }: any) => (
    <span data-testid="notification-badge" {...rest}>
      {children}
    </span>
  ),
}));

import { NotificationCenter } from './NotificationCenter';

/* ── Helpers ────────────────────────────────────────────── */
const makeNotifs = (count: number, allRead = false) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: `Title ${i + 1}`,
    message: `Message ${i + 1}`,
    timestamp: `${i + 1}m ago`,
    read: allRead ? true : i % 2 === 1,
  }));

/* ── Tests ──────────────────────────────────────────────── */
describe('NotificationCenter', () => {
  beforeEach(() => vi.clearAllMocks());

  // ─────────────── Rendering ───────────────
  describe('rendering', () => {
    it('renders the bell button with 🔔 emoji', () => {
      render(<NotificationCenter />);
      const bell = screen.getByLabelText('Notifications (0 unread)');
      expect(bell).toBeInTheDocument();
      expect(screen.getByText('🔔')).toBeInTheDocument();
    });

    it('shows unread count in aria-label', () => {
      render(<NotificationCenter notifications={makeNotifs(4)} />);
      // 4 notifs: id 1 read=false, 2 read=true, 3 read=false, 4 read=true → 2 unread
      expect(screen.getByLabelText('Notifications (2 unread)')).toBeInTheDocument();
    });

    it('shows 0 unread when all notifications are read', () => {
      render(<NotificationCenter notifications={makeNotifs(3, true)} />);
      expect(screen.getByLabelText('Notifications (0 unread)')).toBeInTheDocument();
    });

    it('renders badge when there are unread notifications', () => {
      render(<NotificationCenter notifications={makeNotifs(4)} />);
      const badge = screen.getByTestId('notification-badge');
      expect(badge).toHaveTextContent('2');
    });

    it('does NOT render badge when all read', () => {
      render(<NotificationCenter notifications={makeNotifs(3, true)} />);
      expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument();
    });

    it('starts with dropdown closed (aria-expanded=false)', () => {
      render(<NotificationCenter />);
      expect(screen.getByLabelText('Notifications (0 unread)')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  // ─────────────── Dropdown Toggle ───────────────
  describe('dropdown toggle', () => {
    it('opens dropdown on bell click', () => {
      render(<NotificationCenter notifications={makeNotifs(2)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText(/Notifications/)).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes dropdown on second bell click', () => {
      render(<NotificationCenter notifications={makeNotifs(2)} />);
      const bell = screen.getByLabelText(/Notifications/);
      fireEvent.click(bell);
      expect(bell).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(bell);
      expect(bell).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ─────────────── Notification Items ───────────────
  describe('notification items', () => {
    it('displays notification titles', () => {
      render(<NotificationCenter notifications={makeNotifs(3)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('Title 1')).toBeInTheDocument();
      expect(screen.getByText('Title 2')).toBeInTheDocument();
      expect(screen.getByText('Title 3')).toBeInTheDocument();
    });

    it('displays notification messages', () => {
      render(<NotificationCenter notifications={makeNotifs(2)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });

    it('displays timestamps', () => {
      render(<NotificationCenter notifications={makeNotifs(2)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('1m ago')).toBeInTheDocument();
      expect(screen.getByText('2m ago')).toBeInTheDocument();
    });

    it('only shows first 5 notifications (truncates)', () => {
      render(<NotificationCenter notifications={makeNotifs(8)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('Title 5')).toBeInTheDocument();
      expect(screen.queryByText('Title 6')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Empty State ───────────────
  describe('empty state', () => {
    it('shows "No notifications" when list is empty', () => {
      render(<NotificationCenter notifications={[]} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('shows "No notifications" with default (no prop)', () => {
      render(<NotificationCenter />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });

  // ─────────────── Callbacks ───────────────
  describe('callbacks', () => {
    it('calls onMarkAsRead with notification id', () => {
      const onMarkAsRead = vi.fn();
      render(<NotificationCenter notifications={makeNotifs(3)} onMarkAsRead={onMarkAsRead} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      fireEvent.click(screen.getByText('Title 1'));
      expect(onMarkAsRead).toHaveBeenCalledWith('1');
    });

    it('calls onMarkAsRead for different notifications', () => {
      const onMarkAsRead = vi.fn();
      render(<NotificationCenter notifications={makeNotifs(3)} onMarkAsRead={onMarkAsRead} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      fireEvent.click(screen.getByText('Title 3'));
      expect(onMarkAsRead).toHaveBeenCalledWith('3');
    });

    it('does not crash when onMarkAsRead is not provided', () => {
      render(<NotificationCenter notifications={makeNotifs(2)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(() => fireEvent.click(screen.getByText('Title 1'))).not.toThrow();
    });

    it('shows View All button when > 5 notifications', () => {
      const onViewAll = vi.fn();
      render(<NotificationCenter notifications={makeNotifs(8)} onViewAll={onViewAll} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      const btn = screen.getByText('View All Notifications');
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(onViewAll).toHaveBeenCalledOnce();
    });

    it('hides View All when ≤ 5 notifications', () => {
      render(<NotificationCenter notifications={makeNotifs(5)} />);
      fireEvent.click(screen.getByLabelText(/Notifications/));
      expect(screen.queryByText('View All Notifications')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Edge Cases ───────────────
  describe('edge cases', () => {
    it('applies custom className', () => {
      const { container } = render(<NotificationCenter className="custom-cls" />);
      expect(container.firstChild).toHaveClass('custom-cls');
    });

    it('renders without crashing with undefined notifications', () => {
      expect(() => render(<NotificationCenter notifications={undefined} />)).not.toThrow();
    });
  });
});
