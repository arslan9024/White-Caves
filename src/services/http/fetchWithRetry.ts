import { createLogger } from '../../utils/logger';
const logger = createLogger('fetchWithRetry');

export interface FetchWithRetryOptions {
  retries?: number;
  backoffMs?: number;
}

const RETRYABLE_STATUSES = new Set([502, 503, 504]);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function wait(ms: number, signal?: AbortSignal | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = (): void => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('Request cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
  });
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithRetryOptions
): Promise<Response> {
  const retries = options?.retries ?? 3;
  const backoffMs = options?.backoffMs ?? 1000;
  if (
    !Number.isInteger(retries) ||
    retries < 0 ||
    retries > 10 ||
    !Number.isFinite(backoffMs) ||
    backoffMs < 0 ||
    backoffMs > 60_000
  ) {
    logger.error('fetchWithRetry: invalid retry configuration');
    throw new RangeError('Invalid retry configuration');
  }
  const request = typeof Request !== 'undefined' && input instanceof Request ? input : undefined;
  const method = (init?.method ?? request?.method ?? 'GET').toUpperCase();
  const signal = init?.signal ?? request?.signal;
  // Never replay writes or a Request body after an ambiguous network failure.
  const limit = SAFE_METHODS.has(method) && !init?.body && !request?.body ? retries : 0;

  for (let attempt = 0; ; attempt += 1) {
    signal?.throwIfAborted();
    try {
      const response = await fetch(input, init);
      if (!RETRYABLE_STATUSES.has(response.status) || attempt === limit) return response;
      logger.warn(`fetchWithRetry: gateway ${response.status}; retry ${attempt + 1}/${limit}`);
      await response.body?.cancel();
    } catch (error) {
      if (signal?.aborted || (error instanceof Error && error.name === 'AbortError')) throw error;
      if (attempt === limit) {
        logger.error('fetchWithRetry: request failed; no further retries');
        throw error;
      }
      logger.warn(`fetchWithRetry: network failure; retry ${attempt + 1}/${limit}`);
    }
    await wait(Math.min(backoffMs * 2 ** attempt, 60_000), signal);
  }
}
