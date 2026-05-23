/**
 * AssistantSidebar.tsx — Comprehensive Unit Tests
 * Batch 36 | AI Assistant sidebar with Redux + favorites
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <svg data-testid="icon-chevron-right" {...props} />,
  Star: (props: any) => <svg data-testid="icon-star" {...props} />,
  Bell: (props: any) => <svg data-testid="icon-bell" {...props} />,
  Settings: (props: any) => <svg data-testid="icon-settings" {...props} />,
  HelpCircle: (props: any) => <svg data-testid="icon-help" {...props} />,
}));

// Mock styles
vi.mock('./AssistantSidebar.styles', () => ({
  AssistantSidebarContainer: ({ children }: any) => (
    <div data-testid="sidebar-container">{children}</div>
  ),
  SidebarHeader: ({ children }: any) => <div data-testid="sidebar-header">{children}</div>,
  AssistantAvatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AssistantInfo: ({ children }: any) => <div data-testid="assistant-info">{children}</div>,
  AssistantTitle: ({ children }: any) => <span data-testid="assistant-title">{children}</span>,
  FavoriteButton: ({ children, onClick, title }: any) => (
    <button data-testid="fav-btn" onClick={onClick} title={title}>
      {children}
    </button>
  ),
  SidebarNav: ({ children }: any) => <nav data-testid="sidebar-nav">{children}</nav>,
  SidebarDivider: () => <hr data-testid="divider" />,
  SidebarSection: ({ children }: any) => <div data-testid="sidebar-section">{children}</div>,
  SidebarItem: ({ children, onClick }: any) => (
    <div data-testid="sidebar-item" onClick={onClick} role="button">
      {children}
    </div>
  ),
  ItemLabel: ({ children }: any) => <span data-testid="item-label">{children}</span>,
  ItemBadge: ({ children }: any) => <span data-testid="item-badge">{children}</span>,
  ItemArrow: ({ children }: any) => <span data-testid="item-arrow">{children}</span>,
  SidebarFooter: ({ children }: any) => <div data-testid="sidebar-footer">{children}</div>,
  QuickActionButton: ({ children, title }: any) => (
    <button data-testid={`qa-${title?.toLowerCase()}`} title={title}>
      {children}
    </button>
  ),
}));

// Mock Redux
const mockDispatch = vi.fn();
const mockCurrentAssistant = {
  id: 'assist-1',
  name: 'Nancy',
  title: 'HR Assistant',
  avatar: '👩‍💼',
  colorScheme: '#0EA5E9',
};
let mockFavorites: string[] = ['assist-1'];

vi.mock('react-redux', () => ({
  useSelector: (selector: any) => {
    // Call the selector with a mock state to detect which one it is
    const mockState = {
      aiAssistantDashboard: {
        currentAssistantId: 'assist-1',
        assistants: { byId: { 'assist-1': mockCurrentAssistant } },
        favorites: mockFavorites,
      },
    };
    return selector(mockState);
  },
  useDispatch: () => mockDispatch,
}));

// Mock the slice
vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  selectCurrentAssistant: (state: any) =>
    state.aiAssistantDashboard?.assistants?.byId?.[
      state.aiAssistantDashboard?.currentAssistantId
    ] ?? null,
  selectFavorites: (state: any) => state.aiAssistantDashboard?.favorites ?? [],
  toggleFavorite: (id: string) => ({ type: 'aiAssistantDashboard/toggleFavorite', payload: id }),
}));

import AssistantSidebar from './AssistantSidebar';

/* ── Helpers ────────────────────────────────────────────── */
const sampleItems = [
  { id: 'dashboard', label: 'Dashboard', badge: 5 },
  { id: 'div1', divider: true },
  { id: 'sec-tools', section: 'Tools' },
  { id: 'crm', label: 'CRM' },
  { id: 'reports', label: 'Reports', badge: 12 },
];

const DummyIcon = (props: any) => <svg data-testid="dummy-icon" {...props} />;
const itemsWithIcons = sampleItems.map(item => (item.label ? { ...item, icon: DummyIcon } : item));

