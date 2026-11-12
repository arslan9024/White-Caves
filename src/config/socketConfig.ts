/**
 * Socket.io connection configuration.
 *
 * Single source of truth for resolving the realtime server origin so the
 * REST layer and every socket consumer agree on where the backend lives.
 *
 * Resolution priority:
 *  1. VITE_API_URL (origin only — any path such as `/api` is stripped),
 *     required for production where the API lives on another origin
 *     (e.g. Cloudflare Tunnel / api.whitecaves.com) than the Vercel frontend.
 *  2. Browser origin (development, where Vite proxies to the API).
 *  3. Local API default (http://localhost:5001 — see server/index.ts).
 */
import logger from '../utils/logger';

export const LOCAL_API_ORIGIN = 'http://localhost:5001';

export function resolveSocketUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (raw) {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : LOCAL_API_ORIGIN;
      const parsed = new URL(raw, base);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Unsupported socket origin protocol');
      }
      return parsed.origin;
    } catch {
      logger.warn('[socketConfig] VITE_API_URL is invalid; falling back to browser origin.');
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return LOCAL_API_ORIGIN;
}
