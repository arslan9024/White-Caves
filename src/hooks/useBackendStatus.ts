import { useEffect, useState } from 'react';
import { getApiUrl } from '../config/constants';
import { fetchWithRetry } from '../services/http/fetchWithRetry';
import logger from '../utils/logger';

export type BackendHealthStatus = 'checking' | 'online' | 'degraded' | 'offline';

export interface BackendStatusState {
  status: BackendHealthStatus;
  lastChecked: Date | null;
}

export interface UseBackendStatusOptions {
  pollIntervalMs?: number;
  requestTimeoutMs?: number;
}

export function useBackendStatus(options?: UseBackendStatusOptions): BackendStatusState {
  const pollIntervalMs = options?.pollIntervalMs ?? 30_000;
  const requestTimeoutMs = options?.requestTimeoutMs ?? 5_000;
  const [state, setState] = useState<BackendStatusState>({ status: 'checking', lastChecked: null });

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    let nextCheck: ReturnType<typeof setTimeout>;

    const check = async (): Promise<void> => {
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), requestTimeoutMs);
      let status: BackendHealthStatus = 'offline';
      try {
        const response = await fetchWithRetry(
          getApiUrl('health'),
          { signal: controller.signal, headers: { Accept: 'application/json' }, cache: 'no-store' },
          { retries: 0 }
        );
        const payload: unknown = response.ok ? await response.json() : null;
        const valid =
          typeof payload === 'object' &&
          payload !== null &&
          'status' in payload &&
          (payload.status === 'OK' || payload.status === 'healthy');
        status = response.ok && valid ? 'online' : 'degraded';
      } catch {
        if (active) logger.warn('useBackendStatus: health request failed');
      } finally {
        clearTimeout(timeout);
        if (active) {
          setState({ status, lastChecked: new Date() });
          nextCheck = setTimeout(() => {
            void check();
          }, pollIntervalMs);
        }
      }
    };
    void check();
    return () => {
      active = false;
      clearTimeout(nextCheck);
      controller?.abort();
    };
  }, [pollIntervalMs, requestTimeoutMs]);

  return state;
}
