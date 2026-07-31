import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardActivityFeed from './DashboardActivityFeed';

vi.mock('../../hooks/useCompanyActivityFeed', () => ({
  useCompanyActivityFeed: (seeds: unknown[]) => ({
    items: seeds.length
      ? [
          { id: '1', actor: 'Alice', action: 'listed', entity: 'Villa 42', relativeTime: '2m ago' },
          { id: '2', actor: 'Bob', action: 'updated', entity: 'Lead #19', relativeTime: '5m ago' },
        ]
      : [],
    isLoading: false,
    error: null,
  }),
}));

const seed = [{ id: '1' }];

describe('DashboardActivityFeed', () => {
  it('renders the activity feed section with correct aria-label', () => {
    render(<DashboardActivityFeed seedItems={seed} />);
    expect(screen.getByLabelText('Company activity feed')).toBeInTheDocument();
  });

  it('renders a "View all" button that calls onViewAll', () => {
    const spy = vi.fn();
    render(<DashboardActivityFeed seedItems={seed} onViewAll={spy} />);
    fireEvent.click(screen.getByText('View all'));
    expect(spy).toHaveBeenCalledOnce();
  });

  it('renders activity items when data is available', () => {
    render(<DashboardActivityFeed seedItems={seed} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty state when no items exist', () => {
    render(<DashboardActivityFeed seedItems={[]} />);
    expect(screen.getByText('No activity events yet.')).toBeInTheDocument();
  });

  it('renders the heading "Live activity feed"', () => {
    render(<DashboardActivityFeed seedItems={seed} />);
    expect(screen.getByText('Live activity feed')).toBeInTheDocument();
  });
});
