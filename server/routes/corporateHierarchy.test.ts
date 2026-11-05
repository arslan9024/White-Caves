/**
 * White Caves Real Estate LLC - Corporate Hierarchy Server Routes Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import corporateHierarchyRouter from './corporateHierarchy';

const app = express();
app.use(express.json());
app.use('/api/corporate-hierarchy', corporateHierarchyRouter);

describe('Corporate Hierarchy REST Endpoints (Turing Protocol)', () => {
  it('GET /api/corporate-hierarchy/tasks returns list of tasks with Turing IDs', async () => {
    const res = await request(app).get('/api/corporate-hierarchy/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].taskCode).toMatch(/^T\d+/);
    expect(res.body.data[0].reportingChain.supervisorCode).toMatch(/^SUP-\d+/);
    expect(res.body.data[0].reportingChain.managerCode).toMatch(/^M\d+/);
  });

  it('PUT /api/corporate-hierarchy/tasks/:id/status updates status and awards XP on completion', async () => {
    const res = await request(app)
      .put('/api/corporate-hierarchy/tasks/TSK-001/status')
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('COMPLETED');
    expect(res.body.awardedXp).toBeGreaterThan(0);
  });

  it('PUT /api/corporate-hierarchy/tasks/:id/reassign reassigns execution supervisor', async () => {
    const res = await request(app).put('/api/corporate-hierarchy/tasks/TSK-001/reassign').send({
      supervisorName: 'Aisha Al-Falasi',
      supervisorCode: 'SUP-008',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reportingChain.supervisorName).toBe('Aisha Al-Falasi');
    expect(res.body.data.reportingChain.supervisorCode).toBe('SUP-008');
  });

  it('GET /api/corporate-hierarchy/leaderboard returns ranked employees and top podium', async () => {
    const res = await request(app).get('/api/corporate-hierarchy/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.topPodium.gold).toBeDefined();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/corporate-hierarchy/promotions promotes employee tier', async () => {
    const res = await request(app).post('/api/corporate-hierarchy/promotions').send({
      employeeId: 'EMP-002',
      targetTier: 'SUPERVISOR',
      targetRole: 'Operational Supervisor (Compliance & RERA)',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.roleTier).toBe('SUPERVISOR');
    expect(res.body.data.designation).toContain('Supervisor');
  });
});
