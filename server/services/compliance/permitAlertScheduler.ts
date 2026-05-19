import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

export interface PermitAlertSummary {
  daysAhead: number;
  listingPermitIssues: number;
  brnExpired: number;
  brnExpiringSoon: number;
}

export interface PermitAlertResult {
  summary: PermitAlertSummary;
  listingPermitIssues: Array<{
    id: string;
    title: string | null;
    status: string;
    municipalityNumber: string | null;
    buildingPermitNumber: string | null;
    createdAt: Date;
  }>;
  brnPermitAlerts: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    brnNumber: string | null;
    brnExpiry: Date | null;
    status: 'expired' | 'expiring_soon';
    daysToExpiry: number;
  }>;
}

export async function getPermitAlerts(daysAhead = 30): Promise<PermitAlertResult> {
  const parsedDaysAhead = Math.max(1, Math.min(365, Math.trunc(daysAhead || 30)));
  const now = new Date();
  const cutoff = new Date(now.getTime() + parsedDaysAhead * 24 * 60 * 60 * 1000);

  const listingPermitIssues = await prisma.property.findMany({
    where: {
      status: 'available',
      OR: [
        { municipalityNumber: null },
        { municipalityNumber: '' },
        { buildingPermitNumber: null },
        { buildingPermitNumber: '' },
      ],
    },
    select: {
      id: true,
      title: true,
      status: true,
      municipalityNumber: true,
      buildingPermitNumber: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const brnExpiringOrExpired = await prisma.user.findMany({
    where: {
      role: { in: ['agent', 'owner'] },
      status: 'active',
      brnNumber: { not: null },
      brnExpiry: { not: null, lte: cutoff },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      brnNumber: true,
      brnExpiry: true,
    },
    orderBy: { brnExpiry: 'asc' },
    take: 200,
  });

  const brnPermitAlerts = brnExpiringOrExpired.map(agent => {
    const expiry = agent.brnExpiry as Date;
    const daysToExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return {
      ...agent,
      status: (daysToExpiry < 0 ? 'expired' : 'expiring_soon') as 'expired' | 'expiring_soon',
      daysToExpiry,
    };
  });

  return {
    summary: {
      daysAhead: parsedDaysAhead,
      listingPermitIssues: listingPermitIssues.length,
      brnExpired: brnPermitAlerts.filter(a => a.status === 'expired').length,
      brnExpiringSoon: brnPermitAlerts.filter(a => a.status === 'expiring_soon').length,
    },
    listingPermitIssues,
    brnPermitAlerts,
  };
}

export async function checkPermitAlertsAndLog(daysAhead = 30): Promise<PermitAlertSummary> {
  const result = await getPermitAlerts(daysAhead);

  const hasIssues =
    result.summary.listingPermitIssues > 0 ||
    result.summary.brnExpired > 0 ||
    result.summary.brnExpiringSoon > 0;

  if (!hasIssues) {
    logger.info('Permit alert scheduler check complete: no issues found', {
      daysAhead: result.summary.daysAhead,
    });
    return result.summary;
  }

  await prisma.activity.create({
    data: {
      type: 'compliance',
      action: 'permit_alert_snapshot',
      description: `Permit alert snapshot: listings=${result.summary.listingPermitIssues}, brnExpired=${result.summary.brnExpired}, brnExpiringSoon=${result.summary.brnExpiringSoon}`,
      metadata: {
        ...result.summary,
        generatedAt: new Date().toISOString(),
      } as any,
    },
  });

  logger.info('Permit alert scheduler check complete: issues logged', result.summary);
  return result.summary;
}

export function startPermitAlertScheduler(daysAhead = 30): NodeJS.Timeout {
  logger.info('Starting permit alert scheduler (daily)', { daysAhead });

  const interval = setInterval(
    async () => {
      try {
        await checkPermitAlertsAndLog(daysAhead);
      } catch (error) {
        logger.error('Permit alert scheduler error', { error });
      }
    },
    24 * 60 * 60 * 1000
  );

  setTimeout(() => {
    checkPermitAlertsAndLog(daysAhead).catch(err =>
      logger.error('Initial permit alert check failed', { error: err })
    );
  }, 60_000);

  return interval;
}
