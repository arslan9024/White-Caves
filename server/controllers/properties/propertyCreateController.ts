/**
 * propertyCreateController.ts
 * Dedicated controller for property creation and RERA publication verification.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { invalidatePropertyCache } from '../../services/cacheInvalidation.js';

export async function createProperty(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — insufficient permissions to create properties', 403);
  }

  const {
    title,
    description,
    type,
    status,
    price,
    currency,
    bedrooms,
    bathrooms,
    sqft,
    location,
    area,
    amenities,
    images,
    featured,
    agentName,
    unitNumber,
    floorPlan,
    rentalPrice,
    commissionPercent,
    availabilityDate,
    inventoryStage,
    municipalityNumber,
    plotNumber,
    buildingPermitNumber,
    rentIndexRef,
    furnished,
    verifiedAt,
    verifiedBy,
    verificationNotes,
    lastRefreshedAt,
    reraPermitNumber,
    reraPermitExpiryDate,
  } = req.body as Record<string, unknown>;

  if (!title || typeof title !== 'string') throw new AppError('Property title is required', 400);
  if (!location || typeof location !== 'string')
    throw new AppError('Property location is required', 400);
  if (price === undefined || price === null)
    throw new AppError('Property price is required', 400);

  const parsedPrice = typeof price === 'number' ? price : parseFloat(String(price));
  if (isNaN(parsedPrice) || parsedPrice < 0) throw new AppError('Invalid price value', 400);

  const targetStatus = status ? String(status) : 'available';

  if (targetStatus === 'available') {
    if (!reraPermitNumber || String(reraPermitNumber).trim() === '') {
      throw new AppError(
        'Cannot publish property: reraPermitNumber is required (RERA Law No. 16/2007). Obtain a Trakheesi permit first or save as draft_collected.',
        422
      );
    }
    if (reraPermitExpiryDate && new Date(String(reraPermitExpiryDate)) < new Date()) {
      throw new AppError(
        'Cannot publish property: RERA permit has expired. Renew via Trakheesi before publishing.',
        422
      );
    }
  }

  const property = await prisma.property.create({
    data: {
      title: sanitizeString(String(title)),
      description: description ? sanitizeString(String(description)) : null,
      type: type ? String(type) : 'apartment',
      status: status ? String(status) : 'available',
      price: parsedPrice,
      currency: currency ? String(currency) : 'AED',
      bedrooms: bedrooms ? parseInt(String(bedrooms), 10) : 0,
      bathrooms: bathrooms ? parseInt(String(bathrooms), 10) : 0,
      sqft: sqft ? parseInt(String(sqft), 10) : 0,
      location: sanitizeString(String(location)),
      area: area ? sanitizeString(String(area)) : null,
      amenities: Array.isArray(amenities) ? (amenities as string[]) : [],
      images: Array.isArray(images) ? (images as string[]) : [],
      featured: featured === true || featured === 'true',
      agentName: agentName ? String(agentName) : null,
      unitNumber: unitNumber ? String(unitNumber) : null,
      floorPlan: floorPlan ? String(floorPlan) : null,
      rentalPrice: rentalPrice ? parseFloat(String(rentalPrice)) : null,
      commissionPercent:
        commissionPercent !== undefined && commissionPercent !== null
          ? parseFloat(String(commissionPercent))
          : undefined,
      availabilityDate: availabilityDate ? new Date(String(availabilityDate)) : null,
      inventoryStage: inventoryStage ? String(inventoryStage) : 'draft_collected',
      municipalityNumber: municipalityNumber ? String(municipalityNumber) : null,
      plotNumber: plotNumber ? String(plotNumber) : null,
      buildingPermitNumber: buildingPermitNumber ? String(buildingPermitNumber) : null,
      rentIndexRef: rentIndexRef ? String(rentIndexRef) : null,
      furnished: furnished === true || furnished === 'true',
      verifiedAt: verifiedAt ? new Date(String(verifiedAt)) : null,
      verifiedBy: verifiedBy ? String(verifiedBy) : null,
      verificationNotes: verificationNotes ? sanitizeString(String(verificationNotes)) : null,
      lastRefreshedAt: lastRefreshedAt ? new Date(String(lastRefreshedAt)) : null,
      reraPermitNumber: reraPermitNumber ? String(reraPermitNumber) : null,
      reraPermitExpiryDate: reraPermitExpiryDate ? new Date(String(reraPermitExpiryDate)) : null,
      userId: req.user!.id,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.activity.create({
    data: {
      type: 'property',
      action: 'created',
      description: `Property created: ${property.title}`,
      userId: req.user?.id || null,
    },
  });

  await invalidatePropertyCache(property.id);

  res.status(201).json({ success: true, data: property });
}
