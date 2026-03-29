import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./StatCard.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    StatCardGridContainer: ({ children, $columns, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('div', { ...filtered, 'data-columns': $columns }, children);
    },
    StatCardWrapper: ({ children, $variant, $clickable, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('div', { ...filtered, 'data-variant': $variant }, children);
    },
    StatIconWrapper: c('div'),
    StatIcon: c('div'),
    StatInfo: c('div'),
    StatValue: c('span'),
    StatLabel: c('span'),
    StatChange: ({ children, $positive, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('span', { ...filtered, 'data-positive': String($positive) }, children);
    },
  };
});

import StatCard, { StatCardGrid } from './StatCard';

describe('StatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders value and label', () => {
      render(<StatCard value="1,234" label="Total Leads" />);
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Total Leads')).toBeInTheDocument();
    });

    it('renders numeric value', () => {
      render(<StatCard value={500} label="Properties" />);
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      render(<StatCard value="10" label="Active" icon={<span data-testid="stat-icon">📊</span>} />);
      expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
    });

    it('renders without icon', () => {
      const { container } = render(<StatCard value="10" label="Active" />);
      expect(container).toBeTruthy();
    });
  });

  describe('change indicator', () => {
    it('renders change text when provided', () => {
      render(<StatCard value="100" label="Sales" change="+12%" />);
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('does not render change text when not provided', () => {
      render(<StatCard value="100" label="Sales" />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('marks positive change by default', () => {
      render(<StatCard value="100" label="Sales" change="+5%" />);
      const changeEl = screen.getByText('+5%');
      expect(changeEl).toHaveAttribute('data-positive', 'true');
    });

    it('marks negative change when positive=false', () => {
      render(<StatCard value="100" label="Sales" change="-3%" positive={false} />);
      const changeEl = screen.getByText('-3%');
      expect(changeEl).toHaveAttribute('data-positive', 'false');
    });
  });

  describe('variants', () => {
    it('applies default variant', () => {
      const { container } = render(<StatCard value="10" label="Test" />);
      expect(container.querySelector('[data-variant="default"]')).toBeInTheDocument();
    });

    it('applies primary variant', () => {
      const { container } = render(<StatCard value="10" label="Test" variant="primary" />);
      expect(container.querySelector('[data-variant="primary"]')).toBeInTheDocument();
    });

    it('applies success variant', () => {
      const { container } = render(<StatCard value="10" label="Test" variant="success" />);
      expect(container.querySelector('[data-variant="success"]')).toBeInTheDocument();
    });

    it('applies warning variant', () => {
      const { container } = render(<StatCard value="10" label="Test" variant="warning" />);
      expect(container.querySelector('[data-variant="warning"]')).toBeInTheDocument();
    });

    it('applies danger variant', () => {
      const { container } = render(<StatCard value="10" label="Test" variant="danger" />);
      expect(container.querySelector('[data-variant="danger"]')).toBeInTheDocument();
    });
  });

  describe('click behavior', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<StatCard value="10" label="Clickable" onClick={onClick} />);
      fireEvent.click(screen.getByText('Clickable'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('sets role=button when onClick is provided', () => {
      const onClick = vi.fn();
      render(<StatCard value="10" label="Clickable" onClick={onClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('sets tabIndex=0 when onClick is provided', () => {
      const onClick = vi.fn();
      render(<StatCard value="10" label="Clickable" onClick={onClick} />);
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
    });

    it('does not set role=button when no onClick', () => {
      render(<StatCard value="10" label="Static" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('applies className', () => {
      const { container } = render(<StatCard value="10" label="Test" className="custom" />);
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });
  });
});

describe('StatCardGrid', () => {
  it('renders children', () => {
    render(
      <StatCardGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </StatCardGrid>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('defaults to 4 columns', () => {
    const { container } = render(
      <StatCardGrid><div>Item</div></StatCardGrid>
    );
    expect(container.querySelector('[data-columns="4"]')).toBeInTheDocument();
  });

  it('accepts custom columns', () => {
    const { container } = render(
      <StatCardGrid columns={3}><div>Item</div></StatCardGrid>
    );
    expect(container.querySelector('[data-columns="3"]')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(
      <StatCardGrid className="my-grid"><div>Item</div></StatCardGrid>
    );
    expect(container.querySelector('.my-grid')).toBeInTheDocument();
  });
});
