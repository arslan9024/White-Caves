import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  aIConversation: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock('../../../database.js', () => ({ prisma: mockPrisma }));

const mockCache = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  incrby: vi.fn(),
}));

vi.mock('../../CacheService.js', () => ({ cacheService: mockCache }));

import { NinaEngine } from '../ninaEngine.js';

describe('W24-008 NinaEngine - Context Injection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('injects property details context correctly', async () => {
    const context = { type: 'property', id: 'prop-123' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting on a Property page');
    expect(systemMsg.content).toContain('Property ID: prop-123');
  });

  it('injects lead context correctly', async () => {
    const context = { type: 'lead', name: 'John Doe', status: 'hot' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting a Lead');
    expect(systemMsg.content).toContain('Lead Name: John Doe');
    expect(systemMsg.content).toContain('Status: hot');
  });

  it('injects tenant context correctly', async () => {
    const context = { type: 'tenant', leaseId: 'lease-999' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting a Tenant');
    expect(systemMsg.content).toContain('Active Lease: lease-999');
  });

  it('provides default context when no entity context is provided', async () => {
    const systemMsg = await NinaEngine.buildContext('nina-1');

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toBe('You are Nina, a helpful AI assistant.');
  });
});

describe('W24-009 NinaEngine - Token Caps & Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks and enforces daily token caps correctly', async () => {
    mockCache.get.mockResolvedValue(5000);
    const hasCap = await NinaEngine.checkCap('nina-1');
    expect(hasCap).toBe(true);
    expect(mockCache.get).toHaveBeenCalled();

    mockCache.get.mockResolvedValue(10000);
    const hasCapLimit = await NinaEngine.checkCap('nina-1');
    expect(hasCapLimit).toBe(false);
  });

  it('increments daily token caps using cache service', async () => {
    await NinaEngine.incrementCap('nina-1', 15);
    expect(mockCache.incrby).toHaveBeenCalledWith(expect.stringContaining('ai_cap:nina-1:'), 15, 86400);
  });

  it('prunes conversations older than 30 days programmatically', async () => {
    mockPrisma.aIConversation.findUnique.mockResolvedValue({ sessionId: 'session-1', messages: [] });
    
    await NinaEngine.getHistory('session-1');

    expect(mockPrisma.aIConversation.deleteMany).toHaveBeenCalledWith({
      where: {
        updatedAt: {
          lt: expect.any(Date),
        },
      },
    });
    expect(mockPrisma.aIConversation.findUnique).toHaveBeenCalledWith({ where: { sessionId: 'session-1' } });
  });

  it('limits message persistence history to last 20 messages', async () => {
    const messages = Array.from({ length: 25 }, (_, i) => ({ role: 'user' as const, content: `message-${i}` }));
    
    await NinaEngine.saveHistory('session-1', 'nina-1', messages);

    expect(mockPrisma.aIConversation.upsert).toHaveBeenCalledWith({
      where: { sessionId: 'session-1' },
      update: {
        messages: expect.arrayContaining([
          expect.objectContaining({ content: 'message-5' }),
          expect.objectContaining({ content: 'message-24' }),
        ]),
        updatedAt: expect.any(Date),
      },
      create: {
        sessionId: 'session-1',
        assistantId: 'nina-1',
        messages: expect.arrayContaining([
          expect.objectContaining({ content: 'message-5' }),
          expect.objectContaining({ content: 'message-24' }),
        ]),
      },
    });

    // Verify it pruned the first 5 messages
    const updateArgs = mockPrisma.aIConversation.upsert.mock.calls[0][0];
    expect(updateArgs.update.messages).toHaveLength(20);
    expect(updateArgs.update.messages[0].content).toBe('message-5');
  });
});
