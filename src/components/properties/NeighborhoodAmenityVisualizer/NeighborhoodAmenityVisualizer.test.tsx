import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeighborhoodAmenityVisualizer } from './NeighborhoodAmenityVisualizer';

describe('NeighborhoodAmenityVisualizer', () => {
  it('renders amenity cards with commute times and distances', () => {
    render(<NeighborhoodAmenityVisualizer />);

    expect(screen.getByTestId('neighborhood-amenity-visualizer')).toBeDefined();
    expect(screen.getByText('DXB Int. Airport')).toBeDefined();
    expect(screen.getByText('18 Mins')).toBeDefined();
    expect(screen.getByText('The Dubai Mall / Burj Khalifa')).toBeDefined();
    expect(screen.getByText('12 Mins')).toBeDefined();
  });
});
