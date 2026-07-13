import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import mediaRoutes from './media.js';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockPrisma, mockStorageService, mockLogger } = vi.hoisted(() => {
  const fn = vi.fn;
  const logger = {
    createLogger: vi.fn((name: string) => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    })),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
  return {
    mockPrisma: {
      property: {
        findUnique: fn().mockResolvedValue({
          id: 'prop-1',
          userId: 'user-1',
          images: [],
        }),
        update: fn().mockResolvedValue({
          id: 'prop-1',
          images: ['/uploads/properties/transformed/a.webp'],
        }),
      },
    },
    mockStorageService: {
      storePropertyImage: fn().mockResolvedValue({
        fileName: 'a.jpg',
        originalUrl: '/uploads/properties/a.jpg',
        optimizedUrl: '/uploads/properties/transformed/a.webp',
        thumbnailUrl: '/uploads/properties/transformed/a-thumb.webp',
      }),
      deletePropertyImage: fn().mockResolvedValue(true),
    },
    mockLogger: logger,
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/StorageService.js', () => ({ storageService: mockStorageService }));
vi.mock('../utils/logger.js', () => ({
  default: mockLogger,
  createLogger: mockLogger.createLogger,
  logger: mockLogger,
}));

function createApp(role = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: userId, role, email: 'test@whitecaves.ae' };
    next();
  });
  app.use('/api/media', mediaRoutes);
  app.use(errorHandler);
  return app;
}

describe('Media routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads property media and persists URL', async () => {
    const res = await request(createApp())
      .post('/api/media/upload')
      .field('propertyId', 'prop-1')
      .attach('image', Buffer.from('test-image-content'), 'photo.jpg');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockStorageService.storePropertyImage).toHaveBeenCalled();
    expect(mockPrisma.property.update).toHaveBeenCalled();
  });

  it('rejects upload without file', async () => {
    const res = await request(createApp()).post('/api/media/upload').field('propertyId', 'prop-1');
    expect(res.status).toBe(400);
  });

  it('deletes property media and updates images array', async () => {
    mockPrisma.property.findUnique.mockResolvedValueOnce({
      id: 'prop-1',
      userId: 'user-1',
      images: ['/uploads/properties/transformed/a.webp'],
    });

    const res = await request(createApp()).delete('/api/media/prop-1/a.jpg');
    expect(res.status).toBe(200);
    expect(mockStorageService.deletePropertyImage).toHaveBeenCalledWith('a.jpg');
    expect(mockPrisma.property.update).toHaveBeenCalled();
  });
});
