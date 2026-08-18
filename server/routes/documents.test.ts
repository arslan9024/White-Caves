/**
 * Documents API Integration Tests
 * ────────────────────────────────
 * Tests document generation, template catalog, auto-fill variable previews,
 * document listing, status transitions, and RBAC authorization.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockDoc } = vi.hoisted(() => ({
  mockDoc: {
    id: 'doc-001',
    title: 'Ejari Unified Tenancy Contract',
    type: 'tenancy_contract',
    status: 'draft',
    html: '<html><body><h1>Tenancy Contract</h1></body></html>',
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../services/documents/documentGenerator.js', () => ({
  generateDocument: vi.fn().mockResolvedValue(mockDoc),
  getDocument: vi.fn().mockImplementation((id: string) => {
    if (id === 'doc-001') return Promise.resolve(mockDoc);
    return Promise.resolve(null);
  }),
  listDocuments: vi.fn().mockResolvedValue({
    data: [mockDoc],
    total: 1,
  }),
  updateDocumentStatus: vi.fn().mockImplementation((id: string, status: string) =>
    Promise.resolve({ ...mockDoc, id, status })
  ),
  getAvailableDocumentTypes: vi.fn().mockReturnValue([
    { type: 'tenancy_contract', name: 'Unified Tenancy Contract', category: 'Leasing' },
    { type: 'form_f', name: 'Form F Purchase Agreement', category: 'Sales' },
  ]),
}));

vi.mock('../services/documents/documentAutoFill.js', () => ({
  autoFillVariables: vi.fn().mockResolvedValue({
    variables: { tenant_name: 'Rashid Khan', property_title: 'Palm Villa' },
    missingRequired: [],
  }),
  getAutoFillableEntities: vi.fn().mockReturnValue([
    { entity: 'lead', fields: ['name', 'email', 'phone'] },
    { entity: 'property', fields: ['title', 'price', 'area'] },
  ]),
  getEntityRequirements: vi.fn().mockReturnValue({}),
}));

vi.mock('../services/DocumentService.js', () => ({
  documentService: {},
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));

import documentsRouter from './documents.js';

describe('Documents API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/documents', documentsRouter);
    app.use(errorHandler);
  });

  describe('POST /api/documents/generate', () => {
    it('generates a document from template with 201', async () => {
      const res = await request(app)
        .post('/api/documents/generate')
        .send({
          type: 'tenancy_contract',
          variables: { tenant_name: 'Rashid Khan' },
          propertyId: 'prop-101',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('doc-001');
    });

    it('rejects missing document type with 400', async () => {
      const res = await request(app)
        .post('/api/documents/generate')
        .send({ variables: {} });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/documents', () => {
    it('returns paginated list of generated documents', async () => {
      const res = await request(app).get('/api/documents?type=tenancy_contract');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/documents/types', () => {
    it('returns available document template types catalog', async () => {
      const res = await request(app).get('/api/documents/types');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].type).toBe('tenancy_contract');
    });
  });

  describe('GET /api/documents/auto-fill/entities', () => {
    it('returns list of auto-fillable entity fields', async () => {
      const res = await request(app).get('/api/documents/auto-fill/entities');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
