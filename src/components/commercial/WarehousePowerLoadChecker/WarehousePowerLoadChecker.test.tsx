import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { WarehousePowerLoadChecker } from './WarehousePowerLoadChecker';

describe('WarehousePowerLoadChecker Component', () => {
  it('renders industrial warehouse power load checker and verifies DEWA connected power', () => {
    render(<WarehousePowerLoadChecker />);
    expect(screen.getByTestId('warehouse-power-load-checker')).toBeDefined();
    expect(screen.getByText(/Industrial Warehouse Electrical Power Load/i)).toBeDefined();
    expect(screen.getByText(/DEWA INDUSTRIAL AUDIT/i)).toBeDefined();
    expect(screen.getByText(/Electrical Capacity Compatibility/i)).toBeDefined();
    expect(screen.getByText(/DEWA Connected Power/i)).toBeDefined();
  });
});
