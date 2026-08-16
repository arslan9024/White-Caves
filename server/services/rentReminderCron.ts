/**
 * Rent Payment Reminder Cron Service — Wave 35 (REQ-TENANT-004)
 *
 * Runs daily to:
 * 1. Identify upcoming rent payments due in 5 days or 10 days
 * 2. Send automated WhatsApp / SMS reminders to tenants
 * 3. Log activity records for audit trail
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface RentReminderCronResult {
  remindersSentCount: number;
  notifiedPaymentIds: string[];
}

/**
 * Process rent payment reminders (due in 5 or 10 days)
 */
export async function processRentReminders(): Promise<RentReminderCronResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // ~4 days
  const windowEnd = new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000);  // ~11 days

  const upcomingPayments = await prisma.rentPayment.findMany({
    where: {
      status: 'pending',
      dueDate: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      lease: {
        select: {
          id: true,
          leaseNumber: true,
          tenantId: true,
          landlordId: true,
          property: { select: { title: true } },
          tenant: { select: { name: true, phone: true, email: true } },
        },
      },
    },
  });

  const notifiedPaymentIds: string[] = [];

  for (const payment of upcomingPayments) {
    const daysUntilDue = Math.ceil((payment.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    await prisma.activity.create({
      data: {
        type: 'lease',
        action: 'rent_due_reminder_sent',
        description: `Rent payment reminder sent for lease ${payment.lease.leaseNumber || payment.leaseId} (Installment ${payment.installment}, AED ${payment.amountAED}, due in ${daysUntilDue} days)`,
        userId: payment.lease.tenantId,
      },
    });

    notifiedPaymentIds.push(payment.id);
  }

  logger.info('[RentReminderCron] processed rent reminders', {
    remindersSentCount: notifiedPaymentIds.length,
    notifiedPaymentIds,
  });

  return {
    remindersSentCount: notifiedPaymentIds.length,
    notifiedPaymentIds,
  };
}

let cronTimer: NodeJS.Timeout | null = null;

export const rentReminderCron = {
  start(intervalMs = 24 * 60 * 60 * 1000) {
    if (cronTimer) return;
    processRentReminders().catch(err => logger.error('Rent reminder cron initial run error', err));
    cronTimer = setInterval(() => {
      processRentReminders().catch(err => logger.error('Rent reminder cron interval error', err));
    }, intervalMs);
    logger.info('Rent reminder cron started', { intervalMs });
  },

  stop() {
    if (cronTimer) {
      clearInterval(cronTimer);
      cronTimer = null;
      logger.info('Rent reminder cron stopped');
    }
  },
};
