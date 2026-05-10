/**
 * LifecycleNotificationFeed — Unit Tests
 *
 * Covers: empty state, rendering notifications, unread badge, mark-all-read,
 * mark single read on click, type + severity icons, custom color
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import type { Mock } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────

vi.mock('./LifecycleNotificationFeed.css', () => ({}));

vi.mock('lucide-react', () => {
  const icon =
    (name: string) =>
    ({ size, className }: { size?: number; className?: string }) =>
      <span data-testid={`icon-${name}`} className={className} />;
  return {
    Bell: icon('bell'),
    BellOff: icon('bell-off'),
    CheckCircle2: icon('check-circle2'),
    AlertTriangle: icon('alert-triangle'),
    XCircle: icon('x-circle'),
    Info: icon('info'),
    Clock: icon('clock'),
    Zap: icon('zap'),
    BarChart2: icon('bar-chart2'),
  };
});

// Store mocks
let mockNotifications: Record<string, unknown>[] = [];
let mockUnreadCount = 0;
const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => selector({}),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  selectNotificationsByAssistant: (_id: string) => () => mockNotifications,
  selectUnreadCountByAssistant: (_id: string) => () => mockUnreadCount,
  markNotificationRead: vi.fn((payload) => ({ type: 'markRead', payload })),
  markAllNotificationsRead: vi.fn((id) => ({ type: 'markAllRead', payload: id })),
}));

vi.mock('../../../store/store', () => ({}));

import LifecycleNotificationFeed from './LifecycleNotificationFeed';

// ── Helpers ───────────────────────────────────────────────────────

const now = new Date().toISOString();

const makeNotif = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: `n_${Math.random()}`,
  type: 'task_lifecycle',
  message: 'Task advanced to in_progress',
  severity: 'info' as const,
  isRead: false,
  timestamp: now,
  ...overrides,
});

// ── Tests ─────────────────────────────────────────────────────────

describe('LifecycleNotificationFeed', () => {
  beforeEach(() => {
    mockNotifications = [];
    mockUnreadCount = 0;
    mockDispatch.mockClear();
  });

  it('renders without crashing', () => {
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lifecycle-notification-feed')).toBeTruthy();
  });

  it('shows empty state when no notifications', () => {
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(screen.getByText('No lifecycle notifications yet')).toBeTruthy();
  });

  it('shows notifications when present', () => {
    mockNotifications = [
      makeNotif({ message: 'Task moved to in_progress' }),
      makeNotif({ type: 'task_action', message: 'KYC check completed', isRead: true }),
    ];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(screen.getByText('Task moved to in_progress')).toBeTruthy();
    expect(screen.getByText('KYC check completed')).toBeTruthy();
  });

  it('filters to lifecycle types only', () => {
    mockNotifications = [
      makeNotif({ type: 'task_lifecycle', message: 'Lifecycle event' }),
      makeNotif({ type: 'some_other_type', message: 'Should be hidden' }),
    ];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(screen.getByText('Lifecycle event')).toBeTruthy();
    expect(screen.queryByText('Should be hidden')).toBeNull();
  });

  it('shows unread badge when unread > 0', () => {
    mockNotifications = [makeNotif({ isRead: false })];
    mockUnreadCount = 1;
    render(<LifecycleNotificationFeed assistantId="laila" />);
    const badge = document.querySelector('.lnf-badge');
    expect(badge?.textContent).toBe('1');
  });

  it('does not show unread badge when all read', () => {
    mockNotifications = [makeNotif({ isRead: true })];
    mockUnreadCount = 0;
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-badge')).toBeNull();
  });

  it('shows mark-all-read button when unread notifications exist', () => {
    mockNotifications = [makeNotif({ isRead: false })];
    mockUnreadCount = 1;
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-mark-all-btn')).toBeTruthy();
  });

  it('hides mark-all-read button when no unread', () => {
    mockNotifications = [makeNotif({ isRead: true })];
    mockUnreadCount = 0;
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-mark-all-btn')).toBeNull();
  });

  it('dispatches markAllNotificationsRead when button clicked', () => {
    mockNotifications = [makeNotif({ isRead: false })];
    mockUnreadCount = 1;
    render(<LifecycleNotificationFeed assistantId="sophia" />);
    const btn = document.querySelector('.lnf-mark-all-btn') as HTMLButtonElement;
    fireEvent.click(btn);
    expect(mockDispatch).toHaveBeenCalled();
    const call = mockDispatch.mock.calls[0][0];
    expect(call.payload).toBe('sophia');
  });

  it('dispatches markNotificationRead when unread notification clicked', () => {
    const notifId = 'notif_xyz';
    mockNotifications = [makeNotif({ id: notifId, isRead: false })];
    render(<LifecycleNotificationFeed assistantId="clara" />);
    const item = document.querySelector('.lnf-item.unread') as HTMLElement;
    fireEvent.click(item);
    expect(mockDispatch).toHaveBeenCalled();
    const call = mockDispatch.mock.calls[0][0];
    expect(call.payload).toMatchObject({ assistantId: 'clara', notificationId: notifId });
  });

  it('does not dispatch read action on already-read notification click', () => {
    mockNotifications = [makeNotif({ isRead: true })];
    render(<LifecycleNotificationFeed assistantId="nadia" />);
    const item = document.querySelector('.lnf-item.read') as HTMLElement;
    fireEvent.click(item);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('unread items have .unread class; read items have .read class', () => {
    mockNotifications = [
      makeNotif({ isRead: false }),
      makeNotif({ isRead: true }),
    ];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelectorAll('.lnf-item.unread').length).toBe(1);
    expect(document.querySelectorAll('.lnf-item.read').length).toBe(1);
  });

  it('applies severity CSS class to notification item', () => {
    mockNotifications = [
      makeNotif({ severity: 'critical', isRead: false }),
    ];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-item.sev-critical')).toBeTruthy();
  });

  it('shows unread dot for unread notifications', () => {
    mockNotifications = [makeNotif({ isRead: false })];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-unread-dot')).toBeTruthy();
  });

  it('applies custom color via CSS custom property', () => {
    render(<LifecycleNotificationFeed assistantId="laila" color="#A78BFA" />);
    const feed = document.querySelector('.lifecycle-notification-feed') as HTMLElement;
    expect(feed.style.getPropertyValue('--lnf-accent')).toBe('#A78BFA');
  });

  it('respects maxItems limit', () => {
    mockNotifications = Array.from({ length: 10 }, (_, i) =>
      makeNotif({ id: `n${i}`, message: `Notification ${i}` }),
    );
    render(<LifecycleNotificationFeed assistantId="laila" maxItems={3} />);
    expect(document.querySelectorAll('.lnf-item').length).toBe(3);
  });

  it('shows footer when notifications are present', () => {
    mockNotifications = [makeNotif()];
    render(<LifecycleNotificationFeed assistantId="laila" />);
    expect(document.querySelector('.lnf-footer')).toBeTruthy();
  });
});
