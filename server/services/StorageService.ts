import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import logger from '../utils/logger.js';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'server', 'public', 'uploads', 'properties');
const TRANSFORMED_DIR = path.join(BASE_UPLOAD_DIR, 'transformed');

export interface StoredMediaAsset {
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  fileName: string;
}

class StorageService {
  private async ensureDirectories(): Promise<void> {
    await Promise.all([
      fs.mkdir(BASE_UPLOAD_DIR, { recursive: true }),
      fs.mkdir(TRANSFORMED_DIR, { recursive: true }),
    ]);
  }

  validateImage(file: Express.Multer.File): void {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      throw new Error('Unsupported image type. Allowed: JPEG, PNG, WEBP');
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error('Image exceeds maximum size (8MB)');
    }
  }

  async storePropertyImage(file: Express.Multer.File): Promise<StoredMediaAsset> {
    this.validateImage(file);
    await this.ensureDirectories();

    const imageId = crypto.randomUUID();
    const ext = this.resolveExtension(file.mimetype);
    const originalName = `${imageId}.${ext}`;
    const optimizedName = `${imageId}.webp`;
    const thumbnailName = `${imageId}-thumb.webp`;

    const originalPath = path.join(BASE_UPLOAD_DIR, originalName);
    const optimizedPath = path.join(TRANSFORMED_DIR, optimizedName);
    const thumbnailPath = path.join(TRANSFORMED_DIR, thumbnailName);

    await fs.writeFile(originalPath, file.buffer);

    await sharp(file.buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(optimizedPath);

    await sharp(file.buffer)
      .rotate()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(thumbnailPath);

    logger.info('Property image stored', { imageId, size: file.size });

    return {
      fileName: originalName,
      originalUrl: `/uploads/properties/${originalName}`,
      optimizedUrl: `/uploads/properties/transformed/${optimizedName}`,
      thumbnailUrl: `/uploads/properties/transformed/${thumbnailName}`,
    };
  }

  async deletePropertyImage(fileName: string): Promise<boolean> {
    const safeFileName = path.basename(fileName);
    if (!safeFileName) return false;

    const baseName = safeFileName.split('.').slice(0, -1).join('.') || safeFileName;
    const originalPath = path.join(BASE_UPLOAD_DIR, safeFileName);
    const optimizedPath = path.join(TRANSFORMED_DIR, `${baseName}.webp`);
    const thumbnailPath = path.join(TRANSFORMED_DIR, `${baseName}-thumb.webp`);

    let deleted = false;
    deleted = (await this.safeDelete(originalPath)) || deleted;
    deleted = (await this.safeDelete(optimizedPath)) || deleted;
    deleted = (await this.safeDelete(thumbnailPath)) || deleted;

    if (deleted) {
      logger.info('Property image deleted', { fileName: safeFileName });
    }
    return deleted;
  }

  private async safeDelete(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private resolveExtension(mimetype: string): 'jpg' | 'png' | 'webp' {
    if (mimetype === 'image/png') return 'png';
    if (mimetype === 'image/webp') return 'webp';
    return 'jpg';
  }
}

export const storageService = new StorageService();
