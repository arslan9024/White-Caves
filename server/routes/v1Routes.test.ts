/**
 * White Caves Real Estate LLC - V1 REST API Integration Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import v1DealsRouter from './v1Deals.js';
import v1CustomersRouter from './v1Customers.js';
import v1RelationshipsRouter from './v1Relationships.js';
import v1DocumentsRouter from './v1Documents.js';

function createTestApp(): express.Application {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/deals', v1DealsRouter);
  app.use('/api/v1/customers', v1CustomersRouter);
  app.use('/api/v1/relationships', v1RelationshipsRouter);
  app.use('/api/v1/documents', v1DocumentsRouter);
  return app;
}

describe('V1 REST API Routes Suite', () => {
  const app = createTestApp();

  describe('/api/v1/deals endpoints', () => {
    it('GET /api/v1/deals returns canonical deals list', async () => {
      const res = await request(app).get('/api/v1/deals').expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/deals/:id returns single deal', async () => {
      const res = await request(app).get('/api/v1/deals/DEAL-001').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('DEAL-001');
    });

    it('POST /api/v1/deals creates a new deal', async () => {
      const payload = {
        title: 'New Luxury Penthouse Deal',
        dealType: 'SALES',
        valueAED: 12000000,
        commissionAED: 240000,
      };
      const res = await request(app).post('/api/v1/deals').send(payload).expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Luxury Penthouse Deal');
    });
  });

  describe('/api/v1/customers endpoints', () => {
    it('GET /api/v1/customers returns customers list', async () => {
      const res = await request(app).get('/api/v1/customers').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/customers creates a new customer', async () => {
      const payload = {
        fullName: 'Sheikh Mansoor',
        email: 'mansoor@uae.gov.ae',
        customerType: 'INVESTOR',
      };
      const res = await request(app).post('/api/v1/customers').send(payload).expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Sheikh Mansoor');
    });

    it('POST /api/v1/customers/:id/step advances transaction step', async () => {
      const res = await request(app)
        .post('/api/v1/customers/CUST-001/step')
        .send({ nextStep: 16, stepName: 'KEY_HANDOVER' })
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.currentStep).toBe(16);
    });
  });

  describe('/api/v1/relationships endpoints', () => {
    it('GET /api/v1/relationships returns relational chains', async () => {
      const res = await request(app).get('/api/v1/relationships').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/relationships/:id returns single chain', async () => {
      const res = await request(app).get('/api/v1/relationships/REL-001').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('REL-001');
    });
  });

  describe('/api/v1/documents endpoints', () => {
    it('GET /api/v1/documents returns document vault files', async () => {
      const res = await request(app).get('/api/v1/documents').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/documents/verify sets status to VERIFIED', async () => {
      const res = await request(app)
        .post('/api/v1/documents/verify')
        .send({ id: 'DOC-001', verifiedBy: 'Henry Legal OCR' })
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('VERIFIED');
    });
  });
});
