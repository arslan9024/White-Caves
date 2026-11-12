import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { errorHandler } from '../middleware/errorHandler.js';
import { IS_PRODUCTION } from '../config/env.js';

export function configureFinalHandlers(app: Express): void {
  if (IS_PRODUCTION) {
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');

    // Serve SEO/PWA/static assets from public first (robots.txt, sitemap.xml, manifest.json, etc.)
    app.use(express.static(publicDir, { index: false }));
    // Serve built frontend assets from dist
    app.use(express.static(distDir, { index: false }));

    // SPA fallback for non-API GET requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api/')) return next();
      if (req.path.startsWith('/uploads/')) return next();

      res.sendFile(path.join(distDir, 'index.html'), err => {
        if (err) next();
      });
    });
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      success: false,
      message: `Route ${req.path} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });

  // Global error handler
  app.use(errorHandler);

  // ============================================================================
  // DATABASE CONNECTION & SERVER STARTUP
  // ============================================================================
}
