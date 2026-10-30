/**
 * Tenant Query Controller
 * Handlers for tenant listings, tenant statistics, tenant profile retrieval, and leases.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { RouteRequest, routeParamToString } from './tenantCommon.js';

export const getTenants = async (req: RouteRequest, res: Response): Promise<void> => {
  // AUTHORIZATION: Tenant PII restricted to managers/admins
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — tenant data requires manager or above role', 403);
  }

  const {
    page = '1',
    pageSize = '20',
    status,
    search,
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

  const where: Record<string, unknown> = {};
  if (status && status !== 'all') where.status = status as string;
  if (search) {
    const s = search as string;
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { email: { contains: s, mode: 'insensitive' } },
      { phone: { contains: s, mode: 'insensitive' } },
    ];
  }

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limit,
      take: limit,
    }),
    prisma.tenant.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: tenants,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getTenantStats = async (req: RouteRequest, res: Response): Promise<void> => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
    throw new AppError('Access denied — tenant statistics require manager role', 403);
  }
  const [total, byStatus, rentStats] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.tenant.aggregate({ _sum: { monthlyRent: true }, _avg: { monthlyRent: true } }),
  ]);

  const statusCounts: Record<string, number> = {};
  byStatus.forEach(s => {
    statusCounts[s.status] = s._count._all;
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: statusCounts,
      totalMonthlyRent: rentStats._sum.monthlyRent || 0,
      averageRent: Math.round(rentStats._avg.monthlyRent || 0),
    },
  });
};

export const getTenantById = async (req: Request, res: Response): Promise<void> => {
  const tenantId = routeParamToString(req.params.id);
  if (!tenantId) {
    throw new AppError('Tenant ID is required', 400);
  }

  validateIdParam(tenantId, 'Tenant ID');

  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — tenant details require manager or above role', 403);
  }
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new AppError('Tenant not found', 404);
  res.status(200).json({ success: true, data: tenant });
};

export const getTenantLeases = async (req: Request, res: Response): Promise<void> => {
  const tenantId = routeParamToString(req.params.id);
  if (!tenantId) {
    throw new AppError('Tenant ID is required', 400);
  }

  validateIdParam(tenantId, 'Tenant ID');
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new AppError('Tenant not found', 404);

  let property = null;
  if (tenant.propertyId) {
    property = await prisma.property.findUnique({
      where: { id: tenant.propertyId },
      select: { id: true, title: true, location: true, price: true, type: true },
    });
  }

  res.status(200).json({
    success: true,
    data: property
      ? [
          {
            id: `lease-${tenant.id}`,
            propertyId: property.id,
            property: property,
            tenantId: tenant.id,
            monthlyRent: tenant.monthlyRent,
            deposit: tenant.deposit,
            moveInDate: tenant.moveInDate,
            moveOutDate: tenant.moveOutDate,
            status: tenant.status,
          },
        ]
      : [],
  });
};

