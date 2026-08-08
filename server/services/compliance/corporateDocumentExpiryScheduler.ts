import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { notificationService } from '../NotificationService.js';

const db = prisma as any;

const ALERT_THRESHOLDS = [90, 60, 30, 14, 7, 0] as const;
const NOTIFICATION_ROLES = ['owner', 'manager', 'admin', 'finance'] as const;

interface CorporateDocumentFanoutResult {
  inAppRecipients: number;
  emailRecipients: number;
  whatsappRecipients: number;
  deliveryEvents: number;
}

type CorporateDocumentStatus = 'active' | 'expiring_soon' | 'expired' | 'reference_stored' | 'archived';

export interface CorporateDocumentExpiryAlertSummary {
  scanned: number;
  statusUpdated: number;
  alertsCreated: number;
  notificationsQueued: number;
  expiringSoon: number;
  expired: number;
}

export interface CorporateDocumentExpiryTickResult {
  status: 'ran' | 'skipped';
  summary?: CorporateDocumentExpiryAlertSummary;
}

let corporateDocumentExpiryRunInProgress = false;

function calculateDaysUntilExpiry(expiryDate: Date, referenceDate: Date): number {
  return Math.ceil((expiryDate.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000));
}

function deriveCorporateDocumentStatus(expiryDate: Date | null): CorporateDocumentStatus {
  if (!expiryDate) return 'active';

  const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate, new Date());
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 60) return 'expiring_soon';
  return 'active';
}

function toAlertType(daysUntilExpiry: number): string {
  return daysUntilExpiry <= 0 ? 'expiry_threshold_0' : `expiry_threshold_${daysUntilExpiry}`;
}

function buildAlertMessage(documentTitle: string, daysUntilExpiry: number): string {
  if (daysUntilExpiry <= 0) {
    return `${documentTitle} expires today or is overdue and requires immediate renewal.`;
  }

  return `${documentTitle} will expire in ${daysUntilExpiry} day(s).`;
}

async function fanOutCorporateDocumentAlertNotification(args: {
  title: string;
  message: string;
  documentId: string;
  authority: string;
  daysUntilExpiry: number;
}): Promise<CorporateDocumentFanoutResult> {
  const emailEnabled = process.env.CORPORATE_DOCUMENT_ALERT_EMAIL_ENABLED === 'true';
  const whatsappEnabled = process.env.CORPORATE_DOCUMENT_ALERT_WHATSAPP_ENABLED === 'true';

  const recipients = await db.user.findMany({
    where: {
      role: { in: [...NOTIFICATION_ROLES] },
      status: 'active',
    },
    select: { id: true, email: true, phone: true, name: true },
  });

  let emailRecipients = 0;
  let whatsappRecipients = 0;

  await Promise.all(
    recipients.map((recipient: { id: string; email?: string | null; phone?: string | null; name?: string | null }) =>
      notificationService.pushToUser({
        userId: recipient.id,
        title: args.title,
        message: args.message,
        type: args.daysUntilExpiry <= 0 ? 'error' : 'warning',
        channel: 'in_app',
        metadata: {
          documentId: args.documentId,
          authority: args.authority,
          daysUntilExpiry: args.daysUntilExpiry,
        },
      }),
    ),
  );

  if (emailEnabled) {
    try {
      const { sendEmailTracked } = await import('../emailService.js');
      await Promise.all(
        recipients
          .filter((recipient: { email?: string | null }) => Boolean(recipient.email))
          .map(async (recipient: { email?: string | null; name?: string | null }) => {
            await sendEmailTracked({
              to: recipient.email as string,
              subject: args.title,
              html: `<p>${args.message}</p><p><strong>Authority:</strong> ${args.authority}</p>`,
              text: `${args.message} | Authority: ${args.authority}`,
              tags: [{ name: 'type', value: 'corporate_document_expiry' }],
            });
            emailRecipients += 1;
          }),
      );
    } catch (error) {
      logger.warn('Corporate document email fanout failed', { error, documentId: args.documentId });
    }
  }

  if (whatsappEnabled) {
    try {
      const accessToken = process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || '';
      const phoneNumberId = process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
      const businessAccountId = process.env.META_BUSINESS_ACCOUNT_ID || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';

      if (accessToken && phoneNumberId) {
        const { createMetaAPIClient } = await import('../whatsapp/metaAPI.js');
        const { normalizePhone } = await import('../whatsapp/whatsappUtils.js');
        const client = createMetaAPIClient({ accessToken, phoneNumberId, businessAccountId });

        await Promise.all(
          recipients
            .filter((recipient: { phone?: string | null }) => Boolean(recipient.phone))
            .map(async (recipient: { phone?: string | null }) => {
              const phone = normalizePhone(recipient.phone as string);
              if (!phone) {
                return;
              }

              await client.sendText(phone, `${args.title}: ${args.message}`);
              whatsappRecipients += 1;
            }),
        );
      }
    } catch (error) {
      logger.warn('Corporate document WhatsApp fanout failed', {
        error,
        documentId: args.documentId,
      });
    }
  }

  return {
    inAppRecipients: recipients.length,
    emailRecipients,
    whatsappRecipients,
    deliveryEvents: recipients.length + emailRecipients + whatsappRecipients,
  };
}

