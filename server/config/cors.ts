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
    const host = parsed.hostname;
    return (
      (host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]' ||
        host === '::1' ||
        host.endsWith('.localhost')) &&
      (parsed.protocol === 'http:' || parsed.protocol === 'https:')
    );
  } catch {
    return false;
  }
}

/**
 * Production origins that are always allowed regardless of CORS_ORIGIN env.
 * Keeps the Vercel frontend and the named Cloudflare tunnel working even when
 * the env allowlist is misconfigured.
 */
const ALLOWED_STATIC_ORIGINS: readonly string[] = [
  'https://whitecaves.com',
  'https://www.whitecaves.com',
  'https://white-caves.vercel.app',
  'https://api.whitecaves.com',
];

/**
 * Hosted-platform hostname suffixes allowed for preview/tunnel traffic (https only).
 * Deliberately scoped: `.vercel.app` previews are restricted to this project's
 * account suffix so arbitrary third-party Vercel apps cannot send credentialed
 * requests; `.trycloudflare.com` enables Cloudflare quick tunnels during bridge
 * development.
 */
const ALLOWED_ORIGIN_SUFFIXES: readonly string[] = [
  '.trycloudflare.com',
  '-arslan-maliks-projects.vercel.app',
];

function matchesAllowedSuffix(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:') {
      return false;
    }
    return ALLOWED_ORIGIN_SUFFIXES.some(suffix => hostname.endsWith(suffix));
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

  if (ALLOWED_STATIC_ORIGINS.includes(normalizedOrigin)) {
    return true;
  }

  if (matchesAllowedSuffix(normalizedOrigin)) {
    return true;
  }

  return allowedOrigins.includes(normalizedOrigin);
}
