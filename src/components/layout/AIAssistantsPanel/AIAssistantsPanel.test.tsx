/**
 * AIAssistantsPanel – comprehensive test suite
 * Covers rendering, search, status filters, expand, select, notifications, close
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

/* ── Mock assistantRegistry ──────────────────────────────────── */
vi.mock('../../../config/assistantRegistry', () => ({
  getAllAssistants: () => [
    { id: 'clara', name: 'Clara', title: 'Lead Agent', department: 'sales', status: 'active', color: '#10B981', capabilities: ['Lead scoring', 'Pipeline management', 'Deal tracking'] },
    { id: 'mary', name: 'Mary', title: 'Inventory Manager', department: 'operations', status: 'active', color: '#3B82F6', capabilities: ['Property tracking', 'Data management'] },
    { id: 'nadia', name: 'Nadia', title: 'Communications Lead', department: 'communications', status: 'idle', color: '#8B5CF6', capabilities: ['Messaging', 'Templates'] },
  ],
}));

import AIAssistantsPanel from './AIAssistantsPanel';

/* ── Mock styled-components ──────────────────────────────────── */
vi.mock('./styles', () => {
  const stub = (name: string) => {
    const C = ({ children, onClick, className, style, value, onChange, placeholder, type, ...rest }: any) => {
      if (type === 'text' || name === 'SearchInput') {
        return <input data-testid={name} placeholder={placeholder} value={value} onChange={onChange} type="text" {...rest} />;
      }
      return <div data-testid={name} onClick={onClick} className={className} style={style} {...rest}>{children}</div>;
    };
    C.displayName = name;
    return C;
  };
  return {
    PanelContainer: stub('PanelContainer'),
    PanelHeader: stub('PanelHeader'),
    PanelTitle: stub('PanelTitle'),
    PanelCloseButton: stub('PanelCloseButton'),
    PanelSearchContainer: stub('PanelSearchContainer'),
    SearchInputWrapper: stub('SearchInputWrapper'),
    SearchIcon: stub('SearchIcon'),
    SearchInput: stub('SearchInput'),
    SearchClearButton: stub('SearchClearButton'),
    PanelFilters: stub('PanelFilters'),
    FilterButton: stub('FilterButton'),
    AssistantsList: stub('AssistantsList'),
    NoResults: stub('NoResults'),
    AssistantCard: stub('AssistantCard'),
    AssistantMain: stub('AssistantMain'),
    AssistantAvatar: stub('AssistantAvatar'),
    AssistantDetails: stub('AssistantDetails'),
    AssistantNameRow: stub('AssistantNameRow'),
    AssistantName: stub('AssistantName'),
    StatusBadge: stub('StatusBadge'),
    AssistantTitle: stub('AssistantTitle'),
    AssistantDept: stub('AssistantDept'),
    NotificationBadge: stub('NotificationBadge'),
    ExpandButton: stub('ExpandButton'),
    AssistantExpanded: stub('AssistantExpanded'),
    CapabilitiesList: stub('CapabilitiesList'),
    CapabilityTag: stub('CapabilityTag'),
    QuickActions: stub('QuickActions'),
    ActionButton: stub('ActionButton'),
    PanelFooter: stub('PanelFooter'),
    FooterStats: stub('FooterStats'),
    Stat: stub('Stat'),
    StatDot: stub('StatDot'),
  };
});

