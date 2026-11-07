import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { oqoodRouter, oqoodRegistry, calculateOqoodFees } from './oqood';

describe('DLD Oqood Pre-Registration Suite (DU004 / AEG-012)', () => {
  let app: express.Express;

  beforeEach(() => {
    oqoodRegistry.clear();
    app = express();
    app.use(express.json());
    app.use('/api/oqood', oqoodRouter);
  });

  it('calculates statutory DLD & Oqood fees accurately', () => {
    const fees = calculateOqoodFees(2000000); // 2,000,000 AED
    expect(fees.dldFeeAed).toBe(80000); // 4% = 80,000 AED
    expect(fees.dldAdminFeeAed).toBe(580);
    expect(fees.oqoodFeeAed).toBe(1050);
    expect(fees.totalPayableAed).toBe(81630);
  });

  it('successfully registers an off-plan unit with valid escrow', async () => {
    const res = await request(app)
      .post('/api/oqood/register')
      .send({
        projectNumber: 'PRJ-889',
        developerId: 'EMAAR-01',
        unitNumber: 'UNIT-1402',
        buyerName: 'Sheikh Mansoor Al-Nahyan',
        buyerPassportOrEmiratesId: '784-1990-1234567-1',
        purchasePriceAed: 3500000,
        escrowAccountNumber: 'ESCROW987654321',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.idempotencyKey).toBe('AEG-OQOOD-PRJ-889-UNIT-1402');
    expect(res.body.data.status).toBe('APPROVED_PRE_REGISTRATION');
    expect(res.body.data.dldFeeAed).toBe(140000);
    expect(res.body.data.dldCertificateChecksum).toBeDefined();
  });

  it('enforces idempotency on duplicate registration (AEG-012)', async () => {
    const payload = {
      projectNumber: 'PRJ-101',
      developerId: 'SOBHA-02',
      unitNumber: 'VILLA-22',
      buyerName: 'Elena Rostova',
      buyerPassportOrEmiratesId: 'P12398745',
      purchasePriceAed: 5000000,
      escrowAccountNumber: 'ESCROW11223344',
    };

    const first = await request(app).post('/api/oqood/register').send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/oqood/register').send(payload);
    expect(second.status).toBe(200);
    expect(second.body.message).toContain('idempotent');
    expect(second.body.data.registrationId).toBe(first.body.data.registrationId);
  });

  it('rejects registration with invalid escrow account number', async () => {
    const res = await request(app)
      .post('/api/oqood/register')
      .send({
        projectNumber: 'PRJ-102',
        developerId: 'DAMAC-03',
        unitNumber: 'APT-101',
        buyerName: 'John Doe',
        buyerPassportOrEmiratesId: 'USA-998822',
        purchasePriceAed: 1200000,
        escrowAccountNumber: 'BAD@#', // invalid
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toContain('Escrow');
  });

  it('retrieves registered unit by project and unit numbers', async () => {
    await request(app)
      .post('/api/oqood/register')
      .send({
        projectNumber: 'PRJ-303',
        developerId: 'MERAAS-09',
        unitNumber: 'PH-01',
        buyerName: 'Alexander Vance',
        buyerPassportOrEmiratesId: 'UK-772211',
        purchasePriceAed: 10000000,
        escrowAccountNumber: 'ESCROW33445566',
      });

    const res = await request(app).get('/api/oqood/PRJ-303/PH-01');
    expect(res.status).toBe(200);
    expect(res.body.data.unitNumber).toBe('PH-01');
    expect(res.body.data.dldFeeAed).toBe(400000);
  });
});
