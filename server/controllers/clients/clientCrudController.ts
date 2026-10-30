/**
 * Client CRUD Controller
 * Endpoints for client listing, retrieval, creation, modification, and deletion.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { parsePagination } from '../../config/pagination.js';
import {
  RouteRequest,
  VALID_CATEGORIES,
  VALID_STATUSES,
  VALID_TYPES,
  getRouteParam,
} from './clientCommon.js';

export const getClients = async (req: RouteRequest, res: Response): Promise<void> => {
  const {
    status,
    category,
    type,
    search,
    assignedTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query as Record<string, string | undefined>;

  const {
    page: pageNum,
    limit,
    skip,
  } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  const where: Prisma.ClientWhereInput = {};

  if (status && status !== 'all') {
    where.status = status as string;
  }
  if (category && category !== 'all') {
    where.category = category as string;
  }
  if (type && type !== 'all') {
    where.type = type as string;
  }
  if (assignedTo) {
    where.assignedToId = assignedTo as string;
  }
  if (search) {
    const s = String(search);
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { email: { contains: s, mode: 'insensitive' } },
      { company: { contains: s, mode: 'insensitive' } },
      { phone: { contains: s, mode: 'insensitive' } },
    ];
  }

  // Validate sort field
  const allowedSortFields = ['createdAt', 'name', 'totalValue', 'lastContact', 'dealsCount'];
  const safeSortBy = allowedSortFields.includes(sortBy as string)
    ? (sortBy as string)
    : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeSortOrder },
      include: {
        clientProperties: true,
        _count: { select: { communications: true } },
      },
    }),
    prisma.client.count({ where }),
  ]);

  res.json({
    success: true,
    data: clients,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      clientProperties: true,
      communications: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: { select: { communications: true, clientProperties: true } },
    },
  });

  if (!client) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  res.json({ success: true, data: client });
};

export const createClient = async (req: RouteRequest, res: Response): Promise<void> => {
  const {
    name,
    email,
    phone,
    company,
    category,
    status,
    type,
    nationality,
    notes,
    tags,
    assignedToId,
    convertedFromLeadId,
  } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Client name is required' });
    return;
  }

  // Validate enums
  if (category && !VALID_CATEGORIES.includes(category)) {
    res.status(400).json({
      success: false,
      error: `Invalid category. Must be: ${VALID_CATEGORIES.join(', ')}`,
    });
    return;
  }
  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      success: false,
      error: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }
  if (type && !VALID_TYPES.includes(type)) {
    res.status(400).json({
      success: false,
      error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}`,
    });
    return;
  }

  const client = await prisma.client.create({
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      category: category || 'buyer',
      status: status || 'active',
      type: type || 'individual',
      nationality: nationality?.trim() || null,
      notes: notes?.trim() || null,
      tags: Array.isArray(tags) ? tags : [],
      assignedToId: assignedToId || null,
      convertedFromLeadId: convertedFromLeadId || null,
    },
  });

  res.status(201).json({ success: true, data: client });
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const existing = await prisma.client.findUnique({ where: { id: clientId } });
  if (!existing) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  const {
    name,
    email,
    phone,
    company,
    category,
    status,
    type,
    nationality,
    totalValue,
    dealsCount,
    notes,
    tags,
    assignedToId,
    lastContact,
  } = req.body;

  // Validate enums if provided
  if (category && !VALID_CATEGORIES.includes(category)) {
    res.status(400).json({
      success: false,
      error: `Invalid category. Must be: ${VALID_CATEGORIES.join(', ')}`,
    });
    return;
  }
  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      success: false,
      error: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }
  if (type && !VALID_TYPES.includes(type)) {
    res.status(400).json({
      success: false,
      error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}`,
    });
    return;
  }

  const updateData: Prisma.ClientUpdateInput = {};
  if (name !== undefined) updateData.name = name.trim();
  if (email !== undefined) updateData.email = email?.trim() || null;
  if (phone !== undefined) updateData.phone = phone?.trim() || null;
  if (company !== undefined) updateData.company = company?.trim() || null;
  if (category !== undefined) updateData.category = category;
  if (status !== undefined) updateData.status = status;
  if (type !== undefined) updateData.type = type;
  if (nationality !== undefined) updateData.nationality = nationality?.trim() || null;
  if (totalValue !== undefined) updateData.totalValue = Number(totalValue);
  if (dealsCount !== undefined) updateData.dealsCount = Number(dealsCount);
  if (notes !== undefined) updateData.notes = notes?.trim() || null;
  if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
  if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null;
  if (lastContact !== undefined)
    updateData.lastContact = lastContact ? new Date(lastContact) : null;

  const client = await prisma.client.update({
    where: { id: clientId },
    data: updateData,
  });

  res.json({ success: true, data: client });
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const existing = await prisma.client.findUnique({ where: { id: clientId } });
  if (!existing) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  // Prevent deleting clients with active property links
  const activeLinks = await prisma.clientProperty.count({
    where: { clientId, relationship: { in: ['owner', 'tenant', 'buyer'] } },
  });
  if (activeLinks > 0) {
    res.status(400).json({
      success: false,
      error: `Cannot delete client with ${activeLinks} active property link(s). Remove links first.`,
    });
    return;
  }

  // Cascade: delete communications and property links, then client
  await prisma.$transaction([
    prisma.communication.deleteMany({ where: { clientId } }),
    prisma.clientProperty.deleteMany({ where: { clientId } }),
    prisma.client.delete({ where: { id: clientId } }),
  ]);

  res.json({ success: true, data: { id: clientId } });
};

