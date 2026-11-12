import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const database = vi.hoisted(() => ({
  property: { findMany: vi.fn(), count: vi.fn(), findFirst: vi.fn() },
  $runCommandRaw: vi.fn(),
}));
const inventory = vi.hoisted(() => ({
  findById: vi.fn(),
  updateStatus: vi.fn(),
  getStatusBreakdown: vi.fn(),
  getAreaStats: vi.fn(),
}));

vi.mock('./database.js', () => ({
  getPrismaClient: () => database,
  connectDB: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../models/InventoryProperty.js', () => ({ default: inventory }));

import app from '../../api/index.js';
import { connectDB } from './database.js';

function inventoryAuthorization(role = 'manager'): string {
  return `Bearer ${jwt.sign({ id: 'test-user', email: 'inventory@example.test', role }, JWT_SECRET)}`;
}

beforeEach(() => {
  vi.resetAllMocks();
  database.property.findMany.mockResolvedValue([{ id: 'property-1' }]);
  database.property.count.mockResolvedValue(1);
});

describe('serverless API composition', () => {
  it('serves health without a database connection', async () => {
    const result = await request(app).get('/api/health');
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ status: 'healthy', platform: 'vercel' });
    expect(database.$runCommandRaw).not.toHaveBeenCalled();
  });

  it('reports database failure honestly', async () => {
    database.$runCommandRaw.mockRejectedValue(new Error('private database diagnostic'));
    const result = await request(app).get('/api/system/health');
    expect(result.body.database.status).toBe('not_connected');
    expect(result.text).not.toContain('private database diagnostic');
  });

  it('keeps property pagination and result envelopes', async () => {
    const result = await request(app)
      .get('/api/properties?page=2&pageSize=5')
      .set('Authorization', inventoryAuthorization('agent'));
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      success: true,
      properties: [{ id: 'property-1' }],
      pagination: { page: 2, pageSize: 5, total: 1 },
    });
    expect(database.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5, where: { userId: 'test-user' } })
    );
    expect(database.property.count).toHaveBeenCalledWith({ where: { userId: 'test-user' } });
  });

  it('rejects repeated query parameters before reaching the database', async () => {
    const result = await request(app)
      .get('/api/properties?search=one&search=two')
      .set('Authorization', inventoryAuthorization());
    expect(result.status).toBe(400);
    expect(database.property.findMany).not.toHaveBeenCalled();
  });

  it('does not expose raw database errors', async () => {
    database.property.findMany.mockRejectedValue(new Error('private database diagnostic'));
    const result = await request(app)
      .get('/api/properties')
      .set('Authorization', inventoryAuthorization());
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ success: false, error: 'Internal server error' });
  });

  it('rejects anonymous property listing and detail access before the database', async () => {
    const listing = await request(app).get('/api/properties');
    const detail = await request(app).get('/api/properties/property-1');

    expect(listing.status).toBe(401);
    expect(detail.status).toBe(401);
    expect(database.property.findMany).not.toHaveBeenCalled();
    expect(database.property.findFirst).not.toHaveBeenCalled();
  });

  it('applies the authenticated ownership scope to property detail lookups', async () => {
    database.property.findFirst.mockResolvedValue({ id: 'property-1', userId: 'test-user' });

    const result = await request(app)
      .get('/api/properties/property-1')
      .set('Authorization', inventoryAuthorization('agent'));

    expect(result.status).toBe(200);
    expect(database.property.findFirst).toHaveBeenCalledWith({
      where: { id: 'property-1', userId: 'test-user' },
    });
  });

  it('mounts inventory details at startup without a preceding statistics request', async () => {
    const property = { id: 'one' };
    const populate = vi.fn().mockResolvedValue(property);
    inventory.findById.mockReturnValue({ populate: vi.fn().mockReturnValue({ populate }) });
    const result = await request(app)
      .get('/api/inventory/one')
      .set('Authorization', inventoryAuthorization());
    expect(result.status).toBe(200);
    expect(result.body.data).toEqual(property);
  });

  it('mounts inventory statistics before the dynamic id route', async () => {
    inventory.getStatusBreakdown.mockResolvedValue([{ total: 1 }]);
    inventory.getAreaStats.mockResolvedValue([]);
    const result = await request(app)
      .get('/api/inventory/statistics')
      .set('Authorization', inventoryAuthorization());
    expect(result.status).toBe(200);
    expect(inventory.findById).not.toHaveBeenCalled();
    expect(result.body.data.statusBreakdown).toEqual({ total: 1 });
  });

  it.each([
    '/api/inventory/query',
    '/api/inventory/statistics',
    '/api/inventory/one',
    '/api/inventory/by-pnumber/P-1',
  ])('rejects anonymous access to %s before the database', async path => {
    const result = await request(app).get(path);
    expect(result.status).toBe(401);
    expect(connectDB).not.toHaveBeenCalled();
  });

  it('requires edit permission before an inventory mutation', async () => {
    const result = await request(app)
      .put('/api/inventory/one/status')
      .set('Authorization', inventoryAuthorization('viewer'))
      .send({ marketAvailability: 'available' });
    expect(result.status).toBe(403);
    expect(inventory.updateStatus).not.toHaveBeenCalled();
    expect(connectDB).not.toHaveBeenCalled();
  });

  it('blocks unscoped agent access to private inventory data', async () => {
    const result = await request(app)
      .get('/api/inventory/one')
      .set('Authorization', inventoryAuthorization('agent'));
    expect(result.status).toBe(403);
    expect(connectDB).not.toHaveBeenCalled();
  });

  it('rejects a malformed status payload before the database', async () => {
    const result = await request(app)
      .put('/api/inventory/one/status')
      .set('Authorization', inventoryAuthorization())
      .send([]);
    expect(result.status).toBe(400);
    expect(connectDB).not.toHaveBeenCalled();
  });

  it('allows an authorized inventory status update', async () => {
    inventory.updateStatus.mockResolvedValue({ propertyId: 'one' });
    const result = await request(app)
      .put('/api/inventory/one/status')
      .set('Authorization', inventoryAuthorization())
      .send({ marketAvailability: 'available_for_sale', updatedBy: 'forged-user' });
    expect(result.status).toBe(200);
    expect(inventory.updateStatus).toHaveBeenCalledWith(
      'one',
      { marketAvailability: 'available_for_sale', updatedBy: 'test-user' },
      'api_update'
    );
  });

  it.each([
    ['get', '/api/sourcing/opportunities'],
    ['post', '/api/sourcing/opportunities/one/add-to-inventory'],
    ['post', '/api/services/book'],
    ['get', '/api/improvements/dashboard'],
    ['get', '/api/leads/scoring/analytics'],
    ['post', '/api/recommendations/one/outcome'],
  ] as const)('reports unavailable %s %s without fabricated success', async (method, path) => {
    const result = await request(app)[method](path).send({});
    expect(result.status).toBe(501);
    expect(result.body.success).toBe(false);
  });

  it('uses the real pricing engine export and instance method', async () => {
    const result = await request(app)
      .post('/api/services/pricing/calculate')
      .send({
        serviceType: 'PROPERTY_SALE',
        propertyData: { value: 1_000_000 },
        clientData: { tier: 'BASIC' },
      });
    expect(result.status).toBe(200);
    expect(result.body.pricing.finalAmount).toBeGreaterThan(0);
    expect(result.body.pricing.finalRate).toBeGreaterThan(0);
  });

  it('uses the real lead scoring engine', async () => {
    const result = await request(app).post('/api/leads/one/score').send({});
    expect(result.status).toBe(200);
    expect(result.body.score).toEqual(expect.any(Number));
    expect(result.body.grade).toEqual(expect.any(String));
  });

  it('rejects invalid pricing input rather than calculating a zero amount', async () => {
    const result = await request(app).post('/api/services/pricing/calculate').send({
      serviceType: 'PROPERTY_SALE',
    });
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('validates chatbot messages and handles English and Arabic', async () => {
    expect((await request(app).post('/api/chatbot/test').send({})).status).toBe(400);
    const english = await request(app).post('/api/chatbot/test').send({ message: 'Hello' });
    expect(english.body).toMatchObject({ success: true, language: 'en', intent: 'greeting' });
    const arabic = await request(app)
      .post('/api/chatbot/test')
      .send({ message: '\u0645\u0631\u062d\u0628\u0627' });
    expect(arabic.body).toMatchObject({ success: true, language: 'ar', intent: 'greeting' });
    expect(arabic.body.response).not.toBe('');
  });

  it('returns a real API 404 under Express 5', async () => {
    const result = await request(app).get('/api/missing');
    expect(result.status).toBe(404);
    expect(result.body).toEqual({ error: 'API endpoint not found' });
  });
});
