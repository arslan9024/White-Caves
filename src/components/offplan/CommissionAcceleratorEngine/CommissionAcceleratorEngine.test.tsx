import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommissionAcceleratorEngine } from './CommissionAcceleratorEngine';

describe('CommissionAcceleratorEngine Component', () => {
  it('renders commission accelerator engine and adjusts units sold to accelerate tier', () => {
    render(<CommissionAcceleratorEngine />);
    expect(screen.getByTestId('commission-accelerator-engine')).toBeDefined();
    expect(screen.getByText(/Commission Accelerator Engine/i)).toBeDefined();
    expect(screen.getByText(/Tier Progress/i)).toBeDefined();
    expect(screen.getByText(/YTD Earnings/i)).toBeDefined();
    expect(screen.getByText(/Sales Volume/i)).toBeDefined();

    const unitsInput = screen.getByDisplayValue('7');
    fireEvent.change(unitsInput, { target: { value: '12' } });
    expect(screen.getAllByText(/Platinum Tier/i).length).toBeGreaterThan(0);
  });
});
