/**
 * Broadcast Campaign Service — Wave 38 (REQ-WA-005)
 *
 * Provides:
 * 1. Audience builder for target lead segmentation (score, status, location)
 * 2. Automated WhatsApp broadcast campaign execution engine
 * 3. Delivery tracking & per-campaign analytics
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { sendTemplateMessage } from './whatsapp/metaAPI.js';

export interface AudienceFilter {
  minScore?: number;
  status?: string;
  location?: string;
  source?: string;
}

export interface CampaignExecutionResult {
  campaignId: string;
  targetCount: number;
  sentCount: number;
  failedCount: number;
}

/**
 * Filter leads based on audience segmentation criteria
 */
export async function buildCampaignAudience(filter: AudienceFilter = {}): Promise<Array<{ id: string; phone: string; name: string | null }>> {
  const where: Record<string, unknown> = {};

  if (filter.minScore !== undefined) {
    where.score = { gte: filter.minScore };
  }
  if (filter.status) {
    where.status = filter.status;
  }
  if (filter.source) {
    where.source = filter.source;
  }

  const leads = await prisma.lead.findMany({
    where,
    select: {
      id: true,
      phone: true,
      name: true,
    },
  });

  // Exclude leads without valid phone numbers or who opted out of WhatsApp
  const optedOut = await prisma.whatsAppConsent.findMany({
    where: { consent: false },
    select: { phone: true },
  });
  const optedOutPhones = new Set(optedOut.map(o => o.phone.replace(/[^0-9]/g, '')));
  const validLeads: Array<{ id: string; phone: string; name: string | null }> = [];

  for (const lead of leads) {
    if (!lead.phone) continue;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    if (!optedOutPhones.has(cleanPhone)) {
      validLeads.push({ id: lead.id, phone: lead.phone, name: lead.name });
    }
  }

  return validLeads;
}

/**
 * Execute a broadcast campaign
 */
export async function executeCampaign(campaignId: string): Promise<CampaignExecutionResult> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error(`Campaign #${campaignId} not found`);
  }

  if (campaign.status === 'completed' || campaign.status === 'sending') {
    return {
      campaignId,
      targetCount: campaign.targetCount,
      sentCount: campaign.sentCount,
      failedCount: campaign.failedCount,
    };
  }

  // Update campaign status to sending
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'sending', startedAt: new Date() },
  });

  const filter = (campaign.audienceFilter as AudienceFilter) || {};
  const audience = await buildCampaignAudience(filter);

  let sentCount = 0;
  let failedCount = 0;

  for (const lead of audience) {
    try {
      const res = await sendTemplateMessage(
        lead.phone,
        campaign.templateName,
        campaign.templateLanguage || 'en',
        [lead.name || 'Valued Customer']
      );

      await prisma.campaignRecipient.create({
        data: {
          campaignId,
          leadId: lead.id,
          phone: lead.phone,
          name: lead.name,
          status: 'sent',
          wabaMessageId: res.messageId,
          sentAt: new Date(),
        },
      });

      sentCount++;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Send failed';
      await prisma.campaignRecipient.create({
        data: {
          campaignId,
          leadId: lead.id,
          phone: lead.phone,
          name: lead.name,
          status: 'failed',
          errorMessage: errMsg,
        },
      });

      failedCount++;
    }
  }

  // Update campaign summary stats
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      targetCount: audience.length,
      sentCount,
      failedCount,
    },
  });

  logger.info('[BroadcastCampaignService] campaign completed', {
    campaignId,
    targetCount: audience.length,
    sentCount,
    failedCount,
  });

  return {
    campaignId,
    targetCount: audience.length,
    sentCount,
    failedCount,
  };
}

/**
 * Get campaign analytics & delivery funnel breakdown
 */
export async function getCampaignAnalytics(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      recipients: {
        select: {
          id: true,
          status: true,
          sentAt: true,
          deliveredAt: true,
          readAt: true,
          errorMessage: true,
        },
      },
    },
  });

  if (!campaign) {
    throw new Error(`Campaign #${campaignId} not found`);
  }

  const deliveryRate = campaign.sentCount > 0 ? (campaign.deliveredCount / campaign.sentCount) * 100 : 0;
  const readRate = campaign.deliveredCount > 0 ? (campaign.readCount / campaign.deliveredCount) * 100 : 0;

  return {
    campaignId: campaign.id,
    name: campaign.name,
    status: campaign.status,
    templateName: campaign.templateName,
    scheduledAt: campaign.scheduledAt,
    startedAt: campaign.startedAt,
    completedAt: campaign.completedAt,
    funnel: {
      targetCount: campaign.targetCount,
      sentCount: campaign.sentCount,
      deliveredCount: campaign.deliveredCount,
      readCount: campaign.readCount,
      failedCount: campaign.failedCount,
      deliveryRatePercent: Math.round(deliveryRate * 10) / 10,
      readRatePercent: Math.round(readRate * 10) / 10,
    },
  };
}
