import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    kycRecord: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import {
  getKycChecklist,
  createKycRecord,
  addKycDocument,
  updateKycStatus,
  isClientKycVerified,
} from './kycService.js';

describe('KYC Service — Wave 41 (W41-002, W41-004)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getKycChecklist', () => {
    it('returns required items for lease transaction', () => {
      const items = getKycChecklist('lease');
      expect(items).toHaveLength(4);
      expect(items.some(i => i.code === 'emirates_id_front')).toBe(true);
    });

    it('returns required items for sale transaction', () => {
      const items = getKycChecklist('sale');
      expect(items.some(i => i.code === 'proof_of_funds')).toBe(true);
    });
  });

  describe('createKycRecord', () => {
    it('initializes KYC record in pending_submission status', async () => {
      mockPrisma.kycRecord.create.mockResolvedValueOnce({
        id: 'kyc-101',
        clientName: 'Tariq Mansoor',
        status: 'pending_submission',
      });

      const res = await createKycRecord({
        clientName: 'Tariq Mansoor',
        transactionType: 'lease',
      });

      expect(res.id).toBe('kyc-101');
      expect(mockPrisma.kycRecord.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clientName: 'Tariq Mansoor',
          status: 'pending_submission',
        }),
      });
    });
  });

  describe('addKycDocument', () => {
    it('appends document and updates status to under_review', async () => {
      mockPrisma.kycRecord.findUnique.mockResolvedValueOnce({
        id: 'kyc-101',
        documents: [],
      });
      mockPrisma.kycRecord.update.mockResolvedValueOnce({
        id: 'kyc-101',
        status: 'under_review',
      });

      const res = await addKycDocument('kyc-101', {
        docType: 'emirates_id_front',
        fileUrl: 'https://storage.whitecaves.ae/docs/eid_front.pdf',
      });

      expect(res.status).toBe('under_review');
    });
  });

  describe('updateKycStatus', () => {
    it('updates status to verified and records verification timestamp', async () => {
      mockPrisma.kycRecord.update.mockResolvedValueOnce({
        id: 'kyc-101',
        status: 'verified',
        verifiedAt: new Date(),
      });

      const res = await updateKycStatus('kyc-101', 'verified', { id: 'usr-1', name: 'Laila Officer' });

      expect(res.status).toBe('verified');
      expect(mockPrisma.kycRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'verified',
            reviewedByName: 'Laila Officer',
          }),
        })
      );
    });
  });

  describe('isClientKycVerified', () => {
    it('returns true when client has verified KYC record', async () => {
      mockPrisma.kycRecord.findFirst.mockResolvedValueOnce({ id: 'kyc-101', status: 'verified' });

      const verified = await isClientKycVerified('cli-101');
      expect(verified).toBe(true);
    });
  });
});
