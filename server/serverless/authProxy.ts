import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ServerlessAuthProxy');
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'forwarded',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
]);

type Fetcher = typeof fetch;

function parseBackendOrigin(value: string | undefined): URL | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isLocalDevelopment =
      process.env.NODE_ENV !== 'production' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      (url.protocol !== 'https:' && !isLocalDevelopment) ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return new URL(url.origin);
  } catch {
    return null;
  }
}

function copyRequestHeaders(request: Request): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (value && !HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      headers.set(name, Array.isArray(value) ? value.join(', ') : value);
    }
  }
  return headers;
}

function copyResponseHeaders(source: Headers, target: Response): void {
  source.forEach((value, name) => {
    if (name.toLowerCase() !== 'set-cookie' && !HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      target.setHeader(name, value);
    }
  });

  const cookies = source.getSetCookie();
  if (cookies.length > 0) target.setHeader('set-cookie', cookies);
}

export function createAuthProxy(
  backendOrigin: string | undefined,
  fetcher: Fetcher = fetch
): RequestHandler {
  const origin = parseBackendOrigin(backendOrigin);
  if (backendOrigin && !origin) {
    logger.error('Invalid BACKEND_API_ORIGIN; auth proxy will fail closed');
  }

  return async (req, res, next: NextFunction) => {
    if (!origin) {
      res.status(503).json({
        success: false,
        error: 'Authentication backend is not configured',
      });
      return;
    }

    try {
      const target = new URL(req.originalUrl, origin);
      const headers = copyRequestHeaders(req);
      const hasBody = req.body !== undefined && !['GET', 'HEAD'].includes(req.method);
      const upstream = await fetcher(target, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
        redirect: 'manual',
      });

      copyResponseHeaders(upstream.headers, res);
      const body = Buffer.from(await upstream.arrayBuffer());
      res.status(upstream.status).send(body);
    } catch (error) {
      if (res.headersSent) {
        next(error);
        return;
      }

      logger.error('Authentication proxy request failed', {
        path: req.path,
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });
      res.status(502).json({
        success: false,
        error: 'Authentication service is temporarily unavailable',
      });
    }
  };
}
