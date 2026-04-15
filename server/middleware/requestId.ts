/**
 * Request ID Middleware
 * ====================
 * Generates a unique request ID for every HTTP request, enabling end-to-end
 * tracing through logs, error reports, and downstream services.
 *
 * Behaviour:
 *   1. If the client sends an x-request-id header, honour it (proxy/gateway chains).
 *   2. Otherwise generate a compact UUID-v4 (crypto.randomUUID).
 *   3. Attach the ID to `req.requestId` and echo it back via the response header.
 *
 * Any downstream logger can read `req.requestId` to correlate log entries.
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request so TypeScript recognises `req.requestId`
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const HEADER = 'x-request-id';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Express middleware — attach a unique request ID to every request.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Honour upstream request IDs (API gateways, load balancers)
  const incoming = req.headers[HEADER] as string | undefined;
  const id = incoming && UUID_RE.test(incoming) ? incoming : crypto.randomUUID();

  req.requestId = id;
  res.setHeader(HEADER, id);
  next();
}
