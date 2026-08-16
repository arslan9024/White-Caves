import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetroProximityMultiplier from './MetroProximityMultiplier';

describe('MetroProximityMultiplier Component', () => {
  it('renders without crashing and displays the metro proximity valuation slider', () => {
    render(<MetroProximityMultiplier />);
    expect(screen.getByTestId('metro-proximity-multiplier')).toBeInTheDocument();
  });
});
