import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { APIOptimizer } from '../apiOptimizer';

describe('APIOptimizer', () => {
  let optimizer: APIOptimizer;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    optimizer = new APIOptimizer({
      cacheTTL: 1000,
      enableCache: true,
      enableDedup: true,
      enablePagination: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('caches responses via getWithCache', async () => {
    let calls = 0;
    const exec = async () => {
      calls += 1;
      return { ok: true };
    };

    const first = await optimizer.getWithCache('k1', exec, 1000);
    const second = await optimizer.getWithCache('k1', exec, 1000);

    expect(first).toEqual({ ok: true });
    expect(second).toEqual({ ok: true });
    expect(calls).toBe(1);
  });

  it('deduplicates concurrent execution for same method/url/data', async () => {
    let calls = 0;
    const exec = () =>
      new Promise<{ value: number }>(resolve => {
        calls += 1;
        setTimeout(() => resolve({ value: 42 }), 20);
      });

    const [a, b] = await Promise.all([
      optimizer.executeWithDedup('GET', '/api/test', undefined, exec),
      optimizer.executeWithDedup('GET', '/api/test', undefined, exec),
    ]);

    expect(a).toEqual({ value: 42 });
    expect(b).toEqual({ value: 42 });
    expect(calls).toBe(1);
  });

  it('builds paginated request and metadata correctly', () => {
    const req = optimizer.buildPaginatedRequest('/api/departments', {
      page: 2,
      pageSize: 25,
      sort: 'name:asc',
      filters: { code: 'SALES' },
    });

    expect(req.url).toContain('/api/departments?');
    expect(req.url).toContain('page=2');
    expect(req.url).toContain('pageSize=25');

    const paged = optimizer.createPaginatedResponse([{ id: 1 }], 2, 25, 80);
    expect(paged.pagination.totalPages).toBe(4);
    expect(paged.pagination.hasPrevious).toBe(true);
    expect(paged.pagination.hasNext).toBe(true);
  });

  it('invalidates cache by pattern and clears all', async () => {
    const exec = async (name: string) => ({ name });

    await optimizer.getWithCache('/api/a', () => exec('a'));
    await optimizer.getWithCache('/api/b', () => exec('b'));

    expect(optimizer.getCacheStats().size).toBe(2);

    optimizer.invalidateCache('/api/a');
    const keysAfterPattern = optimizer.getCacheStats().keys;
    expect(keysAfterPattern.some(k => k.includes('/api/a'))).toBe(false);

    optimizer.clear();
    expect(optimizer.getCacheStats().size).toBe(0);
  });

  it('honors runtime config toggles', async () => {
    optimizer.setCache(false);

    let calls = 0;
    const exec = async () => {
      calls += 1;
      return { ok: true };
    };

    await optimizer.getWithCache('cfg-key', exec);
    await optimizer.getWithCache('cfg-key', exec);

    expect(calls).toBe(2);

    optimizer.setCache(true);
    optimizer.updateConfig({ cacheTTL: 2000 });

    await optimizer.getWithCache('cfg-key-2', exec);
    await optimizer.getWithCache('cfg-key-2', exec);

    expect(calls).toBe(3);
  });
});
