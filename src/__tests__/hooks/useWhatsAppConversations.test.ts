/**
 * useWhatsAppConversations Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useWhatsAppConversations } from '../../hooks/whatsapp/useWhatsAppConversations';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

vi.mock('../../services/whatsapp/whatsapp.service');

describe('useWhatsAppConversations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useWhatsAppConversations());

      expect(result.current.conversations).toEqual([]);
      expect(result.current.currentConversation).toBeNull();
      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadConversations', () => {
    it('should load conversations for an account', async () => {
      const mockConversations = [
        {
          conversationId: 'conv-1',
          recipientNumber: '+1234567890',
          recipientName: 'John Doe',
          lastMessage: 'Hello!',
          unreadCount: 0,
        },
      ];

      (whatsappService.listConversations as vi.Mock).mockResolvedValue({
        data: { conversations: mockConversations },
      });

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.loadConversations('account-1');
      });

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(1);
      });

      expect(result.current.conversations[0].recipientName).toBe('John Doe');
    });

    it('should handle loading errors', async () => {
      (whatsappService.listConversations as vi.Mock).mockRejectedValue(
        new Error('Load failed')
      );

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        try {
          await result.current.loadConversations('account-1');
        } catch (e) {
          // Error expected
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('selectConversation', () => {
    it('should select a conversation', async () => {
      const mockConversations = [
        {
          conversationId: 'conv-1',
          recipientNumber: '+1234567890',
          recipientName: 'John Doe',
          unreadCount: 2,
        },
      ];

      (whatsappService.listConversations as vi.Mock).mockResolvedValue({
        data: { conversations: mockConversations },
      });

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.loadConversations('account-1');
      });

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(1);
      });

      act(() => {
        result.current.selectConversation('conv-1');
      });

      expect(result.current.currentConversation?.conversationId).toBe('conv-1');
    });
  });

  describe('loadMessages', () => {
    it('should load message history', async () => {
      const mockMessages = [
        { id: 'msg-1', text: 'Hi', isOwn: false, timestamp: new Date() },
        { id: 'msg-2', text: 'Hello', isOwn: true, timestamp: new Date() },
      ];

      (whatsappService.getConversationHistory as vi.Mock).mockResolvedValue({
        data: { messages: mockMessages },
      });

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.loadMessages('account-1', '+1234567890', 50);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
      });

      expect(result.current.messages[0].text).toBe('Hi');
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const mockMessage = {
        id: 'msg-3',
        text: 'New message',
        isOwn: true,
        timestamp: new Date(),
      };

      (whatsappService.sendMessage as vi.Mock).mockResolvedValue({
        data: { message: mockMessage },
      });

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.sendMessage('account-1', '+1234567890', 'New message');
      });

      expect(whatsappService.sendMessage).toHaveBeenCalledWith(
        'account-1',
        '+1234567890',
        'New message'
      );
    });

    it('should handle send errors', async () => {
      (whatsappService.sendMessage as vi.Mock).mockRejectedValue(
        new Error('Send failed')
      );

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        try {
          await result.current.sendMessage('account-1', '+1234567890', 'Message');
        } catch (e) {
          // Error expected
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('markAsRead', () => {
    it('should mark conversation as read', async () => {
      (whatsappService.markConversationAsRead as vi.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.markAsRead('account-1', 'conv-1');
      });

      expect(whatsappService.markConversationAsRead).toHaveBeenCalledWith(
        'account-1',
        'conv-1'
      );
    });
  });

  describe('searchConversations', () => {
    it('should search conversations', async () => {
      const mockResults = [
        {
          conversationId: 'conv-1',
          recipientNumber: '+1234567890',
          recipientName: 'John',
          unreadCount: 0,
        },
      ];

      (whatsappService.searchConversations as vi.Mock).mockResolvedValue({
        data: { conversations: mockResults },
      });

      const { result } = renderHook(() => useWhatsAppConversations());

      await act(async () => {
        await result.current.searchConversations('John');
      });

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(1);
      });
    });
  });
});
