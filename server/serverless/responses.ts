import type { RequestHandler, Response } from 'express';
import { createLogger } from '../utils/logger.js';

const log = createLogger('ServerlessAPI');

export function respondFailure(
  res: Response,
  error: unknown,
  operation: string,
  status = 500
): void {
  log.error('Serverless operation failed', {
    operation,
    errorType: error instanceof Error ? error.name : 'UnknownError',
  });
  res.status(status).json({
    success: false,
    error: status === 400 ? 'Invalid request' : 'Internal server error',
  });
}

export const notImplemented =
  (feature: string, backendRoute: string): RequestHandler =>
  (_req, res) => {
    res.status(501).json({
      success: false,
      error: 'NOT_IMPLEMENTED_ON_SERVERLESS',
      feature,
      backendRoute,
      message: `${feature} is unavailable on this serverless deployment. Configure the full backend and verify ${backendRoute} before using it.`,
    });
  };
