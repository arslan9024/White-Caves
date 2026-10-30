/**
 * Client Communication & Lead Conversion Controller
 * Endpoints for logging communications and converting qualified leads into client records.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { parsePagination } from '../../config/pagination.js';
import { VALID_COMM_TYPES, getRouteParam } from './clientCommon.js';

export const getClientCommunications = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
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
};

export const createClientCommunication = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const { type, direction, subject, body, duration, outcome } = req.body;

  // Validate client exists
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  // Validate communication type
  if (type && !VALID_COMM_TYPES.includes(type)) {
    res.status(400).json({
      success: false,
      error: `Invalid type. Must be: ${VALID_COMM_TYPES.join(', ')}`,
    });
    return;
  }

  // Validate direction
  if (direction && !['inbound', 'outbound'].includes(direction)) {
    res.status(400).json({
      success: false,
      error: 'Invalid direction. Must be: inbound, outbound',
    });
    return;
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
};

export const convertLeadToClient = async (req: Request, res: Response): Promise<void> => {
  const leadId = getRouteParam(req.params.leadId);
  if (!leadId) {
    res.status(400).json({ success: false, error: 'Invalid lead id' });
    return;
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    res.status(404).json({ success: false, error: 'Lead not found' });
    return;
  }

  // Check if already converted
  const alreadyConverted = await prisma.client.findFirst({
    where: { convertedFromLeadId: leadId },
  });
  if (alreadyConverted) {
    res.status(409).json({
      success: false,
      error: 'Lead has already been converted to a client',
      data: alreadyConverted,
    });
    return;
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
};

