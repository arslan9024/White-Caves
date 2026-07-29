import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FinanceMetrics from '../FinanceMetrics';

describe('FinanceMetrics Component', () => {
  it('renders default finance metrics correctly', () => {
    render(<FinanceMetrics />);
    expect(screen.getByTestId('finance-metrics')).toBeDefined();
    expect(screen.getByText('Finance Metrics')).toBeDefined();
    expect(screen.getByText('AED 4,850,000')).toBeDefined();
    expect(screen.getByText('AED 320,000')).toBeDefined();
  });

  it('renders custom metric values when props are passed', () => {
    render(<FinanceMetrics totalRevenueAED={9000000} monthlyCommissionAED={500000} pendingEscrowAED={2000000} />);
    expect(screen.getByText('AED 9,000,000')).toBeDefined();
    expect(screen.getByText('AED 500,000')).toBeDefined();
  });
});
