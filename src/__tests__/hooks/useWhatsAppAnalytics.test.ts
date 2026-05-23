/**
 * useWhatsAppAnalytics Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useWhatsAppAnalytics } from '../../hooks/whatsapp/useWhatsAppAnalytics';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';
import { vi } from 'vitest';

vi.mock('../../services/whatsapp/whatsapp.service', () => ({
  whatsappService: {
    getCounters: vi.fn(),
    getConversations: vi.fn(),
  },
}));

describe('useWhatsAppAnalytics', () => {
  let anchorClickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Prevent jsdom from attempting real navigation via anchor.click()
    // during export tests (which triggers "Not implemented: navigation").
    anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    anchorClickSpy?.mockRestore();
  });

  describe('initialization', () => {
    it('should initialize with null analytics and default date range', () => {
      const { result } = renderHook(() => useWhatsAppAnalytics());

      expect(result.current.analytics).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.dateRange).toBeDefined();
    });
  });

  describe('loadAnalytics', () => {
    it('should load analytics data', async () => {
      const mockAnalytics = {
        totalMessages: 150,
        activeConversations: 10,
        avgResponseTime: '5 min',
        deliveryRate: 99,
        topConversations: [],
      };

      (whatsappService.getCounters as vi.Mock).mockResolvedValue({
        data: mockAnalytics,
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      await act(async () => {
        await result.current.loadAnalytics('account-1');
      });

      await waitFor(() => {
        expect(result.current.analytics).toBeDefined();
      });

      expect(result.current.analytics?.totalMessages).toBe(150);
    });

    it('should handle loading errors', async () => {
      (whatsappService.getCounters as vi.Mock).mockRejectedValue(new Error('Load failed'));

      const { result } = renderHook(() => useWhatsAppAnalytics());

      await act(async () => {
        try {
          await result.current.loadAnalytics('account-1');
        } catch (e) {
          // Error expected
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('setDateRange', () => {
    it('should update date range', () => {
      const { result } = renderHook(() => useWhatsAppAnalytics());

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      act(() => {
        result.current.setDateRange(startDate, endDate);
      });

      expect(result.current.dateRange.startDate).toEqual(startDate);
      expect(result.current.dateRange.endDate).toEqual(endDate);
    });
  });

  describe('getMessageStats', () => {
    it('should get message statistics', async () => {
      const mockStats = {
        totalMessages: 100,
        avgResponseTime: '3 min',
        messageTypes: { text: 80, media: 20 },
      };

      (whatsappService.getCounters as vi.Mock).mockResolvedValue({
        data: mockStats,
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      let stats;
      await act(async () => {
        stats = await result.current.getMessageStats('account-1');
      });

      expect(stats?.totalMessages).toBe(100);
    });
  });

  describe('getConversationStats', () => {
    it('should get conversation statistics', async () => {
      const mockStats = {
        activeConversations: 15,
        averageMessagesPerConversation: 6,
        topConversations: [],
      };

      (whatsappService.getConversations as vi.Mock).mockResolvedValue({
        data: [{ id: 'conv-1' }],
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      let stats;
      await act(async () => {
        stats = await result.current.getConversationStats('account-1');
      });

      expect((stats as Record<string, unknown>)?.conversations).toBeDefined();
    });
  });

  describe('exportAnalytics', () => {
    it('should export analytics as CSV', async () => {
      (whatsappService.getCounters as vi.Mock).mockResolvedValue({
        data: { messages: 100 },
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      await act(async () => {
        await result.current.exportAnalytics('account-1', 'csv');
      });

      expect(whatsappService.getCounters).toHaveBeenCalledWith('account-1', 'month');
    });

    it('should export analytics as JSON', async () => {
      (whatsappService.getCounters as vi.Mock).mockResolvedValue({
        data: { messages: 100 },
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      await act(async () => {
        await result.current.exportAnalytics('account-1', 'json');
      });

      expect(whatsappService.getCounters).toHaveBeenCalledWith('account-1', 'month');
    });
  });

  describe('error handling', () => {
    it('should clear errors', () => {
      const { result } = renderHook(() => useWhatsAppAnalytics());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should refresh analytics data', async () => {
      const mockAnalytics = {
        totalMessages: 200,
        activeConversations: 20,
        avgResponseTime: '4 min',
        deliveryRate: 98,
      };

      (whatsappService.getCounters as vi.Mock).mockResolvedValue({
        data: mockAnalytics,
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      // First load
      await act(async () => {
        await result.current.loadAnalytics('account-1');
      });

      // Refresh
      await act(async () => {
        await result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.analytics?.totalMessages).toBe(200);
      });
    });
  });
});
