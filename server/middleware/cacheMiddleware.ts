/**
 * Route-Level Cache Middleware — Wave 15 Performance Layer
 * Intercepts GET requests, checks Redis cache pool, and tags responses with X-Cache headers.
 */

import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/CacheService.js';

export interface CacheMiddlewareOptions {
  ttlSeconds?: number;
  keyPrefix?: string;
}

export function cacheMiddleware(options: number | CacheMiddlewareOptions = 300) {
  const ttlSeconds = typeof options === 'number' ? options : (options.ttlSeconds ?? 300);
  const keyPrefix = typeof options === 'number' ? 'wc:route' : (options.keyPrefix ?? 'wc:route');

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Bypass cache if request asks for fresh content
    if (req.headers['cache-control'] === 'no-cache' || req.headers['pragma'] === 'no-cache') {
      return next();
    }

    const key = `${keyPrefix}:${req.originalUrl || req.url}`;
    try {
      const cached = await cacheService.get(key);
      if (cached !== null) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached);
      }
    } catch {
      // Graceful degradation: on cache read error, continue to DB
    }

    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);

    res.json = function (data: unknown) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(key, data as any, ttlSeconds).catch(() => {});
      }
      return originalJson(data);
    };

    next();
  };
}

export default cacheMiddleware;
