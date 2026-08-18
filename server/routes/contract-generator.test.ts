/**
 * Contract Generator API Integration Tests
 * ─────────────────────────────────────────
 * Tests contract compilation from offers, HTML preview, and PDF generation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockGeneratedContract } = vi.hoisted(() => ({
  mockGeneratedContract: {
    contractId: 'gen-contract-001',
    offerId: 'offer-101',
    contractType: 'TENANCY_EJARI',
    compiledHtml: '<html><body><h1>Ejari Unified Tenancy Contract</h1></body></html>',
    status: 'COMPILED',
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../services/ContractGeneratorService.js', () => ({
  default: {
    generateFromOffer: vi.fn().mockImplementation((offerId: string, options: any) =>
      Promise.resolve({
        ...mockGeneratedContract,
        offerId,
        options,
      })
    ),
    getContractPreview: vi.fn().mockImplementation((contractId: string) => {
      if (contractId === 'gen-contract-001') {
        return Promise.resolve('<html><body><h1>Ejari Unified Tenancy Contract</h1></body></html>');
      }
      return Promise.reject(new Error('Contract not found'));
    }),
    compilePdf: vi.fn().mockResolvedValue({
      contractId: 'gen-contract-001',
      pdfUrl: 'https://cdn.whitecaves.ae/contracts/gen-contract-001.pdf',
      checksum: 'sha256-a1b2c3d4',
    }),
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = { id: 'agent-101', role: 'agent', email: 'agent@whitecaves.ae' };
    next();
  },
}));

import contractGeneratorRouter from './contract-generator.js';

describe('Contract Generator API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/contract-generator', contractGeneratorRouter);
  });

  describe('POST /api/contract-generator/from-offer/:offerId', () => {
    it('generates a contract draft from an accepted offer', async () => {
      const res = await request(app)
        .post('/api/contract-generator/from-offer/offer-101')
        .send({ companyName: 'White Caves Real Estate LLC' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contractId).toBe('gen-contract-001');
      expect(res.body.data.offerId).toBe('offer-101');
    });
  });

  describe('GET /api/contract-generator/:contractId/preview', () => {
    it('returns raw HTML preview with text/html content-type', async () => {
      const res = await request(app).get('/api/contract-generator/gen-contract-001/preview');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('Ejari Unified Tenancy Contract');
    });

    it('returns 500 when contract is not found', async () => {
      const res = await request(app).get('/api/contract-generator/invalid-contract/preview');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
});
