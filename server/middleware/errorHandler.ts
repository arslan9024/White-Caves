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
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface AppErrorOptions {
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
}

type AsyncRouteHandler<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next?: NextFunction
) => Promise<unknown>;

// Async handler wrapper to catch errors
export const asyncHandler =
  <Req extends Request = Request>(fn: AsyncRouteHandler<Req>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };

/**
 * Standardized Application Error class
 * Supports both:
 * 1. SDD format: new AppError(statusCode: number, code: string, message: string)
 * 2. Classic format: new AppError(message: string, statusCode?: number, options?: AppErrorOptions)
 */
export class AppError extends Error implements CustomError {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;

  constructor(statusCode: number, code: string, message: string);
  constructor(message: string, statusCode?: number, options?: AppErrorOptions);
  constructor(
    arg1: string | number,
    arg2?: number | string,
    arg3?: string | AppErrorOptions
  ) {
    let message: string;
    let statusCode = 500;
    let code: string | undefined;
    let errors: Array<{ field?: string; message: string }> | undefined;

    if (typeof arg1 === 'number') {
      // SDD style: (statusCode, code, message)
      statusCode = arg1;
      code = typeof arg2 === 'string' ? arg2 : undefined;
      message = typeof arg3 === 'string' ? arg3 : '';
    } else {
      // Classic style: (message, statusCode?, options?)
      message = arg1;
      if (typeof arg2 === 'number') {
        statusCode = arg2;
      }
      if (typeof arg3 === 'object' && arg3 !== null) {
        code = arg3.code;
        errors = arg3.errors;
      }
    }

    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.errors = errors;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Type guard
  static isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }

  // Factory helpers
  static badRequest(message = 'Bad request', code = 'BAD_REQUEST', errors?: Array<{ field?: string; message: string }>): AppError {
    return new AppError(message, 400, { code, errors });
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): AppError {
    return new AppError(message, 401, { code });
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN'): AppError {
    return new AppError(message, 403, { code });
  }

  static notFound(resource = 'Resource', code = 'NOT_FOUND'): AppError {
    return new AppError(`${resource} not found`, 404, { code });
  }

  static conflict(message = 'Conflict', code = 'CONFLICT'): AppError {
    return new AppError(message, 409, { code });
  }

  static validation(message: string, errors?: Array<{ field?: string; message: string }>): AppError {
    return new AppError(`Validation error: ${message}`, 422, { code: 'VALIDATION_ERROR', errors });
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR'): AppError {
    return new AppError(message, 500, { code });
  }

  toJSON() {
    return {
      status: 'error',
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.code && { code: this.code }),
      ...(Array.isArray(this.errors) && this.errors.length > 0 && { errors: this.errors }),
    };
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
  const code = (err as CustomError).code;
  const details = (err as CustomError).errors;

  log.error(`${statusCode}: ${message}`);

  if (process.env.NODE_ENV === 'development') {
    log.error('Stack trace', { stack: err.stack });
  }

  res.status(statusCode).json({
    status: 'error',
    success: false,
    message,
    error: message,
    statusCode,
    ...(code && { code }),
    ...(Array.isArray(details) && details.length > 0 && { errors: details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Common error responses
export const errors = {
  UNAUTHORIZED: () => AppError.unauthorized(),
  FORBIDDEN: () => AppError.forbidden(),
  NOT_FOUND: (resource: string) => AppError.notFound(resource),
  BAD_REQUEST: (message: string) => AppError.badRequest(message),
  INTERNAL_SERVER_ERROR: () => AppError.internal(),
  VALIDATION_ERROR: (message: string) => AppError.validation(message),
  CONFLICT: (message: string) => AppError.conflict(message),
};
