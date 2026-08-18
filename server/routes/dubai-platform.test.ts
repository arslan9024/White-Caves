/**
 * Dubai Platform API Integration Tests
 * ─────────────────────────────────────
 * Tests Dubai user types, service catalog, community directory with AI scoring,
 * and AML risk assessment scoring.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockUserType, mockService, mockCommunity, mockAmlAssessment } = vi.hoisted(() => {
  const aml: any = {
    assessmentId: 'AML-2026-001',
    entityType: 'buyer',
    entityName: 'Global Investment Fund Ltd',
    riskScore: 20,
    riskLevel: 'LOW',
    autoApproved: true,
    goAMLReporting: { reportRequired: false },
    enhancedDueDiligence: { required: false },
    calculateRiskScore: vi.fn(),
  };
  aml.save = vi.fn().mockResolvedValue(aml);

  return {
    mockUserType: {
      typeCode: 'HNWI_INVESTOR',
      name: 'High Net Worth Investor',
      tier: 'TIER_1_ULTRA_LUXURY',
      isActive: true,
    },
    mockService: {
      serviceId: 'SRV-EJARI-001',
      name: 'Ejari Unified Tenancy Registration',
      category: 'LEASING',
      isActive: true,
    },
    mockCommunity: {
      communityId: 'COM-PALM-JUMEIRAH',
      communityName: 'Palm Jumeirah',
      tier: 'ULTRA_LUXURY',
      isActive: true,
      aiRecommendationScore: { forInvestors: 95, forFamilies: 88 },
    },
    mockAmlAssessment: aml,
  };
});

const createChain = (result: any) => ({
  sort: vi.fn().mockImplementation(() => createChain(result)),
  limit: vi.fn().mockImplementation(() => createChain(result)),
  then: (resolve: any) => resolve(result),
  exec: vi.fn().mockResolvedValue(result),
});

vi.mock('../models/UserType.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockUserType, ...data, save: vi.fn().mockResolvedValue({ ...mockUserType, ...data }) };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockUserType]));
  MockModel.findOne = vi.fn().mockImplementation(({ typeCode }: { typeCode: string }) => {
    if (typeCode === 'HNWI_INVESTOR') return Promise.resolve(mockUserType);
    return Promise.resolve(null);
  });
  MockModel.create = vi.fn().mockImplementation((data: any) => Promise.resolve({ ...mockUserType, ...data }));
  return { default: MockModel };
});

vi.mock('../models/ServiceCatalog.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockService, ...data };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockService]));
  MockModel.findOne = vi.fn().mockImplementation(({ serviceId }: { serviceId: string }) => {
    if (serviceId === 'SRV-EJARI-001') return Promise.resolve(mockService);
    return Promise.resolve(null);
  });
  MockModel.create = vi.fn().mockImplementation((data: any) => Promise.resolve({ ...mockService, ...data }));
  return { default: MockModel };
});

vi.mock('../models/DubaiCommunity.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockCommunity, ...data };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockCommunity]));
  MockModel.findOne = vi.fn().mockImplementation(({ communityId }: { communityId: string }) => {
    if (communityId === 'COM-PALM-JUMEIRAH') return Promise.resolve(mockCommunity);
    return Promise.resolve(null);
  });
  MockModel.create = vi.fn().mockImplementation((data: any) => Promise.resolve({ ...mockCommunity, ...data }));
  return { default: MockModel };
});

vi.mock('../models/AMLRiskAssessment.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...mockAmlAssessment,
      ...data,
      calculateRiskScore: vi.fn(),
      save: vi.fn().mockResolvedValue({ ...mockAmlAssessment, ...data }),
    };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockAmlAssessment]));
  return { default: MockModel };
});

vi.mock('../models/Commission.js', () => ({
  default: {
    find: vi.fn().mockImplementation(() => createChain([])),
  },
}));

import dubaiPlatformRouter from './dubai-platform.js';

describe('Dubai Platform API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/dubai', dubaiPlatformRouter);
  });

  describe('GET /api/dubai/user-types', () => {
    it('returns list of active user types', async () => {
      const res = await request(app).get('/api/dubai/user-types');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].typeCode).toBe('HNWI_INVESTOR');
    });

    it('returns single user type by code', async () => {
      const res = await request(app).get('/api/dubai/user-types/HNWI_INVESTOR');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.typeCode).toBe('HNWI_INVESTOR');
    });

    it('returns 404 when user type code is not found', async () => {
      const res = await request(app).get('/api/dubai/user-types/NON_EXISTENT');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/dubai/services', () => {
    it('returns service catalog entries', async () => {
      const res = await request(app).get('/api/dubai/services');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].serviceId).toBe('SRV-EJARI-001');
    });

    it('returns single service by ID', async () => {
      const res = await request(app).get('/api/dubai/services/SRV-EJARI-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.serviceId).toBe('SRV-EJARI-001');
    });
  });

  describe('GET /api/dubai/communities', () => {
    it('returns Dubai community directory', async () => {
      const res = await request(app).get('/api/dubai/communities');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].communityId).toBe('COM-PALM-JUMEIRAH');
    });

    it('returns community recommendations by user type', async () => {
      const res = await request(app).get('/api/dubai/communities/recommendations/investor');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/dubai/aml/assess', () => {
    it('performs AML risk assessment on transaction', async () => {
      const payload = {
        entityType: 'buyer',
        entityId: 'ent-101',
        entityName: 'Global Investment Fund Ltd',
        transactionType: 'property_sale',
        transactionValue: 15000000,
        checks: { pepCheck: false, sanctionsClear: true },
      };

      const res = await request(app)
        .post('/api/dubai/aml/assess')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.assessmentId).toBeDefined();
      expect(res.body.data.riskLevel).toBe('LOW');
    });
  });
});
