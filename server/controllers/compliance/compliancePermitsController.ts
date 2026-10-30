/**
 * compliancePermitsController.ts
 * Handlers for Trakheesi property permits, alerts, register updates, and enforcement runs.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { getPermitAlerts } from '../../services/compliance/permitAlertScheduler.js';
import { enforcePropertyPermitCompliance } from '../../services/compliance/propertyPermitEnforcementScheduler.js';
import { normalizeMetadata } from './complianceCommon.js';

const db = prisma as any;

export async function getPermitAlertsHandler(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — permit alerts require manager role', 403);
  }

  const parsedDaysAhead = parseInt(String(req.query.daysAhead || '30'), 10);
  if (!Number.isFinite(parsedDaysAhead) || parsedDaysAhead < 1 || parsedDaysAhead > 365) {
    throw new AppError('daysAhead must be a number between 1 and 365', 400);
  }

  const permitAlerts = await getPermitAlerts(parsedDaysAhead);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        ...permitAlerts.summary,
      },
      listingPermitIssues: permitAlerts.listingPermitIssues,
      brnPermitAlerts: permitAlerts.brnPermitAlerts,
    },
  });
}

export async function getPermitsList(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — permit register requires manager role', 403);
  }

  const statusFilter = String(req.query.status || 'all').toLowerCase();
  if (!['all', 'missing', 'complete'].includes(statusFilter)) {
    throw new AppError('status must be one of: all, missing, complete', 400);
  }

  const limit = Math.max(1, Math.min(500, parseInt(String(req.query.limit || '100'), 10) || 100));

  const missingWhere = {
    OR: [
      { municipalityNumber: null },
      { municipalityNumber: '' },
      { buildingPermitNumber: null },
      { buildingPermitNumber: '' },
    ],
  };

  const where =
    statusFilter === 'missing'
      ? missingWhere
      : statusFilter === 'complete'
        ? { NOT: missingWhere }
        : {};

  const [properties, totalProperties, missingCount] = await Promise.all([
    db.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        location: true,
        area: true,
        municipalityNumber: true,
        plotNumber: true,
        buildingPermitNumber: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    }),
    db.property.count(),
    db.property.count({ where: missingWhere }),
  ]);

  const data = properties.map((p: any) => {
    const permitStatus =
      !p.municipalityNumber ||
      !String(p.municipalityNumber).trim() ||
      !p.buildingPermitNumber ||
      !String(p.buildingPermitNumber).trim()
        ? 'missing'
        : 'complete';

    return {
      id: p.id,
      title: p.title,
      listingStatus: p.status,
      location: p.location,
      area: p.area,
      municipalityNumber: p.municipalityNumber,
      plotNumber: p.plotNumber,
      buildingPermitNumber: p.buildingPermitNumber,
      permitStatus,
      updatedAt: p.updatedAt,
    };
  });

  res.status(200).json({
    success: true,
    data,
    summary: {
      totalProperties,
      missingPermits: missingCount,
      completePermits: Math.max(0, totalProperties - missingCount),
      filter: statusFilter,
    },
  });
}

export async function runPermitEnforcement(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — permit enforcement requires manager role', 403);
  }

  const dryRun = req.body?.dryRun === true;
  const limitRaw = req.body?.limit;
  const limit =
    limitRaw === undefined
      ? undefined
      : Math.max(1, Math.min(2000, parseInt(String(limitRaw), 10) || 500));

  const result = await enforcePropertyPermitCompliance({ dryRun, limit });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: dryRun ? 'permit_enforcement_dry_run' : 'permit_enforcement_triggered',
      description: dryRun
        ? `Permit enforcement dry-run executed: scanned=${result.scanned}`
        : `Permit enforcement executed: autoUnpublished=${result.autoUnpublished}`,
      userId: req.user?.id || null,
      metadata: {
        ...result,
        requestedAt: new Date().toISOString(),
      },
    },
  });

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function getEnforcementHistory(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — permit enforcement history requires manager role', 403);
  }

  const limit = Math.max(1, Math.min(200, parseInt(String(req.query.limit || '25'), 10) || 25));

  const runs = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: {
        in: ['permit_enforcement_dry_run', 'permit_enforcement_triggered'],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, role: true, email: true } },
    },
  });

  const data = runs.map((run: any) => {
    const metadata = normalizeMetadata(run.metadata);
    return {
      id: run.id,
      action: run.action,
      description: run.description,
      createdAt: run.createdAt,
      user: run.user,
      summary: {
        scanned: Number(metadata.scanned || 0),
        autoUnpublished: Number(metadata.autoUnpublished || 0),
        errors: Number(metadata.errors || 0),
        dryRun: metadata.dryRun === true,
        affectedPropertyIds: Array.isArray(metadata.affectedPropertyIds)
          ? metadata.affectedPropertyIds
          : [],
      },
    };
  });

  res.status(200).json({
    success: true,
    data,
    summary: {
      total: data.length,
      liveRuns: data.filter((r: any) => r.action === 'permit_enforcement_triggered').length,
      dryRuns: data.filter((r: any) => r.action === 'permit_enforcement_dry_run').length,
    },
  });
}

export async function updatePropertyPermit(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — permit updates require manager role', 403);
  }

  const { propertyId } = req.params as Record<string, string>;
  const { municipalityNumber, plotNumber, buildingPermitNumber } = req.body || {};

  if (
    municipalityNumber === undefined &&
    plotNumber === undefined &&
    buildingPermitNumber === undefined
  ) {
    throw new AppError(
      'At least one field is required: municipalityNumber, plotNumber, buildingPermitNumber',
      400
    );
  }

  const existing = await db.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      title: true,
      status: true,
      municipalityNumber: true,
      plotNumber: true,
      buildingPermitNumber: true,
    },
  });

  if (!existing) {
    throw new AppError('Property not found', 404);
  }

  const nextMunicipalityNumber =
    municipalityNumber !== undefined
      ? sanitizeString(String(municipalityNumber || '').trim()) || null
      : existing.municipalityNumber;
  const nextPlotNumber =
    plotNumber !== undefined
      ? sanitizeString(String(plotNumber || '').trim()) || null
      : existing.plotNumber;
  const nextBuildingPermitNumber =
    buildingPermitNumber !== undefined
      ? sanitizeString(String(buildingPermitNumber || '').trim()) || null
      : existing.buildingPermitNumber;

  if (existing.status === 'available' && (!nextMunicipalityNumber || !nextBuildingPermitNumber)) {
    throw new AppError(
      'RERA compliance: available listings require municipalityNumber and buildingPermitNumber',
      400
    );
  }

  const updated = await db.property.update({
    where: { id: propertyId },
    data: {
      municipalityNumber: nextMunicipalityNumber,
      plotNumber: nextPlotNumber,
      buildingPermitNumber: nextBuildingPermitNumber,
    },
    select: {
      id: true,
      title: true,
      status: true,
      municipalityNumber: true,
      plotNumber: true,
      buildingPermitNumber: true,
      updatedAt: true,
    },
  });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'permit_register_updated',
      description: `Permit register updated for property ${updated.title || updated.id}`,
      userId: req.user?.id || null,
      metadata: {
        propertyId: updated.id,
        municipalityNumber: updated.municipalityNumber,
        plotNumber: updated.plotNumber,
        buildingPermitNumber: updated.buildingPermitNumber,
        updatedAt: new Date().toISOString(),
      },
    },
  });

  res.status(200).json({ success: true, data: updated });
}

