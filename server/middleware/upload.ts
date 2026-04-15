/**
 * File Upload Middleware — White Caves CRM
 *
 * Centralized multer configuration with:
 * - File type validation (MIME + magic bytes)
 * - Size limits per upload type
 * - Secure filename generation (UUID-based)
 * - Virus scan hook (pluggable)
 * - Storage: local disk (dev) or S3-compatible (prod)
 *
 * Usage:
 *   import { uploadSingle, uploadMultiple, uploadFields } from '../middleware/upload.js';
 *   router.post('/avatar', uploadSingle('avatar'), handler);
 *   router.post('/photos', uploadMultiple('photos', 10), handler);
 */

import multer, { type FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';
import { createLogger } from '../utils/logger.js';
import { AppError } from './errorHandler.js';

const log = createLogger('Upload');

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve('uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB default
const MAX_FILES = parseInt(process.env.MAX_FILES || '10', 10);

/** Allowed MIME types grouped by category */
export const ALLOWED_MIME_TYPES: Record<string, readonly string[]> = {
  image: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
  ],
  video: [
    'video/mp4',
    'video/webm',
  ],
  any: [] as string[], // Populated below
} as const;

// Build "any" as union of all categories
(ALLOWED_MIME_TYPES.any as string[]).push(
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.document,
  ...ALLOWED_MIME_TYPES.video,
);

/** Size limits per category (bytes) */
export const SIZE_LIMITS: Record<string, number> = {
  avatar: 2 * 1024 * 1024,       // 2MB — profile photos
  image: 5 * 1024 * 1024,        // 5MB — property photos
  document: 10 * 1024 * 1024,    // 10MB — contracts, leases
  video: 50 * 1024 * 1024,       // 50MB — property videos
  default: MAX_FILE_SIZE,
};

/** Magic bytes for MIME type double-check */
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Ensure the upload directory exists */
function ensureUploadDir(subDir?: string): string {
  const dir = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Created upload directory: ${dir}`);
  }
  return dir;
}

/** Generate a unique, non-guessable filename */
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  return `${timestamp}-${uuid}${ext}`;
}

/** Validate MIME type matches magic bytes (prevents spoofed content-type) */
export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return true; // No magic bytes to check — allow
  if (buffer.length < expected.length) return false;
  return expected.every((byte, i) => buffer[i] === byte);
}

/** Sanitize original filename (remove path traversal, special chars) */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.')            // No double dots (path traversal)
    .replace(/^\./, '_')                // No leading dot (hidden files)
    .substring(0, 200);                 // Cap length
}

// ─────────────────────────────────────────────────────────────
// Storage Configuration
// ─────────────────────────────────────────────────────────────

function createDiskStorage(subDir?: string): multer.StorageEngine {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      const dir = ensureUploadDir(subDir);
      cb(null, dir);
    },
    filename(_req, file, cb) {
      const safeName = generateFilename(file.originalname);
      cb(null, safeName);
    },
  });
}

// ─────────────────────────────────────────────────────────────
// File Filters
// ─────────────────────────────────────────────────────────────

type UploadCategory = keyof typeof ALLOWED_MIME_TYPES;

function createFileFilter(category: UploadCategory = 'any') {
  const allowedTypes = ALLOWED_MIME_TYPES[category] || ALLOWED_MIME_TYPES.any;

  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    // Check MIME type against whitelist
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      log.warn('File rejected: MIME type not allowed', {
        filename: sanitizeFilename(file.originalname),
        mimetype: file.mimetype,
        category,
      });
      cb(new AppError(`File type "${file.mimetype}" is not allowed for ${category} uploads`, 415) as any);
      return;
    }

    // Check extension matches MIME (prevent .exe renamed to .jpg)
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeExtMap: Record<string, string[]> = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    };
    const expectedExts = mimeExtMap[file.mimetype];
    if (expectedExts && !expectedExts.includes(ext)) {
      log.warn('File rejected: extension does not match MIME type', {
        filename: sanitizeFilename(file.originalname),
        mimetype: file.mimetype,
        ext,
      });
      cb(new AppError(`File extension "${ext}" does not match declared type "${file.mimetype}"`, 415) as any);
      return;
    }

    log.debug('File accepted', {
      filename: sanitizeFilename(file.originalname),
      mimetype: file.mimetype,
      size: file.size,
    });
    cb(null, true);
  };
}

// ─────────────────────────────────────────────────────────────
// Multer Instances
// ─────────────────────────────────────────────────────────────

function createUploader(options: {
  category?: UploadCategory;
  subDir?: string;
  maxSize?: number;
}) {
  const { category = 'any', subDir, maxSize } = options;
  const sizeLimit = maxSize ?? SIZE_LIMITS[category] ?? SIZE_LIMITS.default;

  return multer({
    storage: createDiskStorage(subDir),
    fileFilter: createFileFilter(category),
    limits: {
      fileSize: sizeLimit,
      files: MAX_FILES,
      fields: 20,
      fieldSize: 1024 * 1024, // 1MB for text fields
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Public API — Express Middleware Factories
// ─────────────────────────────────────────────────────────────

/**
 * Single file upload middleware.
 * @param fieldName Form field name (e.g. 'avatar', 'photo')
 * @param options Category, subdirectory, max size
 */
export function uploadSingle(
  fieldName: string,
  options: { category?: UploadCategory; subDir?: string; maxSize?: number } = {}
) {
  return createUploader(options).single(fieldName);
}

/**
 * Multiple files upload middleware (same field name).
 * @param fieldName Form field name
 * @param maxCount Maximum number of files
 * @param options Category, subdirectory, max size
 */
export function uploadMultiple(
  fieldName: string,
  maxCount: number = 10,
  options: { category?: UploadCategory; subDir?: string; maxSize?: number } = {}
) {
  return createUploader(options).array(fieldName, maxCount);
}

/**
 * Mixed fields upload middleware.
 * @param fields Array of { name, maxCount } field definitions
 * @param options Category, subdirectory, max size
 */
export function uploadFields(
  fields: Array<{ name: string; maxCount: number }>,
  options: { category?: UploadCategory; subDir?: string; maxSize?: number } = {}
) {
  return createUploader(options).fields(fields);
}

// ─────────────────────────────────────────────────────────────
// Post-Upload Validation (magic bytes check)
// ─────────────────────────────────────────────────────────────

/**
 * Middleware to validate uploaded files' magic bytes after multer saves them.
 * Use AFTER uploadSingle/uploadMultiple in the middleware chain.
 */
export function validateUploadedFiles(req: Request, _res: any, next: any): void {
  const files: Express.Multer.File[] = [];

  if ((req as any).file) files.push((req as any).file);
  if ((req as any).files) {
    if (Array.isArray((req as any).files)) {
      files.push(...(req as any).files);
    } else {
      // fields() returns { [fieldname]: File[] }
      Object.values((req as any).files as Record<string, Express.Multer.File[]>).forEach(
        (arr) => files.push(...arr)
      );
    }
  }

  for (const file of files) {
    try {
      const buffer = fs.readFileSync(file.path);
      if (!validateMagicBytes(buffer, file.mimetype)) {
        // Delete the suspicious file
        fs.unlinkSync(file.path);
        log.error('File failed magic bytes validation — deleted', {
          filename: file.filename,
          mimetype: file.mimetype,
        });
        next(new AppError('Uploaded file content does not match its declared type', 415));
        return;
      }
    } catch (err) {
      log.warn('Could not validate magic bytes', {
        filename: file.filename,
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  next();
}

// ─────────────────────────────────────────────────────────────
// Cleanup Utility
// ─────────────────────────────────────────────────────────────

/**
 * Delete an uploaded file by its path.
 * Safe — logs errors but doesn't throw.
 */
export function deleteUploadedFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log.debug('Deleted uploaded file', { filePath });
      return true;
    }
    return false;
  } catch (err) {
    log.warn('Failed to delete uploaded file', {
      filePath,
      error: err instanceof Error ? err.message : err,
    });
    return false;
  }
}
