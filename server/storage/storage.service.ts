import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';
import logger from '../utils/logger.js';

interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  conversationId: string;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
  };
}

export class StorageService {
  private basePath: string;
  private uploadDir: string;
  private thumbnailDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor(basePath: string = './uploads') {
    this.basePath = basePath;
    this.uploadDir = path.join(basePath, 'files');
    this.thumbnailDir = path.join(basePath, 'thumbnails');
    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  private ensureDirectories(): void {
    [this.basePath, this.uploadDir, this.thumbnailDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Upload file
   */
  public async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
    conversationId: string,
    uploadedBy: string
  ): Promise<FileMetadata> {
    // Validate file
    this.validateFile(fileBuffer, mimetype, originalName);

    // Generate file ID and filename
    const fileId = crypto.randomBytes(16).toString('hex');
    const ext = this.getFileExtension(originalName);
    const filename = `${fileId}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    // Write file
    fs.writeFileSync(filepath, fileBuffer);

    // Generate thumbnail if image
    let thumbnailUrl: string | undefined;
    const metadata: any = {};

    if (mimetype.startsWith('image/')) {
      thumbnailUrl = await this.generateThumbnail(fileBuffer, fileId);
      const image = sharp(fileBuffer);
      const dims = await image.metadata();
      metadata.width = dims.width;
      metadata.height = dims.height;
    }

    const fileMetadata: FileMetadata = {
      id: fileId,
      originalName,
      filename,
      mimetype,
      size: fileBuffer.length,
      uploadedAt: new Date(),
      uploadedBy,
      conversationId,
      url: `/api/files/${fileId}`,
      thumbnailUrl,
      metadata,
    };

    logger.info(`File uploaded: ${filename}`);
    return fileMetadata;
  }

  /**
   * Download file
   */
  public downloadFile(fileId: string): Buffer | null {
    const files = fs.readdirSync(this.uploadDir);
    const filename = files.find((f) => f.startsWith(fileId));

    if (!filename) {
      logger.warn(`File not found: ${fileId}`);
      return null;
    }

    const filepath = path.join(this.uploadDir, filename);
    return fs.readFileSync(filepath);
  }

  /**
   * Delete file
   */
  public deleteFile(fileId: string): boolean {
    const files = fs.readdirSync(this.uploadDir);
    const filename = files.find((f) => f.startsWith(fileId));

    if (!filename) {
      return false;
    }

    const filepath = path.join(this.uploadDir, filename);
    fs.unlinkSync(filepath);

    // Delete thumbnail if exists
    const thumbFiles = fs.readdirSync(this.thumbnailDir);
    const thumbFile = thumbFiles.find((f) => f.startsWith(fileId));
    if (thumbFile) {
      fs.unlinkSync(path.join(this.thumbnailDir, thumbFile));
    }

    logger.info(`File deleted: ${filename}`);
    return true;
  }

  /**
   * Generate thumbnail for image
   */
  private async generateThumbnail(
    fileBuffer: Buffer,
    fileId: string
  ): Promise<string> {
    const thumbnailName = `${fileId}-thumb.webp`;
    const thumbnailPath = path.join(this.thumbnailDir, thumbnailName);

    await sharp(fileBuffer)
      .resize(200, 200, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    return `/api/files/${fileId}/thumbnail`;
  }

  /**
   * Validate file
   */
  private validateFile(
    buffer: Buffer,
    mimetype: string,
    filename: string
  ): void {
    // Check size
    if (buffer.length > this.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new Error(
        `File type ${mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Check file extension
    const ext = path.extname(filename).toLowerCase();
    const validExts = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.mp4',
      '.webm',
      '.mp3',
      '.wav',
      '.pdf',
      '.doc',
      '.docx',
    ];
    if (!validExts.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`);
    }
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    const ext = path.extname(filename);
    return ext || '.bin';
  }

  /**
   * Cleanup old files
   */
  public cleanupOldFiles(daysOld: number = 30): number {
    const now = new Date();
    const cutoffTime = now.getTime() - daysOld * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    fs.readdirSync(this.uploadDir).forEach((filename) => {
      const filepath = path.join(this.uploadDir, filename);
      const stats = fs.statSync(filepath);

      if (stats.mtimeMs < cutoffTime) {
        fs.unlinkSync(filepath);
        deletedCount++;
      }
    });

    logger.info(`Cleaned up ${deletedCount} old files`);
    return deletedCount;
  }

  /**
   * Get file info
   */
  public getFileInfo(fileId: string): FileMetadata | null {
    const files = fs.readdirSync(this.uploadDir);
    const filename = files.find((f) => f.startsWith(fileId));

    if (!filename) {
      return null;
    }

    const filepath = path.join(this.uploadDir, filename);
    const stats = fs.statSync(filepath);

    return {
      id: fileId,
      originalName: filename,
      filename: filename,
      mimetype: this.getMimeType(filename),
      size: stats.size,
      uploadedAt: stats.birthtime,
      uploadedBy: 'unknown',
      conversationId: 'unknown',
      url: `/api/files/${fileId}`,
      metadata: {},
    };
  }

  /**
   * Get mime type
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.pdf': 'application/pdf',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  /**
   * Get storage stats
   */
  public getStats(): {
    totalFiles: number;
    totalSize: number;
    diskUsageMB: number;
  } {
    let totalSize = 0;
    let totalFiles = 0;

    fs.readdirSync(this.uploadDir).forEach((filename) => {
      const filepath = path.join(this.uploadDir, filename);
      const stats = fs.statSync(filepath);
      totalSize += stats.size;
      totalFiles++;
    });

    return {
      totalFiles,
      totalSize,
      diskUsageMB: totalSize / 1024 / 1024,
    };
  }
}

export default StorageService;
