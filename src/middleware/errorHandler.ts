import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Global error handling middleware
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error with request ID if available
  const requestId = res.getHeader('X-Request-ID') as string | undefined;
  logger.error('Unhandled error', { err, requestId });

  // Do not leak internal error details in production
  const response = process.env.NODE_ENV === 'production' && status === 500
    ? { error: 'Internal Server Error' }
    : { error: message, ...(err.details || {}) };

  res.status(status).json(response);
}
