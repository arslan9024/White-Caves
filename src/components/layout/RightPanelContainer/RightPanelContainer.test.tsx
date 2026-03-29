import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  X: (props: any) => <span data-testid="icon-x" {...props} />,
  Search: (props: any) => <span data-testid="icon-search" {...props} />,
  ChevronRight: (props: any) => <span data-testid="icon-chevron" {...props} />,
  Bot: (props: any) => <span data-testid="icon-bot" {...props} />,
}));

// Mock styled-components
vi.mock('./styles', () => {
  const c = (tag: string, testid?: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    if (testid) filtered['data-testid'] = testid;
    return React.createElement(tag, filtered, children);
  };
  return {
    RightPanelRoot: ({ children, $isMobile, $isTablet, $isOpen, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('div', { ...filtered, 'data-testid': 'panel-root' }, children);
    },
    PanelHeader: c('div', 'panel-header'),
    PanelTitle: c('div'),
    PanelCloseButton: c('button'),
    PanelSearchSection: c('div'),
    SearchInputWrapper: c('div'),
    SearchIcon: c('span'),
    SearchInput: ({ ...props }: any) => React.createElement('input', props),
    SearchClearButton: c('button'),
    PanelContent: c('div', 'panel-content'),
    AssistantGroup: c('div'),
    GroupHeaderButton: ({ children, $expanded, ...props }: any) => {
      const f: any = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) f[k] = v; }
      return React.createElement('button', f, children);
    },
    ToggleIcon: ({ children, $rotated, ...props }: any) => React.createElement('span', props, children),
    GroupAssistants: c('div'),
    AssistantItemButton: ({ children, $active, ...props }: any) => {
      const f: any = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) f[k] = v; }
      return React.createElement('button', f, children);
    },
    AssistantAvatar: c('span'),
    AssistantInfo: c('div'),
    AssistantName: c('span'),
    AssistantRole: c('span'),
    NotificationBadge: c('span', 'notification-badge'),
    PanelFooter: c('div'),
    FooterHint: c('span'),
    KeyboardKey: c('kbd'),
  };
});

// Mock assistant registry
vi.mock('../../../config/assistantRegistry', () => ({
  getAllAssistants: () => [
    { id: 'clara', name: 'Clara', description: 'Leads CRM', emoji: '👩', role: 'CRM Lead' },
    { id: 'sophia', name: 'Sophia', description: 'Sales Analytics', emoji: '📊', role: 'Sales' },
    { id: 'mary', name: 'Mary', description: 'Inventory Manager', emoji: '🏠', role: 'Inventory' },
    { id: 'nadia', name: 'Nadia', description: 'Client Relations', emoji: '🤝', role: 'Client' },
    { id: 'nancy', name: 'Nancy', description: 'HR Manager', emoji: '👔', role: 'HR' },
    { id: 'daisy', name: 'Daisy', description: 'Operations', emoji: '⚙️', role: 'Ops' },
    { id: 'theodora', name: 'Theodora', description: 'Finance', emoji: '💰', role: 'Finance' },
    { id: 'zoe', name: 'Zoe', description: 'Executive CRM', emoji: '👑', role: 'Executive' },
    { id: 'aurora', name: 'Aurora', description: 'CTO Dashboard', emoji: '🏛️', role: 'CTO' },
    { id: 'hazel', name: 'Hazel', description: 'Security', emoji: '🔒', role: 'Security' },
  ],
}));

import RightPanelContainer from './RightPanelContainer';

describe('RightPanelContainer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onAssistantSelect: vi.fn(),
    notifications: {} as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders when open', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByTestId('panel-root')).toBeInTheDocument();
    });

    it('returns null when closed and not mobile', () => {
      const { container } = render(<RightPanelContainer {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders panel title "AI Assistants"', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search assistants...')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByLabelText('Close panel')).toBeInTheDocument();
    });

    it('renders footer keyboard hint', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('Cmd')).toBeInTheDocument();
    });
  });

  describe('groups', () => {
    it('renders CRM Assistants group', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('CRM Assistants')).toBeInTheDocument();
    });

    it('renders Operations group', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('renders Technical group', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('Technical')).toBeInTheDocument();
    });

    it('shows CRM assistants by default (crm expanded)', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Sophia')).toBeInTheDocument();
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.getByText('Nadia')).toBeInTheDocument();
    });

    it('shows Operations assistants by default (operations expanded)', () => {
      render(<RightPanelContainer {...defaultProps} />);
      expect(screen.getByText('Nancy')).toBeInTheDocument();
      expect(screen.getByText('Daisy')).toBeInTheDocument();
    });

    it('technical group does not show assistants by default (collapsed)', () => {
      render(<RightPanelContainer {...defaultProps} />);
      // Technical is collapsed — Zoe, Aurora, Hazel should NOT be visible
      expect(screen.queryByText('Zoe')).not.toBeInTheDocument();
    });

    it('expands technical group on click', () => {
      render(<RightPanelContainer {...defaultProps} />);
      fireEvent.click(screen.getByText('Technical'));
      expect(screen.getByText('Zoe')).toBeInTheDocument();
      expect(screen.getByText('Aurora')).toBeInTheDocument();
    });

    it('collapses CRM group on click', () => {
      render(<RightPanelContainer {...defaultProps} />);
      fireEvent.click(screen.getByText('CRM Assistants'));
      expect(screen.queryByText('Clara')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClose when close button clicked', () => {
      render(<RightPanelContainer {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Close panel'));
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onAssistantSelect when assistant clicked', () => {
      render(<RightPanelContainer {...defaultProps} />);
      fireEvent.click(screen.getByText('Clara'));
      expect(defaultProps.onAssistantSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'clara', name: 'Clara' })
      );
    });
  });

  describe('search', () => {
    it('filters assistants by name', () => {
      render(<RightPanelContainer {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'nancy' } });
      expect(screen.getByText('Nancy')).toBeInTheDocument();
      // Clara should no longer be visible (doesn't match search)
      expect(screen.queryByText('Clara')).not.toBeInTheDocument();
    });

    it('filters assistants by description', () => {
      render(<RightPanelContainer {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'inventory' } });
      expect(screen.getByText('Mary')).toBeInTheDocument();
    });

    it('shows clear button when search has value', () => {
      render(<RightPanelContainer {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('clears search when clear button clicked', () => {
      render(<RightPanelContainer {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'nancy' } });
      fireEvent.click(screen.getByLabelText('Clear search'));
      // Clara should be back
      expect(screen.getByText('Clara')).toBeInTheDocument();
    });
  });

  describe('notifications', () => {
    it('renders notification badge when assistant has notifications', () => {
      render(
        <RightPanelContainer
          {...defaultProps}
          notifications={{ clara: [{ msg: 'hello' }, { msg: 'world' }] }}
        />
      );
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
