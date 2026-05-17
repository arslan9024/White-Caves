/**
 * TaskLifecycleBoard — Unit Tests
 *
 * Covers: column rendering, task distribution by lifecycle stage, task card expand/collapse,
 * advance-stage dispatch, notification feed toggle, mark-all-read, summary pills
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ─────────────────────────────────────────────────────────

vi.mock('./TaskLifecycleBoard.css', () => ({}));
vi.mock('./TaskLifecyclePanel.css', () => ({}));
vi.mock('./LifecycleNotificationFeed.css', () => ({}));
vi.mock('./SharedComponents.css', () => ({}));

vi.mock('lucide-react', () => {
  const icon =
    (name: string) =>
    ({ size, className }: { size?: number; className?: string }) => (
      <span data-testid={`icon-${name}`} className={className} />
    );
  return {
    Bell: icon('bell'),
    BellOff: icon('bell-off'),
    Clock: icon('clock'),
    Loader2: icon('loader2'),
    AlertTriangle: icon('alert-triangle'),
    CheckCircle: icon('check-circle'),
    XCircle: icon('x-circle'),
    ChevronDown: icon('chevron-down'),
    ChevronRight: icon('chevron-right'),
    ArrowRight: icon('arrow-right'),
    RefreshCw: icon('refresh-cw'),
    CheckCircle2: icon('check-circle2'),
    Info: icon('info'),
    Zap: icon('zap'),
    BarChart2: icon('bar-chart2'),
    Circle: icon('circle'),
    User: icon('user'),
    Calendar: icon('calendar'),
    Flag: icon('flag'),
    Menu: icon('menu'),
    X: icon('x'),
  };
});

// Store mocks
const mockDispatch = vi.fn();
let mockTasks: Record<string, unknown>[] = [];
let mockNotifications: Record<string, unknown>[] = [];

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => selector({}),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  selectTasksByAssistant: (_id: string) => () => mockTasks,
  selectNotificationsByAssistant: (_id: string) => () => mockNotifications,
  advanceTaskLifecycle: vi.fn(p => ({ type: 'advanceTaskLifecycle', payload: p })),
  markAllNotificationsRead: vi.fn(id => ({ type: 'markAllNotificationsRead', payload: id })),
}));

vi.mock('../../../store/store', () => ({}));

// Sub-components — use lightweight stubs to isolate board logic
vi.mock('./TaskLifecyclePanel', () => ({
  __esModule: true,
  default: ({ task }: { task: { title: string } }) => (
    <div data-testid="task-lifecycle-panel">{task.title}</div>
  ),
}));

vi.mock('./LifecycleNotificationFeed', () => ({
  __esModule: true,
  default: ({ assistantId }: { assistantId: string }) => (
    <div data-testid="lifecycle-notification-feed">{assistantId}</div>
  ),
}));

vi.mock('./NotificationBadge', () => ({
  __esModule: true,
  default: ({ count }: { count: number }) => <span data-testid="notification-badge">{count}</span>,
}));

import TaskLifecycleBoard from './TaskLifecycleBoard';

// ── Helpers ───────────────────────────────────────────────────────

const makeTask = (
  id: string,
  stage: string,
  title: string,
  status = 'in_progress'
): Record<string, unknown> => ({
  id,
  title,
  priority: 'medium',
  status,
  assignedTo: 'agent',
  dueDate: new Date().toISOString(),
  lifecycleStage: stage,
  actions: [],
});

// ── Tests ─────────────────────────────────────────────────────────

describe('TaskLifecycleBoard', () => {
  beforeEach(() => {
    mockTasks = [];
    mockNotifications = [];
    mockDispatch.mockClear();
  });

  it('renders without crashing', () => {
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(document.querySelector('.task-lifecycle-board')).toBeTruthy();
  });

  it('renders the board title', () => {
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(screen.getByText('Task Lifecycle Board')).toBeTruthy();
  });

  it('renders 5 kanban columns', () => {
    render(<TaskLifecycleBoard assistantId="laila" />);
    const columns = document.querySelectorAll('.tlb-column');
    expect(columns.length).toBe(5);
  });

  it('shows summary pills for pending, in-progress, completed', () => {
    mockTasks = [
      makeTask('p1', 'queued', 'Pending 1', 'pending'),
      makeTask('p2', 'queued', 'Pending 2', 'pending'),
      makeTask('p3', 'queued', 'Pending 3', 'pending'),
      makeTask('ip1', 'in_progress', 'In Progress 1'),
      makeTask('ip2', 'in_progress', 'In Progress 2'),
      makeTask('c1', 'completed', 'Completed 1', 'completed'),
      makeTask('c2', 'completed', 'Completed 2', 'completed'),
      makeTask('c3', 'completed', 'Completed 3', 'completed'),
      makeTask('c4', 'completed', 'Completed 4', 'completed'),
      makeTask('c5', 'completed', 'Completed 5', 'completed'),
      makeTask('c6', 'completed', 'Completed 6', 'completed'),
      makeTask('c7', 'completed', 'Completed 7', 'completed'),
    ];
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(screen.getByText(/3 pending/i)).toBeTruthy();
    expect(screen.getByText(/2 in progress/i)).toBeTruthy();
    expect(screen.getByText(/7 completed/i)).toBeTruthy();
  });

  it('places queued task in Pending column', () => {
    mockTasks = [makeTask('t1', 'queued', 'Fix database index', 'pending')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const pendingCol = document.querySelector('.col-pending');
    expect(pendingCol?.textContent).toContain('Fix database index');
  });

  it('places in_progress task in In Progress column', () => {
    mockTasks = [makeTask('t2', 'in_progress', 'Run KYC check')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const inProgressCol = document.querySelector('.col-inprogress');
    expect(inProgressCol?.textContent).toContain('Run KYC check');
  });

  it('places pending_review task in Pending Review column', () => {
    mockTasks = [makeTask('t3', 'pending_review', 'Review contract')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const reviewCol = document.querySelector('.col-review');
    expect(reviewCol?.textContent).toContain('Review contract');
  });

  it('places completed task in Completed column', () => {
    mockTasks = [makeTask('t4', 'completed', 'Send follow-up email', 'completed')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const completedCol = document.querySelector('.col-completed');
    expect(completedCol?.textContent).toContain('Send follow-up email');
  });

  it('places failed task in Failed / Cancelled column', () => {
    mockTasks = [makeTask('t5', 'failed', 'Import data', 'in_progress')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const failedCol = document.querySelector('.col-failed');
    expect(failedCol?.textContent).toContain('Import data');
  });

  it('expands lifecycle panel on card click', () => {
    mockTasks = [makeTask('t6', 'in_progress', 'Process payment')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(screen.queryByTestId('task-lifecycle-panel')).toBeNull();
    const cardBtn = document.querySelector('.tlb-card-header') as HTMLButtonElement;
    fireEvent.click(cardBtn);
    expect(screen.getByTestId('task-lifecycle-panel')).toBeTruthy();
  });

  it('collapses lifecycle panel on second card click', () => {
    mockTasks = [makeTask('t7', 'in_progress', 'Send report')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const cardBtn = document.querySelector('.tlb-card-header') as HTMLButtonElement;
    fireEvent.click(cardBtn);
    expect(screen.getByTestId('task-lifecycle-panel')).toBeTruthy();
    fireEvent.click(cardBtn);
    expect(screen.queryByTestId('task-lifecycle-panel')).toBeNull();
  });

  it('dispatches advanceTaskLifecycle when Advance button is clicked', () => {
    mockTasks = [makeTask('t8', 'queued', 'Start task', 'pending')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const advanceBtn = document.querySelector('.tlb-advance-btn') as HTMLButtonElement;
    fireEvent.click(advanceBtn);
    expect(mockDispatch).toHaveBeenCalled();
    const call = mockDispatch.mock.calls[0][0];
    expect(call.payload).toMatchObject({
      assistantId: 'laila',
      taskId: 't8',
      stage: 'in_progress',
    });
  });

  it('shows notification feed by default (showNotificationFeed=true)', () => {
    render(<TaskLifecycleBoard assistantId="sophia" showNotificationFeed />);
    expect(screen.getByTestId('lifecycle-notification-feed')).toBeTruthy();
  });

  it('hides notification feed when showNotificationFeed=false', () => {
    render(<TaskLifecycleBoard assistantId="sophia" showNotificationFeed={false} />);
    expect(screen.queryByTestId('lifecycle-notification-feed')).toBeNull();
  });

  it('toggles notification feed on bell button click', () => {
    render(<TaskLifecycleBoard assistantId="laila" showNotificationFeed={false} />);
    const bellBtn = document.querySelector('.tlb-notif-toggle') as HTMLButtonElement;
    expect(screen.queryByTestId('lifecycle-notification-feed')).toBeNull();
    fireEvent.click(bellBtn);
    expect(screen.getByTestId('lifecycle-notification-feed')).toBeTruthy();
    fireEvent.click(bellBtn);
    expect(screen.queryByTestId('lifecycle-notification-feed')).toBeNull();
  });

  it('shows notification badge when there are unread notifications', () => {
    mockNotifications = [
      {
        id: 'n1',
        type: 'task_lifecycle',
        message: 'x',
        severity: 'info',
        isRead: false,
        timestamp: new Date().toISOString(),
      },
    ];
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(screen.getByTestId('notification-badge')).toBeTruthy();
  });

  it('shows mark-all-read button when unread notifications exist', () => {
    mockNotifications = [
      {
        id: 'n2',
        type: 'task_lifecycle',
        message: 'x',
        severity: 'info',
        isRead: false,
        timestamp: new Date().toISOString(),
      },
    ];
    render(<TaskLifecycleBoard assistantId="laila" />);
    expect(document.querySelector('.tlb-mark-read-btn')).toBeTruthy();
  });

  it('dispatches markAllNotificationsRead when mark-all-read is clicked', () => {
    mockNotifications = [
      {
        id: 'n3',
        type: 'task_lifecycle',
        message: 'x',
        severity: 'info',
        isRead: false,
        timestamp: new Date().toISOString(),
      },
    ];
    render(<TaskLifecycleBoard assistantId="sophia" />);
    const btn = document.querySelector('.tlb-mark-read-btn') as HTMLButtonElement;
    fireEvent.click(btn);
    expect(mockDispatch).toHaveBeenCalled();
    const call = mockDispatch.mock.calls[0][0];
    expect(call.payload).toBe('sophia');
  });

  it('applies custom accent color via CSS custom property', () => {
    render(<TaskLifecycleBoard assistantId="laila" color="#8B5CF6" />);
    const board = document.querySelector('.task-lifecycle-board') as HTMLElement;
    expect(board.style.getPropertyValue('--tlb-accent')).toBe('#8B5CF6');
  });

  it('shows column task count badge', () => {
    mockTasks = [makeTask('a1', 'in_progress', 'Task A'), makeTask('a2', 'in_progress', 'Task B')];
    render(<TaskLifecycleBoard assistantId="laila" />);
    const inProgressCol = document.querySelector('.col-inprogress');
    const countBadge = inProgressCol?.querySelector('.tlb-col-count');
    expect(countBadge?.textContent).toBe('2');
  });

  it('shows empty state message in columns with no tasks', () => {
    render(<TaskLifecycleBoard assistantId="laila" />);
    const emptyMessages = document.querySelectorAll('.tlb-col-empty');
    expect(emptyMessages.length).toBe(5);
  });
});
