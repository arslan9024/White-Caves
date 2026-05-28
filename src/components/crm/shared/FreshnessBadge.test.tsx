/**
 * FreshnessBadge tests — W18.1-P0-012
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FreshnessBadge } from './FreshnessBadge';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

describe('FreshnessBadge', () => {
  it('renders "Fresh" for date ≤7 days ago', () => {
    render(<FreshnessBadge createdAt={daysAgo(3)} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Fresh');
  });

  it('renders "Recent" for date 8–30 days ago', () => {
    render(<FreshnessBadge createdAt={daysAgo(15)} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Recent');
  });

  it('renders "Aging" for date 31–90 days ago', () => {
    render(<FreshnessBadge createdAt={daysAgo(60)} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Aging');
  });

  it('renders "Stale" for date >90 days ago', () => {
    render(<FreshnessBadge createdAt={daysAgo(120)} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Stale');
  });

  it('uses lastRefreshedAt when provided (overrides createdAt)', () => {
    // createdAt is old but lastRefreshedAt is fresh
    render(<FreshnessBadge createdAt={daysAgo(200)} lastRefreshedAt={daysAgo(2)} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Fresh');
  });

  it('falls back to createdAt when lastRefreshedAt is null', () => {
    render(<FreshnessBadge createdAt={daysAgo(100)} lastRefreshedAt={null} />);
    expect(screen.getByTestId('freshness-badge')).toHaveTextContent('Stale');
  });

  it('has role=img for accessibility', () => {
    render(<FreshnessBadge createdAt={daysAgo(1)} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has accessible aria-label with tier and days', () => {
    render(<FreshnessBadge createdAt={daysAgo(3)} />);
    const badge = screen.getByTestId('freshness-badge');
    expect(badge).toHaveAttribute('aria-label');
    expect(badge.getAttribute('aria-label')).toMatch(/freshness: Fresh/i);
    expect(badge.getAttribute('aria-label')).toMatch(/days ago/);
  });

  it('data-tier attribute is "Fresh" for recent date', () => {
    render(<FreshnessBadge createdAt={daysAgo(1)} />);
    expect(screen.getByTestId('freshness-badge').dataset.tier).toBe('Fresh');
  });

  it('data-tier attribute is "Stale" for very old date', () => {
    render(<FreshnessBadge createdAt={daysAgo(200)} />);
    expect(screen.getByTestId('freshness-badge').dataset.tier).toBe('Stale');
  });

  it('renders a clock icon (svg) in all states', () => {
    render(<FreshnessBadge createdAt={daysAgo(5)} />);
    expect(screen.getByTestId('freshness-badge').querySelector('svg')).toBeInTheDocument();
  });
});
