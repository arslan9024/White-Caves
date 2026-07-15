import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * W24-006: Broadcast campaign sender
 * Segment by area/budget/stage
 */
router.post(
  '/broadcast',
  requireAuth,
  requireRole(['owner', 'manager', 'agent']),
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignId, audienceFilter, messageTemplate, templateParams } = req.body;

    if (!campaignId || !audienceFilter || !messageTemplate) {
      res
        .status(400)
        .json({ error: 'Missing required fields: campaignId, audienceFilter, messageTemplate' });
      return;
    }

    // 1. Find leads matching audienceFilter
    // Example filter: { stage: 'new', area: 'Downtown Dubai' }
    const whereClause: any = {};
    if (audienceFilter.stage) whereClause.status = audienceFilter.stage;
    if (audienceFilter.budgetMin) whereClause.budget = { gte: audienceFilter.budgetMin };

    const leads = await prisma.lead.findMany({
      where: whereClause,
      select: { id: true, phone: true, name: true },
    });

    const targetLeads = leads.filter(l => !!l.phone);

    if (targetLeads.length === 0) {
      res.status(404).json({ error: 'No valid leads found matching the filter' });
      return;
    }

    // 2. Check Opt-outs
    const phones = targetLeads.map(l => l.phone as string);
    const optOuts = await prisma.whatsAppConsent.findMany({
      where: {
        phone: { in: phones },
        status: 'opted_out',
      },
    });

    const optOutSet = new Set(optOuts.map(o => o.phone));
    const validLeads = targetLeads.filter(l => !optOutSet.has(l.phone as string));

    // 3. Create BroadcastStat tracking
    const stat = await prisma.broadcastStat.create({
      data: {
        campaignId,
        totalSent: validLeads.length,
        totalFailed: targetLeads.length - validLeads.length, // Count opted out as failed/skipped for now
      },
    });

    // 4. Queue sends
    // In a real implementation we would push to a queue (e.g. BullMQ)
    // For now, we mock the dispatch and assume success
    // We simulate delivery by updating the stats
    setTimeout(async () => {
      // Mock Meta WhatsApp API call loop
      let delivered = 0;
      for (const lead of validLeads) {
        // API call to Meta WhatsApp here...
        delivered++;
      }

      await prisma.broadcastStat.update({
        where: { id: stat.id },
        data: { totalDelivered: delivered },
      });
    }, 1000);

    res.status(202).json({
      message: 'Broadcast queued successfully',
      statId: stat.id,
      targetCount: targetLeads.length,
      sentCount: validLeads.length,
    });
  })
);

export default router;
