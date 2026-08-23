import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { prisma } from '../database.js';
import broadcastRouter from './broadcast.js';

vi.mock('../database.js', () => ({
  prisma: {
    lead: {
      findMany: vi.fn(),
    },
    whatsAppConsent: {
      findMany: vi.fn(),
    },
    broadcastStat: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  default: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user', role: 'owner' };
    next();
  },
  requireAuth: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user', role: 'owner' };
    next();
  },
  requireRole: () => (req: any, res: any, next: any) => next(),
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (req: any, res: any, next: any) => next(),
  requirePermission: () => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/whatsapp', broadcastRouter);

describe('W24-006 Broadcast Campaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters audience, checks opt-outs, and starts broadcast stat tracking', async () => {
    // Mock 10 leads matching criteria
    const mockLeads = Array.from({ length: 10 }).map((_, i) => ({
      id: `lead-${i}`,
      name: `Lead ${i}`,
      phone: `+97150000000${i}`,
    }));

    vi.mocked(prisma.lead.findMany).mockResolvedValue(mockLeads as any);

    // Mock 2 opt-outs
    vi.mocked(prisma.whatsAppConsent.findMany).mockResolvedValue([
      { phone: '+971500000002', consent: false },
      { phone: '+971500000005', consent: false },
    ] as any);

    vi.mocked(prisma.broadcastStat.create).mockResolvedValue({
      id: 'stat-123',
      campaignId: 'camp-456',
      totalSent: 8,
      totalFailed: 2,
    } as any);

    const payload = {
      campaignId: 'camp-456',
      audienceFilter: { stage: 'new', budgetMin: 500000 },
      messageTemplate: 'Hello {{name}}, check out this new villa!',
    };

    const res = await request(app).post('/api/whatsapp/broadcast').send(payload);

    expect(res.status).toBe(202);
    expect(res.body.message).toContain('Broadcast queued');
    expect(res.body.targetCount).toBe(10);
    expect(res.body.sentCount).toBe(8); // 10 total - 2 opt-outs

    expect(prisma.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'new',
          budget: { gte: 500000 },
        }),
      })
    );

    expect(prisma.broadcastStat.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          campaignId: 'camp-456',
          totalSent: 8,
          totalFailed: 2,
        }),
      })
    );
  });
});
