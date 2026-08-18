import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import KPITile from './KPITile';

describe('KPITile Component', () => {
  it('renders title, value, and trend indicators correctly', () => {
    render(
      <KPITile
        title="Gross Commission"
        value={1500000}
        format="currency"
        unit="AED"
        trend="up"
        color="gold"
      />
    );

    expect(screen.getByText('Gross Commission')).toBeInTheDocument();
    expect(screen.getByText('AED 1,500,000')).toBeInTheDocument();
  });

  it('renders percentage format correctly', () => {
    render(
      <KPITile
        title="Occupancy Rate"
        value={94.5}
        format="percentage"
        trend="up"
        color="green"
      />
    );

    expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('94.5%')).toBeInTheDocument();
  });
});
