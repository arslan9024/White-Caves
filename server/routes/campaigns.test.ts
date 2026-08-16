import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma, mockBroadcastService } = vi.hoisted(() => ({
  mockPrisma: {
    campaign: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  mockBroadcastService: {
    executeCampaign: vi.fn().mockResolvedValue({
      campaignId: '507f1f77bcf86cd799439011',
      targetCount: 50,
      sentCount: 50,
      failedCount: 0,
    }),
    getCampaignAnalytics: vi.fn().mockResolvedValue({
      campaignId: '507f1f77bcf86cd799439011',
      name: 'Summer Promo',
      funnel: { deliveryRatePercent: 95, readRatePercent: 60 },
    }),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/broadcastCampaignService.js', () => mockBroadcastService);
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));

import campaignsRoutes from './campaigns.js';

function createApp(role = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; email: string; role: string } }).user = {
      id: userId,
      email: 'marketing@whitecaves.ae',
      role,
    };
    next();
  });
  app.use('/api/campaigns', campaignsRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_CAMPAIGN_ID = '507f1f77bcf86cd799439011';

describe('Campaigns Routes — /api/campaigns (Wave 38)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/campaigns', () => {
    it('returns list of broadcast campaigns', async () => {
      mockPrisma.campaign.findMany.mockResolvedValueOnce([
        { id: VALID_CAMPAIGN_ID, name: 'Summer Promo', status: 'draft' },
      ]);

      const res = await request(createApp()).get('/api/campaigns');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/campaigns', () => {
    it('creates a new draft broadcast campaign', async () => {
      mockPrisma.campaign.create.mockResolvedValueOnce({
        id: VALID_CAMPAIGN_ID,
        name: 'VIP Investor Blast',
        templateName: 'investor_vip_v1',
        status: 'draft',
      });

      const res = await request(createApp())
        .post('/api/campaigns')
        .send({ name: 'VIP Investor Blast', templateName: 'investor_vip_v1' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(VALID_CAMPAIGN_ID);
    });
  });

  describe('POST /api/campaigns/:id/execute', () => {
    it('triggers broadcast execution for campaign', async () => {
      const res = await request(createApp())
        .post(`/api/campaigns/${VALID_CAMPAIGN_ID}/execute`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockBroadcastService.executeCampaign).toHaveBeenCalledWith(VALID_CAMPAIGN_ID);
    });
  });

  describe('GET /api/campaigns/:id/analytics', () => {
    it('returns delivery analytics funnel for campaign', async () => {
      const res = await request(createApp())
        .get(`/api/campaigns/${VALID_CAMPAIGN_ID}/analytics`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.funnel.deliveryRatePercent).toBe(95);
    });
  });
});
