import { afterEach, describe, expect, it, vi } from 'vitest';

type FetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
};

const okResponse = (payload: unknown = {}): FetchResponse => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  json: async () => payload,
});

describe('API base URL normalization regression', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('PropertyQueryService strips trailing /api before query endpoint composition', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001/api');
    const fetchMock = vi.fn().mockResolvedValue(okResponse({ success: true, data: [] }));
    vi.stubGlobal('fetch', fetchMock);

    const { default: PropertyQueryService } = await import('./PropertyQueryService.js');
    const service = new PropertyQueryService();

    await service.queryProperties({ area: 'Dubai Marina' });

    const url = String(fetchMock.mock.calls[0]?.[0] ?? '');
    expect(url).toMatch(/^http:\/\/localhost:3001\/api\/inventory\/query\?/);
    expect(url).toContain('area=Dubai+Marina');
  });

  it('relationalSidebarAPI preserves a configured /api suffix exactly once', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001/api');
    const fetchMock = vi.fn().mockResolvedValue(okResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const sidebarApi = await import('./relationalSidebarAPI.js');
    await sidebarApi.getDepartments();

    const url = String(fetchMock.mock.calls[0]?.[0] ?? '');
    expect(url).toBe('http://localhost:3001/api/relational-sidebar/departments');
  });

  it('whatsapp service appends /api/whatsapp when base has no /api suffix', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001');
    const fetchMock = vi.fn().mockResolvedValue(okResponse({ success: true, data: {} }));
    vi.stubGlobal('fetch', fetchMock);

    const { whatsappService } = await import('./whatsapp/whatsapp.service.ts');
    await whatsappService.listAccounts();

    const url = String(fetchMock.mock.calls[0]?.[0] ?? '');
    expect(url).toBe('http://localhost:3001/api/whatsapp/accounts');
  });
});
