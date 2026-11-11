import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from './fetchWithRetry';

const mockResponse = (status: number): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: `HTTP ${status}`,
    json: async () => ({}),
  }) as unknown as Response;

describe('fetchWithRetry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('retries a 503 response and resolves once the backend recovers', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(503))
      .mockResolvedValueOnce(mockResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchWithRetry('/api/health', undefined, { retries: 3, backoffMs: 1 });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry non-gateway statuses such as 400', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(400));
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchWithRetry('/api/leads', undefined, { retries: 3, backoffMs: 1 });

    expect(response.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('respects retries=0 by returning the first gateway-error response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(503));
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchWithRetry('/api/health', undefined, { retries: 0 });

    expect(response.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries network errors and succeeds on a later attempt', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(mockResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchWithRetry('/api/health', undefined, { retries: 2, backoffMs: 1 });

    expect(response.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws the last network error after exhausting all retries', async () => {
    const failure = new TypeError('Failed to fetch');
    const fetchMock = vi.fn().mockRejectedValue(failure);
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchWithRetry('/api/health', undefined, { retries: 2, backoffMs: 1 })
    ).rejects.toBe(failure);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('applies exponential backoff (1s, 2s) between gateway-error retries', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(502));
    vi.stubGlobal('fetch', fetchMock);

    const pending = fetchWithRetry('/api/health', undefined, { retries: 2, backoffMs: 1000 });

    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(2000);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const response = await pending;
    expect(response.status).toBe(502);
  });
});
