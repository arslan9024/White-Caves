import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

export interface PropertyPermitEnforcementSummary {
  scanned: number;
  autoUnpublished: number;
  errors: number;
  dryRun: boolean;
  affectedPropertyIds: string[];
}

export interface PropertyPermitEnforcementOptions {
  dryRun?: boolean;
  limit?: number;
}

let permitEnforcementRunInProgress = false;

export interface PropertyPermitEnforcementTickResult {
  status: 'ran' | 'skipped';
  summary?: PropertyPermitEnforcementSummary;
}

export async function enforcePropertyPermitCompliance(
  options: PropertyPermitEnforcementOptions = {}
): Promise<PropertyPermitEnforcementSummary> {
  const dryRun = options.dryRun === true;
  const limit = Math.max(1, Math.min(2000, Math.trunc(options.limit || 500)));

  const nonCompliantListings = await prisma.property.findMany({
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
      userId: true,
    },
    orderBy: { updatedAt: 'asc' },
    take: limit,
  });

  const summary: PropertyPermitEnforcementSummary = {
    scanned: nonCompliantListings.length,
    autoUnpublished: 0,
    errors: 0,
    dryRun,
    affectedPropertyIds: [],
  };

  if (nonCompliantListings.length === 0) {
    logger.info('Property permit enforcement check complete: no non-compliant available listings');
    return summary;
  }

  if (dryRun) {
    logger.info('Property permit enforcement dry-run complete', {
      scanned: summary.scanned,
      ids: nonCompliantListings.map(p => p.id),
    });
    return {
      ...summary,
      affectedPropertyIds: nonCompliantListings.map(p => p.id),
    };
  }

  for (const property of nonCompliantListings) {
    try {
      await prisma.property.update({
        where: { id: property.id },
        data: { status: 'off_market' },
      });

      await prisma.activity.create({
        data: {
          type: 'compliance',
          action: 'property_auto_unpublished_permit_noncompliant',
          description: `Property auto-unpublished due to missing permit compliance fields: ${property.title || property.id}`,
          metadata: {
            propertyId: property.id,
            previousStatus: property.status,
            nextStatus: 'off_market',
            municipalityNumber: property.municipalityNumber,
            buildingPermitNumber: property.buildingPermitNumber,
            reason: 'missing_required_permit_fields_for_available_listing',
            automatedAt: new Date().toISOString(),
          } as any,
          userId: property.userId || undefined,
        },
      });

      summary.autoUnpublished += 1;
      summary.affectedPropertyIds.push(property.id);
    } catch (error) {
      summary.errors += 1;
      logger.error('Property permit enforcement failed for listing', {
        propertyId: property.id,
        error,
      });
    }
  }

  logger.info('Property permit enforcement check complete', summary);
  return summary;
}

export async function runPropertyPermitEnforcementTick(
  options: PropertyPermitEnforcementOptions = {}
): Promise<PropertyPermitEnforcementTickResult> {
  if (permitEnforcementRunInProgress) {
    logger.info('Property permit enforcement tick skipped (previous run still active)');
    return { status: 'skipped' };
  }

  permitEnforcementRunInProgress = true;
  try {
    const summary = await enforcePropertyPermitCompliance(options);
    return { status: 'ran', summary };
  } finally {
    permitEnforcementRunInProgress = false;
  }
}

export function startPropertyPermitEnforcementScheduler(): NodeJS.Timeout {
  logger.info('Starting property permit enforcement scheduler (daily)');

  const interval = setInterval(
    async () => {
      try {
        await runPropertyPermitEnforcementTick();
      } catch (error) {
        logger.error('Property permit enforcement scheduler error', { error });
      }
    },
    24 * 60 * 60 * 1000
  );

  // Startup run after DB stabilization.
  setTimeout(() => {
    runPropertyPermitEnforcementTick().catch(err =>
      logger.error('Initial property permit enforcement run failed', { error: err })
    );
  }, 75_000);

  return interval;
}
