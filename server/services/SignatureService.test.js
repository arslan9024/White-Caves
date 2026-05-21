import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockSendEmailTracked, mockWrapInBrandedTemplate, mockCreateAuditLog, mockFindById } =
  vi.hoisted(() => ({
    mockSendEmailTracked: vi.fn(),
    mockWrapInBrandedTemplate: vi.fn(body => `<html>${body}</html>`),
    mockCreateAuditLog: vi.fn().mockResolvedValue(undefined),
    mockFindById: vi.fn(),
  }));

vi.mock('./emailService.js', () => ({
  sendEmailTracked: mockSendEmailTracked,
  wrapInBrandedTemplate: mockWrapInBrandedTemplate,
}));

vi.mock('../models/ContractSignature.js', () => ({
  default: {
    findById: mockFindById,
    findOne: vi.fn(),
    find: vi.fn(),
  },
}));
vi.mock('../models/SignatureToken.js', () => ({
  default: {},
}));
vi.mock('../models/SignatureAudit.js', () => ({
  default: {},
}));
vi.mock('../models/Contract.js', () => ({
  default: {},
}));
vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn() },
}));

import SignatureService from './SignatureService.js';

describe('SignatureService notification email flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    SignatureService.createAuditLog = mockCreateAuditLog;
  });

  function makeSignatureRecord() {
    return {
      _id: 'sig-1',
      token: 'token-123',
      expiresAt: new Date('2026-05-21T10:00:00.000Z'),
      signedBy: {
        name: 'Tenant Name',
        email: 'tenant@example.com',
      },
      contractId: {
        _id: 'contract-123',
        contractNumber: 'WC-2026-0001',
      },
    };
  }

  it('sends a branded signing request email', async () => {
    const signature = makeSignatureRecord();
    mockFindById.mockReturnValueOnce({
      populate: vi.fn().mockResolvedValue(signature),
    });
    mockSendEmailTracked.mockResolvedValue({ success: true, devMode: true });

    const result = await SignatureService.sendSigningNotification(
      'sig-1',
      'https://whitecaves.com/sign/sig-1'
    );

    expect(result).toBe(true);
    expect(mockWrapInBrandedTemplate).toHaveBeenCalledTimes(1);
    expect(mockSendEmailTracked).toHaveBeenCalledTimes(1);
    const emailArgs = mockSendEmailTracked.mock.calls[0][0];
    expect(emailArgs.to).toBe('tenant@example.com');
    expect(emailArgs.subject).toContain('WC-2026-0001');
    expect(emailArgs.text).toContain('https://whitecaves.com/sign/sig-1');
    expect(mockCreateAuditLog).toHaveBeenCalledWith('contract-123', 'system', 'notification_sent', {
      email: 'tenant@example.com',
    });
  });

  it('sends a branded reminder email', async () => {
    const signature = makeSignatureRecord();
    mockFindById.mockReturnValueOnce({
      populate: vi.fn().mockResolvedValue(signature),
    });
    mockSendEmailTracked.mockResolvedValue({ success: true, devMode: true });

    const result = await SignatureService.sendSignatureReminder('sig-1');

    expect(result).toBe(true);
    expect(mockWrapInBrandedTemplate).toHaveBeenCalledTimes(1);
    expect(mockSendEmailTracked).toHaveBeenCalledTimes(1);
    const emailArgs = mockSendEmailTracked.mock.calls[0][0];
    expect(emailArgs.subject).toContain('Reminder');
    expect(emailArgs.text).toContain('/sign/contract-123/token-123');
  });
});
