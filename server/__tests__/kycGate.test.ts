/**
 * P0-013: requireKycForRiskyTransaction middleware unit tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const mockPrisma = vi.hoisted(() => ({
  lead: { findUnique: vi.fn() },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));

import { requireKycForRiskyTransaction, RISKY_AMOUNT_AED } from '../middleware/kycGate.js';

function makeReq(body: Record<string, unknown>): Request {
  return { body, user: { id: 'u1', role: 'manager' } } as unknown as Request;
}
const res = {} as Response;

describe('requireKycForRiskyTransaction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('passes through for non-risky type (lease) without hitting DB', async () => {
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'lease', amount: 100_000, leadId: 'lead-1' }), res, next);
    expect(next).toHaveBeenCalledWith();
    expect(mockPrisma.lead.findUnique).not.toHaveBeenCalled();
  });

  it('passes through for low-amount non-sale transaction', async () => {
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'commission', amount: 10_000, leadId: 'lead-1' }), res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('blocks sale transaction when lead lacks kyc_verified tag', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({ id: 'lead-1', tags: ['active'] });
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'sale', amount: 200_000, leadId: 'lead-1' }), res, next);
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(403);
  });

  it(`blocks transaction with amount >= ${RISKY_AMOUNT_AED} when lead lacks kyc_verified`, async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({ id: 'lead-2', tags: [] });
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'deposit', amount: RISKY_AMOUNT_AED, leadId: 'lead-2' }), res, next);
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err.statusCode).toBe(403);
  });

  it('allows sale transaction when lead has kyc_verified tag', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue({ id: 'lead-3', tags: ['active', 'kyc_verified'] });
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'sale', amount: 1_000_000, leadId: 'lead-3' }), res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 400 when risky type but no leadId provided', async () => {
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'sale', amount: 200_000 }), res, next);
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });

  it('returns 400 when lead not found in DB', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue(null);
    const next = vi.fn() as unknown as NextFunction;
    const mw = requireKycForRiskyTransaction();
    await mw(makeReq({ type: 'sale', amount: 200_000, leadId: 'nonexistent' }), res, next);
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });
});
