import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KPITile from './KPITile';

describe('KPITile Component', () => {
  it('renders title and value formatted correctly', () => {
    render(<KPITile title="Total Deals" value={1450000} format="currency" unit="AED" />);
    expect(screen.getByText('Total Deals')).toBeInTheDocument();
    expect(screen.getByText(/1,450,000/)).toBeInTheDocument();
  });
});
