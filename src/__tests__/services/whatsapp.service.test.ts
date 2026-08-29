import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';
import * as authFetchModule from '../../utils/authFetch';

describe('WhatsApp Client Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles getConversations API request', async () => {
    vi.spyOn(authFetchModule, 'authFetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ id: 'conv-1', accountId: 'acc-1', customerPhone: '+971501234567', lastMessage: 'Hello', lastMessageTime: new Date() }],
      }),
    } as any);

    const res = await whatsappService.getConversations('acc-1');
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(1);
  });

  it('handles unlinkAccount API request', async () => {
    vi.spyOn(authFetchModule, 'authFetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { accountId: 'acc-1', status: 'unlinked' },
      }),
    } as any);

    const res = await whatsappService.unlinkAccount('acc-1');
    expect(res.success).toBe(true);
    expect(res.data.status).toBe('unlinked');
  });

  it('handles sendMessage API request', async () => {
    vi.spyOn(authFetchModule, 'authFetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'msg-999',
          accountId: 'acc-1',
          recipientPhone: '+971509999999',
          message: 'Hello from White Caves',
          direction: 'outbound',
          status: 'sent',
          timestamp: new Date(),
        },
      }),
    } as any);

    const res = await whatsappService.sendMessage('acc-1', '+971509999999', 'Hello from White Caves');
    expect(res.success).toBe(true);
  });
});
