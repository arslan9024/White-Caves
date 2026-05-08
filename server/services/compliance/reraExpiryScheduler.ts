/**
 * RERA BRN Expiry Scheduler — Phase 3D
 * ─────────────────────────────────────
 * Automated notifications for agents with expiring RERA Broker
 * Registration Numbers (BRN). Sends alerts at 30, 15, and 7 days
 * before expiry via WhatsApp and Email.
 *
 * Runs daily at startup and every 24 hours thereafter.
 *
 * @module reraExpiryScheduler
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

// ─── Types ───────────────────────────────────────────────────────────────

interface ExpiryCheckResult {
  notified: number;
  errors: number;
  agents: Array<{
    id: string;
    name: string;
    brnNumber: string;
    daysUntilExpiry: number;
    channel: string;
  }>;
}

// ─── Alert Thresholds ────────────────────────────────────────────────────

const ALERT_THRESHOLDS = [30, 15, 7, 3, 1]; // Days before expiry

// ─── Core Functions ──────────────────────────────────────────────────────

/**
 * Check all agents for upcoming BRN expirations and send notifications.
 * Called by the scheduler daily.
 */
export async function checkBRNExpirations(): Promise<ExpiryCheckResult> {
  const now = new Date();
  const maxAlertDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  // Find agents with BRN expiring within 30 days
  const expiringAgents = await prisma.user.findMany({
    where: {
      brnExpiry: {
        gte: now,        // Not yet expired
        lte: maxAlertDate, // Within 30 days
      },
      brnNumber: { not: null },
      status: 'active',
      role: { in: ['agent', 'owner'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      brnNumber: true,
      brnExpiry: true,
    },
  });

  const result: ExpiryCheckResult = { notified: 0, errors: 0, agents: [] };

  for (const agent of expiringAgents) {
    if (!agent.brnExpiry || !agent.brnNumber) continue;

    const daysUntilExpiry = Math.ceil(
      (agent.brnExpiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );

    // Only notify on threshold days (30, 15, 7, 3, 1)
    if (!ALERT_THRESHOLDS.includes(daysUntilExpiry)) continue;

    try {
      const channels: string[] = [];

      // Send Email notification
      if (agent.email) {
        try {
          const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../emailService.js');
          const template = EMAIL_TEMPLATES.reraExpiry(
            agent.name || 'Agent',
            agent.brnNumber,
            agent.brnExpiry.toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai' }),
            String(daysUntilExpiry),
          );

          await sendEmailTracked({
            to: agent.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
            tags: [{ name: 'type', value: 'rera_expiry' }],
          });
          channels.push('email');
        } catch (emailErr) {
          logger.warn('Failed to send BRN expiry email', { agentId: agent.id, error: emailErr });
        }
      }

      // Send WhatsApp notification
      if (agent.phone) {
        try {
          const { createMetaAPIClient } = await import('../whatsapp/metaAPI.js');
          const { normalizePhone, WHATSAPP_TEMPLATES, getTemplateParams } = await import(
            '../whatsapp/whatsappUtils.js'
          );

          const phone = normalizePhone(agent.phone);
          const metaConfig = {
            accessToken: process.env.META_ACCESS_TOKEN || '',
            businessAccountId: process.env.META_BUSINESS_ACCOUNT_ID || '',
            phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
          };

          if (metaConfig.accessToken && metaConfig.phoneNumberId) {
            const client = createMetaAPIClient(metaConfig);
            const template = WHATSAPP_TEMPLATES.rera_expiry_alert;
            const params = getTemplateParams('rera_expiry_alert', {
              brnNumber: agent.brnNumber,
              daysRemaining: String(daysUntilExpiry),
              expiryDate: agent.brnExpiry.toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai' }),
            });

            await client.sendTemplate(phone, template.name, 'en', params);
            channels.push('whatsapp');
          } else {
            logger.debug('WhatsApp not configured for BRN expiry (dev mode)', { agentId: agent.id });
          }
        } catch (waErr) {
          logger.warn('Failed to send BRN expiry WhatsApp', { agentId: agent.id, error: waErr });
        }
      }

      // Log activity
      await prisma.activity.create({
        data: {
          type: 'compliance',
          action: 'brn_expiry_alert',
          description: `BRN expiry alert (${daysUntilExpiry} days) sent to ${agent.name || agent.email} via ${channels.join(', ') || 'none'}`,
          metadata: JSON.stringify({
            brnNumber: agent.brnNumber,
            daysUntilExpiry,
            channels,
            expiryDate: agent.brnExpiry.toISOString(),
          }),
          userId: agent.id,
        },
      });

      result.notified++;
      result.agents.push({
        id: agent.id,
        name: agent.name || 'Unknown',
        brnNumber: agent.brnNumber,
        daysUntilExpiry,
        channel: channels.join(', ') || 'logged_only',
      });

      logger.info('BRN expiry alert sent', {
        agentId: agent.id,
        brnNumber: agent.brnNumber,
        daysUntilExpiry,
        channels,
      });
    } catch (error) {
      result.errors++;
      logger.error('Failed to process BRN expiry alert', {
        agentId: agent.id,
        brnNumber: agent.brnNumber,
        error,
      });
    }
  }

  if (result.notified > 0 || result.errors > 0) {
    logger.info('BRN expiry check complete', {
      checked: expiringAgents.length,
      notified: result.notified,
      errors: result.errors,
    });
  }

  return result;
}

/**
 * Get all agents with their BRN expiry status.
 * Used by the compliance dashboard.
 */
export async function getBRNExpiryReport(): Promise<
  Array<{
    id: string;
    name: string | null;
    email: string;
    brnNumber: string | null;
    brnExpiry: Date | null;
    daysUntilExpiry: number | null;
    status: 'valid' | 'expiring_soon' | 'expired' | 'not_set';
  }>
> {
  const agents = await prisma.user.findMany({
    where: {
      role: { in: ['agent', 'owner'] },
      status: 'active',
    },
    select: {
      id: true,
      name: true,
      email: true,
      brnNumber: true,
      brnExpiry: true,
    },
    orderBy: { brnExpiry: 'asc' },
  });

  const now = new Date();

  return agents.map((agent) => {
    if (!agent.brnNumber || !agent.brnExpiry) {
      return { ...agent, daysUntilExpiry: null, status: 'not_set' as const };
    }

    const daysUntilExpiry = Math.ceil(
      (agent.brnExpiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );

    let status: 'valid' | 'expiring_soon' | 'expired' = 'valid';
    if (daysUntilExpiry <= 0) status = 'expired';
    else if (daysUntilExpiry <= 30) status = 'expiring_soon';

    return { ...agent, daysUntilExpiry, status };
  });
}

// ─── Scheduler ───────────────────────────────────────────────────────────

/**
 * Start the RERA BRN Expiry scheduler.
 * Runs daily to check for expiring BRN registrations.
 */
export function startRERAExpiryScheduler(): NodeJS.Timeout {
  logger.info('Starting RERA BRN expiry scheduler (daily)');

  const interval = setInterval(async () => {
    try {
      await checkBRNExpirations();
    } catch (error) {
      logger.error('RERA BRN expiry scheduler error', { error });
    }
  }, 24 * 60 * 60 * 1000); // Daily

  // Run once on startup (after 60s delay to allow DB connection)
  setTimeout(() => {
    checkBRNExpirations().catch((err) =>
      logger.error('Initial BRN expiry check failed', { error: err }),
    );
  }, 60_000);

  return interval;
}
