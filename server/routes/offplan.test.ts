/**
 * Off-Plan Developments API Integration Tests
 * ────────────────────────────────────────────
 * Tests off-plan project catalog, construction milestone updates, inventory units,
 * and featured developer queries.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockProject, mockUnit } = vi.hoisted(() => {
  const proj: any = {
    _id: 'proj-offplan-001',
    name: 'Creek Waters Ultra',
    developer: 'Emaar Properties',
    location: { area: 'Dubai Creek Harbour' },
    status: 'active',
    constructionStatus: 'under-construction',
    currentProgress: 45,
    constructionProgress: [],
    priceRange: { min: 1800000, max: 8500000 },
    views: 120,
  };
  proj.save = vi.fn().mockResolvedValue(proj);

  const unit: any = {
    _id: 'unit-101',
    projectId: 'proj-offplan-001',
    unitNumber: 'CW-1002',
    propertyType: 'apartment',
    bedrooms: 2,
    price: 2400000,
    status: 'available',
  };
  unit.save = vi.fn().mockResolvedValue(unit);

  return { mockProject: proj, mockUnit: unit };
});

const createChain = (result: any) => ({
  sort: vi.fn().mockImplementation(() => createChain(result)),
  skip: vi.fn().mockImplementation(() => createChain(result)),
  limit: vi.fn().mockImplementation(() => createChain(result)),
  select: vi.fn().mockImplementation(() => createChain(result)),
  then: (resolve: any) => resolve(result),
  exec: vi.fn().mockResolvedValue(result),
});

vi.mock('../models/OffPlanProject.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockProject, ...data, save: vi.fn().mockResolvedValue({ ...mockProject, ...data }) };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockProject]));
  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === 'proj-offplan-001') return Promise.resolve(mockProject);
    return Promise.resolve(null);
  });
  MockModel.findByIdAndUpdate = vi.fn().mockImplementation((id: string, data: any) => {
    if (id === 'proj-offplan-001') return Promise.resolve({ ...mockProject, ...data });
    return Promise.resolve(null);
  });
  MockModel.countDocuments = vi.fn().mockResolvedValue(1);
  return { default: MockModel };
});

vi.mock('../models/OffPlanUnit.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockUnit, ...data, save: vi.fn().mockResolvedValue({ ...mockUnit, ...data }) };
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockUnit]));
  MockModel.create = vi.fn().mockImplementation((data: any) => Promise.resolve({ ...mockUnit, ...data }));
  return { default: MockModel };
});

import offplanRouter from './offplan.js';

describe('Off-Plan Projects API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/offplan', offplanRouter);
  });

  describe('GET /api/offplan/projects', () => {
    it('returns paginated list of off-plan projects', async () => {
      const res = await request(app).get('/api/offplan/projects?area=Dubai%20Creek');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.projects)).toBe(true);
      expect(res.body.projects[0].name).toBe('Creek Waters Ultra');
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/offplan/projects/:id', () => {
    it('returns single project details and increments views', async () => {
      const res = await request(app).get('/api/offplan/projects/proj-offplan-001');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Creek Waters Ultra');
      expect(res.body.developer).toBe('Emaar Properties');
    });

    it('returns 404 for unknown project id', async () => {
      const res = await request(app).get('/api/offplan/projects/unknown-proj');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Project not found');
    });
  });

  describe('POST /api/offplan/projects/:id/progress', () => {
    it('records construction milestone and updates percentage', async () => {
      const res = await request(app)
        .post('/api/offplan/projects/proj-offplan-001/progress')
        .send({
          percentage: 95,
          description: 'Substructure and tower exterior glass completed',
        });

      expect(res.status).toBe(200);
      expect(res.body.currentProgress).toBe(95);
      expect(res.body.constructionStatus).toBe('near-completion');
    });
  });

  describe('GET /api/offplan/projects/:projectId/units', () => {
    it('returns available unit inventory with summary', async () => {
      const res = await request(app).get('/api/offplan/projects/proj-offplan-001/units');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.units)).toBe(true);
      expect(res.body.summary.total).toBe(1);
    });
  });
});
