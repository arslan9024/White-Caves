/**
 * PersistentAssistantSidebar — Comprehensive Unit Tests
 *
 * Covers: rendering, Redux integration, collapse/expand, assistant tiles,
 * department grouping, notification badges, selection, empty state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// ── Hoisted mock state (available inside vi.mock factories) ──────
const { mockState } = vi.hoisted(() => {
  return {
    mockState: {
      dispatch: vi.fn(),
      assistants: [] as unknown[],
      sidebar: { isCollapsed: false, isOpen: true },
      unreadCounts: {} as Record<string, number>,
      selectors: {} as Record<string, unknown>,
    },
  };
});

// ── Mock lucide-react ────────────────────────────────────────────
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="icon-chevron-left" />,
  ChevronRight: () => <span data-testid="icon-chevron-right" />,
  Settings: () => <span data-testid="icon-settings" />,
  Bell: () => <span data-testid="icon-bell" />,
}));

// ── Mock styled components ───────────────────────────────────────
vi.mock('./PersistentAssistantSidebar.styles', () => ({
  PersistentSidebarContainer: ({ children, ...p }: React.PropsWithChildren<Record<string, unknown>>) => <div data-testid="sidebar-container" {...p}>{children}</div>,
  SidebarHeader: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="sidebar-header" {...p}>{children}</div>,
  CollapseButton: ({ children, ...p }: React.PropsWithChildren<{ onClick?: () => void; title?: string }>) => <button data-testid="collapse-btn" {...p}>{children}</button>,
  SidebarTitle: ({ children, ...p }: React.PropsWithChildren) => <h3 data-testid="sidebar-title" {...p}>{children}</h3>,
  SidebarContent: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="sidebar-content" {...p}>{children}</div>,
  DepartmentGroup: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="dept-group" {...p}>{children}</div>,
  DepartmentHeader: ({ children, ...p }: React.PropsWithChildren<Record<string, unknown>>) => <div data-testid="dept-header" {...p}>{children}</div>,
  DepartmentAssistants: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="dept-assistants" {...p}>{children}</div>,
  AssistantTileContainer: ({ children, $active, $tileColor, ...p }: React.PropsWithChildren<Record<string, unknown>>) => <div data-testid="assistant-tile" data-active={$active} {...p}>{children}</div>,
  TileAvatar: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="tile-avatar" {...p}>{children}</div>,
  TileEmoji: ({ children, ...p }: React.PropsWithChildren) => <span data-testid="tile-emoji" {...p}>{children}</span>,
  TileInfo: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="tile-info" {...p}>{children}</div>,
  TileName: ({ children, ...p }: React.PropsWithChildren) => <span data-testid="tile-name" {...p}>{children}</span>,
  TileTitle: ({ children, ...p }: React.PropsWithChildren) => <span data-testid="tile-title" {...p}>{children}</span>,
  TileAction: ({ children, ...p }: React.PropsWithChildren<{ title?: string }>) => <button data-testid="tile-action" {...p}>{children}</button>,
  NotificationBadgeContainer: ({ children, ...p }: React.PropsWithChildren<Record<string, unknown>>) => <span data-testid="notification-badge" {...p}>{children}</span>,
  SidebarFooter: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="sidebar-footer" {...p}>{children}</div>,
}));

// ── Mock child components ────────────────────────────────────────
vi.mock('./NotificationBadge', () => ({
  default: ({ count }: { count?: number }) => <span data-testid="notif-badge">{count}</span>,
}));

vi.mock('./StatusIndicator', () => ({
  default: ({ status, size }: { status: string; size?: string }) => (
    <span data-testid="status-indicator" data-status={status} data-size={size} />
  ),
}));

// ── Mock Redux slice ─────────────────────────────────────────────
vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => {
  const selectAllAssistantsArray = () => 'selectAllAssistantsArray';
  const selectSidebar = () => 'selectSidebar';
  const selectAllUnreadCounts = () => 'selectAllUnreadCounts';
  mockState.selectors = { selectAllAssistantsArray, selectSidebar, selectAllUnreadCounts };
  return {
    selectAllAssistantsArray,
    selectSidebar,
    selectAllUnreadCounts,
    selectAssistant: (id: string) => ({ type: 'selectAssistant', payload: id }),
    toggleSidebar: () => ({ type: 'toggleSidebar' }),
    collapseSidebar: (val: boolean) => ({ type: 'collapseSidebar', payload: val }),
    DEPARTMENT_COLORS: {
      communications: '#3B82F6',
      sales: '#10B981',
      operations: '#F59E0B',
      finance: '#EF4444',
      marketing: '#8B5CF6',
      executive: '#EC4899',
      compliance: '#6366F1',
      technology: '#06B6D4',
    },
  };
});

// ── Mock react-redux ─────────────────────────────────────────────
vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => {
    if (selector === mockState.selectors.selectAllAssistantsArray) return mockState.assistants;
    if (selector === mockState.selectors.selectSidebar) return mockState.sidebar;
    if (selector === mockState.selectors.selectAllUnreadCounts) return mockState.unreadCounts;
    return undefined;
  },
  useDispatch: () => mockState.dispatch,
}));

import PersistentAssistantSidebar from './PersistentAssistantSidebar';

// ── Helper: make assistant data ──────────────────────────────────
function makeAssistant(overrides: Partial<{
  id: string; name: string; title: string; avatar: string;
  colorScheme: string; department: string; metrics: Record<string, string>;
}> = {}) {
  return {
    id: overrides.id || 'nadia',
    name: overrides.name || 'Nadia',
    title: overrides.title || 'Communications Lead',
    avatar: overrides.avatar || '💬',
    colorScheme: overrides.colorScheme || '#3B82F6',
    department: overrides.department || 'communications',
    metrics: overrides.metrics || { systemHealth: 'optimal' },
    capabilities: [],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  mockState.assistants.length = 0;
  Object.keys(mockState.unreadCounts).forEach(k => delete mockState.unreadCounts[k]);
  mockState.sidebar.isCollapsed = false;
  mockState.sidebar.isOpen = true;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PersistentAssistantSidebar', () => {
  describe('rendering', () => {
    it('renders sidebar when open', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('sidebar-container')).toBeInTheDocument();
    });

    it('renders AI Assistants title', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });

    it('renders collapse button', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('collapse-btn')).toBeInTheDocument();
    });

    it('returns null when sidebar is not open', () => {
      mockState.sidebar.isOpen = false;
      const { container } = render(<PersistentAssistantSidebar />);
      expect(container.innerHTML).toBe('');
    });

    it('has displayName set', () => {
      expect(PersistentAssistantSidebar.displayName).toBe('PersistentAssistantSidebar');
    });
  });

  describe('assistant tiles', () => {
    it('renders assistant tiles for each assistant', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', name: 'Nadia', department: 'communications' }),
        makeAssistant({ id: 'mary', name: 'Mary', department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getAllByTestId('assistant-tile')).toHaveLength(2);
    });

    it('shows assistant name and title', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', name: 'Nadia', title: 'Communications Lead' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getByText('Nadia')).toBeInTheDocument();
      expect(screen.getByText('Communications Lead')).toBeInTheDocument();
    });

    it('shows assistant emoji avatar', () => {
      mockState.assistants.push(makeAssistant({ avatar: '💬' }));
      render(<PersistentAssistantSidebar />);
      expect(screen.getByText('💬')).toBeInTheDocument();
    });

    it('shows status indicator', () => {
      mockState.assistants.push(
        makeAssistant({ metrics: { systemHealth: 'optimal' } })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('status-indicator').dataset.status).toBe('active');
    });

    it('shows idle status for assistants without health data', () => {
      mockState.assistants.push(
        makeAssistant({ metrics: {} })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('status-indicator').dataset.status).toBe('idle');
    });

    it('shows busy status for degraded health', () => {
      mockState.assistants.push(
        makeAssistant({ metrics: { systemHealth: 'degraded' } })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('status-indicator').dataset.status).toBe('busy');
    });
  });

  describe('department grouping', () => {
    it('groups assistants by department', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'n', name: 'Nadia', department: 'communications' }),
        makeAssistant({ id: 'm', name: 'Mary', department: 'sales' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getAllByTestId('dept-group')).toHaveLength(2);
    });

    it('shows department header with capitalized name', () => {
      mockState.assistants.push(
        makeAssistant({ department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.getByText('Communications')).toBeInTheDocument();
    });

    it('hides department headers when collapsed', () => {
      mockState.sidebar.isCollapsed = true;
      mockState.assistants.push(
        makeAssistant({ department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.queryByText('Communications')).not.toBeInTheDocument();
    });
  });

  describe('notification badges', () => {
    it('shows notification badge for assistants with unread', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      mockState.unreadCounts['nadia'] = 5;
      render(<PersistentAssistantSidebar />);
      const tile = screen.getByTestId('assistant-tile');
      expect(within(tile).getByText('5')).toBeInTheDocument();
    });

    it('shows total unread in header', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      mockState.unreadCounts['nadia'] = 3;
      render(<PersistentAssistantSidebar />);
      const header = screen.getByTestId('sidebar-header');
      expect(within(header).getByText('3')).toBeInTheDocument();
    });

    it('does not show badge when no unread', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      const badges = screen.queryAllByTestId('notification-badge');
      expect(badges).toHaveLength(0);
    });
  });

  describe('interactions', () => {
    it('dispatches collapseSidebar on collapse button click', () => {
      render(<PersistentAssistantSidebar />);
      fireEvent.click(screen.getByTestId('collapse-btn'));
      expect(mockState.dispatch).toHaveBeenCalledWith({ type: 'collapseSidebar', payload: true });
    });

    it('dispatches expand on collapse button click when collapsed', () => {
      mockState.sidebar.isCollapsed = true;
      render(<PersistentAssistantSidebar />);
      fireEvent.click(screen.getByTestId('collapse-btn'));
      expect(mockState.dispatch).toHaveBeenCalledWith({ type: 'collapseSidebar', payload: false });
    });

    it('dispatches selectAssistant and calls onSelectAssistant callback', () => {
      const onSelect = vi.fn();
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      render(<PersistentAssistantSidebar onSelectAssistant={onSelect} />);
      fireEvent.click(screen.getByTestId('assistant-tile'));
      expect(mockState.dispatch).toHaveBeenCalledWith({ type: 'selectAssistant', payload: 'nadia' });
      expect(onSelect).toHaveBeenCalledWith('nadia');
    });

    it('highlights active assistant', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      render(<PersistentAssistantSidebar activeAssistantId="nadia" />);
      expect(screen.getByTestId('assistant-tile').dataset.active).toBe('true');
    });
  });

  describe('collapsed state', () => {
    beforeEach(() => {
      mockState.sidebar.isCollapsed = true;
    });

    it('hides sidebar title when collapsed', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.queryByText('AI Assistants')).not.toBeInTheDocument();
    });

    it('hides assistant info when collapsed', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', name: 'Nadia', title: 'Communications Lead', department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.queryByTestId('tile-info')).not.toBeInTheDocument();
    });

    it('hides settings footer when collapsed', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.queryByTestId('sidebar-footer')).not.toBeInTheDocument();
    });

    it('hides bell action when collapsed', () => {
      mockState.assistants.push(
        makeAssistant({ id: 'nadia', department: 'communications' })
      );
      render(<PersistentAssistantSidebar />);
      expect(screen.queryByTestId('icon-bell')).not.toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('renders settings button in footer', () => {
      render(<PersistentAssistantSidebar />);
      expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
      expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    });
  });
});
