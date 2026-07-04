import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Hoisted mocks ──────────────────────────────────────────────────────────
const { mockCreateSignatureRequest, mockSendSigningNotification, mockFindByIdAndUpdate } =
  vi.hoisted(() => ({
    mockCreateSignatureRequest: vi.fn(),
    mockSendSigningNotification: vi.fn(),
    mockFindByIdAndUpdate: vi.fn(),
  }));

vi.mock('../services/SignatureService.js', () => ({
  default: {
    createSignatureRequest: mockCreateSignatureRequest,
    sendSigningNotification: mockSendSigningNotification,
  },
}));
vi.mock('../models/Contract.js', () => ({ default: {} }));
vi.mock('../models/ContractSignature.js', () => ({
  default: { findByIdAndUpdate: mockFindByIdAndUpdate },
}));

import signaturesRouter from './signatures.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/signatures', signaturesRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ── Webhook callback tests ─────────────────────────────────────────────────
describe('POST /api/signatures/webhook/callback', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts a "signed" event and returns updated signature', async () => {
    mockFindByIdAndUpdate.mockResolvedValue({
      _id: 'sig-001',
      status: 'signed',
      signedAt: new Date('2026-06-01T10:00:00Z'),
    });

    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({
        signatureId: 'sig-001',
        status: 'signed',
        signedAt: '2026-06-01T10:00:00Z',
        providerEventId: 'evt-abc',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('signed');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'sig-001',
      expect.objectContaining({ status: 'signed' }),
      { new: true }
    );
  });

  it('accepts a "rejected" event and stores rejection reason', async () => {
    mockFindByIdAndUpdate.mockResolvedValue({
      _id: 'sig-002',
      status: 'rejected',
      rejectionReason: 'client declined',
    });

    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({
        signatureId: 'sig-002',
        status: 'rejected',
        rejectionReason: 'client declined',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('rejected');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'sig-002',
      expect.objectContaining({ status: 'rejected', rejectionReason: 'client declined' }),
      { new: true }
    );
  });

  it('returns 400 when signatureId is missing', async () => {
    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({ status: 'signed' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 400 when status is missing', async () => {
    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({ signatureId: 'sig-003' });

    expect(res.status).toBe(400);
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({ signatureId: 'sig-004', status: 'invalid_status' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid status');
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when the signature record is not found', async () => {
    mockFindByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/signatures/webhook/callback')
      .send({ signatureId: 'sig-missing', status: 'opened' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('accepts all valid status values', async () => {
    const validStatuses = ['pending', 'sent', 'opened', 'signed', 'rejected', 'expired'];

    for (const status of validStatuses) {
      mockFindByIdAndUpdate.mockResolvedValue({ _id: 'sig-x', status });
      const res = await request(app)
        .post('/api/signatures/webhook/callback')
        .send({ signatureId: 'sig-x', status });
      expect(res.status, `status="${status}" should be accepted`).toBe(200);
    }
  });

  it('normalises status to lowercase', async () => {
    mockFindByIdAndUpdate.mockResolvedValue({ _id: 'sig-005', status: 'signed' });

    await request(app)
      .post('/api/signatures/webhook/callback')
      .send({ signatureId: 'sig-005', status: 'SIGNED' });

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'sig-005',
      expect.objectContaining({ status: 'signed' }),
      { new: true }
    );
  });
});

// ── Signature request tests ────────────────────────────────────────────────
describe('POST /api/signatures/request', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSignatureRequest.mockResolvedValue({
      signatureId: 'sig-new',
      signingLink: 'https://whitecaves.com/sign/sig-new',
    });
    mockSendSigningNotification.mockResolvedValue(undefined);
  });

  it('creates a signature request and sends a notification', async () => {
    const res = await request(app)
      .post('/api/signatures/request')
      .send({
        contractId: 'contract-1',
        signerEmail: 'tenant@example.com',
        signerRole: 'tenant',
        signerName: 'Alice Test',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockCreateSignatureRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'contract-1',
        signerEmail: 'tenant@example.com',
        signerRole: 'tenant',
      })
    );
    expect(mockSendSigningNotification).toHaveBeenCalledWith('sig-new', expect.any(String));
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/signatures/request')
      .send({ contractId: 'contract-2' });

    expect(res.status).toBe(400);
    expect(mockCreateSignatureRequest).not.toHaveBeenCalled();
  });
});
