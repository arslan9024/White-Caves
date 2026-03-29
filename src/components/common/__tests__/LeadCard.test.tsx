import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled components
vi.mock('../LeadCard/LeadCard.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    LeadScoreBadgeStyled: c('span', 'lead-score-badge'),
    LeadStatusBadgeStyled: c('span', 'lead-status-badge'),
    LeadCardContainer: c('div', 'lead-card'),
    LeadCardHeader: c('div', 'lead-card-header'),
    LeadAvatar: c('div', 'lead-avatar'),
    LeadHeaderInfo: c('div', 'lead-header-info'),
    LeadName: c('span', 'lead-name'),
    LeadCardBody: c('div', 'lead-card-body'),
    LeadDetail: c('p', 'lead-detail'),
    LeadCardActions: c('div', 'lead-card-actions'),
    LeadListItemContainer: c('div', 'lead-list-item'),
    LeadScoreWrapper: c('div', 'lead-score-wrapper'),
    LeadInfo: c('div', 'lead-info'),
    LeadListName: c('span', 'lead-list-name'),
    LeadDetails: c('span', 'lead-details'),
  };
});

import LeadCard, { LeadScoreBadge, LeadStatusBadge, LeadListItem } from '../LeadCard';

const fullLeadProps = {
  name: 'Sarah Ahmed',
  avatar: 'https://example.com/avatar.jpg',
  requirement: '3BR Villa',
  budget: 'AED 5M - 8M',
  status: 'Hot',
  score: 92,
  source: 'Website',
  lastContact: '2 days ago',
  onView: vi.fn(),
  onContact: vi.fn(),
};

describe('LeadCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── LeadScoreBadge ─────────────────────────────────────────
  describe('LeadScoreBadge', () => {
    it('renders the score value', () => {
      render(<LeadScoreBadge score={85} />);
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('renders with default size', () => {
      render(<LeadScoreBadge score={50} />);
      expect(screen.getByTestId('lead-score-badge')).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<LeadScoreBadge score={95} size="small" />);
      expect(screen.getByText('95')).toBeInTheDocument();
    });
  });

  // ── LeadStatusBadge ────────────────────────────────────────
  describe('LeadStatusBadge', () => {
    it('renders the status text', () => {
      render(<LeadStatusBadge status="Hot" />);
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('renders different statuses', () => {
      const { rerender } = render(<LeadStatusBadge status="Warm" />);
      expect(screen.getByText('Warm')).toBeInTheDocument();
      rerender(<LeadStatusBadge status="Cold" />);
      expect(screen.getByText('Cold')).toBeInTheDocument();
    });
  });

  // ── LeadCard Rendering ─────────────────────────────────────
  describe('rendering', () => {
    it('renders lead name', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText('Sarah Ahmed')).toBeInTheDocument();
    });

    it('renders avatar image when provided', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByAltText('Sarah Ahmed')).toBeInTheDocument();
    });

    it('renders initial when no avatar', () => {
      render(<LeadCard {...fullLeadProps} avatar={undefined} />);
      expect(screen.getByText('S')).toBeInTheDocument();
    });

    it('renders ? when no avatar and no name', () => {
      render(<LeadCard {...fullLeadProps} name="" avatar={undefined} />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders status badge', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('renders score badge when provided', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText('92')).toBeInTheDocument();
    });

    it('does not render score badge when undefined', () => {
      render(<LeadCard {...fullLeadProps} score={undefined} />);
      expect(screen.queryByText('92')).not.toBeInTheDocument();
    });
  });

  // ── LeadCard Body Details ──────────────────────────────────
  describe('details', () => {
    it('renders requirement', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText(/3BR Villa/)).toBeInTheDocument();
    });

    it('renders budget', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText(/AED 5M - 8M/)).toBeInTheDocument();
    });

    it('renders source', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText(/Website/)).toBeInTheDocument();
    });

    it('renders last contact', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
    });

    it('hides optional details when not provided', () => {
      render(<LeadCard name="Test" status="New" />);
      expect(screen.queryByText(/Looking for/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Budget/)).not.toBeInTheDocument();
    });
  });

  // ── Actions ────────────────────────────────────────────────
  describe('actions', () => {
    it('renders View button when onView is provided', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText('View')).toBeInTheDocument();
    });

    it('renders Contact button when onContact is provided', () => {
      render(<LeadCard {...fullLeadProps} />);
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('calls onView when View is clicked', () => {
      render(<LeadCard {...fullLeadProps} />);
      fireEvent.click(screen.getByText('View'));
      expect(fullLeadProps.onView).toHaveBeenCalled();
    });

    it('calls onContact when Contact is clicked', () => {
      render(<LeadCard {...fullLeadProps} />);
      fireEvent.click(screen.getByText('Contact'));
      expect(fullLeadProps.onContact).toHaveBeenCalled();
    });

    it('does not render actions when no callbacks provided', () => {
      render(<LeadCard name="Test" status="New" />);
      expect(screen.queryByText('View')).not.toBeInTheDocument();
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    });
  });

  // ── LeadListItem ───────────────────────────────────────────
  describe('LeadListItem', () => {
    it('renders list item name', () => {
      render(<LeadListItem name="Alex M." status="Warm" />);
      expect(screen.getByText('Alex M.')).toBeInTheDocument();
    });

    it('renders score badge in list item', () => {
      render(<LeadListItem name="Alex M." status="Warm" score={75} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('renders requirement and budget', () => {
      render(<LeadListItem name="Alex" requirement="1BR Apt" budget="AED 1M" status="New" />);
      expect(screen.getByText(/1BR Apt/)).toBeInTheDocument();
    });

    it('renders status badge', () => {
      render(<LeadListItem name="Alex" status="Hot" />);
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<LeadListItem name="Alex" status="New" onClick={onClick} />);
      fireEvent.click(screen.getByTestId('lead-list-item'));
      expect(onClick).toHaveBeenCalled();
    });

    it('sets button role when clickable', () => {
      render(<LeadListItem name="Alex" status="New" onClick={vi.fn()} />);
      expect(screen.getByTestId('lead-list-item')).toHaveAttribute('role', 'button');
    });

    it('does not set role when not clickable', () => {
      render(<LeadListItem name="Alex" status="New" />);
      expect(screen.getByTestId('lead-list-item')).not.toHaveAttribute('role');
    });
  });
});
