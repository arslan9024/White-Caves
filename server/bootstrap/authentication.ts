import { Express, Request, Response, NextFunction } from 'express';
import { prisma } from '../database.js';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { isAuthenticationRequired } from '../config/authenticationPolicy.js';

export function configureAuthentication(app: Express): void {
  // Protected routes (require authentication in production or when DEV_AUTH_BYPASS=false)
  if (isAuthenticationRequired()) {
    app.use('/api', authMiddleware);
    logger.info(
      `🔒 Auth middleware enabled — all protected /api routes require JWT (${
        process.env.NODE_ENV === 'production' ? 'production mode' : 'DEV_AUTH_BYPASS=false'
      })`
    );
  } else if (process.env.NODE_ENV === 'development') {
    logger.info(
      'ℹ️  Dev auth fallback active (DEV_AUTH_BYPASS enabled) — unauthenticated /api requests inherit Lion superuser'
    );

    // Lion Superuser: stable dev identity when DB is unreachable
    const LION_SUPERUSER = {
      id: 'lion-superuser-dev',
      email: process.env.CREATOR_SUPERUSER_EMAIL || 'arslanmalikgoraha@gmail.com',
      role: 'managing_director',
      name: 'Arslan Malik (Lion)',
    };

    let cachedDevUser: { id: string; email: string; role: string; name?: string } | null = null;

    app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        return authMiddleware(req, res, next);
      }
      // Dev fallback: look up real owner user from DB (once, then cache)
      try {
        if (!cachedDevUser) {
          const owner = await prisma.user.findFirst({
            where: { email: { in: ['owner@whitecaves.ae', LION_SUPERUSER.email] } },
            orderBy: [{ role: 'asc' }],
          });
          if (owner) {
            cachedDevUser = {
              id: owner.id,
              email: owner.email,
              role: owner.role,
              name: owner.name ?? undefined,
            };
            logger.info(`Dev auth: using owner ${owner.name} (${owner.id})`);
          } else {
            cachedDevUser = LION_SUPERUSER;
            logger.warn('Dev auth: owner not found in DB — using Lion superuser fallback');
          }
        }
        req.user = { ...cachedDevUser };
      } catch {
        // DB unreachable — fall back to Lion superuser so the app stays functional
        req.user = { ...LION_SUPERUSER };
        logger.warn('Dev auth: DB unreachable — Lion superuser identity applied');
      }
      next();
    });
  }
}
