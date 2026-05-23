/**
 * Request ID Middleware
 * ─────────────────────
 * Generates a unique request ID for every inbound HTTP request.
 * - Accepts an existing `X-Request-ID` header from trusted upstream proxies
 *   (e.g. load balancers, Vercel edge) as long as it matches the safe-ID pattern.
 * - Falls back to a server-generated UUID v4 when the header is absent or unsafe.
 * - Attaches `req.requestId` for use in route handlers and log statements.
 * - Echoes the ID back in the `X-Request-ID` response header so clients and
 *   monitoring tools can correlate requests end-to-end.
 *
 * Security audit value: every log line and DB activity row should include
 * `requestId` so incidents can be reconstructed across multiple log entries.
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Extend the Express Request type to include requestId
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

/**
 * Pattern for an acceptable incoming `X-Request-ID` value.
 * Only alphanumeric characters, hyphens, and underscores, 1–128 chars.
 * Rejects values that could be used for log injection or header smuggling.
 */
const SAFE_REQUEST_ID_RE = /^[\w-]{1,128}$/;

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id'];

  const requestId =
    typeof incoming === 'string' && SAFE_REQUEST_ID_RE.test(incoming)
      ? incoming
      : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
}

export default requestIdMiddleware;
