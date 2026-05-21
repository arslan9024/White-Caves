/**
 * assistantsService — Unit Tests (Phase 0.8)
 *
 * Validates request paths, method choices, and response shape handling
 * for each assistantsService method, including the plan: null / exists: false
 * path so client behaviour stays aligned with the API contract.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── apiClient mock ─────────────────────────────────────────────────────
const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../utils/apiClient', () => ({
  apiClient: mockApiClient,
}));

import { assistantsService } from '../assistantsService';

// ═════════════════════════════════════════════════════════════════════

describe('assistantsService.listAll()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /assistants and returns the data array', async () => {
    const fixtures = [
      {
        id: 'mary',
        name: 'Mary',
        title: 'Inventory Manager',
        department: 'operations',
        icon: 'FileText',
        colorScheme: '#3B82F6',
        avatar: '👩‍💻',
      },
      {
        id: 'zoe',
        name: 'Zoe',
        title: 'Executive Assistant',
        department: 'executive',
        icon: 'Crown',
        colorScheme: '#10B981',
        avatar: '👑',
      },
    ];
    mockApiClient.get.mockResolvedValueOnce({ success: true, data: fixtures, total: 2 });

    const result = await assistantsService.listAll();

    expect(mockApiClient.get).toHaveBeenCalledOnce();
    expect(mockApiClient.get).toHaveBeenCalledWith('/assistants');
    expect(result).toEqual(fixtures);
    expect(result).toHaveLength(2);
  });

  it('propagates errors thrown by apiClient', async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(assistantsService.listAll()).rejects.toThrow('Network error');
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('assistantsService.getPlan()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /assistants/:id/plan and returns the data object', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      success: true,
      data: { id: 'mary', plan: '# Mary Plan', exists: true },
    });

    const result = await assistantsService.getPlan('mary');

    expect(mockApiClient.get).toHaveBeenCalledWith('/assistants/mary/plan');
    expect(result.id).toBe('mary');
    expect(result.plan).toBe('# Mary Plan');
    expect(result.exists).toBe(true);
  });

  it('handles plan: null / exists: false (plan file does not exist on server)', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      success: true,
      data: { id: 'zoe', plan: null, exists: false },
    });

    const result = await assistantsService.getPlan('zoe');

    expect(result.plan).toBeNull();
    expect(result.exists).toBe(false);
  });

  it('URL-encodes the assistant id', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      success: true,
      data: { id: 'my-bot', plan: null, exists: false },
    });

    await assistantsService.getPlan('my-bot');

    expect(mockApiClient.get).toHaveBeenCalledWith('/assistants/my-bot/plan');
  });

  it('propagates errors thrown by apiClient', async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error('Unauthorized'));

    await expect(assistantsService.getPlan('mary')).rejects.toThrow('Unauthorized');
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('assistantsService.createPlan()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs to /assistants with id and plan in the body', async () => {
    mockApiClient.post.mockResolvedValueOnce({ success: true, data: { id: 'mary', exists: true } });

    await assistantsService.createPlan('mary', '# New Plan');

    expect(mockApiClient.post).toHaveBeenCalledWith('/assistants', {
      id: 'mary',
      plan: '# New Plan',
    });
  });

  it('propagates errors thrown by apiClient (e.g. 409 conflict)', async () => {
    mockApiClient.post.mockRejectedValueOnce(new Error('Conflict'));

    await expect(assistantsService.createPlan('mary', '# Plan')).rejects.toThrow('Conflict');
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('assistantsService.updatePlan()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('PUTs to /assistants/:id with plan in the body', async () => {
    mockApiClient.put.mockResolvedValueOnce({ success: true, data: { id: 'mary', exists: true } });

    await assistantsService.updatePlan('mary', '# Updated Plan');

    expect(mockApiClient.put).toHaveBeenCalledWith('/assistants/mary', { plan: '# Updated Plan' });
  });

  it('URL-encodes the assistant id', async () => {
    mockApiClient.put.mockResolvedValueOnce({ success: true });

    await assistantsService.updatePlan('my-bot', '# Plan');

    expect(mockApiClient.put).toHaveBeenCalledWith('/assistants/my-bot', { plan: '# Plan' });
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('assistantsService.deletePlan()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('DELETEs /assistants/:id', async () => {
    mockApiClient.delete.mockResolvedValueOnce({
      success: true,
      data: { id: 'mary', deleted: true },
    });

    await assistantsService.deletePlan('mary');

    expect(mockApiClient.delete).toHaveBeenCalledWith('/assistants/mary');
  });

  it('propagates errors thrown by apiClient (e.g. 404 no plan)', async () => {
    mockApiClient.delete.mockRejectedValueOnce(new Error('Not Found'));

    await expect(assistantsService.deletePlan('mary')).rejects.toThrow('Not Found');
  });
});
