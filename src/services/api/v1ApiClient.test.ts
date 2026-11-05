/**
 * White Caves Real Estate LLC - V1 REST API Client Unit Tests
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v1DealsApi, v1CustomersApi, v1RelationshipsApi, v1DocumentsApi } from './v1ApiClient';

describe('v1ApiClient REST Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches all deals successfully via v1DealsApi.getAll', async () => {
    const mockDeals = [{ id: 'DEAL-001', title: 'DAMAC Hills Lease' }];
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockDeals }),
    } as Response);

    const result = await v1DealsApi.getAll();
    expect(result).toEqual(mockDeals);
  });

  it('handles network error gracefully and returns null', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network down'));

    const result = await v1DealsApi.getAll();
    expect(result).toBeNull();
  });

  it('updates deal status via PATCH /api/v1/deals/:id/status', async () => {
    const mockUpdated = { id: 'DEAL-001', status: 'COMPLETED' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockUpdated }),
    } as Response);

    const result = await v1DealsApi.updateStatus('DEAL-001', 'COMPLETED');
    expect(result).toEqual(mockUpdated);
  });

  it('advances customer step via v1CustomersApi.advanceStep', async () => {
    const mockUpdated = { id: 'CUST-001', currentStep: 2, stepName: 'INTAKE' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockUpdated }),
    } as Response);

    const result = await v1CustomersApi.advanceStep('CUST-001', 2, 'INTAKE');
    expect(result).toEqual(mockUpdated);
  });

  it('verifies customer KYC via v1CustomersApi.verifyKyc', async () => {
    const mockUpdated = { id: 'CUST-001', kycVerified: true };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockUpdated }),
    } as Response);

    const result = await v1CustomersApi.verifyKyc('CUST-001');
    expect(result).toEqual(mockUpdated);
  });

  it('fetches relationships via v1RelationshipsApi.getAll', async () => {
    const mockRels = [{ id: 'REL-001', name: 'DAMAC Deal Chain' }];
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockRels }),
    } as Response);

    const result = await v1RelationshipsApi.getAll();
    expect(result).toEqual(mockRels);
  });

  it('fetches documents via v1DocumentsApi.getAll', async () => {
    const mockDocs = [{ id: 'DOC-001', title: 'Ejari Contract' }];
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockDocs }),
    } as Response);

    const result = await v1DocumentsApi.getAll();
    expect(result).toEqual(mockDocs);
  });
});
