/**
 * useBackendStatus — Polls the backend health endpoint and reports
 * 'online' | 'degraded' | 'offline' so UI (e.g. BackendStatusBanner) can
 * react to Cloudflare-tunnel / local-backend outages.
 *
 * - 'online'   → /api/health responded 2xx
 * - 'degraded' → server reachable but unhealthy (e.g. tunnel 502/503/504)
 * - 'offline'  → network error or 5s timeout (never throws to the component)
 *
 * URL resolution reuses getApiUrl() (src/config/constants.ts), which handles
 * a VITE_API_URL that may or may not already end with /api.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiUrl } from '../config/constants';
import { fetchWithRetry } from '../services/http/fetchWithRetry';
import logger from '../utils/logger';

export type BackendHealthStatus = 'online' | 'degraded' | 'offline';

export interface BackendStatusState {
  status: BackendHealthStatus;
  lastChecked: Date | null;
}

export interface UseBackendStatusOptions {
  /** Poll cadence in ms. Default: 30 000. */
  pollIntervalMs?: number;
  /** Per-request abort timeout in ms. Default: 5 000. */
  requestTimeoutMs?: number;
}

const DEFAULT_POLL_INTERVAL_MS = 30_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 5_000;

export function useBackendStatus(options?: UseBackendStatusOptions): BackendStatusState {
  const pollIntervalMs = options?.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const requestTimeoutMs = options?.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

  // Optimistic initial state: no banner flash before the first check lands.
  const [state, setState] = useState<BackendStatusState>({
    status: 'online',
    lastChecked: null,
  });

  const mountedRef = useRef<boolean>(true);
  const controllerRef = useRef<AbortController | null>(null);

  const checkHealth = useCallback(async (): Promise<void> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const response = await fetchWithRetry(
        getApiUrl('health'),
        { signal: controller.signal, headers: { Accept: 'application/json' } },
        { retries: 0 }
      );
      if (!mountedRef.current) return;
      setState({
        status: response.ok ? 'online' : 'degraded',
        lastChecked: new Date(),
      });
    } catch (error) {
      logger.warn('useBackendStatus: health check failed — backend offline', error);
      if (mountedRef.current) {
        setState({ status: 'offline', lastChecked: new Date() });
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }, [requestTimeoutMs]);

  useEffect(() => {
    mountedRef.current = true;
    void checkHealth();
    const intervalId = setInterval(() => {
      void checkHealth();
    }, pollIntervalMs);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
      controllerRef.current?.abort();
    };
  }, [checkHealth, pollIntervalMs]);

  return state;
}
