/**
 * Tenancy Contracts API Integration Tests
 * ───────────────────────────────────────
 * Tests creation, update, signatures, and status retrieval of tenancy contract drafts.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockContract } = vi.hoisted(() => ({
  mockContract: {
    contractId: 'TC-2026-001',
    status: 'DRAFT',
    formData: {
      tenantName: 'Elena Rostova',
      landlordName: 'Tariq Al-Mansoor',
      rentAmount: 180000,
      chequesCount: 4,
    },
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../services/TenancyContractService.js', () => ({
  default: {
    createDraft: vi.fn().mockImplementation((agentId: string, formData: any) =>
      Promise.resolve({
        contractId: 'TC-2026-002',
        agentId,
        formData,
        status: 'DRAFT',
      })
    ),
    updateDraft: vi.fn().mockImplementation((contractId: string, formData: any) =>
      Promise.resolve({
        contractId,
        formData,
        status: 'DRAFT',
        updatedAt: new Date().toISOString(),
      })
    ),
    requestSignatures: vi.fn().mockImplementation((contractId: string) =>
      Promise.resolve({
        contractId,
        status: 'SIGNATURES_REQUESTED',
      })
    ),
    getContractStatus: vi.fn().mockImplementation((contractId: string) => {
      if (contractId === 'TC-2026-001') {
        return Promise.resolve(mockContract);
      }
      return Promise.resolve(null);
    }),
    listContractsByAgent: vi.fn().mockResolvedValue([mockContract]),
  },
}));

// Mock auth middleware to inject user
vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: 'agent-101', role: 'agent', email: 'agent@whitecaves.ae' };
    next();
  },
}));

import tenancyContractsRouter from './tenancy-contracts.js';

describe('Tenancy Contracts API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tenancy-contracts', tenancyContractsRouter);
  });

  describe('POST /api/tenancy-contracts/create', () => {
    it('creates a new tenancy contract draft', async () => {
      const payload = {
        formData: {
          tenantName: 'Elena Rostova',
          propertyAddress: 'DAMAC Hills 2 Villa 401',
          rentAmount: 180000,
        },
      };

      const res = await request(app)
        .post('/api/tenancy-contracts/create')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contractId).toBe('TC-2026-002');
      expect(res.body.data.status).toBe('DRAFT');
    });

    it('rejects creation when formData is missing with 400', async () => {
      const res = await request(app)
        .post('/api/tenancy-contracts/create')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Form data is required');
    });
  });

  describe('PUT /api/tenancy-contracts/:contractId', () => {
    it('updates draft contract with new form data', async () => {
      const payload = {
        formData: {
          rentAmount: 190000,
        },
      };

      const res = await request(app)
        .put('/api/tenancy-contracts/TC-2026-001')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contractId).toBe('TC-2026-001');
    });
  });

  describe('GET /api/tenancy-contracts/:contractId/status', () => {
    it('returns contract status and metadata', async () => {
      const res = await request(app).get('/api/tenancy-contracts/TC-2026-001/status');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contractId).toBe('TC-2026-001');
    });
  });

  describe('POST /api/tenancy-contracts/:contractId/request-signatures', () => {
    it('triggers signature request workflow', async () => {
      const res = await request(app).post('/api/tenancy-contracts/TC-2026-001/request-signatures');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SIGNATURES_REQUESTED');
    });
  });

  describe('GET /api/tenancy-contracts', () => {
    it('lists contracts for agent with pagination', async () => {
      const res = await request(app).get('/api/tenancy-contracts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
