/**
 * fetchWithRetry — Resilient fetch wrapper for the White Caves frontend.
 * =======================================================================
 * WHEN TO USE: The production frontend reaches the local backend through a
 * Cloudflare tunnel. While the local backend restarts or the tunnel
 * reconnects, Cloudflare briefly answers with HTTP 502/503/504. This wrapper
 * absorbs those transient gateway errors (and raw network failures) with
 * exponential backoff instead of surfacing them to the user.
 *
 * RETRY POLICY:
 * - Retries ONLY on network errors (fetch rejection) and HTTP 502/503/504.
 * - Any other status (200, 400, 401, 404, 500, …) is returned immediately.
 * - AbortError is never retried — caller-initiated cancellation is honored.
 * - Defaults: retries=3, backoffMs=1000 → waits of 1s, 2s, 4s.
 * - After exhausting retries: the last gateway-error Response is returned;
 *   a persistent network error is re-thrown.
 */
import logger from '../../utils/logger';

export interface FetchWithRetryOptions {
  /** Maximum retry attempts after the initial request. Default: 3. */
  retries?: number;
  /** Base backoff delay in ms, doubled on every retry. Default: 1000. */
  backoffMs?: number;
}

/** Gateway statuses emitted by the Cloudflare tunnel during backend restarts. */
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([502, 503, 504]);

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const describeTarget = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithRetryOptions
): Promise<Response> {
  const retries = options?.retries ?? 3;
  const backoffMs = options?.backoffMs ?? 1000;
  const target = describeTarget(input);

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const delayMs = backoffMs * 2 ** attempt;
    try {
      const response = await fetch(input, init);
      if (!RETRYABLE_STATUSES.has(response.status) || attempt === retries) {
        return response;
      }
      logger.warn(
        `fetchWithRetry: ${target} responded ${response.status} — retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})`
      );
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
      if (attempt === retries) break;
      logger.warn(
        `fetchWithRetry: network error for ${target} — retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})`,
        error
      );
    }
    await wait(delayMs);
  }

  logger.error(`fetchWithRetry: exhausted ${retries} retries for ${target}`, lastError);
  if (lastError instanceof Error) throw lastError;
  throw new Error(`fetchWithRetry: request to ${target} failed after ${retries} retries`);
}
