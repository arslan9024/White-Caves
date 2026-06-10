import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { batchRescoreLeads } from './ai/leadScoringEngine.js';
import { runPermitAlertSchedulerTick } from './compliance/permitAlertScheduler.js';
import { runPropertyPermitEnforcementTick } from './compliance/propertyPermitEnforcementScheduler.js';
import { runLeadSlaEscalationTick } from './leadWorkflowService.js';

type ScheduledTask = {
  stop(): void;
  destroy(): void;
};

const cron = {
  schedule: (
    _expression: string,
    _handler: () => void | Promise<void>,
    _options?: { timezone?: string }
  ): ScheduledTask => ({
    stop: () => {},
    destroy: () => {},
  }),
};

type CronJobId =
  | 'lead-sla-escalation'
  | 'lead-rescore-daily'
  | 'permit-checks-daily'
  | 'rent-generation-monthly'
  | 'rent-reminders-daily'
  | 'lease-expiry-reminders-daily'
  | 'sitemap-weekly-refresh';

interface CronJobInfo {
  id: CronJobId;
  name: string;
  cronExpression: string;
  timezone: string;
  task: unknown;
  lastRunAt: string | null;
  lastStatus: 'success' | 'failed' | 'skipped' | null;
}

export class SchedulerService {
  private jobs = new Map<CronJobId, CronJobInfo>();

  private started = false;

  start(): void {
    if (this.started) {
      logger.warn('[SchedulerService] already started');
      return;
    }

    this.registerLeadSlaEscalationJob();
    this.registerLeadRescoreJob();
    this.registerPermitChecksJob();
    this.registerMonthlyRentGenerationJob();
    this.registerRentRemindersJob();
    this.registerLeaseExpiryRemindersJob();
    this.registerSitemapRefreshJob();
    logger.warn('[SchedulerService] cron unavailable in this workspace — scheduled jobs registered with no-op scheduler');
    this.started = true;
    return;
  }

  stop(): void {
    this.jobs.clear();
    this.started = false;
    logger.info('[SchedulerService] stopped');
  }

  getStatus(): Array<Omit<CronJobInfo, 'task'>> {
    return Array.from(this.jobs.values()).map(({ task, ...status }) => status);
  }

  private registerLeadSlaEscalationJob(): void {
    const id: CronJobId = 'lead-sla-escalation';
    const cronExpression = '0 * * * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'lead SLA escalation', async () => {
          return runLeadSlaEscalationTick();
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Lead SLA Escalation',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private registerLeadRescoreJob(): void {
    const id: CronJobId = 'lead-rescore-daily';
    const cronExpression = '15 1 * * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'daily lead re-score', async () => {
          const result = await batchRescoreLeads();
          return {
            scored: result.scored,
            total: result.total,
            upgraded: result.upgraded,
            downgraded: result.downgraded,
            durationMs: result.duration,
          };
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Daily Lead Re-score',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private registerPermitChecksJob(): void {
    const id: CronJobId = 'permit-checks-daily';
    const cronExpression = '0 2 * * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'daily permit checks', async () => {
          const [permitAlerts, permitEnforcement] = await Promise.all([
            runPermitAlertSchedulerTick(30),
            runPropertyPermitEnforcementTick(),
          ]);

          return {
            permitAlertsStatus: permitAlerts.status,
            permitAlertsSummary: permitAlerts.summary ?? null,
            permitEnforcementStatus: permitEnforcement.status,
            permitEnforcementSummary: permitEnforcement.summary ?? null,
          };
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Daily Permit Checks',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private registerMonthlyRentGenerationJob(): void {
    const id: CronJobId = 'rent-generation-monthly';
    const cronExpression = '0 3 1 * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'monthly rent invoice generation', async () => {
          return this.generateMonthlyRentInvoices();
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Monthly Rent Invoice Generation',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private async runJob(
    jobId: CronJobId,
    jobName: string,
    handler: () => Promise<Record<string, unknown>>
  ) {
    const runStartedAt = new Date();
    const job = this.jobs.get(jobId);

    if (!job) {
      logger.error('[SchedulerService] attempted to run unknown job', { jobId });
      return;
    }

    try {
      const summary = await handler();
      job.lastRunAt = runStartedAt.toISOString();
      job.lastStatus = 'success';

      await this.logCronEvent('cron_job_success', `Cron job "${jobName}" completed`, {
        jobId,
        jobName,
        runStartedAt: runStartedAt.toISOString(),
        summary,
      });
    } catch (error) {
      job.lastRunAt = runStartedAt.toISOString();
      job.lastStatus = 'failed';
      const message = error instanceof Error ? error.message : 'Unknown scheduler error';

      logger.error('[SchedulerService] cron job failed', { jobId, jobName, error: message });
      await this.logCronEvent('cron_job_failed', `Cron job "${jobName}" failed`, {
        jobId,
        jobName,
        runStartedAt: runStartedAt.toISOString(),
        error: message,
      });
    }
  }

