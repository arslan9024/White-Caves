import express, { type NextFunction, type Request, type Response } from 'express';
import authRoutes from './auth.js';

export function createApp(
  role: string | null = 'owner',
  userId: string | null = 'user-1',
  autoCsrf = true
): express.Express {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use((req, _res, next) => {
    const cookieHeader = req.headers.cookie;
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach(part => {
        const eqIdx = part.indexOf('=');
        if (eqIdx > 0) {
          cookies[part.slice(0, eqIdx).trim()] = decodeURIComponent(part.slice(eqIdx + 1).trim());
        }
      });
    }
    // Non-CSRF tests model the frontend's GET /csrf bootstrap before mutations.
    if (autoCsrf && !cookies.csrf_token) {
      cookies.csrf_token = 'auth-test-csrf-token';
      req.headers['x-csrf-token'] = 'auth-test-csrf-token';
    }
    req.cookies = cookies;
    next();
  });
  app.use((req, _res, next) => {
    if (userId) {
      Object.assign(req, {
        user: { id: userId, email: 'test@whitecaves.ae', role: role || 'owner' },
      });
    }
    next();
  });
  app.use('/api/auth', authRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}
