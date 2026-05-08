/**
 * Error Handler Middleware
 * Central error handling for all Express routes
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger.js';

const log = createLogger('ErrorHandler');

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

type AsyncRouteHandler = (req: Request, res: Response, next?: NextFunction) => Promise<unknown>;

// Async handler wrapper to catch errors
export const asyncHandler =
  (fn: AsyncRouteHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Common error class
export class AppError extends Error implements CustomError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = (err as CustomError).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  log.error(`${statusCode}: ${message}`);

  if (process.env.NODE_ENV === 'development') {
    log.error('Stack trace', { stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Common error responses
export const errors = {
  UNAUTHORIZED: () => new AppError('Unauthorized', 401),
  FORBIDDEN: () => new AppError('Forbidden', 403),
  NOT_FOUND: (resource: string) => new AppError(`${resource} not found`, 404),
  BAD_REQUEST: (message: string) => new AppError(message, 400),
  INTERNAL_SERVER_ERROR: () => new AppError('Internal server error', 500),
  VALIDATION_ERROR: (message: string) => new AppError(`Validation error: ${message}`, 422),
  CONFLICT: (message: string) => new AppError(message, 409),
};
