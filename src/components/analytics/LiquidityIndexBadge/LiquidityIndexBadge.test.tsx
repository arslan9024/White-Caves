import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LiquidityIndexBadge from './LiquidityIndexBadge';

describe('LiquidityIndexBadge Component', () => {
  it('renders without crashing and displays liquidity index metric', () => {
    render(<LiquidityIndexBadge />);
    expect(screen.getByTestId('liquidity-index-badge')).toBeInTheDocument();
  });
});
