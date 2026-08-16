import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma, mockMetaAPI } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findMany: vi.fn(),
    },
    whatsAppConsent: {
      findMany: vi.fn(),
    },
    campaign: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    campaignRecipient: {
      create: vi.fn(),
    },
  },
  mockMetaAPI: {
    sendTemplateMessage: vi.fn().mockResolvedValue({ messageId: 'wmid-12345' }),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('./whatsapp/metaAPI.js', () => mockMetaAPI);
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import {
  buildCampaignAudience,
  executeCampaign,
  getCampaignAnalytics,
} from './broadcastCampaignService.js';

describe('Broadcast Campaign Service — Wave 38 (W38-003, W38-004, W38-006)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildCampaignAudience', () => {
    it('filters target leads by score and excludes opted-out phone numbers', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([
        { id: 'lead-1', phone: '+971501112233', name: 'Lead One' },
        { id: 'lead-2', phone: '+971509998877', name: 'Lead Two' },
      ]);
      mockPrisma.whatsAppConsent.findMany.mockResolvedValueOnce([
        { phone: '+971509998877' }, // Lead Two opted out
      ]);

      const audience = await buildCampaignAudience({ minScore: 20 });

      expect(audience).toHaveLength(1);
      expect(audience[0].id).toBe('lead-1');
    });
  });

  describe('executeCampaign', () => {
    it('sends template messages to audience and updates campaign metrics', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValueOnce({
        id: 'camp-101',
        name: 'Summer Luxury Promo',
        templateName: 'summer_promo_v1',
        templateLanguage: 'en',
        status: 'draft',
        audienceFilter: { minScore: 10 },
        targetCount: 0,
        sentCount: 0,
        failedCount: 0,
      });
      mockPrisma.lead.findMany.mockResolvedValueOnce([
        { id: 'lead-1', phone: '+971501112233', name: 'Lead One' },
      ]);
      mockPrisma.whatsAppConsent.findMany.mockResolvedValueOnce([]);
      mockPrisma.campaign.update.mockResolvedValue({ id: 'camp-101' });

      const result = await executeCampaign('camp-101');

      expect(result.targetCount).toBe(1);
      expect(result.sentCount).toBe(1);
      expect(result.failedCount).toBe(0);
      expect(mockMetaAPI.sendTemplateMessage).toHaveBeenCalledWith(
        '+971501112233',
        'summer_promo_v1',
        'en',
        ['Lead One']
      );
    });
  });

  describe('getCampaignAnalytics', () => {
    it('returns delivery funnel breakdown for campaign', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValueOnce({
        id: 'camp-101',
        name: 'Summer Luxury Promo',
        status: 'completed',
        templateName: 'summer_promo_v1',
        targetCount: 100,
        sentCount: 100,
        deliveredCount: 90,
        readCount: 45,
        failedCount: 0,
        recipients: [],
      });

      const analytics = await getCampaignAnalytics('camp-101');

      expect(analytics.funnel.deliveryRatePercent).toBe(90);
      expect(analytics.funnel.readRatePercent).toBe(50);
    });
  });
});
