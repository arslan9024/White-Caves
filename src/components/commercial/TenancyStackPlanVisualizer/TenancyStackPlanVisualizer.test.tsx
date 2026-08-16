import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TenancyStackPlanVisualizer } from './TenancyStackPlanVisualizer';

describe('TenancyStackPlanVisualizer Component', () => {
  it('renders commercial building tenancy stack plan and floor levels', () => {
    render(<TenancyStackPlanVisualizer />);
    expect(screen.getByTestId('tenancy-stack-plan-visualizer')).toBeDefined();
    expect(screen.getByText(/Commercial Building Vertical Tenancy Stack Plan/i)).toBeDefined();
    expect(screen.getByText(/ASSET STACK 20-STOREY/i)).toBeDefined();
    expect(screen.getByText(/236,000 SqFt/i)).toBeDefined();
    expect(screen.getByText(/Morgan Stanley MENA Headquarters/i)).toBeDefined();
    expect(screen.getByText(/White Caves Global Executive Suites/i)).toBeDefined();
  });
});
