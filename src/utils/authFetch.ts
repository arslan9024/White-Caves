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

// ─── Auto-Logout ────────────────────────────────────────────────────────

function handleUnauthorized(): void {
  log.warn('Session expired or invalid token – logging out');
  safeStorage.remove('token');
  safeStorage.remove('userRole');
  // Navigate to sign-in; avoids importing router (keeps util pure)
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
}

// ─── Main Wrapper ───────────────────────────────────────────────────────

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number },
): Promise<Response> {
  const token = safeStorage.get('token');
  const headers = new Headers(init?.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

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

  let response: Response;
  try {
    response = await fetch(input, { ...init, headers, signal });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  // ── Centralized HTTP-status handling ───────────────────────────────
  if (response.status === 401) {
    handleUnauthorized();
    throw new HttpError('Session expired — please sign in again', 401, response.statusText);
  }

  if (response.status === 403) {
    throw new HttpError('Access denied — insufficient permissions', 403, response.statusText);
  }

  if (response.status >= 500) {
    log.error(`Server error ${response.status} for ${typeof input === 'string' ? input : 'request'}`);
    throw new HttpError(
      `Server error (${response.status}) — please try again later`,
      response.status,
      response.statusText,
    );
  }

  return response;
}

/**
 * Merge two AbortSignals so aborting either one aborts the request.
 * Uses AbortSignal.any() where available, falls back to event listener.
 */
function mergeAbortSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  // Modern browsers support AbortSignal.any()
  if ('any' in AbortSignal) {
    return (AbortSignal as unknown as { any(signals: AbortSignal[]): AbortSignal }).any([a, b]);
  }
  // Fallback: wire up listeners
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (a.aborted || b.aborted) { controller.abort(); return controller.signal; }
  a.addEventListener('abort', onAbort, { once: true });
  b.addEventListener('abort', onAbort, { once: true });
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
