import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { BayutTruCheckBadge } from './BayutTruCheckBadge';

describe('BayutTruCheckBadge — Luxury Design Standard Token #12', () => {
  it('renders Component Variant 1 properly', () => {
    render(<BayutTruCheckBadge variant="variant-1" />);
    expect(screen.getByTestId('trucheck-badge-v1')).toBeInTheDocument();
    expect(screen.getByText('TruCheck™')).toBeInTheDocument();
  });

  it('renders Component Variant 2 with animated stamp and verified seal', () => {
    render(<BayutTruCheckBadge variant="variant-2" timestamp="Just now" />);
    const stamp = screen.getByTestId('trucheck-badge-v2');
    expect(stamp).toBeInTheDocument();
    expect(stamp).toHaveAttribute('title', expect.stringContaining('Just now'));
    expect(screen.getByText('TruCheck™')).toBeInTheDocument();
  });
});
