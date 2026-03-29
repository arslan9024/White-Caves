import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock styled-components for DataCard
vi.mock('./DataCard/DataCard.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  const { Link } = require('react-router-dom');
  return {
    DataCardWrapper: c('div'),
    DataCardHeader: c('div'),
    HeaderActions: c('div'),
    ViewAllLink: ({ children, to, ...props }: any) => React.createElement(Link, { to, ...props }, children),
    DataCardContent: c('div'),
    DataListItemContainer: ({ children, $clickable, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('div', filtered, children);
    },
    ItemAvatar: c('div'),
    AvatarText: c('span'),
    AvatarIcon: c('span'),
    ItemContent: c('div'),
    ItemTitle: c('span'),
    ItemSubtitle: c('span'),
    ItemMeta: c('span'),
    ItemStatus: ({ children, $statusColor, ...props }: any) => React.createElement('span', props, children),
    ItemBadge: ({ children, $badgeColor, ...props }: any) => React.createElement('span', props, children),
    ItemActions: c('div'),
    DataList: c('div'),
  };
});

import DataCard, { DataCardGrid, DataListComponent, DataListItem } from './DataCard';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DataCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with title', () => {
      renderWithRouter(<DataCard title="Recent Leads" />);
      expect(screen.getByText('Recent Leads')).toBeInTheDocument();
    });

    it('renders children content', () => {
      renderWithRouter(<DataCard title="Card"><p>Card content</p></DataCard>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders View All link when viewAllLink is provided', () => {
      renderWithRouter(<DataCard title="Test" viewAllLink="/leads" />);
      const link = screen.getByText('View All →');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/leads');
    });

    it('renders custom viewAllText', () => {
      renderWithRouter(<DataCard title="Test" viewAllLink="/leads" viewAllText="See More" />);
      expect(screen.getByText('See More →')).toBeInTheDocument();
    });

    it('does not render View All link when viewAllLink is not provided', () => {
      renderWithRouter(<DataCard title="Test" />);
      expect(screen.queryByText('View All →')).not.toBeInTheDocument();
    });

    it('renders header actions', () => {
      renderWithRouter(
        <DataCard title="Test" headerActions={<button>Action</button>} />
      );
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('applies className', () => {
      const { container } = renderWithRouter(<DataCard title="Test" className="custom" />);
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });
  });
});

describe('DataCardGrid', () => {
  it('renders children', () => {
    render(<DataCardGrid><div>Grid Item</div></DataCardGrid>);
    expect(screen.getByText('Grid Item')).toBeInTheDocument();
  });

  it('applies custom columns via style', () => {
    const { container } = render(<DataCardGrid columns={3}><div>Item</div></DataCardGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });

  it('defaults to 2 columns', () => {
    const { container } = render(<DataCardGrid><div>Item</div></DataCardGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
  });

  it('applies className', () => {
    const { container } = render(<DataCardGrid className="my-grid"><div>Item</div></DataCardGrid>);
    expect(container.querySelector('.my-grid')).toBeInTheDocument();
  });
});

describe('DataListComponent', () => {
  it('renders children', () => {
    render(<DataListComponent><div>List Item</div></DataListComponent>);
    expect(screen.getByText('List Item')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<DataListComponent className="my-list"><div>Item</div></DataListComponent>);
    expect(container.querySelector('.my-list')).toBeInTheDocument();
  });
});

describe('DataListItem', () => {
  it('renders title', () => {
    render(<DataListItem title="John Doe" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<DataListItem title="John" subtitle="Manager" />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders status', () => {
    render(<DataListItem title="Lead" status="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<DataListItem title="Lead" badge={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders meta content', () => {
    render(<DataListItem title="Lead" meta={<span>2 days ago</span>} />);
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(<DataListItem title="Lead" actions={<button>Edit</button>} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders avatarText when provided', () => {
    render(<DataListItem title="John" avatarText="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<DataListItem title="John" icon={<span data-testid="icon">📧</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DataListItem title="Clickable" onClick={onClick} />);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets role=button and tabIndex=0 when onClick is provided', () => {
    const onClick = vi.fn();
    render(<DataListItem title="Clickable" onClick={onClick} />);
    const item = screen.getByRole('button');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('tabindex', '0');
  });

  it('does not set role=button when no onClick', () => {
    render(<DataListItem title="Static" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders avatar image when avatar prop is given', () => {
    render(<DataListItem title="Jane" avatar="https://example.com/jane.jpg" />);
    const img = screen.getByAltText('Jane');
    expect(img).toHaveAttribute('src', 'https://example.com/jane.jpg');
  });
});