/* ── Tests ──────────────────────────────────────────────── */
describe('AssistantSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFavorites = ['assist-1'];
  });

  // ─────────────── Rendering ───────────────
  describe('rendering', () => {
    it('renders sidebar container', () => {
      render(<AssistantSidebar />);
      expect(screen.getByTestId('sidebar-container')).toBeInTheDocument();
    });

    it('shows assistant name in header', () => {
      render(<AssistantSidebar />);
      expect(screen.getByText('Nancy')).toBeInTheDocument();
    });

    it('shows assistant title', () => {
      render(<AssistantSidebar />);
      expect(screen.getByTestId('assistant-title')).toHaveTextContent('HR Assistant');
    });

    it('shows assistant avatar emoji', () => {
      render(<AssistantSidebar />);
      expect(screen.getByText('👩‍💼')).toBeInTheDocument();
    });

    it('renders nav items with labels', () => {
      render(<AssistantSidebar items={sampleItems} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('CRM')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('renders section headers', () => {
      render(<AssistantSidebar items={sampleItems} />);
      expect(screen.getByText('Tools')).toBeInTheDocument();
    });

    it('renders dividers', () => {
      render(<AssistantSidebar items={sampleItems} />);
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });

    it('renders badges on nav items', () => {
      render(<AssistantSidebar items={sampleItems} />);
      const badges = screen.getAllByTestId('item-badge');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveTextContent('5');
      expect(badges[1]).toHaveTextContent('12');
    });
  });

  // ─────────────── Header Visibility ───────────────
  describe('header visibility', () => {
    it('hides header when showHeader=false', () => {
      render(<AssistantSidebar showHeader={false} />);
      expect(screen.queryByTestId('sidebar-header')).not.toBeInTheDocument();
    });

    it('shows header by default', () => {
      render(<AssistantSidebar />);
      expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
    });
  });

  // ─────────────── Favorite Toggle ───────────────
  describe('favorite toggle', () => {
    it('shows "Remove from favorites" when assistant is favorited', () => {
      render(<AssistantSidebar />);
      expect(screen.getByTitle('Remove from favorites')).toBeInTheDocument();
    });

    it('dispatches toggleFavorite on click', () => {
      render(<AssistantSidebar />);
      fireEvent.click(screen.getByTestId('fav-btn'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/toggleFavorite',
        payload: 'assist-1',
      });
    });

    it('shows "Add to favorites" when assistant is NOT favorited', () => {
      mockFavorites = [];
      render(<AssistantSidebar />);
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });
  });

  // ─────────────── Quick Actions ───────────────
  describe('quick actions', () => {
    it('renders Notifications, Settings, Help buttons by default', () => {
      render(<AssistantSidebar />);
      expect(screen.getByTitle('Notifications')).toBeInTheDocument();
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
      expect(screen.getByTitle('Help')).toBeInTheDocument();
    });

    it('hides quick actions when showQuickActions=false', () => {
      render(<AssistantSidebar showQuickActions={false} />);
      expect(screen.queryByTestId('sidebar-footer')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Collapsed ───────────────
  describe('collapsed mode', () => {
    it('hides assistant info when collapsed', () => {
      render(<AssistantSidebar collapsed />);
      expect(screen.queryByTestId('assistant-info')).not.toBeInTheDocument();
    });

    it('hides labels when collapsed', () => {
      render(<AssistantSidebar collapsed items={sampleItems} />);
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('hides section headers when collapsed', () => {
      render(<AssistantSidebar collapsed items={sampleItems} />);
      expect(screen.queryByText('Tools')).not.toBeInTheDocument();
    });

    it('hides quick actions when collapsed', () => {
      render(<AssistantSidebar collapsed />);
      expect(screen.queryByTestId('sidebar-footer')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Item Click ───────────────
  describe('item click', () => {
    it('calls onItemClick with item id', () => {
      const onItemClick = vi.fn();
      render(<AssistantSidebar items={sampleItems} onItemClick={onItemClick} />);
      const items = screen.getAllByTestId('sidebar-item');
      fireEvent.click(items[0]); // Dashboard
      expect(onItemClick).toHaveBeenCalledWith('dashboard');
    });

    it('does not throw when onItemClick is not provided', () => {
      render(<AssistantSidebar items={sampleItems} />);
      const items = screen.getAllByTestId('sidebar-item');
      expect(() => fireEvent.click(items[0])).not.toThrow();
    });
  });

  // ─────────────── Icons ───────────────
  describe('icons', () => {
    it('renders item icons when provided', () => {
      render(<AssistantSidebar items={itemsWithIcons} />);
      const icons = screen.getAllByTestId('dummy-icon');
      expect(icons.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ─────────────── Edge Cases ───────────────
  describe('edge cases', () => {
    it('renders with empty items array', () => {
      render(<AssistantSidebar items={[]} />);
      expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
    });

    it('renders without items prop', () => {
      expect(() => render(<AssistantSidebar />)).not.toThrow();
    });
  });
});
