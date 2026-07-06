import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockFindByIdAndUpdate,
  mockCreateSignatureRequest,
  mockSendSigningNotification,
  mockGetSignatureStatus,
  mockSaveSignature,
} = vi.hoisted(() => ({
  mockFindByIdAndUpdate: vi.fn(),
  mockCreateSignatureRequest: vi.fn(),
  mockSendSigningNotification: vi.fn(),
  mockGetSignatureStatus: vi.fn(),
  mockSaveSignature: vi.fn(),
}));

vi.mock('../services/SignatureService.js', () => ({
  default: {
    createSignatureRequest: mockCreateSignatureRequest,
    sendSigningNotification: mockSendSigningNotification,
    getSignatureStatus: mockGetSignatureStatus,
    saveSignature: mockSaveSignature,
  },
}));

vi.mock('../models/Contract.js', () => ({
  default: {},
}));

vi.mock('../models/ContractSignature.js', () => ({
  default: {
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

import signaturesRouter from './signatures.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/signatures', signaturesRouter);
  app.use(
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ success: false, error: err.message });
    }
  );
  return app;
}

describe('signatures route webhook callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSignatureRequest.mockResolvedValue({
      signatureId: 'sig-123',
      signingLink: 'https://whitecaves.com/sign/sig-123',
    });
    mockSendSigningNotification.mockResolvedValue(undefined);
    mockGetSignatureStatus.mockResolvedValue({
      status: 'pending',
      signed: 0,
      pending: 1,
      total: 1,
      signatures: [],
    });
    mockSaveSignature.mockResolvedValue({
      _id: 'sig-321',
      status: 'signed',
      signedAt: new Date('2026-06-20T10:00:00.000Z'),
    });
  });

  it('creates signature request and sends signing notification', async () => {
    const res = await request(createApp()).post('/api/signatures/request').send({
      contractId: 'contract-1',
      signerEmail: 'tenant@example.com',
      signerRole: 'tenant',
      signerName: 'Tenant Name',
      signerPhone: '+971500000000',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.signatureId).toBe('sig-123');
    expect(mockCreateSignatureRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'contract-1',
        signerEmail: 'tenant@example.com',
        signerRole: 'tenant',
      })
    );
    expect(mockSendSigningNotification).toHaveBeenCalledWith(
      'sig-123',
      'https://whitecaves.com/sign/sig-123'
    );
  });

  it('returns 400 for request endpoint when required fields are missing', async () => {
    const res = await request(createApp()).post('/api/signatures/request').send({
      contractId: 'contract-1',
      signerEmail: 'tenant@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/Missing required fields/i);
    expect(mockCreateSignatureRequest).not.toHaveBeenCalled();
  });

  it('records a signature via signing endpoint', async () => {
    const res = await request(createApp())
      .post('/api/signatures/sig-321/sign')
      .send({
        imageData: 'data:image/png;base64,mockSignatureData',
        method: 'canvas',
        mimeType: 'image/png',
        deviceInfo: { platform: 'Windows' },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.signatureId).toBe('sig-321');
    expect(res.body.data.status).toBe('signed');
    expect(mockSaveSignature).toHaveBeenCalledWith(
      'sig-321',
      expect.objectContaining({
        imageData: 'data:image/png;base64,mockSignatureData',
        method: 'canvas',
        mimeType: 'image/png',
        deviceInfo: expect.objectContaining({
          platform: 'Windows',
        }),
      })
    );
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(createApp()).post('/api/signatures/webhook/callback').send({
      status: 'signed',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/signatureId and status are required/i);
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid status', async () => {
    const res = await request(createApp()).post('/api/signatures/webhook/callback').send({
      signatureId: 'sig-123',
      status: 'invalid_status',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/Invalid status/i);
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when signature is not found', async () => {
    mockFindByIdAndUpdate.mockResolvedValueOnce(null);

    const res = await request(createApp()).post('/api/signatures/webhook/callback').send({
      signatureId: 'sig-missing',
      status: 'signed',
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/Signature not found/i);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('normalizes status and updates signed payload on success', async () => {
    mockFindByIdAndUpdate.mockResolvedValueOnce({
      _id: 'sig-123',
      status: 'signed',
      signedAt: new Date('2026-06-20T09:00:00.000Z'),
    });

    const res = await request(createApp()).post('/api/signatures/webhook/callback').send({
      signatureId: 'sig-123',
      status: 'SIGNED',
      providerEventId: 'evt-111',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.signatureId).toBe('sig-123');
    expect(res.body.data.status).toBe('signed');

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'sig-123',
      expect.objectContaining({
        status: 'signed',
        signedAt: expect.any(Date),
        metadata: expect.objectContaining({
          providerEventId: 'evt-111',
          callbackReceivedAt: expect.any(String),
        }),
      }),
      { new: true }
    );
  });

  it('stores rejection details for rejected status', async () => {
    mockFindByIdAndUpdate.mockResolvedValueOnce({
      _id: 'sig-rej',
      status: 'rejected',
      signedAt: null,
    });

    const res = await request(createApp()).post('/api/signatures/webhook/callback').send({
      signatureId: 'sig-rej',
      status: 'rejected',
      rejectionReason: 'signer_declined',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'sig-rej',
      expect.objectContaining({
        status: 'rejected',
        signedAt: null,
        rejectedAt: expect.any(Date),
        rejectionReason: 'signer_declined',
      }),
      { new: true }
    );
  });
});
