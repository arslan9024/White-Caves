/**
 * Organization Structure & AI Roster API Integration Tests
 * ────────────────────────────────────────────────────────
 * Tests department hierarchy, AI agent rosters (Zoe, Nina, Clara, etc.),
 * assistant status health updates, and department CRUD endpoints.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockDept, mockAssistant } = vi.hoisted(() => {
  const dept: any = {
    _id: '507f1f77bcf86cd799439077',
    name: 'Executive & Strategic Operations',
    code: 'EXEC',
    order: 1,
    status: 'active',
  };
  dept.save = vi.fn().mockResolvedValue(dept);

  const asst: any = {
    _id: '507f1f77bcf86cd799439088',
    name: 'Zoe',
    code: 'ZOE',
    role: 'Chief AI Operations Officer',
    status: 'active',
    isActive: true,
  };
  asst.save = vi.fn().mockResolvedValue(asst);

  return { mockDept: dept, mockAssistant: asst };
});

const createChain = (result: any) => {
  const chain: any = {
    sort: vi.fn().mockImplementation(() => chain),
    populate: vi.fn().mockImplementation(() => chain),
    exec: vi.fn().mockResolvedValue(result),
    then: (resolve: any) => resolve(result),
  };
  return chain;
};

vi.mock('../models/Department.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockDept, ...data, save: vi.fn().mockResolvedValue({ ...mockDept, ...data }) };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockDept]));
  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === '507f1f77bcf86cd799439077') return createChain(mockDept);
    return createChain(null);
  });
  MockModel.findByIdAndUpdate = vi.fn().mockImplementation((id: string, data: any) => {
    if (id === '507f1f77bcf86cd799439077') return Promise.resolve({ ...mockDept, ...data });
    return Promise.resolve(null);
  });
  return { default: MockModel };
});

vi.mock('../models/AIAssistant.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockAssistant, ...data };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockAssistant]));
  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === '507f1f77bcf86cd799439088') return createChain(mockAssistant);
    return createChain(null);
  });
  MockModel.findOne = vi.fn().mockImplementation(({ code }: { code: string }) => {
    if (code === 'ZOE') return createChain(mockAssistant);
    return createChain(null);
  });
  MockModel.findByIdAndUpdate = vi.fn().mockImplementation((id: string, data: any) => {
    if (id === '507f1f77bcf86cd799439088') return Promise.resolve({ ...mockAssistant, ...data });
    return Promise.resolve(null);
  });
  return { default: MockModel };
});

vi.mock('../models/Team.js', () => ({ default: {} }));
vi.mock('../models/Service.js', () => ({ default: {} }));
vi.mock('../models/Employee.js', () => ({ default: {} }));

import orgRouter from './organization.js';

describe('Organization & AI Assistants API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/org', orgRouter);
  });

  describe('GET /api/org/departments', () => {
    it('returns list of departments', async () => {
      const res = await request(app).get('/api/org/departments');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].code).toBe('EXEC');
    });
  });

  describe('GET /api/org/departments/:id', () => {
    it('returns department by ID with populated relations', async () => {
      const res = await request(app).get('/api/org/departments/507f1f77bcf86cd799439077');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Executive & Strategic Operations');
    });

    it('returns 404 for unknown department', async () => {
      const res = await request(app).get('/api/org/departments/unknown-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/org/assistants', () => {
    it('returns active AI assistants directory', async () => {
      const res = await request(app).get('/api/org/assistants');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].code).toBe('ZOE');
    });
  });

  describe('GET /api/org/assistants/code/:code', () => {
    it('finds assistant by uppercase code', async () => {
      const res = await request(app).get('/api/org/assistants/code/zoe');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('ZOE');
    });
  });

  describe('PUT /api/org/assistants/:id/status', () => {
    it('updates assistant operational status', async () => {
      const res = await request(app)
        .put('/api/org/assistants/507f1f77bcf86cd799439088/status')
        .send({ status: 'busy' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('busy');
    });
  });
});