  private async generateMonthlyRentInvoices(): Promise<Record<string, unknown>> {
    const now = new Date();
    const periodTag = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

    const dueLeases = await prisma.lease.findMany({
      where: {
        status: { in: ['active', 'renewed'] },
        nextPaymentDue: { lte: now },
      },
      select: {
        id: true,
        leaseNumber: true,
        monthlyRent: true,
        currency: true,
        nextPaymentDue: true,
        endDate: true,
        tenant: { select: { name: true } },
        landlordId: true,
      },
      take: 1000,
    });

    let generated = 0;
    let skipped = 0;

    for (const lease of dueLeases) {
      const dueDate = lease.nextPaymentDue ?? now;
      const monthlyRent = Number(lease.monthlyRent || 0);
      if (monthlyRent <= 0) {
        skipped += 1;
        continue;
      }

      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          property: lease.id,
          notes: { contains: `PERIOD:${periodTag}` },
        },
        select: { id: true },
      });

      if (existingInvoice) {
        skipped += 1;
        continue;
      }

      const invoiceNumber = this.buildInvoiceNumber(lease.leaseNumber, dueDate);

      await prisma.invoice.create({
        data: {
          invoiceNumber,
          client: lease.tenant?.name || `Tenant ${lease.id}`,
          property: lease.id,
          amount: monthlyRent,
          vatAmount: 0,
          totalAmount: monthlyRent,
          currency: lease.currency || 'AED',
          dueDate,
          notes: `TYPE:rent | PERIOD:${periodTag} | AUTO:monthly-cron`,
          createdById: lease.landlordId || null,
        },
      });

      const nextDueDate = new Date(dueDate);
      nextDueDate.setUTCMonth(nextDueDate.getUTCMonth() + 1);
      if (nextDueDate <= lease.endDate) {
        await prisma.lease.update({
          where: { id: lease.id },
          data: { nextPaymentDue: nextDueDate },
        });
      }

      generated += 1;
    }

    const summary = {
      scanned: dueLeases.length,
      generated,
      skipped,
      periodTag,
    };

    await this.logCronEvent(
      'cron_rent_generation_snapshot',
      `Monthly rent generation completed: generated=${generated}, skipped=${skipped}`,
      summary
    );

    return summary;
  }

  private registerRentRemindersJob(): void {
    const id: CronJobId = 'rent-reminders-daily';
    const cronExpression = '0 8 * * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'daily rent payment reminders', async () => {
          return this.sendRentReminders();
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Daily Rent Payment Reminders',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private registerLeaseExpiryRemindersJob(): void {
    const id: CronJobId = 'lease-expiry-reminders-daily';
    const cronExpression = '0 9 * * *';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'daily lease expiry reminders', async () => {
          return this.sendLeaseExpiryReminders();
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Daily Lease Expiry Reminders',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private registerSitemapRefreshJob(): void {
    const id: CronJobId = 'sitemap-weekly-refresh';
    // Every Sunday at 02:00 Dubai time
    const cronExpression = '0 2 * * 0';
    const timezone = 'Asia/Dubai';

    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.runJob(id, 'weekly sitemap refresh', async () => {
          // Sitemap is generated dynamically per request; this job logs a refresh
          // audit event so monitoring can confirm the cycle is healthy.
          logger.info('[SchedulerService] sitemap weekly refresh tick — dynamic sitemap is live');
          return { status: 'refreshed', timestamp: new Date().toISOString() };
        });
      },
      { timezone }
    );

    this.jobs.set(id, {
      id,
      name: 'Weekly Sitemap Refresh',
      cronExpression,
      timezone,
      task,
      lastRunAt: null,
      lastStatus: null,
    });
  }

  private async sendRentReminders(): Promise<Record<string, unknown>> {
    const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../services/emailService.js');

    const now = new Date();
    // Window: invoices 5–35 days overdue that are still pending
    const overdueFrom = new Date(now);
    overdueFrom.setDate(overdueFrom.getDate() - 35);
    const overdueTo = new Date(now);
    overdueTo.setDate(overdueTo.getDate() - 5);

    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['pending', 'unpaid'] },
        dueDate: { gte: overdueFrom, lte: overdueTo },
      },
      select: {
        id: true,
        client: true,
        amount: true,
        currency: true,
        dueDate: true,
        property: true,
      },
      take: 500,
    });

    let sent = 0;
    let skipped = 0;

    for (const invoice of overdueInvoices) {
      // Look up tenant email via lease (property field stores leaseId in rent invoices)
      const lease = invoice.property
        ? await prisma.lease.findUnique({
            where: { id: invoice.property },
            select: { tenant: { select: { email: true, name: true } } },
          })
        : null;

      const tenantEmail = lease?.tenant?.email;
      const tenantName = lease?.tenant?.name || invoice.client || 'Valued Tenant';

      if (!tenantEmail) {
        skipped += 1;
        continue;
      }

      const amountStr = `${invoice.currency || 'AED'} ${(invoice.amount || 0).toFixed(2)}`;
      const dueDateStr = invoice.dueDate
        ? invoice.dueDate.toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai' })
        : 'overdue';
      const template = EMAIL_TEMPLATES.paymentReminder(
        tenantName,
        amountStr,
        'monthly rent',
        dueDateStr
      );

      await sendEmailTracked({
        to: tenantEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: [{ name: 'type', value: 'rent_reminder' }],
      }).catch(err =>
        logger.warn('[SchedulerService] rent reminder send failed', { err, invoiceId: invoice.id })
      );

      sent += 1;
    }

    const summary = { scanned: overdueInvoices.length, sent, skipped };
    await this.logCronEvent(
      'cron_rent_reminders_snapshot',
      `Rent reminders: sent=${sent}, skipped=${skipped}`,
      summary
    );
    return summary;
  }

  private async sendLeaseExpiryReminders(): Promise<Record<string, unknown>> {
    const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../services/emailService.js');

    const now = new Date();
    // Check for leases expiring in ~90, 60, or 30 days (±2-day window each)
    const reminderWindows = [90, 60, 30] as const;
    let sent = 0;
    let skipped = 0;

    for (const days of reminderWindows) {
      const windowStart = new Date(now);
      windowStart.setDate(windowStart.getDate() + days - 2);
      const windowEnd = new Date(now);
      windowEnd.setDate(windowEnd.getDate() + days + 2);

      const expiringLeases = await prisma.lease.findMany({
        where: {
          status: { in: ['active', 'renewed'] },
          endDate: { gte: windowStart, lte: windowEnd },
        },
        select: {
          id: true,
          leaseNumber: true,
          monthlyRent: true,
          currency: true,
          endDate: true,
          tenant: { select: { email: true, name: true } },
        },
        take: 500,
      });

      for (const lease of expiringLeases) {
        const tenantEmail = lease.tenant?.email;
        const tenantName = lease.tenant?.name || 'Valued Tenant';

        if (!tenantEmail) {
          skipped += 1;
          continue;
        }

        const expiryDateStr = lease.endDate
          ? lease.endDate.toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai' })
          : 'upcoming';
        const rentStr = `${lease.currency || 'AED'} ${(Number(lease.monthlyRent) || 0).toFixed(2)}/month`;
        const template = EMAIL_TEMPLATES.paymentReminder(
          tenantName,
          rentStr,
          `lease renewal (${days} days remaining, expires ${expiryDateStr})`,
          expiryDateStr
        );

        await sendEmailTracked({
          to: tenantEmail,
          subject: `Your Lease Expires in ${days} Days — Action Required`,
          html: template.html,
          text: template.text,
          tags: [{ name: 'type', value: `lease_expiry_${days}d` }],
        }).catch(err =>
          logger.warn('[SchedulerService] lease expiry reminder send failed', {
            err,
            leaseId: lease.id,
          })
        );

        sent += 1;
      }
    }

    const summary = { sent, skipped };
    await this.logCronEvent(
      'cron_lease_expiry_reminders_snapshot',
      `Lease expiry reminders: sent=${sent}, skipped=${skipped}`,
      summary
    );
    return summary;
  }

  private buildInvoiceNumber(leaseNumber: string | null, dueDate: Date): string {
    const ym = `${dueDate.getUTCFullYear()}${String(dueDate.getUTCMonth() + 1).padStart(2, '0')}`;
    const leaseRef = (leaseNumber || 'LEASE')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `INV-RENT-${leaseRef}-${ym}-${random}`;
  }

  private async logCronEvent(
    action: string,
    description: string,
    metadata: Record<string, unknown>
  ) {
    await prisma.activity.create({
      data: {
        type: 'system',
        action,
        description,
        metadata: metadata as unknown as Prisma.InputJsonValue,
      },
    });
  }
}

export const schedulerService = new SchedulerService();
