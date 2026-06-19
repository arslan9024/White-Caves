import { Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { generateDraftContract } from '../services/contractService.js';
import { generateInvoice } from '../services/invoiceService.js';

// 1. Intake a new property directly into the draft_collected stage
export const createLeasingProperty = asyncHandler(async (req: Request, res: Response) => {
  const { title, location, rentalPrice, unitNumber, bedrooms } = req.body;

  if (!title || !location) {
    throw new AppError('Title and location are required', 400);
  }

  // Create property with default missing docs and draft_collected stage
  const property = await prisma.property.create({
    data: {
      title,
      location,
      type: 'apartment',
      status: 'available',
      rentalPrice: Number(rentalPrice) || 0,
      price: Number(rentalPrice) || 0, // Fallback for price
      unitNumber,
      bedrooms: Number(bedrooms) || 0,
      inventoryStage: 'draft_collected',
      titleDeedMissing: true,
      landlordPassportMissing: true,
      ejariMissing: true,
      userId: req.user?.id || 'dev-owner', // From auth middleware
    },
  });

  logger.info(`Leasing Property created: ${property.id}`);

  // Create Activity for creation
  await prisma.activity.create({
    data: {
      type: 'system',
      action: 'created',
      description: `New leasing property ${unitNumber || title} added to Draft Collected`,
      userId: req.user?.id,
    },
  });

  res.status(201).json({
    success: true,
    data: property,
  });
});

// 2. Upload Document (handled by multer in route, this just updates DB)
export const uploadPropertyDocument = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as Record<string, string>;
  const { documentType } = req.body; // 'titleDeed', 'passport', 'ejari'

  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  let dataToUpdate: any = {};
  if (documentType === 'titleDeed') {
    dataToUpdate.titleDeedMissing = false;
  } else if (documentType === 'passport') {
    dataToUpdate.landlordPassportMissing = false;
  } else if (documentType === 'ejari') {
    dataToUpdate.ejariMissing = false;
  } else {
    throw new AppError('Invalid document type', 400);
  }

  const property = await prisma.property.update({
    where: { id },
    data: dataToUpdate,
  });

  // Create Activity
  await prisma.activity.create({
    data: {
      type: 'system',
      action: 'updated',
      description: `${documentType} uploaded for property ${property.unitNumber || property.title}`,
      userId: req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    data: { property, fileUrl },
  });
});

// 3. Transition Stage
export const transitionPropertyStage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as Record<string, string>;
  const { newStage } = req.body;

  const validStages = [
    'draft_collected',
    'verified_active',
    'under_offer',
    'leased_sold',
    'handed_over',
  ];
  if (!validStages.includes(newStage)) {
    throw new AppError('Invalid stage', 400);
  }

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Strict validation logic (@Mary's rules)
  if (newStage === 'verified_active') {
    if (property.titleDeedMissing || property.landlordPassportMissing) {
      throw new AppError(
        'Cannot move to Verified Active. Title Deed and Landlord Passport are required.',
        400
      );
    }
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: { inventoryStage: newStage },
  });

  // Sprint 2: Automated Contract Generation by @Victoria
  if (newStage === 'under_offer') {
    await generateDraftContract(property.id, req.user?.id);
  }

  // Create Activity for bell notification
  await prisma.activity.create({
    data: {
      type: 'property',
      action: 'status_changed',
      description: `Property ${updatedProperty.unitNumber || updatedProperty.title} moved to ${newStage.replace('_', ' ')}`,
      userId: req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedProperty,
  });
});

// 4. Get all leasing inventory properties
export const getLeasingInventory = asyncHandler(async (req: Request, res: Response) => {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: properties,
  });
});

// 5. Sign Contract
export const signContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as Record<string, string>;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (property.inventoryStage !== 'under_offer') {
    throw new AppError('Property is not under offer', 400);
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: { inventoryStage: 'leased_sold' },
  });

  // Automatically trigger Invoice generation in the background
  generateInvoice(id, req.user?.id).catch(err => console.error('Failed to generate invoice:', err));

  // Create Activity for signature
  await prisma.activity.create({
    data: {
      type: 'property',
      action: 'updated',
      description: `Contract securely E-Signed for property ${property.unitNumber || property.title}`,
      userId: req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedProperty,
  });
});

// 6. Register Ejari
export const registerEjari = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as Record<string, string>;
  const { ejariNumber } = req.body;

  if (!ejariNumber) throw new AppError('Ejari number is required', 400);

  const property = await prisma.property.update({
    where: { id },
    data: { rentIndexRef: ejariNumber }, // using rentIndexRef for Ejari
  });

  await prisma.activity.create({
    data: {
      type: 'property',
      action: 'updated',
      description: `Ejari Registered for ${property.unitNumber || property.title} (No. ${ejariNumber})`,
      userId: req.user?.id,
    },
  });

  res.status(200).json({ success: true, data: property });
});

// 7. Complete Handover
export const completeHandover = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as Record<string, string>;

  const property = await prisma.property.update({
    where: { id },
    data: {
      inventoryStage: 'handed_over',
      isLocked: true,
      lockedAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      type: 'property',
      action: 'status_changed',
      description: `Key Handover Completed for ${property.unitNumber || property.title}. Property is locked.`,
      userId: req.user?.id,
    },
  });

  res.status(200).json({ success: true, data: property });
});
