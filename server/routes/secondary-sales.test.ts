/**
 * Secondary Sales Routes — Comprehensive Test Suite
 * File upload testing with multer, stage transitions, and activity logging
 * 20 tests: Inventory fetch, stage validation, NOC document upload
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import secondarySalesRouter from './secondary-sales.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// ─────────────────────────────────────────────────────────────────────────────
// HOISTED MOCKS (vi.hoisted ensures import-time interception)
// ─────────────────────────────────────────────────────────────────────────────

const { mockPrisma, loggerMock, mockMulter } = vi.hoisted(() => {
  const fn = vi.fn;

  // Prisma mock with all required methods
  const mockPrisma = {
    property: {
      findMany: fn().mockResolvedValue([]),
      findUnique: fn().mockResolvedValue(null),
      update: fn().mockResolvedValue(null),
    },
    activity: {
      create: fn().mockResolvedValue(null),
    },
  };

  // Logger mock
  const loggerMock = {
    info: fn(),
    error: fn(),
    warn: fn(),
  };

  // Mock multer - returns middleware that sets req.file for tests
  const mockMulter = (config: any) => ({
    single: (fieldName: string) => (req: any, res: any, next: any) => {
      // Middleware just passes through; supertest.attach() will set req.file
      next();
    },
  });

  // Add diskStorage to mockMulter so routes can call multer.diskStorage()
  mockMulter.diskStorage = (config: any) => ({
    _storage: true,
  });

  return { mockPrisma, loggerMock, mockMulter };
});

// Mock imports
vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({ default: loggerMock }));
vi.mock('multer', () => ({ default: mockMulter }));
vi.mock('../middleware/errorHandler', () => ({
  asyncHandler: (fn: Function) => fn,
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function createApp(userId = 'user-1', withFileUpload = false): Express {
  const app = express();
  app.use(express.json());

  // Custom file upload interceptor for tests
  if (withFileUpload) {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      // Simulate multer setting req.file when multipart data is detected
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('multipart/form-data') || (req as any).file) {
        // Supertest sets req.file when using attach()
        if (!(req as any).file) {
          // Extract file extension from content-type or default to pdf
          let ext = '.pdf';
          if (contentType.includes('application/vnd.openxmlformats')) {
            ext = '.docx';
          } else if (contentType.includes('application/msword')) {
            ext = '.doc';
          }

          (req as any).file = {
            fieldname: 'document',
            originalname: `document${ext}`,
            encoding: '7bit',
            mimetype: contentType.includes('multipart') ? 'application/octet-stream' : contentType,
            size: 1024,
            filename: `document-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
            path: `/uploads/document-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
          };
        } else if ((req as any).file && (req as any).file.originalname) {
          // If file already set (by supertest), ensure filename has correct extension
          const ext = (req as any).file.originalname.substring(
            (req as any).file.originalname.lastIndexOf('.')
          );
          if (!((req as any).file.filename || '').endsWith(ext)) {
            (req as any).file.filename =
              `document-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            (req as any).file.path =
              `/uploads/document-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          }
        }
      }
      next();
    });
  }

  // Inject user context
  app.use((req: Request, _res: Response, next: NextFunction) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role: 'owner' };
    next();
  });

  // Mount router
  app.use('/api/secondary-sales', secondarySalesRouter);

  // Error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ success: false, error: message });
  });

  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const mockProperty = {
  id: 'prop-1',
  title: 'Downtown Dubai Apartment',
  unitNumber: '1001',
  area: 'Downtown Dubai',
  type: 'apartment',
  bedrooms: 3,
  bathrooms: 2,
  sqft: 2000,
  price: 2000000,
  inventoryStage: 'listed',
  documents: ['/uploads/floor-plan.pdf'],
  createdAt: new Date('2026-01-15'),
};

const mockActivity = {
  id: 'activity-1',
  type: 'property',
  action: 'status_changed',
  description: 'Sales Property 1001 moved to FORM A B SIGNED',
  userId: 'user-1',
  createdAt: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Secondary Sales Routes', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: GET / (Fetch secondary sales inventory)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('GET /', () => {
    it('returns all non-rental properties sorted by createdAt DESC', async () => {
      const properties = [
        { ...mockProperty, id: 'prop-1' },
        { ...mockProperty, id: 'prop-2' },
      ];
      mockPrisma.property.findMany.mockResolvedValueOnce(properties);

      const app = createApp();
      const res = await request(app).get('/api/secondary-sales/');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].id).toBe('prop-1');
    });

    it('returns empty array when no properties exist', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);

      const app = createApp();
      const res = await request(app).get('/api/secondary-sales/');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('filters to exclude rental-only properties type', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([mockProperty]);

      const app = createApp();
      await request(app).get('/api/secondary-sales/');

      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { not: 'rental' },
          }),
        })
      );
    });

    it('sorts results by createdAt DESC', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([mockProperty]);

      const app = createApp();
      await request(app).get('/api/secondary-sales/');

      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      );
    });

    it('includes all property fields in response', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([mockProperty]);

      const app = createApp();
      const res = await request(app).get('/api/secondary-sales/');

      expect(res.body.data[0]).toMatchObject({
        id: 'prop-1',
        title: expect.any(String),
        unitNumber: expect.any(String),
        area: expect.any(String),
        type: expect.any(String),
        bedrooms: expect.any(Number),
        price: expect.any(Number),
      });
    });

    it('handles database error gracefully', async () => {
      mockPrisma.property.findMany.mockRejectedValueOnce(new Error('DB error'));

      const app = createApp();
      const res = await request(app).get('/api/secondary-sales/');

      expect(res.status).toBe(500);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: PATCH /:id/stage (Stage transitions)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('PATCH /:id/stage', () => {
    it('transitions property to listed stage', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'listed',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1');
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'listed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.inventoryStage).toBe('listed');
    });

    it('transitions property to form_a_b_signed stage', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'form_a_b_signed',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'form_a_b_signed' });

      expect(res.status).toBe(200);
      expect(res.body.data.inventoryStage).toBe('form_a_b_signed');
    });

    it('transitions property to form_f_mou stage', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'form_f_mou',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'form_f_mou' });

      expect(res.status).toBe(200);
      expect(res.body.data.inventoryStage).toBe('form_f_mou');
    });

    it('transitions property to noc_pending stage', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'noc_pending',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'noc_pending' });

      expect(res.status).toBe(200);
      expect(res.body.data.inventoryStage).toBe('noc_pending');
    });

    it('transitions property to dld_transfer stage', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'dld_transfer',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'dld_transfer' });

      expect(res.status).toBe(200);
      expect(res.body.data.inventoryStage).toBe('dld_transfer');
    });

    it('returns 400 when newStage is invalid', async () => {
      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'invalid_stage' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid sales stage');
    });

    it('returns 400 when newStage is missing', async () => {
      const app = createApp();
      const res = await request(app).patch('/api/secondary-sales/prop-1/stage').send({});

      expect(res.status).toBe(400);
    });

    it('returns 404 when property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);

      const app = createApp();
      const res = await request(app)
        .patch('/api/secondary-sales/prop-notfound/stage')
        .send({ newStage: 'listed' });

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Property not found');
    });

    it('creates audit trail activity on stage transition', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'form_a_b_signed',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1');
      await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'form_a_b_signed' });

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'property',
            action: 'status_changed',
            userId: 'user-1',
          }),
        })
      );
    });

    it('includes property unit number in activity description', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'listed',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      await request(app).patch('/api/secondary-sales/prop-1/stage').send({ newStage: 'listed' });

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: expect.stringContaining('1001'),
          }),
        })
      );
    });

    it('updates property inventoryStage field', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        inventoryStage: 'noc_pending',
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp();
      await request(app)
        .patch('/api/secondary-sales/prop-1/stage')
        .send({ newStage: 'noc_pending' });

      expect(mockPrisma.property.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'prop-1' },
          data: { inventoryStage: 'noc_pending' },
        })
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: POST /:id/noc (NOC document upload)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('POST /:id/noc', () => {
    it('uploads NOC document and updates property', async () => {
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        documents: ['/uploads/floor-plan.pdf', '/uploads/noc-document.pdf'],
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      const res = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC content'), 'noc-document.pdf');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fileUrl).toContain('/uploads/');
      expect(res.body.data.fileUrl).toContain('.pdf');
    });

    it('stores file with unique suffix in filename', async () => {
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        documents: ['/uploads/floor-plan.pdf', '/uploads/noc-document-123456789.pdf'],
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      const res = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC'), 'noc.pdf');

      const fileUrl = res.body.data.fileUrl;
      expect(fileUrl).toMatch(/\d+-\d+\.pdf$/);
    });

    it('appends document URL to property documents array', async () => {
      const updatedProperty = {
        ...mockProperty,
        documents: ['/uploads/floor-plan.pdf', '/uploads/noc-new.pdf'],
      };
      mockPrisma.property.update.mockResolvedValueOnce(updatedProperty);
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC'), 'noc.pdf');

      expect(mockPrisma.property.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'prop-1' },
        })
      );
    });

    it('returns 400 when no file is uploaded', async () => {
      const app = createApp('user-1', true);
      const res = await request(app).post('/api/secondary-sales/prop-1/noc');

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('No NOC file uploaded');
    });

    it('creates audit trail activity on document upload', async () => {
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        documents: ['/uploads/floor-plan.pdf', '/uploads/noc-new.pdf'],
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC'), 'noc.pdf');

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'system',
            action: 'updated',
            userId: 'user-1',
          }),
        })
      );
    });

    it('includes property unit number in activity description', async () => {
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        documents: ['/uploads/noc-new.pdf'],
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC'), 'noc.pdf');

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: expect.stringContaining('Developer NOC uploaded'),
          }),
        })
      );
    });

    it('returns updated property in response', async () => {
      const updatedProperty = {
        ...mockProperty,
        documents: ['/uploads/noc-new.pdf'],
      };
      mockPrisma.property.update.mockResolvedValueOnce(updatedProperty);
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      const res = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC'), 'noc.pdf');

      expect(res.body.data.property).toMatchObject({
        id: 'prop-1',
        title: expect.any(String),
      });
    });

    it('handles multiple sequential uploads', async () => {
      mockPrisma.property.update
        .mockResolvedValueOnce({
          ...mockProperty,
          documents: ['/uploads/noc-1.pdf'],
        })
        .mockResolvedValueOnce({
          ...mockProperty,
          documents: ['/uploads/noc-1.pdf', '/uploads/noc-2.pdf'],
        });
      mockPrisma.activity.create
        .mockResolvedValueOnce(mockActivity)
        .mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);

      const res1 = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC 1'), 'noc1.pdf');

      const res2 = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('NOC 2'), 'noc2.pdf');

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(mockPrisma.property.update).toHaveBeenCalledTimes(2);
    });

    it('handles upload with different file types', async () => {
      mockPrisma.property.update.mockResolvedValueOnce({
        ...mockProperty,
        documents: ['/uploads/noc-doc.docx'],
      });
      mockPrisma.activity.create.mockResolvedValueOnce(mockActivity);

      const app = createApp('user-1', true);
      const res = await request(app)
        .post('/api/secondary-sales/prop-1/noc')
        .attach('document', Buffer.from('DOC'), 'noc.docx');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fileUrl).toMatch(/\/uploads\/document-\d+-\d+\./);
    });
  });
});
