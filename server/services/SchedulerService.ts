import cron from 'node-cron';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { batchRescoreLeads } from './ai/leadScoringEngine.js';
import { runPermitAlertSchedulerTick } from './compliance/permitAlertScheduler.js';
import { runPropertyPermitEnforcementTick } from './compliance/propertyPermitEnforcementScheduler.js';

type CronJobId = 'lead-rescore-daily' | 'permit-checks-daily' | 'rent-generation-monthly';

interface CronJobInfo {
  id: CronJobId;
  name: string;
  cronExpression: string;
  timezone: string;
  task: cron.ScheduledTask;
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

    this.registerLeadRescoreJob();
    this.registerPermitChecksJob();
    this.registerMonthlyRentGenerationJob();

    this.started = true;
    logger.info('[SchedulerService] started', { jobs: Array.from(this.jobs.keys()) });
  }

  stop(): void {
    for (const job of this.jobs.values()) {
      job.task.stop();
      job.task.destroy();
    }
    this.jobs.clear();
    this.started = false;
    logger.info('[SchedulerService] stopped');
  }

  getStatus(): Array<Omit<CronJobInfo, 'task'>> {
    return Array.from(this.jobs.values()).map(({ task, ...status }) => status);
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

  private async runJob(jobId: CronJobId, jobName: string, handler: () => Promise<Record<string, unknown>>) {
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

  private buildInvoiceNumber(leaseNumber: string | null, dueDate: Date): string {
    const ym = `${dueDate.getUTCFullYear()}${String(dueDate.getUTCMonth() + 1).padStart(2, '0')}`;
    const leaseRef = (leaseNumber || 'LEASE').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `INV-RENT-${leaseRef}-${ym}-${random}`;
  }

  private async logCronEvent(action: string, description: string, metadata: Record<string, unknown>) {
    await prisma.activity.create({
      data: {
        type: 'system',
        action,
        description,
        metadata,
      },
    });
  }
}

export const schedulerService = new SchedulerService();

