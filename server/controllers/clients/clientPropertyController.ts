/**
 * Client Property Linking Controller
 * Endpoints for managing relationships between clients and real estate properties.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { VALID_RELATIONSHIPS, getRouteParam } from './clientCommon.js';

export const getClientProperties = async (req: Request, res: Response): Promise<void> => {
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

  const links = await prisma.clientProperty.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: links });
};

export const linkClientProperty = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  if (!clientId) {
    res.status(400).json({ success: false, error: 'Invalid client id' });
    return;
  }

  const { propertyId, relationship, notes } = req.body;

  if (!propertyId) {
    res.status(400).json({ success: false, error: 'propertyId is required' });
    return;
  }

  // Validate relationship enum
  if (relationship && !VALID_RELATIONSHIPS.includes(relationship)) {
    res.status(400).json({
      success: false,
      error: `Invalid relationship. Must be: ${VALID_RELATIONSHIPS.join(', ')}`,
    });
    return;
  }

  // Verify client exists
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    res.status(404).json({ success: false, error: 'Client not found' });
    return;
  }

  // Verify property exists
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    res.status(404).json({ success: false, error: 'Property not found' });
    return;
  }

  // Check for duplicate link
  const existing = await prisma.clientProperty.findUnique({
    where: { clientId_propertyId: { clientId, propertyId } },
  });
  if (existing) {
    res.status(409).json({ success: false, error: 'Client is already linked to this property' });
    return;
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
};

export const updateClientPropertyLink = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  const propertyId = getRouteParam(req.params.propertyId);
  if (!clientId || !propertyId) {
    res.status(400).json({ success: false, error: 'Invalid client or property id' });
    return;
  }

  const link = await prisma.clientProperty.findUnique({
    where: {
      clientId_propertyId: { clientId, propertyId },
    },
  });
  if (!link) {
    res.status(404).json({ success: false, error: 'Property link not found' });
    return;
  }

  const { relationship, notes } = req.body;
  if (relationship && !VALID_RELATIONSHIPS.includes(relationship)) {
    res.status(400).json({
      success: false,
      error: `Invalid relationship. Must be: ${VALID_RELATIONSHIPS.join(', ')}`,
    });
    return;
  }

  const updated = await prisma.clientProperty.update({
    where: { id: link.id },
    data: {
      ...(relationship && { relationship }),
      ...(notes !== undefined && { notes: notes?.trim() || null }),
    },
  });

  res.json({ success: true, data: updated });
};

export const unlinkClientProperty = async (req: Request, res: Response): Promise<void> => {
  const clientId = getRouteParam(req.params.id);
  const propertyId = getRouteParam(req.params.propertyId);
  if (!clientId || !propertyId) {
    res.status(400).json({ success: false, error: 'Invalid client or property id' });
    return;
  }

  const link = await prisma.clientProperty.findUnique({
    where: {
      clientId_propertyId: { clientId, propertyId },
    },
  });
  if (!link) {
    res.status(404).json({ success: false, error: 'Property link not found' });
    return;
  }

  await prisma.clientProperty.delete({ where: { id: link.id } });

  res.json({
    success: true,
    data: { clientId, propertyId },
  });
};

