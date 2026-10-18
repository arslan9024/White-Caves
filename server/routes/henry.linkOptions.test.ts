import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({ lead: { findMany: vi.fn() }, property: { findMany: vi.fn() } }));
vi.mock('../database.js', () => ({ prisma: db }));
vi.mock('../middleware/rbac.js', () => ({
  requireMinRole: () => (req: Request, res: Response, next: NextFunction) =>
    req.headers['x-role'] === 'agent' ? next() : res.sendStatus(403),
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));
import router from './henry';
const owner = '123456789012345678901234';
function app(userId = owner) {
  const instance = express();
  instance.use((req, _res, next) => { Object.assign(req, { user: { id: userId } }); next(); });
  instance.use('/henry', router);
  instance.use((error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) =>
    res.status(error.statusCode ?? 500).json({ error: error.message }));
  return instance;
}
describe('Henry authorized link options', () => {
  beforeEach(() => { vi.clearAllMocks(); db.lead.findMany.mockResolvedValue([]); db.property.findMany.mockResolvedValue([]); });
  it('uses assigned lead owner and minimal projection, ignores requested owner', async () => {
    db.lead.findMany.mockResolvedValue(Array.from({ length: 26 }, (_, index) => ({ id: String(index), name: `Lead ${index}` })));
    const result = await request(app()).get('/henry/documents/link-options?kind=lead&page=2&ownerUserId=other').set('x-role', 'agent');
    expect(result.status).toBe(200);
    expect(result.body.data).toHaveLength(25);
    expect(result.body.hasMore).toBe(true);
    expect(db.lead.findMany).toHaveBeenCalledWith({
      where: { assignedToId: owner }, select: { id: true, name: true }, orderBy: { id: 'asc' }, skip: 25, take: 26,
    });
  });
  it('uses property ownership rather than global CRM access', async () => {
    db.property.findMany.mockResolvedValue([{ id: owner, title: 'Owned unit' }]);
    const result = await request(app()).get('/henry/documents/link-options?kind=property').set('x-role', 'agent');
    expect(result.body.data).toEqual([{ id: owner, name: 'Owned unit' }]);
    expect(db.property.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: owner }, select: { id: true, title: true } }));
  });
  it.each(['kind=tenant', 'kind=lead&page=0', 'kind=lead&page=1.5', 'kind=lead&page=1001'])('rejects invalid bounded options %s', async query => {
    expect((await request(app()).get(`/henry/documents/link-options?${query}`).set('x-role', 'agent')).status).toBe(400);
    expect(db.lead.findMany).not.toHaveBeenCalled();
  });
  it('requires agent access and an authenticated owner', async () => {
    expect((await request(app()).get('/henry/documents/link-options?kind=lead')).status).toBe(403);
    expect((await request(app('')).get('/henry/documents/link-options?kind=lead').set('x-role', 'agent')).status).toBe(401);
    expect(db.lead.findMany).not.toHaveBeenCalled();
  });
});
