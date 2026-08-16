/**
 * Tenant Portal API Routes — Wave 36 (REQ-TENANT-004)
 *
 * Endpoints for authenticated tenant:
 * - GET /api/tenant-portal/overview — Overview dashboard (active lease, upcoming rent, maintenance)
 * - GET /api/tenant-portal/documents — Downloadable Ejari and lease agreement documents
 * - POST /api/tenant-portal/maintenance — Submit tenant maintenance request
 */

import { Router, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/tenant-portal/overview ─────────────────────────────────────
router.get(
  '/overview',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tenantId = req.user?.id;
    if (!tenantId) throw new AppError('Authentication required', 401);

    const activeLease = await prisma.lease.findFirst({
      where: {
        tenantId,
        status: { in: ['active', 'signed'] },
      },
      include: {
        property: {
          select: { id: true, title: true, location: true, images: true },
        },
        rentPayments: {
          orderBy: { dueDate: 'asc' },
          take: 12,
        },
      },
    });

    const recentMaintenance = await prisma.maintenance.findMany({
      where: { requesterId: tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.status(200).json({
      success: true,
      data: {
        activeLease,
        recentMaintenance,
        ejariStatus: activeLease?.ejariStatus || 'not_registered',
        ejariNumber: activeLease?.ejariNumber || null,
      },
    });
  })
);

// ─── GET /api/tenant-portal/documents ────────────────────────────────────
router.get(
  '/documents',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tenantId = req.user?.id;
    if (!tenantId) throw new AppError('Authentication required', 401);

    const leases = await prisma.lease.findMany({
      where: { tenantId },
      select: {
        id: true,
        leaseNumber: true,
        ejariNumber: true,
        ejariStatus: true,
        documents: true,
        addendumDocuments: true,
        startDate: true,
        endDate: true,
      },
    });

    const documentsList = leases.flatMap(lease => [
      ...lease.documents.map((url, i) => ({
        id: `${lease.id}-doc-${i}`,
        type: 'lease_contract',
        name: `Lease Agreement ${lease.leaseNumber || lease.id}`,
        url,
        ejariNumber: lease.ejariNumber,
      })),
      ...lease.addendumDocuments.map((url, i) => ({
        id: `${lease.id}-add-${i}`,
        type: 'addendum',
        name: `Lease Addendum #${i + 1}`,
        url,
        ejariNumber: lease.ejariNumber,
      })),
    ]);

    res.status(200).json({
      success: true,
      data: documentsList,
    });
  })
);

interface TenantMaintenancePayload {
  propertyId: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  images?: string[];
}

function validateTenantMaintenancePayload(body: unknown): TenantMaintenancePayload {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid maintenance request payload', 400);
  }
  const { propertyId, title, description, category, priority, images } = body as Record<string, unknown>;
  if (!propertyId || typeof propertyId !== 'string' || !propertyId.trim()) {
    throw new AppError('propertyId is required and must be a string', 400);
  }
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new AppError('title is required and must be a string', 400);
  }
  return {
    propertyId: propertyId.trim(),
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : undefined,
    category: typeof category === 'string' ? category.trim() : undefined,
    priority: typeof priority === 'string' ? priority.trim() : undefined,
    images: Array.isArray(images) ? images.filter((img): img is string => typeof img === 'string') : undefined,
  };
}

// ─── POST /api/tenant-portal/maintenance ─────────────────────────────────
router.post(
  '/maintenance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tenantId = req.user?.id;
    if (!tenantId) throw new AppError('Authentication required', 401);

    const { propertyId, title, description, category, priority, images } = validateTenantMaintenancePayload(req.body);

    // Default SLA: 4h for emergency, 48h for normal
    const reqPriority = priority || 'medium';
    const slaHours = reqPriority === 'emergency' ? 4 : 48;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const request = await prisma.maintenance.create({
      data: {
        requesterId: tenantId,
        propertyId,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || 'general',
        priority: reqPriority,
        images: images || [],
        slaDeadline,
        status: 'open',
      },
    });

    logger.info('[TenantPortal] maintenance request submitted', {
      tenantId,
      requestId: request.id,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  })
);

export default router;
