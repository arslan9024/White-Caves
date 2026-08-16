import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MasterplanInteractiveMap } from './MasterplanInteractiveMap';

describe('MasterplanInteractiveMap Component', () => {
  it('renders GIS masterplan interactive map layer and switches active cluster', () => {
    render(<MasterplanInteractiveMap />);
    expect(screen.getByTestId('masterplan-interactive-map')).toBeDefined();
    expect(screen.getByText(/Master Community Masterplan GIS & Phasing Layer/i)).toBeDefined();
    expect(screen.getByText(/GIS MASTERPLAN/i)).toBeDefined();
    expect(screen.getAllByText(/Palm Fronds Sector A/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Lagoon Marina Precinct/i)).toBeDefined();

    // Click cluster button
    const lagoonBtn = screen.getByRole('button', { name: /Lagoon Marina Precinct/i });
    fireEvent.click(lagoonBtn);
    expect(screen.getAllByText(/Lagoon Marina Precinct/i).length).toBeGreaterThan(1);
  });
});
