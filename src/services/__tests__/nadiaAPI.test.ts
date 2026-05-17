import { describe, it, expect, beforeEach, vi } from 'vitest';

const { authFetchMock } = vi.hoisted(() => ({
  authFetchMock: vi.fn(),
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: authFetchMock,
}));

vi.mock('../../config/constants', () => ({
  Config: {
    API_URL: 'http://localhost:3001',
  },
}));

import nadiaAPI from '../nadiaAPI';

const successResponse = <T>(data: T) =>
  new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

describe('nadiaAPI Wave 03 contract mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes AGENT sends to /reply endpoint', async () => {
    authFetchMock.mockResolvedValueOnce(
      successResponse({
        id: 'm-1',
        conversationId: 'conv-1',
        direction: 'outbound',
        body: 'Hello from agent',
        timestamp: '2026-05-17T08:00:00.000Z',
      })
    );

    const result = await nadiaAPI.messages.send('conv-1', {
      conversationId: 'conv-1',
      content: 'Hello from agent',
      sender: 'AGENT',
    });

    expect(result.sender).toBe('AGENT');
    expect(result.content).toBe('Hello from agent');

    const [url, init] = authFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/nadia/conversations/conv-1/reply');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ content: 'Hello from agent' }));
  });

  it('routes CUSTOMER sends to /messages endpoint with senderType', async () => {
    authFetchMock.mockResolvedValueOnce(
      successResponse({
        id: 'm-2',
        conversationId: 'conv-1',
        direction: 'inbound',
        body: 'Hello from customer',
        timestamp: '2026-05-17T08:05:00.000Z',
      })
    );

    const result = await nadiaAPI.messages.send('conv-1', {
      conversationId: 'conv-1',
      content: 'Hello from customer',
      sender: 'CUSTOMER',
    });

    expect(result.sender).toBe('CUSTOMER');

    const [url, init] = authFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/nadia/conversations/conv-1/messages');
    expect(init.body).toBe(
      JSON.stringify({ content: 'Hello from customer', senderType: 'customer' })
    );
  });

  it('uses offset query param for message list pagination', async () => {
    authFetchMock.mockResolvedValueOnce(
      successResponse([
        {
          id: 'm-3',
          conversationId: 'conv-2',
          direction: 'inbound',
          body: 'pagination check',
          timestamp: '2026-05-17T08:10:00.000Z',
        },
      ])
    );

    const result = await nadiaAPI.messages.listByConversation('conv-2', 25, 10);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('pagination check');

    const [url] = authFetchMock.mock.calls[0] as [string];
    expect(url).toContain('/api/nadia/conversations/conv-2/messages?');
    expect(url).toContain('offset=25');
    expect(url).toContain('limit=10');
    expect(url).not.toContain('skip=');
  });

  it('normalizes queue assignment response for UI consumption', async () => {
    authFetchMock.mockResolvedValueOnce(
      successResponse({
        id: 'queue-entry-1',
        conversation: {
          id: 'conv-3',
          customerPhone: '+971500000123',
          customerName: 'Ahmed',
          status: 'assigned_to_agent',
          leadScore: 82,
        },
        priority: 2,
        queuedAt: '2026-05-17T07:00:00.000Z',
      })
    );

    const result = await nadiaAPI.queue.assignAgent('queue-entry-1', '+971500000456');

    expect(result.queueId).toBe('queue-entry-1');
    expect(result.conversationId).toBe('conv-3');
    expect(result.customerPhone).toBe('+971500000123');
    expect(result.priority).toBe('URGENT');
    expect(result.status).toBe('PENDING');
  });
});
