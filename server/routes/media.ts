import multer from 'multer';
import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import { storageService } from '../services/StorageService.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post(
  '/upload',
  upload.single('image'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.body;
    if (!propertyId || typeof propertyId !== 'string') {
      throw new AppError('propertyId is required', 400);
    }
    if (!req.file) {
      throw new AppError('image file is required', 400);
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, userId: true, images: true },
    });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const isAdmin = ['owner', 'manager', 'admin'].includes(req.user?.role || '');
    if (!isAdmin && property.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const uploaded = await storageService.storePropertyImage(req.file);
    const nextImages = Array.isArray(property.images) ? [...property.images] : [];
    nextImages.push(uploaded.optimizedUrl);

    await prisma.property.update({
      where: { id: propertyId },
      data: { images: nextImages },
    });

    res.status(201).json({
      success: true,
      data: {
        propertyId,
        ...uploaded,
      },
    });
  })
);

router.delete(
  '/:propertyId/:fileName',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, fileName } = req.params;
    if (!propertyId || !fileName) {
      throw new AppError('propertyId and fileName are required', 400);
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, userId: true, images: true },
    });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const isAdmin = ['owner', 'manager', 'admin'].includes(req.user?.role || '');
    if (!isAdmin && property.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const deleted = await storageService.deletePropertyImage(fileName);
    if (!deleted) {
      throw new AppError('File not found', 404);
    }

    const nextImages = (property.images || []).filter(
      image => typeof image === 'string' && !image.includes(fileName.split('.')[0] || fileName)
    );

    await prisma.property.update({
      where: { id: propertyId },
      data: { images: nextImages },
    });

    res.status(200).json({ success: true, message: 'Image deleted' });
  })
);

export default router;
