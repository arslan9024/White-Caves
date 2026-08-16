import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockKycService, mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    kycRecord: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
  mockKycService: {
    getKycChecklist: vi.fn().mockReturnValue([
      { code: 'emirates_id_front', label: 'Emirates ID Front', required: true },
    ]),
    createKycRecord: vi.fn().mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      clientName: 'Omar Al Farsi',
      status: 'pending_submission',
    }),
    addKycDocument: vi.fn().mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      status: 'under_review',
    }),
    updateKycStatus: vi.fn().mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      status: 'verified',
    }),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/kycService.js', () => mockKycService);
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));

import kycRoutes from './kyc.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string } }).user = {
      id: 'usr-admin',
      role: 'owner',
    };
    next();
  });
  app.use('/api/kyc', kycRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = '507f1f77bcf86cd799439011';

describe('KYC Routes — /api/kyc (Wave 41)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/kyc/checklist/:type', () => {
    it('returns document checklist for transaction type', async () => {
      const res = await request(createApp()).get('/api/kyc/checklist/lease');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockKycService.getKycChecklist).toHaveBeenCalledWith('lease');
    });
  });

  describe('POST /api/kyc', () => {
    it('initiates a new KYC record', async () => {
      const res = await request(createApp())
        .post('/api/kyc')
        .send({ clientName: 'Omar Al Farsi', transactionType: 'lease' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(VALID_ID);
    });
  });

  describe('POST /api/kyc/:id/documents', () => {
    it('attaches document to KYC record', async () => {
      const res = await request(createApp())
        .post(`/api/kyc/${VALID_ID}/documents`)
        .send({ docType: 'emirates_id_front', fileUrl: 'https://storage.ae/eid.pdf' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockKycService.addKycDocument).toHaveBeenCalledWith(VALID_ID, {
        docType: 'emirates_id_front',
        fileUrl: 'https://storage.ae/eid.pdf',
        documentName: undefined,
      });
    });
  });

  describe('PATCH /api/kyc/:id/status', () => {
    it('verifies KYC record', async () => {
      const res = await request(createApp())
        .patch(`/api/kyc/${VALID_ID}/status`)
        .send({ status: 'verified' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockKycService.updateKycStatus).toHaveBeenCalledWith(
        VALID_ID,
        'verified',
        expect.any(Object),
        undefined
      );
    });
  });
});
