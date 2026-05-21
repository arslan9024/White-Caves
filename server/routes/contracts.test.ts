import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRequestSignature, mockSendEmailTracked, mockWrapInBrandedTemplate } = vi.hoisted(
  () => ({
    mockRequestSignature: vi.fn(),
    mockSendEmailTracked: vi.fn(),
    mockWrapInBrandedTemplate: vi.fn((body: string) => `<html>${body}</html>`),
  })
);

vi.mock('../services/ContractService.js', () => ({
  default: {
    requestSignature: mockRequestSignature,
  },
}));
vi.mock('../services/SignatureService.js', () => ({
  default: {},
}));
vi.mock('../services/TemplateEngine.js', () => ({
  default: {},
}));
vi.mock('../lib/googleDrive.js', () => ({
  uploadToDrive: vi.fn(),
  createFolder: vi.fn(),
  listFiles: vi.fn(),
}));
vi.mock('../lib/database.js', () => ({
  Contract: {},
  SignatureToken: {},
}));
vi.mock('../services/emailService.js', () => ({
  sendEmailTracked: mockSendEmailTracked,
  wrapInBrandedTemplate: mockWrapInBrandedTemplate,
}));

import contractsRouter from './contracts.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/contracts', contractsRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('contracts route signature requests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequestSignature.mockResolvedValue({
      signatureId: 'sig-123',
      signingLink: 'https://whitecaves.com/sign/sig-123',
      expiresAt: '2026-05-21T10:00:00.000Z',
    });
    mockSendEmailTracked.mockResolvedValue({ success: true, devMode: true });
  });

  it('sends a signing-link email after creating the signature request', async () => {
    const res = await request(createApp())
      .post('/api/contracts/contract-123/request-signature')
      .send({
        signerEmail: 'tenant@example.com',
        signerName: 'Tenant Name',
        signerRole: 'tenant',
        method: 'canvas',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.signatureId).toBe('sig-123');
    expect(mockRequestSignature).toHaveBeenCalledWith(
      'contract-123',
      expect.objectContaining({
        email: 'tenant@example.com',
        name: 'Tenant Name',
        role: 'tenant',
        method: 'canvas',
      })
    );
    expect(mockSendEmailTracked).toHaveBeenCalledTimes(1);
    expect(mockWrapInBrandedTemplate).toHaveBeenCalledTimes(1);

    const emailArgs = mockSendEmailTracked.mock.calls[0][0];
    expect(emailArgs.to).toBe('tenant@example.com');
    expect(emailArgs.subject).toContain('Contract contract-123');
    expect(emailArgs.text).toContain('sig-123');
    expect(emailArgs.tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'type', value: 'contract_signature_request' }),
        expect.objectContaining({ name: 'contractId', value: 'contract-123' }),
        expect.objectContaining({ name: 'signerRole', value: 'tenant' }),
      ])
    );
    expect(String(emailArgs.html)).toContain('Review & Sign Contract');
  });

  it('returns 400 when signature fields are missing', async () => {
    const res = await request(createApp())
      .post('/api/contracts/contract-123/request-signature')
      .send({ signerEmail: 'tenant@example.com' });

    expect(res.status).toBe(400);
    expect(mockRequestSignature).not.toHaveBeenCalled();
    expect(mockSendEmailTracked).not.toHaveBeenCalled();
  });
});
