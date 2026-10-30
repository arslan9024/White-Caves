/**
 * propertyUpdateController.ts
 * Dedicated controller for full/partial updates and deletions of property records.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { invalidatePropertyCache } from '../../services/cacheInvalidation.js';
import { assertAvailabilityCompliance } from './propertyCommon.js';

export async function updateProperty(req: Request, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Property ID');

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new AppError('Property not found', 404);

  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  const isPropertyOwner = existing.userId === req.user?.id;
  if (!isAdmin && !isPropertyOwner) {
    throw new AppError('You do not have permission to edit this property', 403);
  }

  const updateData: Prisma.PropertyUpdateInput = {};
  const body = req.body as Record<string, unknown>;

  if (body.title !== undefined) updateData.title = sanitizeString(String(body.title));
  if (body.description !== undefined)
    updateData.description = body.description ? sanitizeString(String(body.description)) : null;
  if (body.type !== undefined) updateData.type = String(body.type);
  if (body.status !== undefined) {
    const incomingStatus = String(body.status);
    if (incomingStatus === 'available') {
      const permitNum = body.reraPermitNumber ?? existing.reraPermitNumber;
      const permitExpiry = body.reraPermitExpiryDate
        ? new Date(String(body.reraPermitExpiryDate))
        : existing.reraPermitExpiryDate;
      if (!permitNum || String(permitNum).trim() === '') {
        throw new AppError(
          'Cannot publish property: reraPermitNumber is required (RERA Law No. 16/2007). Obtain a Trakheesi permit first.',
          422
        );
      }
      if (permitExpiry && permitExpiry < new Date()) {
        throw new AppError(
          'Cannot publish property: RERA permit has expired. Renew via Trakheesi before publishing.',
          422
        );
      }
    }
    updateData.status = incomingStatus;
  }
  if (body.price !== undefined) updateData.price = parseFloat(String(body.price));
  if (body.currency !== undefined) updateData.currency = String(body.currency);
  if (body.bedrooms !== undefined) updateData.bedrooms = parseInt(String(body.bedrooms), 10);
  if (body.bathrooms !== undefined) updateData.bathrooms = parseInt(String(body.bathrooms), 10);
  if (body.sqft !== undefined) updateData.sqft = parseInt(String(body.sqft), 10);
  if (body.location !== undefined) updateData.location = sanitizeString(String(body.location));
  if (body.area !== undefined)
    updateData.area = body.area ? sanitizeString(String(body.area)) : null;
  if (body.amenities !== undefined)
    updateData.amenities = Array.isArray(body.amenities) ? (body.amenities as string[]) : [];
  if (body.images !== undefined)
    updateData.images = Array.isArray(body.images) ? (body.images as string[]) : [];
  if (body.featured !== undefined)
    updateData.featured = body.featured === true || body.featured === 'true';
  if (body.agentName !== undefined)
    updateData.agentName = body.agentName ? String(body.agentName) : null;

  if (body.unitNumber !== undefined)
    updateData.unitNumber = body.unitNumber ? String(body.unitNumber) : null;
  if (body.floorPlan !== undefined)
    updateData.floorPlan = body.floorPlan ? String(body.floorPlan) : null;
  if (body.rentalPrice !== undefined)
    updateData.rentalPrice = body.rentalPrice ? parseFloat(String(body.rentalPrice)) : null;
  if (body.commissionPercent !== undefined)
    updateData.commissionPercent =
      body.commissionPercent !== null ? parseFloat(String(body.commissionPercent)) : null;
  if (body.availabilityDate !== undefined)
    updateData.availabilityDate = body.availabilityDate
      ? new Date(String(body.availabilityDate))
      : null;
  if (body.inventoryStage !== undefined) updateData.inventoryStage = String(body.inventoryStage);
  if (body.municipalityNumber !== undefined)
    updateData.municipalityNumber = body.municipalityNumber
      ? String(body.municipalityNumber)
      : null;
  if (body.plotNumber !== undefined)
    updateData.plotNumber = body.plotNumber ? String(body.plotNumber) : null;
  if (body.buildingPermitNumber !== undefined)
    updateData.buildingPermitNumber = body.buildingPermitNumber
      ? String(body.buildingPermitNumber)
      : null;
  if (body.rentIndexRef !== undefined)
    updateData.rentIndexRef = body.rentIndexRef ? String(body.rentIndexRef) : null;
  if (body.furnished !== undefined)
    updateData.furnished = body.furnished === true || body.furnished === 'true';

  if (body.titleDeedMissing !== undefined)
    updateData.titleDeedMissing = Boolean(body.titleDeedMissing);
  if (body.landlordPassportMissing !== undefined)
    updateData.landlordPassportMissing = Boolean(body.landlordPassportMissing);
  if (body.ejariMissing !== undefined) updateData.ejariMissing = Boolean(body.ejariMissing);
  if (body.reraPermitNumber !== undefined)
    updateData.reraPermitNumber = body.reraPermitNumber ? String(body.reraPermitNumber) : null;
  if (body.reraPermitExpiryDate !== undefined)
    updateData.reraPermitExpiryDate = body.reraPermitExpiryDate
      ? new Date(String(body.reraPermitExpiryDate))
      : null;

  const nextStatus = body.status !== undefined ? String(body.status) : existing.status;
  const nextMunicipalityNumber =
    body.municipalityNumber !== undefined
      ? body.municipalityNumber
        ? String(body.municipalityNumber)
        : ''
      : existing.municipalityNumber;
  const nextBuildingPermitNumber =
    body.buildingPermitNumber !== undefined
      ? body.buildingPermitNumber
        ? String(body.buildingPermitNumber)
        : ''
      : existing.buildingPermitNumber;

  assertAvailabilityCompliance({
    currentStatus: existing.status,
    nextStatus,
    nextMunicipalityNumber,
    nextBuildingPermitNumber,
  });

  const property = await prisma.property.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const statusChanged = nextStatus !== existing.status;

  await prisma.activity.create({
    data: {
      type: 'property',
      action: statusChanged ? 'status_changed' : 'updated',
      description: statusChanged
        ? `Property "${property.title}" status: ${existing.status} → ${nextStatus}`
        : `Property "${property.title}" updated`,
      userId: req.user?.id || null,
    },
  });

  await invalidatePropertyCache(id);

  res.status(200).json({ success: true, data: property });
}

export async function patchProperty(req: Request, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Property ID');

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new AppError('Property not found', 404);

  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  const isPropertyOwner = existing.userId === req.user?.id;
  if (!isAdmin && !isPropertyOwner) {
    throw new AppError('You do not have permission to update this property', 403);
  }

  const body = req.body as Record<string, unknown>;
  const updateData: Prisma.PropertyUpdateInput = {};

  if (body.status !== undefined && String(body.status) === 'available') {
    const permitNum = body.reraPermitNumber ?? existing.reraPermitNumber;
    const permitExpiry = body.reraPermitExpiryDate
      ? new Date(String(body.reraPermitExpiryDate))
      : existing.reraPermitExpiryDate;
    if (!permitNum || String(permitNum).trim() === '') {
      throw new AppError(
        'Cannot publish property: reraPermitNumber is required (RERA Law No. 16/2007). Obtain a Trakheesi permit first.',
        422
      );
    }
    if (permitExpiry && permitExpiry < new Date()) {
      throw new AppError(
        'Cannot publish property: RERA permit has expired. Renew via Trakheesi before publishing.',
        422
      );
    }
  }

  const stringFields = [
    'title',
    'description',
    'type',
    'status',
    'currency',
    'location',
    'area',
    'agentName',
    'unitNumber',
    'floorPlan',
    'inventoryStage',
    'municipalityNumber',
    'plotNumber',
    'buildingPermitNumber',
    'rentIndexRef',
  ] as const;

  stringFields.forEach(field => {
    if (body[field] !== undefined) {
      (updateData as Record<string, unknown>)[field] =
        body[field] !== null ? sanitizeString(String(body[field])) : null;
    }
  });

  if (body.price !== undefined) updateData.price = parseFloat(String(body.price));
  if (body.bedrooms !== undefined) updateData.bedrooms = parseInt(String(body.bedrooms), 10);
  if (body.bathrooms !== undefined) updateData.bathrooms = parseInt(String(body.bathrooms), 10);
  if (body.sqft !== undefined) updateData.sqft = parseInt(String(body.sqft), 10);
  if (body.rentalPrice !== undefined)
    updateData.rentalPrice =
      body.rentalPrice !== null ? parseFloat(String(body.rentalPrice)) : null;
  if (body.commissionPercent !== undefined)
    updateData.commissionPercent =
      body.commissionPercent !== null ? parseFloat(String(body.commissionPercent)) : null;
  if (body.availabilityDate !== undefined)
    updateData.availabilityDate = body.availabilityDate
      ? new Date(String(body.availabilityDate))
      : null;
  if (body.featured !== undefined)
    updateData.featured = body.featured === true || body.featured === 'true';
  if (body.furnished !== undefined)
    updateData.furnished = body.furnished === true || body.furnished === 'true';
  if (body.amenities !== undefined)
    updateData.amenities = Array.isArray(body.amenities) ? (body.amenities as string[]) : [];
  if (body.images !== undefined)
    updateData.images = Array.isArray(body.images) ? (body.images as string[]) : [];
  if (body.titleDeedMissing !== undefined)
    updateData.titleDeedMissing = Boolean(body.titleDeedMissing);
  if (body.landlordPassportMissing !== undefined)
    updateData.landlordPassportMissing = Boolean(body.landlordPassportMissing);
  if (body.ejariMissing !== undefined) updateData.ejariMissing = Boolean(body.ejariMissing);
  if (body.verifiedAt !== undefined)
    updateData.verifiedAt = body.verifiedAt ? new Date(String(body.verifiedAt)) : null;
  if (body.verifiedBy !== undefined)
    updateData.verifiedBy = body.verifiedBy ? String(body.verifiedBy) : null;
  if (body.verificationNotes !== undefined)
    updateData.verificationNotes = body.verificationNotes
      ? sanitizeString(String(body.verificationNotes))
      : null;
  if (body.lastRefreshedAt !== undefined)
    updateData.lastRefreshedAt = body.lastRefreshedAt
      ? new Date(String(body.lastRefreshedAt))
      : null;

  const nextStatus = body.status !== undefined ? String(body.status) : existing.status;
  const nextMunicipalityNumber =
    body.municipalityNumber !== undefined
      ? body.municipalityNumber
        ? String(body.municipalityNumber)
        : ''
      : existing.municipalityNumber;
  const nextBuildingPermitNumber =
    body.buildingPermitNumber !== undefined
      ? body.buildingPermitNumber
        ? String(body.buildingPermitNumber)
        : ''
      : existing.buildingPermitNumber;

  assertAvailabilityCompliance({
    currentStatus: existing.status,
    nextStatus,
    nextMunicipalityNumber,
    nextBuildingPermitNumber,
  });

  const property = await prisma.property.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const statusChanged = nextStatus !== existing.status;

  await prisma.activity.create({
    data: {
      type: 'property',
      action: statusChanged ? 'status_changed' : 'updated',
      description: statusChanged
        ? `Property "${property.title}" status: ${existing.status} → ${nextStatus}`
        : `Property "${property.title}" updated`,
      userId: req.user?.id || null,
    },
  });

  await invalidatePropertyCache(id);

  res.status(200).json({ success: true, data: property });
}

export async function deleteProperty(req: Request, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Property ID');

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new AppError('Property not found', 404);

  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  const isPropertyOwner = existing.userId === req.user?.id;
  if (!isAdmin && !isPropertyOwner) {
    throw new AppError('You do not have permission to delete this property', 403);
  }

  await prisma.$transaction(async tx => {
    await tx.commission.updateMany({ where: { propertyId: id }, data: { propertyId: null } });
    await tx.lead.updateMany({ where: { propertyId: id }, data: { propertyId: null } });
    await tx.property.delete({ where: { id } });

    await tx.activity.create({
      data: {
        type: 'property',
        action: 'deleted',
        description: `Property deleted: ${existing.title} (by ${req.user?.email})`,
        userId: req.user?.id || null,
      },
    });
  });

  await invalidatePropertyCache(id);

  res.status(200).json({ success: true, message: `Property "${existing.title}" deleted` });
}
