import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type Request, type Response, type NextFunction } from 'express';

const { mockIsVerified } = vi.hoisted(() => ({
  mockIsVerified: vi.fn(),
}));

vi.mock('../services/kycService.js', () => ({
  isClientKycVerified: mockIsVerified,
}));
vi.mock('./errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

import { requireVerifiedKyc } from './kycGate.js';

describe('KYC Gate Middleware — Wave 41 (W41-005)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows request to proceed when client KYC is verified', async () => {
    mockIsVerified.mockResolvedValueOnce(true);

    const req = { body: { clientId: 'cli-101' } } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireVerifiedKyc()(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('blocks request with 403 error when client KYC is unverified', async () => {
    mockIsVerified.mockResolvedValueOnce(false);

    const req = { body: { clientId: 'cli-102' } } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireVerifiedKyc()(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: expect.stringMatching(/Transaction blocked: Client/i),
      })
    );
  });
});
