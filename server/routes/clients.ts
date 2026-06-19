/**
 * Clients API Routes — Full CRUD + Property Linking + Communication Logs
 * Endpoints: /api/clients
 * Phase 1C: Client/Owner Management
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { parsePagination } from '../config/pagination';
import { requirePermission } from '../middleware/rbac';

const VALID_CATEGORIES = ['buyer', 'seller', 'landlord', 'tenant', 'investor'] as const;
const VALID_STATUSES = ['active', 'inactive', 'prospect', 'archived'] as const;
const VALID_TYPES = ['individual', 'corporate', 'investment_firm'] as const;
const VALID_RELATIONSHIPS = [
  'owner',
  'tenant',
  'buyer',
  'interested',
  'previous_owner',
  'previous_tenant',
] as const;
const VALID_COMM_TYPES = ['call', 'email', 'whatsapp', 'meeting', 'note', 'sms'] as const;

const router = Router();

const getRouteParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }

  return null;
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CLIENT CRUD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€â”€ GET /api/clients â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ GET /api/clients/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
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
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.json({ success: true, data: client });
  })
);

// â”€â”€â”€ POST /api/clients â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
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
      return res.status(400).json({ success: false, error: 'Client name is required' });
    }

    // Validate enums
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}` });
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}` });
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
  })
);

// â”€â”€â”€ PATCH /api/clients/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const existing = await prisma.client.findUnique({ where: { id: clientId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Client not found' });
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
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}` });
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}` });
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
  })
);

// â”€â”€â”€ DELETE /api/clients/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const existing = await prisma.client.findUnique({ where: { id: clientId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Prevent deleting clients with active property links
    const activeLinks = await prisma.clientProperty.count({
      where: { clientId, relationship: { in: ['owner', 'tenant', 'buyer'] } },
    });
    if (activeLinks > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete client with ${activeLinks} active property link(s). Remove links first.`,
      });
    }

    // Cascade: delete communications and property links, then client
    await prisma.$transaction([
      prisma.communication.deleteMany({ where: { clientId } }),
      prisma.clientProperty.deleteMany({ where: { clientId } }),
      prisma.client.delete({ where: { id: clientId } }),
    ]);

    res.json({ success: true, data: { id: clientId } });
  })
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CLIENT â†” PROPERTY LINKING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€â”€ GET /api/clients/:id/properties â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id/properties',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const links = await prisma.clientProperty.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: links });
  })
);

// â”€â”€â”€ POST /api/clients/:id/properties â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/:id/properties',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const { propertyId, relationship, notes } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }

    // Validate relationship enum
    if (relationship && !VALID_RELATIONSHIPS.includes(relationship)) {
      return res.status(400).json({
        success: false,
        error: `Invalid relationship. Must be: ${VALID_RELATIONSHIPS.join(', ')}`,
      });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    // Check for duplicate link
    const existing = await prisma.clientProperty.findUnique({
      where: { clientId_propertyId: { clientId, propertyId } },
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: 'Client is already linked to this property' });
    }

    const link = await prisma.clientProperty.create({
      data: {
        clientId,
        propertyId,
        relationship: relationship || 'interested',
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json({ success: true, data: link });
  })
);

// â”€â”€â”€ PATCH /api/clients/:id/properties/:propertyId â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/:id/properties/:propertyId',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    const propertyId = getRouteParam(req.params.propertyId);
    if (!clientId || !propertyId) {
      return res.status(400).json({ success: false, error: 'Invalid client or property id' });
    }

    const link = await prisma.clientProperty.findUnique({
      where: {
        clientId_propertyId: { clientId, propertyId },
      },
    });
    if (!link) {
      return res.status(404).json({ success: false, error: 'Property link not found' });
    }

    const { relationship, notes } = req.body;
    if (relationship && !VALID_RELATIONSHIPS.includes(relationship)) {
      return res.status(400).json({
        success: false,
        error: `Invalid relationship. Must be: ${VALID_RELATIONSHIPS.join(', ')}`,
      });
    }

    const updated = await prisma.clientProperty.update({
      where: { id: link.id },
      data: {
        ...(relationship && { relationship }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    });

    res.json({ success: true, data: updated });
  })
);

// â”€â”€â”€ DELETE /api/clients/:id/properties/:propertyId â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/:id/properties/:propertyId',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    const propertyId = getRouteParam(req.params.propertyId);
    if (!clientId || !propertyId) {
      return res.status(400).json({ success: false, error: 'Invalid client or property id' });
    }

    const link = await prisma.clientProperty.findUnique({
      where: {
        clientId_propertyId: { clientId, propertyId },
      },
    });
    if (!link) {
      return res.status(404).json({ success: false, error: 'Property link not found' });
    }

    await prisma.clientProperty.delete({ where: { id: link.id } });

    res.json({
      success: true,
      data: { clientId, propertyId },
    });
  })
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// COMMUNICATION LOGS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€â”€ GET /api/clients/:id/communications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id/communications',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const { type: commType } = req.query as Record<string, string | undefined>;
    const {
      page: pageNum,
      limit,
      skip,
    } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });
    const where: Prisma.CommunicationWhereInput = { clientId };
    if (commType && commType !== 'all') {
      where.type = commType as string;
    }

    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communication.count({ where }),
    ]);

    res.json({
      success: true,
      data: communications,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// â”€â”€â”€ POST /api/clients/:id/communications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/:id/communications',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const clientId = getRouteParam(req.params.id);
    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Invalid client id' });
    }

    const { type, direction, subject, body, duration, outcome } = req.body;

    // Validate client exists
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Validate communication type
    if (type && !VALID_COMM_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be: ${VALID_COMM_TYPES.join(', ')}`,
      });
    }

    // Validate direction
    if (direction && !['inbound', 'outbound'].includes(direction)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid direction. Must be: inbound, outbound' });
    }

    const authReq = req as { user?: { id?: string } };
    const communication = await prisma.communication.create({
      data: {
        clientId,
        type: type || 'note',
        direction: direction || 'outbound',
        subject: subject?.trim() || null,
        body: body?.trim() || null,
        duration: duration ? Number(duration) : null,
        outcome: outcome?.trim() || null,
        createdById: authReq.user?.id || null,
      },
    });

    // Update client's lastContact timestamp
    await prisma.client.update({
      where: { id: clientId },
      data: { lastContact: new Date() },
    });

    res.status(201).json({ success: true, data: communication });
  })
);

// â”€â”€â”€ POST /api/clients/convert-lead/:leadId â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Convert a qualified lead into a client
router.post(
  '/convert-lead/:leadId',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const leadId = getRouteParam(req.params.leadId);
    if (!leadId) {
      return res.status(400).json({ success: false, error: 'Invalid lead id' });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    // Check if already converted
    const alreadyConverted = await prisma.client.findFirst({
      where: { convertedFromLeadId: leadId },
    });
    if (alreadyConverted) {
      return res.status(409).json({
        success: false,
        error: 'Lead has already been converted to a client',
        data: alreadyConverted,
      });
    }

    const { category, type } = req.body;

    // Create client from lead data
    const client = await prisma.client.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        category: category || 'buyer',
        type: type || 'individual',
        status: 'active',
        tags: lead.tags,
        notes: lead.notes
          ? `Converted from lead. Original notes: ${lead.notes}`
          : 'Converted from lead',
        assignedToId: lead.assignedToId,
        convertedFromLeadId: lead.id,
        totalValue: lead.budget || 0,
        lastContact: lead.lastContact,
      },
    });

    // Update lead status to "won"
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'won' },
    });

    // If lead has a property, auto-link it
    if (lead.propertyId) {
      await prisma.clientProperty.create({
        data: {
          clientId: client.id,
          propertyId: lead.propertyId,
          relationship: 'interested',
          notes: 'Auto-linked from lead conversion',
        },
      });
    }

    res.status(201).json({ success: true, data: client });
  })
);

export default router;