describe('AIAssistantsPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onAssistantSelect: vi.fn(),
    notifications: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ── Visibility ─────────────────────────────────────────────── */
  describe('visibility', () => {
    it('returns null when not open', () => {
      const { container } = render(<AIAssistantsPanel isOpen={false} onClose={vi.fn()} />);
      expect(container.innerHTML).toBe('');
    });

    it('renders when open', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });
  });

  /* ── Header ─────────────────────────────────────────────────── */
  describe('header', () => {
    it('renders title with icon', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      const closeBtn = screen.getByTestId('PanelCloseButton');
      expect(closeBtn).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<AIAssistantsPanel {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('PanelCloseButton'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  /* ── Search ─────────────────────────────────────────────────── */
  describe('search', () => {
    it('renders search input', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search assistants...')).toBeInTheDocument();
    });

    it('filters assistants by name', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'Clara' } });
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.queryByText('Nadia')).not.toBeInTheDocument();
    });

    it('filters by department', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'communications' } });
      expect(screen.getByText('Nadia')).toBeInTheDocument();
      expect(screen.queryByText('Clara')).not.toBeInTheDocument();
    });

    it('shows no results when search has no match', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'zzzzzzz' } });
      expect(screen.getByText('No assistants found')).toBeInTheDocument();
    });

    it('shows clear button when search has value', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'test' } });
      const clearBtn = screen.getByTestId('SearchClearButton');
      expect(clearBtn).toBeInTheDocument();
    });

    it('clears search on clear button click', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'Clara' } });
      fireEvent.click(screen.getByTestId('SearchClearButton'));
      // All assistants should be visible again
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Nadia')).toBeInTheDocument();
    });
  });

  /* ── Status Filters ─────────────────────────────────────────── */
  describe('status filters', () => {
    it('renders All, Active, Idle filter buttons', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText(/All \(3\)/)).toBeInTheDocument();
      expect(screen.getByText(/Active \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Idle \(1\)/)).toBeInTheDocument();
    });

    it('filters to active assistants', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.click(screen.getByText(/Active \(2\)/));
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.queryByText('Nadia')).not.toBeInTheDocument();
    });

    it('filters to idle assistants', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.click(screen.getByText(/Idle \(1\)/));
      expect(screen.getByText('Nadia')).toBeInTheDocument();
      expect(screen.queryByText('Clara')).not.toBeInTheDocument();
    });

    it('returns to all on All filter click', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      fireEvent.click(screen.getByText(/Idle \(1\)/));
      fireEvent.click(screen.getByText(/All \(3\)/));
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Nadia')).toBeInTheDocument();
    });
  });

  /* ── Assistant Cards ────────────────────────────────────────── */
  describe('assistant cards', () => {
    it('renders all 3 assistants', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.getByText('Nadia')).toBeInTheDocument();
    });

    it('renders titles', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('Lead Agent')).toBeInTheDocument();
      expect(screen.getByText('Inventory Manager')).toBeInTheDocument();
    });

    it('renders departments', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('sales')).toBeInTheDocument();
      expect(screen.getByText('operations')).toBeInTheDocument();
    });

    it('renders status badges', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      const activeBadges = screen.getAllByText('active');
      expect(activeBadges.length).toBe(2);
      expect(screen.getByText('idle')).toBeInTheDocument();
    });
  });

  /* ── Selection ──────────────────────────────────────────────── */
  describe('assistant selection', () => {
    it('calls onAssistantSelect when card is clicked', () => {
      const onSelect = vi.fn();
      render(<AIAssistantsPanel {...defaultProps} onAssistantSelect={onSelect} />);
      // Click the AssistantMain area for Clara
      const mainAreas = screen.getAllByTestId('AssistantMain');
      fireEvent.click(mainAreas[0]);
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'clara', name: 'Clara' }));
    });
  });

  /* ── Expand / Capabilities ──────────────────────────────────── */
  describe('expand assistant', () => {
    it('shows capabilities on expand button click', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      const expandBtns = screen.getAllByTestId('ExpandButton');
      fireEvent.click(expandBtns[0]); // Expand Clara
      expect(screen.getByText('Lead scoring')).toBeInTheDocument();
      expect(screen.getByText('Pipeline management')).toBeInTheDocument();
    });

    it('shows quick actions when expanded', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      const expandBtns = screen.getAllByTestId('ExpandButton');
      fireEvent.click(expandBtns[0]);
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    it('collapses on second click', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      const expandBtns = screen.getAllByTestId('ExpandButton');
      fireEvent.click(expandBtns[0]);
      expect(screen.getByText('Lead scoring')).toBeInTheDocument();
      fireEvent.click(expandBtns[0]);
      expect(screen.queryByText('Lead scoring')).not.toBeInTheDocument();
    });
  });

  /* ── Notifications ──────────────────────────────────────────── */
  describe('notifications', () => {
    it('shows notification badge for unread notifications', () => {
      const notifications = {
        clara: [{ isRead: false }, { isRead: false }, { isRead: true }],
      };
      render(<AIAssistantsPanel {...defaultProps} notifications={notifications} />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('does not show badge when all notifications are read', () => {
      const notifications = {
        clara: [{ isRead: true }],
      };
      render(<AIAssistantsPanel {...defaultProps} notifications={notifications} />);
      expect(screen.queryByTestId('NotificationBadge')).not.toBeInTheDocument();
    });
  });

  /* ── Footer ─────────────────────────────────────────────────── */
  describe('footer', () => {
    it('renders online and idle counts', () => {
      render(<AIAssistantsPanel {...defaultProps} />);
      expect(screen.getByText('2 Online')).toBeInTheDocument();
      expect(screen.getByText('1 Idle')).toBeInTheDocument();
    });
  });
});
