import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { pdcRouter, pdcRegistry, calculateEscalationDeadlines } from './pdc';

describe('UAE Law 50/2022 PDC Bounce & Direct Civil Execution Suite (DU008)', () => {
  let app: express.Express;

  beforeEach(() => {
    pdcRegistry.clear();
    app = express();
    app.use(express.json());
    app.use('/api/pdc', pdcRouter);
  });

  it('calculates statutory grace period and civil execution dates', () => {
    const dishonourDate = '2026-11-01T00:00:00.000Z';
    const deadlines = calculateEscalationDeadlines(dishonourDate);

    expect(new Date(deadlines.gracePeriodExpiresAt).getDate()).toBe(6); // +5 days
    expect(new Date(deadlines.civilExecutionEligibleAt).getMonth()).toBe(11); // +30 days (Dec 1)
  });

  it('records a bounced cheque and issues a Law 50 dossier reference', async () => {
    const res = await request(app)
      .post('/api/pdc/bounce')
      .send({
        chequeNumber: 'CHQ-889900',
        chequeAmountAed: 45000,
        bankName: 'Emirates NBD',
        drawerName: 'Tariq Al-Hashemi',
        drawerEmiratesIdOrPassport: '784-1988-7654321-2',
        tenancyContractNumber: 'TC-2026-991',
        ejariCertificateNumber: 'EJ-99887766',
        dishonourReason: 'INSUFFICIENT_FUNDS',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PDC_BOUNCED');
    expect(res.body.data.law50ReferenceDossierId).toContain('EXEC-DOSSIER-');
    expect(res.body.data.chequeAmountAed).toBe(45000);
  });

  it('escalates incident state to DIRECT_CIVIL_EXECUTION', async () => {
    const createRes = await request(app)
      .post('/api/pdc/bounce')
      .send({
        chequeNumber: 'CHQ-112233',
        chequeAmountAed: 60000,
        bankName: 'First Abu Dhabi Bank (FAB)',
        drawerName: 'Marcus Sterling',
        tenancyContractNumber: 'TC-2026-444',
      });

    const incidentId = createRes.body.data.incidentId;

    const escalateRes = await request(app)
      .patch(`/api/pdc/${incidentId}/escalate`)
      .send({ status: 'DIRECT_CIVIL_EXECUTION' });

    expect(escalateRes.status).toBe(200);
    expect(escalateRes.body.data.status).toBe('DIRECT_CIVIL_EXECUTION');
  });

  it('lists registered PDC incidents', async () => {
    await request(app)
      .post('/api/pdc/bounce')
      .send({
        chequeNumber: 'CHQ-001',
        chequeAmountAed: 25000,
        bankName: 'Mashreq Bank',
        drawerName: 'Rashid Khan',
        tenancyContractNumber: 'TC-2026-001',
      });

    const res = await request(app).get('/api/pdc/incidents');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].chequeNumber).toBe('CHQ-001');
  });
});
