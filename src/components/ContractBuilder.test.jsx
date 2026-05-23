import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContractBuilder from './ContractBuilder';

const mockAuthFetch = vi.fn();

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args) => mockAuthFetch(...args),
}));

vi.mock('./ContractBuilder.css', () => ({}));

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

describe('ContractBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows fallback templates when /api/contracts is empty', async () => {
    mockAuthFetch.mockResolvedValueOnce(jsonResponse({ success: true, contracts: [] }));

    render(<ContractBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Residential Lease — Standard')).toBeInTheDocument();
      expect(screen.getByText('Commercial Lease — Standard')).toBeInTheDocument();
    });
  });

  it('creates contract using live /api/contracts flow', async () => {
    mockAuthFetch
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          contracts: [
            {
              id: 'c-1',
              contractNumber: 'WC-2026-1',
              propertyType: 'Apartment',
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          contract: {
            id: 'contract_1',
            contractNumber: 'WC-2026-2',
          },
        })
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, contracts: [] }));

    const onContractCreated = vi.fn();

    render(<ContractBuilder onContractCreated={onContractCreated} />);

    await waitFor(() => {
      expect(screen.getByText('WC-2026-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('WC-2026-1'));

    const landlordInput = document.querySelector('input[name="landlordName"]');
    const tenantInput = document.querySelector('input[name="tenantName"]');
    const rentInput = document.querySelector('input[name="rentAmount"]');
    const startDateInput = document.querySelector('input[name="startDate"]');

    expect(landlordInput).toBeTruthy();
    expect(tenantInput).toBeTruthy();
    expect(rentInput).toBeTruthy();
    expect(startDateInput).toBeTruthy();

    fireEvent.change(landlordInput, {
      target: { value: 'Landlord A' },
    });
    fireEvent.change(tenantInput, {
      target: { value: 'Tenant A' },
    });
    fireEvent.change(rentInput, {
      target: { value: '10000' },
    });
    fireEvent.change(startDateInput, {
      target: { value: '2026-06-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Preview Contract/i }));

    await waitFor(() => {
      expect(screen.getByText(/Review Contract/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Contract/i }));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/contracts',
        expect.objectContaining({ method: 'POST' })
      );
    });

    expect(onContractCreated).toHaveBeenCalled();
  });
});
