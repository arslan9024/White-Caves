/**
 * Authenticated fetch wrapper
 * ────────────────────────────
 * Adds JWT Bearer token from localStorage to every request.
 * Centralizes HTTP-status handling:
 *   • 401 → clears auth data and redirects to sign-in
 *   • 403 → throws with clear "Access denied" message
 *   • 5xx → throws with server-error context
 *
 * Drop-in replacement for window.fetch() in Redux thunks.
 */

import { safeStorage } from './safeStorage';
import { createLogger } from './logger';
import { HttpError } from './HttpError';

const log = createLogger('authFetch');
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf_token';
const AUTH_REFRESH_ENDPOINT = '/api/auth/refresh';
let refreshInFlight: Promise<boolean> | null = null;

// ─── Auto-Logout ────────────────────────────────────────────────────────

function handleUnauthorized(): void {
  log.warn('Session expired or invalid token – logging out');
  safeStorage.remove('token');
  safeStorage.remove('userRole');
  // Navigate to sign-in; avoids importing router (keeps util pure)
  if (window.location.pathname !== '/signin') {
    window.location.href = '/signin';
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const entries = document.cookie ? document.cookie.split(';') : [];
  for (const entry of entries) {
    const [key, ...valueParts] = entry.trim().split('=');
    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }
  return null;
}

function withCsrfHeader(headers: Headers, input: RequestInfo | URL, method: string): void {
  const upperMethod = method.toUpperCase();
  const isMutationMethod = !['GET', 'HEAD', 'OPTIONS'].includes(upperMethod);
  if (!isMutationMethod || headers.has(CSRF_HEADER_NAME)) return;

  const inputUrl = typeof input === 'string' ? input : input instanceof URL ? input.pathname : '';
  const isAuthMutation = inputUrl.startsWith('/api/auth/');
  if (!isAuthMutation) return;

  const csrfToken = getCookieValue(CSRF_COOKIE_NAME);
  if (csrfToken) {
    headers.set(CSRF_HEADER_NAME, csrfToken);
  }
}

async function attemptSessionRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const csrfToken = getCookieValue(CSRF_COOKIE_NAME);
      const headers = new Headers();
      if (csrfToken) {
        headers.set(CSRF_HEADER_NAME, csrfToken);
      }
      headers.set('Content-Type', 'application/json');

      try {
        const response = await fetch(AUTH_REFRESH_ENDPOINT, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          return false;
        }

        const payload = (await response.json()) as {
          success?: boolean;
          data?: { token?: string };
        };
        const rotatedToken = payload?.data?.token;
        if (!rotatedToken) {
          return false;
        }

        safeStorage.set('token', rotatedToken);
        return true;
      } catch (error) {
        log.warn('Session refresh failed', error);
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

// ─── Main Wrapper ───────────────────────────────────────────────────────

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number }
): Promise<Response> {
  const requestMethod = init?.method ?? 'GET';
  const runRequest = async (): Promise<Response> => {
    const token = safeStorage.get('token');
    const headers = new Headers(init?.headers);

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    withCsrfHeader(headers, input, requestMethod);

    // Ensure JSON content-type for requests with a body (skip FormData — browser sets multipart boundary)
    if (init?.body && !headers.has('Content-Type') && !(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // ── Timeout guard (default 30s) ─────────────────────────────────────
    const timeout = init?.timeout ?? 30_000;
    const controller = new AbortController();
    const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;
    // Respect caller-supplied signal (e.g. from AbortController in useEffect)
    const signal = init?.signal
      ? mergeAbortSignals(init.signal, controller.signal)
      : controller.signal;

    try {
      return await fetch(input, { ...init, headers, signal, credentials: init?.credentials ?? 'include' });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  let response = await runRequest();

  // ── Centralized HTTP-status handling ───────────────────────────────
  if (response.status === 401) {
    const normalizedUrl = typeof input === 'string' ? input : input instanceof URL ? input.pathname : '';
    const isRefreshRequest = normalizedUrl.startsWith(AUTH_REFRESH_ENDPOINT);
    if (!isRefreshRequest) {
      const refreshed = await attemptSessionRefresh();
      if (refreshed) {
        response = await runRequest();
        if (response.status !== 401) {
          return response;
        }
      }
    }
    handleUnauthorized();
    throw new HttpError('Session expired — please sign in again', 401, response.statusText);
  }

  if (response.status === 403) {
    throw new HttpError('Access denied — insufficient permissions', 403, response.statusText);
  }

  if (response.status >= 500) {
    log.error(
      `Server error ${response.status} for ${typeof input === 'string' ? input : 'request'}`
    );
    throw new HttpError(
      `Server error (${response.status}) — please try again later`,
      response.status,
      response.statusText
    );
  }

  return response;
}

/**
 * Merge two AbortSignals so aborting either one aborts the request.
 * Uses AbortSignal.any() where available, falls back to event listener.
 */
function mergeAbortSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const onAbort = () => controller.abort();

  const isAbortSignalLike = (signal: unknown): signal is AbortSignal => {
    return Boolean(
      signal &&
      typeof signal === 'object' &&
      'aborted' in signal &&
      typeof (signal as AbortSignal).addEventListener === 'function'
    );
  };

  const signals = [a, b].filter(isAbortSignalLike);

  if (signals.some(signal => signal.aborted)) {
    controller.abort();
    return controller.signal;
  }

  signals.forEach(signal => {
    signal.addEventListener('abort', onAbort, { once: true });
  });

  return controller.signal;
}

/**
 * Parse a non-OK API response and extract the server's error message.
 * Falls back to a generic message if parsing fails.
 * Usage in thunks:
 *   if (!response.ok) throw new Error(await extractApiError(response, 'Failed to save'));
 */
export async function extractApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    // Backend AppError format: { message: '...' } or { error: '...' }
    return data?.message || data?.error || `${fallback} (${response.status})`;
  } catch {
    return `${fallback} (${response.status})`;
  }
}

// Re-export HttpError so existing consumers can still import from this module
export { HttpError } from './HttpError';