export async function runCorporateDocumentExpiryCheck(): Promise<CorporateDocumentExpiryAlertSummary> {
  const now = new Date();
  const documents = await db.corporateDocument.findMany({
    where: {
      status: { not: 'archived' },
      expiryDate: { not: null },
    },
    select: {
      id: true,
      title: true,
      authority: true,
      expiryDate: true,
      status: true,
    },
  });

  const summary: CorporateDocumentExpiryAlertSummary = {
    scanned: documents.length,
    statusUpdated: 0,
    alertsCreated: 0,
    notificationsQueued: 0,
    expiringSoon: 0,
    expired: 0,
  };

  for (const document of documents) {
    const expiryDate = document.expiryDate as Date | null;
    if (!expiryDate) {
      continue;
    }

    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate, now);
    const nextStatus = deriveCorporateDocumentStatus(expiryDate);

    if (nextStatus === 'expiring_soon') {
      summary.expiringSoon++;
    }
    if (nextStatus === 'expired') {
      summary.expired++;
    }

    if (document.status !== nextStatus) {
      await db.corporateDocument.update({
        where: { id: document.id },
        data: { status: nextStatus },
      });

      await db.corporateDocumentAuditLog.create({
        data: {
          documentId: document.id,
          action: 'status_change',
          message: `Corporate document status changed from ${document.status} to ${nextStatus}`,
          metadata: {
            previousStatus: document.status,
            nextStatus,
            daysUntilExpiry,
          },
        },
      });

      summary.statusUpdated++;
    }

    const thresholdDays = daysUntilExpiry <= 0 ? 0 : daysUntilExpiry;

    if (!ALERT_THRESHOLDS.includes(thresholdDays as (typeof ALERT_THRESHOLDS)[number])) {
      continue;
    }

    const alertType = toAlertType(thresholdDays);
    const existingAlert = await db.corporateDocumentAlert.findFirst({
      where: {
        documentId: document.id,
        alertType,
      },
    });

    if (existingAlert) {
      continue;
    }

    const message = buildAlertMessage(document.title, daysUntilExpiry);
    await db.corporateDocumentAlert.create({
      data: {
        documentId: document.id,
        alertType,
        status: 'open',
        message,
        dueDate: expiryDate,
        metadata: {
          thresholdDays,
          actualDaysUntilExpiry: daysUntilExpiry,
          generatedAt: now.toISOString(),
        },
      },
    });

    await db.corporateDocumentAuditLog.create({
      data: {
        documentId: document.id,
        action: 'alert_triggered',
        message,
        metadata: {
          thresholdDays,
          actualDaysUntilExpiry: daysUntilExpiry,
          alertType,
        },
      },
    });

    await db.activity.create({
      data: {
        type: 'compliance',
        action: 'corporate_document_expiry_alert',
        description: `${document.title} triggered corporate document expiry alert (${daysUntilExpiry} days)` ,
        metadata: {
          documentId: document.id,
          authority: document.authority,
          thresholdDays,
          actualDaysUntilExpiry: daysUntilExpiry,
          alertType,
        } as any,
      },
    });

    const fanout = await fanOutCorporateDocumentAlertNotification({
      title: daysUntilExpiry <= 0 ? 'Corporate document expired' : 'Corporate document expiry warning',
      message,
      documentId: document.id,
      authority: document.authority,
      daysUntilExpiry,
    });

    summary.alertsCreated++;
    summary.notificationsQueued += fanout.deliveryEvents;
  }

  logger.info('Corporate document expiry check complete', summary);
  return summary;
}

export async function runCorporateDocumentExpirySchedulerTick(): Promise<CorporateDocumentExpiryTickResult> {
  if (corporateDocumentExpiryRunInProgress) {
    logger.info('Corporate document expiry scheduler tick skipped (previous run still active)');
    return { status: 'skipped' };
  }

  corporateDocumentExpiryRunInProgress = true;
  try {
    const summary = await runCorporateDocumentExpiryCheck();
    return { status: 'ran', summary };
  } finally {
    corporateDocumentExpiryRunInProgress = false;
  }
}

export function startCorporateDocumentExpiryScheduler(): NodeJS.Timeout {
  logger.info('Starting corporate document expiry scheduler (daily)');

  const interval = setInterval(
    async () => {
      try {
        await runCorporateDocumentExpirySchedulerTick();
      } catch (error) {
        logger.error('Corporate document expiry scheduler error', { error });
      }
    },
    24 * 60 * 60 * 1000,
  );

  setTimeout(() => {
    runCorporateDocumentExpirySchedulerTick().catch(error => {
      logger.error('Initial corporate document expiry check failed', { error });
    });
  }, 60_000);

  return interval;
}