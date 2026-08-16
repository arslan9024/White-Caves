import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VatInvoiceGenerator } from './VatInvoiceGenerator';
import { apiClient } from '../../../services/apiClient';

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({
      data: {
        generateVatInvoice: {
          net: 44000,
          vatAmount: 2200,
          grossAmount: 46200,
          trn: '100432571200003',
          invoiceNumber: 'INV-123456',
          date: '2026-08-16T10:00:00Z'
        }
      }
    })
  }
}));

describe('VatInvoiceGenerator Component', () => {
  it('renders correctly and generates invoice on click', async () => {
    render(<VatInvoiceGenerator />);
    
    expect(screen.getByTestId('vat-invoice-generator')).toBeDefined();
    expect(screen.getByText(/UAE VAT Invoice Generator/i)).toBeDefined();

    const button = screen.getByText(/Generate FTA-Compliant Invoice/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    // Check if the total due is calculated correctly (net + 5% vat)
    expect(screen.getByText(/46,200/)).toBeDefined();
    expect(screen.getByText(/2,200/)).toBeDefined();
  });
});
