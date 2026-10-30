/**
 * leadQueryController.ts
 * Query handlers for lead listing, search/filter, and individual lead detail.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { parsePagination } from '../../config/pagination.js';
import {
  RouteRequest,
  VALID_LEAD_STATUSES,
  VALID_LEAD_SOURCES,
  routeParamToString,
} from './leadCommon.js';

export async function listLeads(req: RouteRequest, res: Response): Promise<void> {
  const {
    status,
    source,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    minScore,
    maxScore,
    assignedTo,
  } = req.query as Record<string, string | undefined>;

  const {
    page: pageNum,
    limit,
    skip,
  } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  const where: Prisma.LeadWhereInput = {};

  if (
    status &&
    status !== 'all' &&
    !VALID_LEAD_STATUSES.includes(status as (typeof VALID_LEAD_STATUSES)[number])
  ) {
    throw new AppError(`Invalid status filter: ${String(status)}`, 422);
  }
  if (
    source &&
    source !== 'all' &&
    !VALID_LEAD_SOURCES.includes(source as (typeof VALID_LEAD_SOURCES)[number])
  ) {
    throw new AppError(`Invalid source filter: ${String(source)}`, 422);
  }

  if (status && status !== 'all') {
    where.status = status as string;
  }
  if (source && source !== 'all') {
    where.source = source as string;
  }
  if (assignedTo) {
    where.assignedToId = assignedTo as string;
  }

  const ownerFilter = (req as any).ownershipFilter ?? {};
  if (Object.keys(ownerFilter).length > 0) {
    Object.assign(where, ownerFilter);
  }

  if (minScore || maxScore) {
    where.score = {};
    if (minScore) {
      const parsed = parseInt(minScore as string, 10);
      if (!isNaN(parsed)) where.score.gte = parsed;
    }
    if (maxScore) {
      const parsed = parseInt(maxScore as string, 10);
      if (!isNaN(parsed)) where.score.lte = parsed;
    }
  }

  if (search) {
    const s = sanitizeString(String(search)).trim().slice(0, 120);
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { email: { contains: s, mode: 'insensitive' } },
      { company: { contains: s, mode: 'insensitive' } },
      { phone: { contains: s, mode: 'insensitive' } },
    ];
  }

  const validSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'score', 'budget'];
  const field = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
  const orderBy: Prisma.LeadOrderByWithRelationInput = {
    [field]: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
        _count: { select: { activities: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getLeadById(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, phone: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      property: {
        select: { id: true, title: true, type: true, status: true, price: true, location: true },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { id: true, name: true } } },
      },
      commissions: {
        select: { id: true, amount: true, status: true, percentage: true, createdAt: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead) throw new AppError('Lead not found', 404);

  res.status(200).json({ success: true, data: lead });
}

