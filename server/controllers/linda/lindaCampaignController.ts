import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import {
  dispatchDueLindaCampaigns,
  dispatchLindaCampaign,
} from '../../services/whatsapp/lindaCampaignService.js';
import { db } from './lindaCommon.js';

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const take = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 200);

    const campaigns = await db.lindaBroadcastCampaign.findMany({
      where: status && status !== 'all' ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
    });

    res.json({ success: true, data: campaigns });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { name, targetList, messageTemplate, templateVars, scheduledAt } = req.body;
    if (!name || !Array.isArray(targetList) || targetList.length === 0 || !messageTemplate) {
      return res.status(400).json({
        success: false,
        error: 'Required: name, targetList (non-empty array), messageTemplate',
      });
    }

    const cleanTargets = targetList
      .map((p: string) => String(p).replace(/\D/g, ''))
      .filter((p: string) => p.length >= 10);
    if (cleanTargets.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid target phone numbers' });
    }

    const campaign = await db.lindaBroadcastCampaign.create({
      data: {
        name: String(name),
        targetList: cleanTargets,
        messageTemplate: String(messageTemplate),
        templateVars: templateVars || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'draft',
        createdById: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const dispatchCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as Record<string, string>;
    const updated = await dispatchLindaCampaign(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message === 'Campaign not found') {
      return res.status(404).json({ success: false, error: message });
    }
    if (
      message.startsWith('Campaign cannot be dispatched from status:') ||
      message.includes('no valid recipients')
    ) {
      return res.status(409).json({ success: false, error: message });
    }
    res.status(500).json({ success: false, error: message });
  }
};

export const dispatchDueCampaignsHandler = async (_req: Request, res: Response) => {
  try {
    const summary = await dispatchDueLindaCampaigns();

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const inventoryBroadcast = async (req: Request, res: Response) => {
  try {
    const { propertyId, propertyData, targetPhones } = req.body as {
      propertyId?: unknown;
      propertyData?: unknown;
      targetPhones?: unknown;
    };

    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }
    if (!propertyData || typeof propertyData !== 'object' || Array.isArray(propertyData)) {
      return res
        .status(400)
        .json({ success: false, error: 'propertyData must be a non-null object' });
    }
    if (!Array.isArray(targetPhones) || targetPhones.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'targetPhones must be a non-empty array' });
    }
    if (targetPhones.length > 500) {
      return res
        .status(400)
        .json({ success: false, error: 'targetPhones cannot exceed 500 entries per broadcast' });
    }

    const data = propertyData as Record<string, unknown>;

    const { assistantOrchestrator } = await import(
      '../../services/orchestrator/AssistantOrchestrator.js'
    );
    assistantOrchestrator.emitEvent('mary:property_status_changed', {
      propertyId,
      previousStatus: typeof data.previousStatus === 'string' ? data.previousStatus : 'unknown',
      newStatus: typeof data.newStatus === 'string' ? data.newStatus : 'updated',
      broadcastPayload: data,
      targetPhones: targetPhones as string[],
    });

    res.json({ success: true, data: { queued: true, count: targetPhones.length } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
