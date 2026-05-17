import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let app: any;
let authHeader: string;

const signTestToken = () => {
  const secret = process.env.JWT_SECRET || 'white-caves-dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
  const token = jwt.sign(
    {
      id: 'test-admin-user',
      email: 'admin@whitecaves.test',
      role: 'admin',
    },
    secret,
    { expiresIn: '1h' }
  );

  return `Bearer ${token}`;
};

beforeAll(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(process.stdout, 'write').mockImplementation((() => true) as never);
  vi.spyOn(process.stderr, 'write').mockImplementation((() => true) as never);

  process.env.NODE_ENV = 'test';
  process.env.VITEST = 'true';
  process.env.DISABLE_SERVER_AUTO_START = 'true';

  const mod = await import('./index.ts');
  app = mod.default;
  authHeader = signTestToken();
}, 30000);

afterAll(() => {
  vi.restoreAllMocks();
});

describe('Server real-app integration (import-safe mode)', () => {
  it('returns 401 for protected endpoint without token', async () => {
    const res = await request(app).post('/api/contracts').send({
      lessorName: 'Owner',
      tenantName: 'Tenant',
      annualRent: 100000,
    });

    expect(res.status).toBe(401);
  });

  it('creates and updates contract through real middleware chain', async () => {
    const created = await request(app)
      .post('/api/contracts')
      .set('Authorization', authHeader)
      .send({
        lessorName: 'Owner Integration',
        tenantName: 'Tenant Integration',
        annualRent: 150000,
        propertyType: 'Apartment',
      });

    expect(created.status).toBe(201);
    expect(created.body.success).toBe(true);
    const contractId = created.body.contract.id;

    const activated = await request(app)
      .patch(`/api/contracts/${contractId}`)
      .set('Authorization', authHeader)
      .send({ status: 'active' });

    expect(activated.status).toBe(200);
    expect(activated.body.contract.status).toBe('active');

    const invalidTransition = await request(app)
      .patch(`/api/contracts/${contractId}`)
      .set('Authorization', authHeader)
      .send({ status: 'draft' });

    expect(invalidTransition.status).toBe(400);
    expect(String(invalidTransition.body.error || '')).toContain('Invalid contract status transition');
  });

  it('creates, transitions, and deletes tenancy agreement', async () => {
    const created = await request(app)
      .post('/api/tenancy-agreements')
      .set('Authorization', authHeader)
      .send({
        propertyId: 'integration_prop_1',
        landlordName: 'Landlord Integration',
        tenantName: 'Tenant Integration',
        startDate: '2026-10-01',
        endDate: '2027-09-30',
        annualRent: 125000,
      });

    expect(created.status).toBe(201);
    const agreementId = created.body.data.id;

    const activated = await request(app)
      .patch(`/api/tenancy-agreements/${agreementId}`)
      .set('Authorization', authHeader)
      .send({ status: 'active' });

    expect(activated.status).toBe(200);
    expect(activated.body.data.status).toBe('active');

    const invalidTransition = await request(app)
      .patch(`/api/tenancy-agreements/${agreementId}`)
      .set('Authorization', authHeader)
      .send({ status: 'draft' });

    expect(invalidTransition.status).toBe(400);

    const deleted = await request(app)
      .delete(`/api/tenancy-agreements/${agreementId}`)
      .set('Authorization', authHeader);

    expect(deleted.status).toBe(200);
    expect(deleted.body.data.id).toBe(agreementId);
  });

  it('creates, transitions, and deletes appointment with guarded transitions', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', authHeader)
      .send({
        propertyId: 'integration_prop_2',
        scheduledAt: '2026-12-10T09:00:00.000Z',
        durationMinutes: 60,
        type: 'in_person',
        notes: 'Integration test appointment',
      });

    expect(created.status).toBe(201);
    expect(created.body.success).toBe(true);
    const appointmentId = created.body.data.id;

    const confirmed = await request(app)
      .patch(`/api/appointments/${appointmentId}`)
      .set('Authorization', authHeader)
      .send({ status: 'confirmed' });

    expect(confirmed.status).toBe(200);
    expect(confirmed.body.data.status).toBe('confirmed');

    const completed = await request(app)
      .patch(`/api/appointments/${appointmentId}`)
      .set('Authorization', authHeader)
      .send({ status: 'completed' });

    expect(completed.status).toBe(200);
    expect(completed.body.data.status).toBe('completed');

    const invalidTransition = await request(app)
      .patch(`/api/appointments/${appointmentId}`)
      .set('Authorization', authHeader)
      .send({ status: 'scheduled' });

    expect(invalidTransition.status).toBe(400);
    expect(String(invalidTransition.body.error || '')).toContain(
      'Invalid appointment status transition'
    );

    const deleted = await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set('Authorization', authHeader);

    expect(deleted.status).toBe(200);
    expect(deleted.body.data.id).toBe(appointmentId);
  });

  it('returns valuation estimate on authenticated request', async () => {
    const res = await request(app)
      .post('/api/valuation/estimate')
      .set('Authorization', authHeader)
      .send({ area: 1000, location: 'Dubai Marina' });

    expect(res.status).toBe(200);
    expect(res.body.estimate.mid).toBeGreaterThan(0);
    expect(Array.isArray(res.body.comparables)).toBe(true);
  });
});
