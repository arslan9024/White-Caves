import type { Express } from 'express';
import { getPrismaClient } from './database.js';
import { readStringQuery } from './query.js';
import { respondFailure } from './responses.js';
import { createLogger } from '../utils/logger.js';
const log = createLogger('ServerlessHealth');
export function mountHealthProperties(app: Express): void {
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      environment: 'production',
      platform: 'vercel',
      database: 'prisma-mongodb',
      timestamp: new Date().toISOString(),
    });
  });
  app.get('/api/system/health', async (_req, res) => {
    let dbConnected = false;
    try {
      await getPrismaClient().$runCommandRaw({ ping: 1 });
      dbConnected = true;
    } catch (error) {
      log.warn('Database health probe failed', {
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });
    }

    res.json({
      server: { status: 'healthy', environment: 'production', platform: 'vercel' },
      database: {
        status: dbConnected ? 'connected' : 'not_connected',
        engine: 'prisma-mongodb',
      },
      firebase: {
        status: process.env.FIREBASE_SERVICE_ACCOUNT ? 'configured' : 'not_configured',
      },
      stripe: {
        status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
      },
    });
  });
  app.get('/api/properties', async (req, res) => {
    const query = readStringQuery(req.query);
    try {
      const {
        type,
        status,
        area,
        minPrice,
        maxPrice,
        search,
        page = '1',
        pageSize = '20',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      const limit = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
      const skip = (Math.max(1, parseInt(page) || 1) - 1) * limit;

      const where: Record<string, unknown> = {};
      if (type && type !== 'all') where.type = type;
      if (status && status !== 'all') where.status = status;
      if (area) where.area = area;
      if (minPrice || maxPrice) {
        where.price = {
          ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
          ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
        };
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [properties, total] = await Promise.all([
        getPrismaClient().property.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        getPrismaClient().property.count({ where }),
      ]);

      res.json({
        success: true,
        properties,
        pagination: {
          page: parseInt(page) || 1,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      respondFailure(res, error, 'properties.list');
    }
  });
  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await getPrismaClient().property.findUnique({
        where: { id: req.params.id },
      });
      if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
      res.json({ success: true, property });
    } catch (error) {
      respondFailure(res, error, 'properties.detail');
    }
  });
}
