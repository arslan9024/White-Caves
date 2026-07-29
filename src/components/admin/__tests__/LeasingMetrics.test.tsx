import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LeasingMetrics from '../LeasingMetrics';

describe('LeasingMetrics Component', () => {
  it('renders leasing metrics correctly', () => {
    render(<LeasingMetrics />);
    expect(screen.getByTestId('leasing-metrics')).toBeDefined();
    expect(screen.getByText('Leasing & Tenancy Metrics')).toBeDefined();
    expect(screen.getByText('412')).toBeDefined();
  });
});
