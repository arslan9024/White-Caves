import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useBackendStatus } from './useBackendStatus';

const healthResponse = (status: number): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: `HTTP ${status}`,
    json: async () => ({ status: 'OK' }),
  }) as unknown as Response;

describe('useBackendStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('reports online after a healthy initial check against /api/health', async () => {
    const fetchMock = vi.fn().mockResolvedValue(healthResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() => useBackendStatus());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.status).toBe('online');
    expect(result.current.lastChecked).toBeInstanceOf(Date);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0] ?? '')).toMatch(/\/api\/health$/);

    unmount();
  });

  it('transitions from online to offline when the backend stops responding', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(healthResponse(200))
      .mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() => useBackendStatus());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe('online');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(result.current.status).toBe('offline');
    expect(result.current.lastChecked).toBeInstanceOf(Date);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('reports degraded on tunnel gateway errors, then recovers to online', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(healthResponse(503))
      .mockResolvedValue(healthResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() => useBackendStatus({ pollIntervalMs: 10_000 }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe('degraded');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    expect(result.current.status).toBe('online');

    unmount();
  });

  it('stops polling after unmount and never throws', async () => {
    const fetchMock = vi.fn().mockResolvedValue(healthResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderHook(() => useBackendStatus({ pollIntervalMs: 5_000 }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    unmount();

    await vi.advanceTimersByTimeAsync(20_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('starts in checking state and rejects a successful non-health response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'not the API' }),
      })
    );
    const { result, unmount } = renderHook(() => useBackendStatus());
    expect(result.current.status).toBe('checking');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe('degraded');
    unmount();
  });
});
