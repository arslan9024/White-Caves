import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ReraCommercialRentIndexCalculator } from './ReraCommercialRentIndexCalculator';
import { apiClient } from '../../../services/apiClient';

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({
      data: {
        calculateReraCommercialRent: {
          benchmark: 320000,
          maxIncreasePct: 15,
          allowableIncreaseAed: 36000,
          maxAllowableRent: 276000
        }
      }
    })
  }
}));

describe('ReraCommercialRentIndexCalculator Component', () => {
  it('renders RERA commercial rent index calculator and displays Decree 43/2013 cap thresholds', async () => {
    render(<ReraCommercialRentIndexCalculator />);
    expect(screen.getByTestId('rera-commercial-rent-index-calculator')).toBeDefined();
    expect(screen.getByText(/RERA Commercial Rent Indexation & Cap Calculator/i)).toBeDefined();
    expect(screen.getByText(/DECREE 43\/2013 STATUTORY/i)).toBeDefined();
    expect(screen.getByText(/Max Permissible Rent Increase/i)).toBeDefined();
    expect(screen.getByText(/Maximum Legal Renewal Rent/i)).toBeDefined();
    expect(screen.getByText(/Dubai Decree No. 43 of 2013 Directives/i)).toBeDefined();
    
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });
});
