/**
 * Scheduled Jobs — White Caves CRM
 * 
 * Lightweight cron-based job scheduler using node-cron.
 * Handles recurring tasks: cleanup, reminders, reports, health checks.
 * 
 * Architecture:
 *   - Each job is a standalone async function
 *   - Jobs are registered with a cron expression
 *   - Jobs are fire-and-forget with error isolation
 *   - Stats tracking for monitoring
 * 
 * Cron Quick Reference:
 *   ┌───── minute (0-59)
 *   │ ┌───── hour (0-23)
 *   │ │ ┌───── day of month (1-31)
 *   │ │ │ ┌───── month (1-12)
 *   │ │ │ │ ┌───── day of week (0-7, Sun=0=7)
 *   * * * * *
 * 
 * Usage:
 *   import { scheduler } from './jobs/scheduler.js';
 *   scheduler.start(); // Call once at server startup
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

// ─── Types ────────────────────────────────────────────────────────────────

interface JobDefinition {
  name: string;
  cron: string;
  handler: () => Promise<void>;
  enabled: boolean;
  /** Timeout in ms — kill if exceeds (default: 5 min) */
  timeout?: number;
}

interface JobStats {
  name: string;
  lastRun: Date | null;
  lastDuration: number | null;
  runCount: number;
  errorCount: number;
  lastError: string | null;
  nextRun: string;
  enabled: boolean;
}

// ─── Lightweight Cron Parser ──────────────────────────────────────────────
// Simple cron scheduling without external deps.
// Supports: specific values, * (all), and basic intervals.

function parseCronField(field: string, min: number, max: number): number[] {
  if (field === '*') return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  if (field.includes('/')) {
    const [, step] = field.split('/');
    const stepN = parseInt(step, 10);
    return Array.from({ length: max - min + 1 }, (_, i) => i + min).filter((v) => v % stepN === 0);
  }
  if (field.includes(',')) {
    return field.split(',').map((v) => parseInt(v, 10));
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }
  return [parseInt(field, 10)];
}

function matchesCron(cron: string, date: Date): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay(); // 0 = Sunday

  const minuteMatch = parseCronField(parts[0], 0, 59).includes(minute);
  const hourMatch = parseCronField(parts[1], 0, 23).includes(hour);
  const dayMatch = parseCronField(parts[2], 1, 31).includes(dayOfMonth);
  const monthMatch = parseCronField(parts[3], 1, 12).includes(month);
  const dowMatch = parseCronField(parts[4], 0, 7).includes(dayOfWeek) || parseCronField(parts[4], 0, 7).includes(dayOfWeek === 0 ? 7 : dayOfWeek);

  return minuteMatch && hourMatch && dayMatch && monthMatch && dowMatch;
}

// ─── Job Definitions ──────────────────────────────────────────────────────

/** Job: Clean up old notifications (daily at 2 AM) */
async function cleanupNotifications(): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const result = await prisma.notification.deleteMany({
    where: {
      OR: [
        { createdAt: { lt: cutoff }, read: true, dismissed: true },
        { expiresAt: { lt: new Date() } },
      ],
    },
  });

  if (result.count > 0) {
    logger.info(`[Job:cleanupNotifications] Deleted ${result.count} old notifications`);
  }
}

/** Job: Clean up old audit logs > 90 days (weekly on Sunday at 3 AM) */
async function cleanupAuditLogs(): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  if (result.count > 0) {
    logger.info(`[Job:cleanupAuditLogs] Deleted ${result.count} audit logs older than 90 days`);
  }
}

