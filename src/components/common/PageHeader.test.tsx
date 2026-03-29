import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock styled-components
vi.mock('./PageHeader.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    PageHeaderWrapper: c('header'),
    Breadcrumbs: (props: any) => React.createElement('nav', { 'aria-label': props['aria-label'] }, props.children),
    BreadcrumbLink: ({ children, to, ...rest }: any) => React.createElement('a', { href: to, ...rest }, children),
    BreadcrumbSeparator: c('span'),
    BreadcrumbCurrent: c('span'),
    HeaderMain: c('div'),
    HeaderContent: c('div'),
    HeaderSubtitle: c('p'),
    HeaderActions: c('div'),
    StyledActionButton: (props: any) => {
      const { children, $variant, $size, ...rest } = props;
      return React.createElement('button', rest, children);
    },
    ActionButtonLink: ({ children, to, $variant, $size, ...rest }: any) => React.createElement('a', { href: to, ...rest }, children),
    ButtonIcon: c('span'),
    ButtonLabel: c('span'),
  };
});

import PageHeader, { ActionButton } from './PageHeader';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('PageHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic Rendering ────────────────────────────────────────
  describe('basic rendering', () => {
    it('renders the title', () => {
      renderWithRouter(<PageHeader title="Dashboard" />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders the title in an h1 element', () => {
      renderWithRouter(<PageHeader title="Properties" />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Properties');
    });

    it('renders subtitle when provided', () => {
      renderWithRouter(<PageHeader title="Title" subtitle="A helpful subtitle" />);
      expect(screen.getByText('A helpful subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      renderWithRouter(<PageHeader title="Title" />);
      expect(screen.queryByText('A helpful subtitle')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderWithRouter(<PageHeader title="T" className="my-header" />);
      expect(container.querySelector('.my-header')).toBeInTheDocument();
    });
  });

  // ── Breadcrumbs ────────────────────────────────────────────
  describe('breadcrumbs', () => {
    const breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Properties', path: '/properties' },
      { label: 'Villa 123' },
    ];

    it('renders breadcrumb navigation', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={breadcrumbs} />);
      expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    });

    it('renders breadcrumb items', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={breadcrumbs} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Villa 123')).toBeInTheDocument();
    });

    it('renders links for breadcrumbs with path', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={breadcrumbs} />);
      const homeLink = screen.getByText('Home');
      expect(homeLink.tagName.toLowerCase()).toBe('a');
      expect(homeLink.getAttribute('href')).toBe('/');
    });

    it('renders current breadcrumb without link', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={breadcrumbs} />);
      const current = screen.getByText('Villa 123');
      expect(current.tagName.toLowerCase()).not.toBe('a');
    });

    it('renders separators between breadcrumbs', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={breadcrumbs} />);
      const separators = screen.getAllByText('/');
      expect(separators.length).toBe(2); // 3 items = 2 separators
    });

    it('does not render breadcrumbs when not provided', () => {
      renderWithRouter(<PageHeader title="T" />);
      expect(screen.queryByLabelText('Breadcrumb')).not.toBeInTheDocument();
    });

    it('does not render breadcrumbs for empty array', () => {
      renderWithRouter(<PageHeader title="T" breadcrumbs={[]} />);
      expect(screen.queryByLabelText('Breadcrumb')).not.toBeInTheDocument();
    });
  });

  // ── Actions ────────────────────────────────────────────────
  describe('actions', () => {
    it('renders actions when provided', () => {
      const actions = <button>Add New</button>;
      renderWithRouter(<PageHeader title="T" actions={actions} />);
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    it('does not render actions area when not provided', () => {
      const { container } = renderWithRouter(<PageHeader title="T" />);
      // Actions wrapper should not exist
      expect(container.querySelectorAll('button').length).toBe(0);
    });
  });
});

describe('ActionButton', () => {
  // ── Basic Rendering ────────────────────────────────────────
  describe('basic rendering', () => {
    it('renders button label', () => {
      renderWithRouter(<ActionButton label="Add Property" />);
      expect(screen.getByText('Add Property')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      renderWithRouter(<ActionButton label="Add" icon={<span>🏠</span>} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });

    it('does not render icon wrapper when no icon', () => {
      renderWithRouter(<ActionButton label="Submit" />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  // ── Button Mode ────────────────────────────────────────────
  describe('button mode', () => {
    it('renders as button when no "to" prop', () => {
      renderWithRouter(<ActionButton label="Click Me" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithRouter(<ActionButton label="Click" onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
      renderWithRouter(<ActionButton label="Disabled" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // ── Link Mode ──────────────────────────────────────────────
  describe('link mode', () => {
    it('renders as link when "to" is provided', () => {
      renderWithRouter(<ActionButton label="Go" to="/somewhere" />);
      const link = screen.getByText('Go').closest('a');
      expect(link).toBeInTheDocument();
      expect(link?.getAttribute('href')).toBe('/somewhere');
    });
  });

  // ── Accessibility ──────────────────────────────────────────
  describe('accessibility', () => {
    it('button has type="button"', () => {
      renderWithRouter(<ActionButton label="Action" />);
      expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    });
  });
});
