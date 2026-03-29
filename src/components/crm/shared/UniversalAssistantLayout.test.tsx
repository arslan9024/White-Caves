/**
 * UniversalAssistantLayout — Comprehensive Unit Tests
 *
 * Covers: empty state, header rendering, sidebar toggle, error boundary,
 * Suspense fallback, header actions, props, memo, CSS custom property
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

let mockCurrentAssistant: Record<string, unknown> | null = {
  id: 'mary',
  name: 'Mary',
  title: 'Inventory Manager',
  colorScheme: '#3B82F6',
};

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => selector({}),
  useDispatch: () => vi.fn(),
}));

vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  selectCurrentAssistant: () => mockCurrentAssistant,
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('./UniversalAssistantLayout.css', () => ({}));

vi.mock('lucide-react', () => ({
  Menu: (props: Record<string, unknown>) => <span data-testid="menu-icon" {...props}>Menu</span>,
  X: (props: Record<string, unknown>) => <span data-testid="x-icon" {...props}>X</span>,
  RefreshCw: (props: Record<string, unknown>) => <span data-testid="refresh-icon" {...props}>↻</span>,
}));

const mockOnItemClick = vi.fn();

vi.mock('./AssistantSidebar', () => ({
  __esModule: true,
  default: ({ items, activeItem, onItemClick, collapsed }: Record<string, unknown>) => (
    <nav data-testid="assistant-sidebar" data-collapsed={String(collapsed)}>
      {Array.isArray(items) && (items as Array<{ id: string; label: string }>).map((item) => (
        <button key={item.id} onClick={() => (onItemClick as (id: string) => void)?.(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  ),
}));

import UniversalAssistantLayout from './UniversalAssistantLayout';

// ── Test Suite ───────────────────────────────────────────────────

describe('UniversalAssistantLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentAssistant = {
      id: 'mary',
      name: 'Mary',
      title: 'Inventory Manager',
      colorScheme: '#3B82F6',
    };
  });

  // ────── Empty State ──────

  describe('empty state (no assistant)', () => {
    it('shows empty-state message when no assistant is selected', () => {
      mockCurrentAssistant = null;
      render(
        <UniversalAssistantLayout>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(
        screen.getByText('Select an AI assistant to view their dashboard'),
      ).toBeInTheDocument();
    });

    it('does NOT render children when no assistant is selected', () => {
      mockCurrentAssistant = null;
      render(
        <UniversalAssistantLayout>
          <div>Secret</div>
        </UniversalAssistantLayout>
      );
      expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    });
  });

  // ────── Header ──────

  describe('header rendering', () => {
    it('renders the assistant name', () => {
      render(
        <UniversalAssistantLayout>
          <div>Body</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByText('Mary')).toBeInTheDocument();
    });

    it('renders the assistant title / subtitle', () => {
      render(
        <UniversalAssistantLayout>
          <div>Body</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByText('Inventory Manager')).toBeInTheDocument();
    });

    it('applies the assistant colorScheme as CSS custom property', () => {
      const { container } = render(
        <UniversalAssistantLayout>
          <div>Body</div>
        </UniversalAssistantLayout>
      );
      const layout = container.querySelector('.universal-layout');
      expect(layout).toBeTruthy();
      expect((layout as HTMLElement).style.getPropertyValue('--assistant-color')).toBe('#3B82F6');
    });

    it('falls back to default color when colorScheme is missing', () => {
      mockCurrentAssistant = { id: 'x', name: 'X', title: 'Bot' };
      const { container } = render(
        <UniversalAssistantLayout>
          <div>Body</div>
        </UniversalAssistantLayout>
      );
      const layout = container.querySelector('.universal-layout');
      expect((layout as HTMLElement).style.getPropertyValue('--assistant-color')).toBe('#0EA5E9');
    });
  });

  // ────── Children ──────

  it('renders children content', () => {
    render(
      <UniversalAssistantLayout>
        <div>Dashboard Content</div>
      </UniversalAssistantLayout>
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  // ────── Sidebar Visibility ──────

  describe('sidebar visibility', () => {
    it('renders sidebar by default (showSidebar defaults true)', () => {
      render(
        <UniversalAssistantLayout>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByTestId('assistant-sidebar')).toBeInTheDocument();
    });

    it('hides sidebar when showSidebar=false', () => {
      render(
        <UniversalAssistantLayout showSidebar={false}>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(screen.queryByTestId('assistant-sidebar')).not.toBeInTheDocument();
    });

    it('hides toggle button when showSidebar=false', () => {
      render(
        <UniversalAssistantLayout showSidebar={false}>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(screen.queryByTitle(/sidebar/i)).not.toBeInTheDocument();
    });
  });

  // ────── Sidebar Toggle ──────

  describe('sidebar collapse / expand', () => {
    it('starts expanded by default (collapsedSidebar defaults false)', () => {
      render(
        <UniversalAssistantLayout>
          <div>C</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByTestId('assistant-sidebar').getAttribute('data-collapsed')).toBe('false');
    });

    it('starts collapsed when collapsedSidebar=true', () => {
      render(
        <UniversalAssistantLayout collapsedSidebar>
          <div>C</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByTestId('assistant-sidebar').getAttribute('data-collapsed')).toBe('true');
    });

    it('toggles sidebar collapsed state on button click', () => {
      render(
        <UniversalAssistantLayout>
          <div>C</div>
        </UniversalAssistantLayout>
      );
      const sidebar = screen.getByTestId('assistant-sidebar');
      expect(sidebar.getAttribute('data-collapsed')).toBe('false');

      fireEvent.click(screen.getByTitle('Collapse sidebar'));
      expect(sidebar.getAttribute('data-collapsed')).toBe('true');

      fireEvent.click(screen.getByTitle('Expand sidebar'));
      expect(sidebar.getAttribute('data-collapsed')).toBe('false');
    });

    it('shows X icon when expanded and Menu icon when collapsed', () => {
      render(
        <UniversalAssistantLayout>
          <div>C</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTitle('Collapse sidebar'));
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    it('adds sidebar-collapsed class to layout wrapper', () => {
      const { container } = render(
        <UniversalAssistantLayout collapsedSidebar>
          <div>C</div>
        </UniversalAssistantLayout>
      );
      expect(container.querySelector('.universal-layout.sidebar-collapsed')).toBeTruthy();
    });
  });

  // ────── Header Actions ──────

  describe('headerActions slot', () => {
    it('renders header actions when provided', () => {
      render(
        <UniversalAssistantLayout headerActions={<button>Export CSV</button>}>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    it('does not render header-actions wrapper when prop omitted', () => {
      const { container } = render(
        <UniversalAssistantLayout>
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(container.querySelector('.header-actions')).not.toBeInTheDocument();
    });
  });

  // ────── Error Boundary ──────

  describe('ErrorBoundary', () => {
    it('renders error fallback when a child throws', () => {
      const ThrowingChild = () => { throw new Error('Test crash'); };
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <UniversalAssistantLayout>
          <ThrowingChild />
        </UniversalAssistantLayout>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test crash')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      spy.mockRestore();
    });

    it('shows generic message when error has no message', () => {
      const ThrowingChild = () => { throw new Error(); };
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <UniversalAssistantLayout>
          <ThrowingChild />
        </UniversalAssistantLayout>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      spy.mockRestore();
    });

    it('retry button resets error state and re-renders children', () => {
      let shouldThrow = true;
      const MaybeThrow = () => {
        if (shouldThrow) throw new Error('Boom');
        return <div>Recovered</div>;
      };
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <UniversalAssistantLayout>
          <MaybeThrow />
        </UniversalAssistantLayout>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByText('Try Again'));

      expect(screen.getByText('Recovered')).toBeInTheDocument();
      spy.mockRestore();
    });
  });

  // ────── Sidebar Items ──────

  describe('sidebar items & feature selection', () => {
    it('passes sidebarItems to AssistantSidebar', () => {
      const items = [
        { id: 'overview', label: 'Overview' },
        { id: 'reports', label: 'Reports' },
      ];
      render(
        <UniversalAssistantLayout sidebarItems={items} activeFeature="overview">
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('invokes onFeatureChange when an item is clicked', () => {
      const handleChange = vi.fn();
      const items = [{ id: 'settings', label: 'Settings' }];
      render(
        <UniversalAssistantLayout
          sidebarItems={items}
          activeFeature="overview"
          onFeatureChange={handleChange}
        >
          <div>Content</div>
        </UniversalAssistantLayout>
      );
      fireEvent.click(screen.getByText('Settings'));
      expect(handleChange).toHaveBeenCalledWith('settings');
    });
  });

  // ────── Suspense / Loading Spinner ──────

  it('renders Suspense fallback (loading spinner) while children are lazy', async () => {
    // Lazy component that never resolves
    const LazyChild = React.lazy(() => new Promise(() => {}));
    render(
      <UniversalAssistantLayout>
        <LazyChild />
      </UniversalAssistantLayout>
    );
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
  });
});