/** Job: Check for expiring leases (daily at 8 AM) */
async function checkExpiringLeases(): Promise<void> {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringLeases = await prisma.lease.findMany({
    where: {
      status: { in: ['active', 'expiring'] },
      endDate: { lte: thirtyDaysFromNow, gte: new Date() },
    },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      landlord: { select: { id: true, name: true, email: true } },
      property: { select: { title: true, location: true } },
    },
  });

  if (expiringLeases.length === 0) return;

  // Mark leases as "expiring" if not already
  const idsToUpdate = expiringLeases.filter((l) => l.status === 'active').map((l) => l.id);
  if (idsToUpdate.length > 0) {
    await prisma.lease.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { status: 'expiring' },
    });
  }

  // Create in-app notifications for landlords
  for (const lease of expiringLeases) {
    const daysLeft = Math.ceil((lease.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    try {
      await prisma.notification.create({
        data: {
          type: 'lease_expiry',
          title: `Lease expiring in ${daysLeft} days`,
          message: `Lease for ${lease.property?.title || 'property'} (tenant: ${lease.tenant?.name || 'unknown'}) expires ${lease.endDate.toLocaleDateString()}.`,
          data: { leaseId: lease.id, propertyId: lease.propertyId, daysLeft },
          priority: daysLeft <= 7 ? 'urgent' : daysLeft <= 14 ? 'high' : 'normal',
          actionUrl: `/leases/${lease.id}`,
          userId: lease.landlordId,
        },
      });
    } catch {
      // Notification creation failed — non-critical
    }
  }

  logger.info(`[Job:checkExpiringLeases] Found ${expiringLeases.length} expiring leases, ${idsToUpdate.length} status-updated`);
}

/** Job: Check for upcoming viewings and send reminders (daily at 7 AM) */
async function sendViewingReminders(): Promise<void> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const endOfTomorrow = new Date(startOfTomorrow.getTime() + 24 * 60 * 60 * 1000);

  const viewings = await prisma.viewing.findMany({
    where: {
      scheduledAt: { gte: startOfTomorrow, lt: endOfTomorrow },
      status: { in: ['scheduled', 'confirmed'] },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      property: { select: { title: true, location: true } },
    },
  });

  if (viewings.length === 0) return;

  for (const viewing of viewings) {
    try {
      await prisma.notification.create({
        data: {
          type: 'viewing_confirmed',
          title: 'Viewing tomorrow',
          message: `Reminder: You have a viewing for "${viewing.property?.title || 'property'}" at ${viewing.scheduledAt.toLocaleTimeString()}.`,
          data: { viewingId: viewing.id, propertyId: viewing.propertyId },
          priority: 'high',
          actionUrl: `/viewings/${viewing.id}`,
          userId: viewing.userId,
        },
      });
    } catch {
      // Non-critical
    }
  }

  logger.info(`[Job:sendViewingReminders] Sent ${viewings.length} viewing reminders for tomorrow`);
}

/** Job: Update stale leads (weekly on Monday at 9 AM) */
async function markStaleLeads(): Promise<void> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await prisma.lead.updateMany({
    where: {
      status: { in: ['new', 'contacted'] },
      updatedAt: { lt: thirtyDaysAgo },
    },
    data: { status: 'cold' },
  });

  if (result.count > 0) {
    logger.info(`[Job:markStaleLeads] Marked ${result.count} leads as cold (no activity in 30+ days)`);
  }
}

/** Job: Database health check (every 5 minutes) */
async function healthCheck(): Promise<void> {
  try {
    // Simple query to verify DB connectivity
    await prisma.user.count();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`[Job:healthCheck] Database health check FAILED: ${msg}`);
  }
}

// ─── Job Registry ─────────────────────────────────────────────────────────

const JOBS: JobDefinition[] = [
  {
    name: 'healthCheck',
    cron: '*/5 * * * *',  // Every 5 minutes
    handler: healthCheck,
    enabled: true,
    timeout: 10_000, // 10s
  },
  {
    name: 'cleanupNotifications',
    cron: '0 2 * * *',    // Daily at 2:00 AM
    handler: cleanupNotifications,
    enabled: true,
  },
  {
    name: 'cleanupAuditLogs',
    cron: '0 3 * * 0',    // Weekly Sunday at 3:00 AM
    handler: cleanupAuditLogs,
    enabled: true,
  },
  {
    name: 'checkExpiringLeases',
    cron: '0 8 * * *',    // Daily at 8:00 AM
    handler: checkExpiringLeases,
    enabled: true,
  },
  {
    name: 'sendViewingReminders',
    cron: '0 7 * * *',    // Daily at 7:00 AM
    handler: sendViewingReminders,
    enabled: true,
  },
  {
    name: 'markStaleLeads',
    cron: '0 9 * * 1',    // Weekly Monday at 9:00 AM
    handler: markStaleLeads,
    enabled: true,
  },
];

