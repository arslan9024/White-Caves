/**
 * File Upload API Routes
 * ─────────────────────
 * Handles property images, lease documents, maintenance photos, and general uploads.
 *
 * Base Path: /api/uploads
 *
 * Endpoints:
 *   POST /api/uploads/images          Upload property/profile images (max 10 files, 10MB each)
 *   POST /api/uploads/documents       Upload documents (max 5 files, 25MB each)
 *   DELETE /api/uploads/:filename     Delete an uploaded file
 *   GET /api/uploads/info             Get upload configuration info
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  uploadImage,
  uploadDocument,
  getFileUrl,
  deleteFile,
  IMAGE_MIMES,
  DOCUMENT_MIMES,
  SIZE_LIMITS,
} from '../middleware/upload.js';
import logger from '../utils/logger.js';

const router = Router();

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

/**
 * POST /api/uploads/images
 * Upload one or more images (property photos, agent avatars, etc.)
 * Accepts: JPEG, PNG, WebP, GIF, SVG, AVIF — max 10MB each, max 10 files
 */
router.post(
  '/images',
  uploadImage.array('files', 10),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const uploaded = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: getFileUrl(file),
    }));

    logger.info('Images uploaded', {
      userId: (req as any).user?.id,
      count: uploaded.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });

    res.status(201).json({
      success: true,
      count: uploaded.length,
      data: uploaded,
    });
  })
);

// ============================================================================
// DOCUMENT UPLOAD
// ============================================================================

/**
 * POST /api/uploads/documents
 * Upload one or more documents (contracts, leases, PDFs, spreadsheets)
 * Accepts: PDF, Word, Excel, CSV — max 25MB each, max 5 files
 */
router.post(
  '/documents',
  requirePermission('create_contracts'),
  uploadDocument.array('files', 5),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const uploaded = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: getFileUrl(file),
    }));

    logger.info('Documents uploaded', {
      userId: (req as any).user?.id,
      count: uploaded.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });

    res.status(201).json({
      success: true,
      count: uploaded.length,
      data: uploaded,
    });
  })
);

// ============================================================================
// DELETE FILE
// ============================================================================

/**
 * DELETE /api/uploads/:filename
 * Delete an uploaded file by filename (owner/admin only)
 */
router.delete(
  '/:filename',
  requirePermission('delete_property'), // Only users who can delete properties can delete files
  asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    // Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new AppError('Invalid filename', 400);
    }

    // Try to find and delete from all subdirectories
    const subdirs = ['images', 'documents', 'temp'];
    let deleted = false;
    for (const sub of subdirs) {
      const filePath = `/uploads/${sub}/${filename}`;
      try {
        deleteFile(filePath);
        deleted = true;
        break;
      } catch {
        // try next subdir
      }
    }

    logger.info('File delete requested', {
      userId: (req as any).user?.id,
      filename,
      deleted,
    });

    res.json({
      success: true,
      message: deleted ? 'File deleted' : 'File not found (may already be deleted)',
    });
  })
);

// ============================================================================
// UPLOAD INFO
// ============================================================================

/**
 * GET /api/uploads/info
 * Returns upload configuration — allowed types, size limits, etc.
 */
router.get(
  '/info',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        images: {
          allowedTypes: [...IMAGE_MIMES],
          maxFileSize: SIZE_LIMITS.image,
          maxFileSizeHuman: `${SIZE_LIMITS.image / (1024 * 1024)}MB`,
          maxFiles: 10,
          endpoint: '/api/uploads/images',
        },
        documents: {
          allowedTypes: [...DOCUMENT_MIMES],
          maxFileSize: SIZE_LIMITS.document,
          maxFileSizeHuman: `${SIZE_LIMITS.document / (1024 * 1024)}MB`,
          maxFiles: 5,
          endpoint: '/api/uploads/documents',
        },
      },
    });
  })
);

export default router;
