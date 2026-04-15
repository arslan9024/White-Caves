/**
 * Upload Routes — White Caves CRM
 *
 * Endpoints:
 *   POST   /api/uploads/avatar           — Upload profile avatar (single, 2MB, images only)
 *   POST   /api/uploads/property-photos   — Upload property photos (multi, up to 10, 5MB each)
 *   POST   /api/uploads/documents         — Upload documents (single, 10MB, PDF/DOC/XLS/CSV)
 *   GET    /api/uploads/:filename         — Serve uploaded file
 *   DELETE /api/uploads/:filename         — Delete uploaded file (owner or admin)
 *   GET    /api/uploads/stats             — Upload statistics (admin only)
 */

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  uploadSingle,
  uploadMultiple,
  validateUploadedFiles,
  deleteUploadedFile,
  ALLOWED_MIME_TYPES,
  SIZE_LIMITS,
} from '../middleware/upload.js';
import { requirePermission } from '../middleware/rbac.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Uploads');
const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve('uploads');

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

interface UploadedFileInfo {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

function fileToInfo(file: Express.Multer.File, req: Request): UploadedFileInfo {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `${baseUrl}/api/uploads/${file.filename}`,
    uploadedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// POST /avatar — Single profile photo
// ─────────────────────────────────────────────────────────────

router.post(
  '/avatar',
  uploadSingle('avatar', { category: 'image', subDir: 'avatars', maxSize: SIZE_LIMITS.avatar }),
  validateUploadedFiles,
  asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      throw new AppError('No avatar file provided. Use multipart/form-data with field name "avatar"', 400);
    }

    log.info('Avatar uploaded', {
      userId: (req as any).user?.id,
      filename: file.filename,
      size: file.size,
    });

    res.status(201).json({
      success: true,
      data: fileToInfo(file, req),
    });
  })
);

// ─────────────────────────────────────────────────────────────
// POST /property-photos — Multiple property images (up to 10)
// ─────────────────────────────────────────────────────────────

router.post(
  '/property-photos',
  requirePermission('create_property'),
  uploadMultiple('photos', 10, { category: 'image', subDir: 'properties', maxSize: SIZE_LIMITS.image }),
  validateUploadedFiles,
  asyncHandler(async (req: Request, res: Response) => {
    const files = ((req as any).files || []) as Express.Multer.File[];
    if (files.length === 0) {
      throw new AppError('No photo files provided. Use multipart/form-data with field name "photos"', 400);
    }

    log.info('Property photos uploaded', {
      userId: (req as any).user?.id,
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });

    res.status(201).json({
      success: true,
      data: files.map((f) => fileToInfo(f, req)),
      count: files.length,
    });
  })
);

// ─────────────────────────────────────────────────────────────
// POST /documents — Single document (PDF, DOC, XLS, CSV)
// ─────────────────────────────────────────────────────────────

router.post(
  '/documents',
  uploadSingle('document', { category: 'document', subDir: 'documents', maxSize: SIZE_LIMITS.document }),
  validateUploadedFiles,
  asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      throw new AppError('No document file provided. Use multipart/form-data with field name "document"', 400);
    }

    log.info('Document uploaded', {
      userId: (req as any).user?.id,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    });

    res.status(201).json({
      success: true,
      data: fileToInfo(file, req),
    });
  })
);

// ─────────────────────────────────────────────────────────────
// GET /:filename — Serve uploaded file
// ─────────────────────────────────────────────────────────────

router.get(
  '/:filename',
  asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    // Sanitize: prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new AppError('Invalid filename', 400);
    }

    // Search across subdirectories
    const subdirs = ['', 'avatars', 'properties', 'documents'];
    let filePath: string | null = null;

    for (const sub of subdirs) {
      const candidate = path.join(UPLOAD_DIR, sub, filename);
      if (fs.existsSync(candidate)) {
        filePath = candidate;
        break;
      }
    }

    if (!filePath) {
      throw new AppError('File not found', 404);
    }

    // Set cache headers for static assets
    res.set({
      'Cache-Control': 'public, max-age=86400', // 24 hours
      'X-Content-Type-Options': 'nosniff',
    });

    res.sendFile(filePath);
  })
);

// ─────────────────────────────────────────────────────────────
// DELETE /:filename — Delete uploaded file
// ─────────────────────────────────────────────────────────────

router.delete(
  '/:filename',
  asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new AppError('Invalid filename', 400);
    }

    const subdirs = ['', 'avatars', 'properties', 'documents'];
    let deleted = false;

    for (const sub of subdirs) {
      const candidate = path.join(UPLOAD_DIR, sub, filename);
      if (deleteUploadedFile(candidate)) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      throw new AppError('File not found', 404);
    }

    log.info('File deleted', {
      userId: (req as any).user?.id,
      filename,
    });

    res.json({ success: true, message: 'File deleted' });
  })
);

// ─────────────────────────────────────────────────────────────
// GET /stats — Upload statistics (admin/owner only)
// ─────────────────────────────────────────────────────────────

router.get(
  '/stats',
  requirePermission('manage_system'),
  asyncHandler(async (_req: Request, res: Response) => {
    const stats: Record<string, { files: number; totalSize: number }> = {};

    const subdirs = ['avatars', 'properties', 'documents'];

    for (const sub of subdirs) {
      const dir = path.join(UPLOAD_DIR, sub);
      if (!fs.existsSync(dir)) {
        stats[sub] = { files: 0, totalSize: 0 };
        continue;
      }

      const files = fs.readdirSync(dir);
      let totalSize = 0;
      for (const f of files) {
        try {
          const stat = fs.statSync(path.join(dir, f));
          totalSize += stat.size;
        } catch {
          // skip unreadable files
        }
      }
      stats[sub] = { files: files.length, totalSize };
    }

    res.json({
      success: true,
      data: {
        ...stats,
        allowedTypes: Object.fromEntries(
          Object.entries(ALLOWED_MIME_TYPES).map(([k, v]) => [k, [...v]])
        ),
        sizeLimits: SIZE_LIMITS,
      },
    });
  })
);

export default router;
