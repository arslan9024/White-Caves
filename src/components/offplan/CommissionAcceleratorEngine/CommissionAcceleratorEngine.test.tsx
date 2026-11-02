import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommissionAcceleratorEngine } from './CommissionAcceleratorEngine';

describe('CommissionAcceleratorEngine Component', () => {
  it('renders commission accelerator engine and adjusts units sold to accelerate tier', () => {
    render(<CommissionAcceleratorEngine />);
    expect(screen.getByTestId('commission-accelerator-engine')).toBeDefined();
    expect(screen.getByText(/Commission Accelerator Engine/i)).toBeDefined();
    expect(screen.getByText(/My Commission Summary/i)).toBeDefined();
    expect(screen.getByText(/My Earnings/i)).toBeDefined();
    expect(screen.getByText(/Total Sales Volume/i)).toBeDefined();

    const unitsInput = screen.getByDisplayValue('12');
    fireEvent.change(unitsInput, { target: { value: '21' } });
    expect(screen.getAllByText(/Platinum Tier/i).length).toBeGreaterThan(0);
  });
});
