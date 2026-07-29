import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import MaintenanceMetrics from '../MaintenanceMetrics';

describe('MaintenanceMetrics Component', () => {
  it('renders maintenance metrics correctly', () => {
    render(<MaintenanceMetrics />);
    expect(screen.getByTestId('maintenance-metrics')).toBeDefined();
    expect(screen.getByText('Operations & Maintenance Metrics')).toBeDefined();
    expect(screen.getByText('34')).toBeDefined();
  });
});
