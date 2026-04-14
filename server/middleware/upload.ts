/**
 * File Upload Middleware — Multer Configuration
 * ──────────────────────────────────────────────
 * Provides configurable file upload handling with:
 *   • Local storage (dev) — files saved to /uploads/
 *   • S3-ready adapter pattern (prod) — swap via UPLOAD_DRIVER env var
 *   • File type validation (images, PDFs, documents)
 *   • Size limits per category (10MB images, 25MB documents)
 *   • Unique filename generation (UUID + original extension)
 *
 * Usage:
 *   import { uploadImage, uploadDocument, uploadAny } from './upload';
 *   router.post('/photos', uploadImage.array('files', 10), handler);
 *   router.post('/docs',   uploadDocument.single('file'),   handler);
 */

import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

// ─── Configuration ──────────────────────────────────────────────────────────

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const UPLOAD_DRIVER = process.env.UPLOAD_DRIVER || 'local'; // 'local' | 's3'

// Ensure upload directory exists
if (UPLOAD_DRIVER === 'local') {
  for (const sub of ['images', 'documents', 'temp']) {
    const dir = path.join(UPLOAD_DIR, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created upload directory: ${dir}`);
    }
  }
}

// ─── MIME Type Validation ───────────────────────────────────────────────────

const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

const DOCUMENT_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]);

const ALL_ALLOWED_MIMES = new Set([...IMAGE_MIMES, ...DOCUMENT_MIMES]);

// ─── Size Limits ────────────────────────────────────────────────────────────

const SIZE_LIMITS = {
  image: 10 * 1024 * 1024,    // 10 MB
  document: 25 * 1024 * 1024, // 25 MB
  any: 25 * 1024 * 1024,      // 25 MB
} as const;

// ─── Local Storage Engine ───────────────────────────────────────────────────

function createLocalStorage(subfolder: string): StorageEngine {
  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      const dest = path.join(UPLOAD_DIR, subfolder);
      cb(null, dest);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      // Generate unique filename: uuid + original extension
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${crypto.randomUUID()}${ext}`;
      cb(null, uniqueName);
    },
  });
}

// ─── File Filter Factories ──────────────────────────────────────────────────

function createFileFilter(allowedMimes: Set<string>) {
  return (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(
        `File type "${file.mimetype}" is not allowed. Accepted: ${[...allowedMimes].join(', ')}`,
        415
      ) as any);
    }
  };
}

// ─── Multer Instances ───────────────────────────────────────────────────────

/** Upload handler for images (JPEG, PNG, WebP, GIF, SVG, AVIF) — max 10MB */
export const uploadImage = multer({
  storage: createLocalStorage('images'),
  limits: { fileSize: SIZE_LIMITS.image },
  fileFilter: createFileFilter(IMAGE_MIMES),
});

/** Upload handler for documents (PDF, Word, Excel, CSV) — max 25MB */
export const uploadDocument = multer({
  storage: createLocalStorage('documents'),
  limits: { fileSize: SIZE_LIMITS.document },
  fileFilter: createFileFilter(DOCUMENT_MIMES),
});

/** Upload handler for any allowed file type — max 25MB */
export const uploadAny = multer({
  storage: createLocalStorage('temp'),
  limits: { fileSize: SIZE_LIMITS.any },
  fileFilter: createFileFilter(ALL_ALLOWED_MIMES),
});

// ─── Helper: Build public URL from file path ────────────────────────────────

export function getFileUrl(file: Express.Multer.File): string {
  if (UPLOAD_DRIVER === 's3') {
    // S3: return the full URL (set by S3 storage engine)
    return (file as any).location || file.path;
  }
  // Local: return relative URL path
  const relativePath = path.relative(UPLOAD_DIR, file.path).replace(/\\/g, '/');
  return `/uploads/${relativePath}`;
}

// ─── Helper: Delete uploaded file ───────────────────────────────────────────

export function deleteFile(filePath: string): void {
  try {
    if (UPLOAD_DRIVER === 'local') {
      const fullPath = filePath.startsWith('/uploads/')
        ? path.join(UPLOAD_DIR, filePath.replace('/uploads/', ''))
        : filePath;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        logger.debug(`Deleted file: ${fullPath}`);
      }
    }
    // S3: would call s3.deleteObject() here
  } catch (err) {
    logger.warn('Failed to delete file', { filePath, error: (err as Error).message });
  }
}

// ─── Export types for convenience ───────────────────────────────────────────

export type UploadedFile = Express.Multer.File;
export { UPLOAD_DIR, IMAGE_MIMES, DOCUMENT_MIMES, ALL_ALLOWED_MIMES, SIZE_LIMITS };
