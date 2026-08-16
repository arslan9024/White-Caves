import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluidMegaMenu } from './FluidMegaMenu';

describe('FluidMegaMenu Component', () => {
  it('renders fluid mega menu and reveals categories on mouse enter', () => {
    render(<FluidMegaMenu />);
    const wrapper = screen.getByTestId('fluid-mega-menu');
    expect(wrapper).toBeDefined();
    expect(screen.getByText(/Properties Navigation/i)).toBeDefined();

    // Hover over menu
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText('Residential')).toBeDefined();
    expect(screen.getByText('Commercial')).toBeDefined();
    expect(screen.getByText('Off-Plan')).toBeDefined();
    expect(screen.getByText(/Palm Luxury Villas/i)).toBeDefined();
    expect(screen.getByText(/EMAAR Launches/i)).toBeDefined();
  });
});
