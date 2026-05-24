import type { Request } from 'express';

const COMMON_DEV_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5173',
];

function normalizeOrigin(origin: string | null | undefined): string | null {
  if (!origin) {
    return null;
  }

  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

export function buildAllowedCorsOrigins(
  configuredOrigins: readonly string[],
  nodeEnv: string | undefined
): string[] {
  const origins = new Set<string>();

  for (const origin of configuredOrigins) {
    const normalized = normalizeOrigin(origin);
    if (normalized) {
      origins.add(normalized);
    }
  }

  if ((nodeEnv || 'development') !== 'production') {
    for (const origin of COMMON_DEV_CORS_ORIGINS) {
      origins.add(origin);
    }
  }

  return [...origins];
}

export function inferRequestOrigin(req: Request): string | null {
  const forwardedHost = req.headers['x-forwarded-host'];
  const hostHeader =
    typeof forwardedHost === 'string' && forwardedHost.length > 0
      ? forwardedHost.split(',')[0].trim()
      : req.get('host') || '';

  if (!hostHeader) {
    return null;
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol =
    typeof forwardedProto === 'string' && forwardedProto.length > 0
      ? forwardedProto.split(',')[0].trim()
      : req.protocol;

  return normalizeOrigin(`${protocol}://${hostHeader}`);
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const parsed = new URL(origin);
    return (
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
      (parsed.protocol === 'http:' || parsed.protocol === 'https:')
    );
  } catch {
    return false;
  }
}

export function isCorsOriginAllowed(
  origin: string | undefined,
  allowedOrigins: readonly string[],
  requestOrigin?: string | null,
  nodeEnv?: string
): boolean {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  if (requestOrigin && normalizedOrigin === requestOrigin) {
    return true;
  }

  if ((nodeEnv || 'development') !== 'production' && isLocalDevOrigin(normalizedOrigin)) {
    return true;
  }

  return allowedOrigins.includes(normalizedOrigin);
}