// ─── Scheduler ──────────────────────────────────────────────────────────

class Scheduler {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private stats: Map<string, { lastRun: Date | null; lastDuration: number | null; runCount: number; errorCount: number; lastError: string | null }> = new Map();
  private running = false;

  constructor() {
    // Initialize stats for all jobs
    for (const job of JOBS) {
      this.stats.set(job.name, { lastRun: null, lastDuration: null, runCount: 0, errorCount: 0, lastError: null });
    }
  }

  /**
   * Start the scheduler. Call once at server startup.
   * Checks every 60 seconds if any jobs should run.
   */
  start(): void {
    if (this.running) return;
    this.running = true;

    logger.info(`[Scheduler] Started with ${JOBS.filter((j) => j.enabled).length} jobs enabled`);
    for (const job of JOBS.filter((j) => j.enabled)) {
      logger.debug(`[Scheduler] Registered: ${job.name} (${job.cron})`);
    }

    // Check every 60 seconds
    this.intervalId = setInterval(() => {
      this.tick();
    }, 60_000);

    // Initial tick after 5 seconds (let server fully start)
    setTimeout(() => this.tick(), 5_000);
  }

  /**
   * Stop the scheduler (for graceful shutdown)
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
    logger.info('[Scheduler] Stopped');
  }

  /**
   * Manual tick — check all jobs and run if due
   */
  private tick(): void {
    const now = new Date();

    for (const job of JOBS) {
      if (!job.enabled) continue;
      if (!matchesCron(job.cron, now)) continue;

      // Prevent re-running within the same minute
      const stat = this.stats.get(job.name);
      if (stat?.lastRun) {
        const diffMs = now.getTime() - stat.lastRun.getTime();
        if (diffMs < 60_000) continue;
      }

      // Run job (fire-and-forget with timeout)
      this.runJob(job);
    }
  }

  private async runJob(job: JobDefinition): Promise<void> {
    const stat = this.stats.get(job.name)!;
    const start = Date.now();

    try {
      const timeout = job.timeout || 300_000; // Default 5 min
      await Promise.race([
        job.handler(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Job ${job.name} timed out after ${timeout}ms`)), timeout)),
      ]);

      stat.lastRun = new Date();
      stat.lastDuration = Date.now() - start;
      stat.runCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      stat.lastRun = new Date();
      stat.lastDuration = Date.now() - start;
      stat.errorCount++;
      stat.lastError = msg;
      logger.error(`[Scheduler] Job ${job.name} failed`, { error: msg, duration: stat.lastDuration });
    }
  }

  /**
   * Get stats for all jobs
   */
  getStats(): JobStats[] {
    return JOBS.map((job) => {
      const stat = this.stats.get(job.name)!;
      return {
        name: job.name,
        lastRun: stat.lastRun,
        lastDuration: stat.lastDuration,
        runCount: stat.runCount,
        errorCount: stat.errorCount,
        lastError: stat.lastError,
        nextRun: job.cron,
        enabled: job.enabled,
      };
    });
  }

  /**
   * Run a specific job on demand (admin trigger)
   */
  async runNow(jobName: string): Promise<{ success: boolean; duration: number; error?: string }> {
    const job = JOBS.find((j) => j.name === jobName);
    if (!job) {
      return { success: false, duration: 0, error: `Job "${jobName}" not found` };
    }
    const start = Date.now();
    try {
      await job.handler();
      return { success: true, duration: Date.now() - start };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, duration: Date.now() - start, error: msg };
    }
  }
}

// Singleton
export const scheduler = new Scheduler();
export default scheduler;
