/**
 * useWhatsAppAnalytics Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useWhatsAppAnalytics } from '../../hooks/whatsapp/useWhatsAppAnalytics';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

vi.mock('../../services/whatsapp/whatsapp.service');

describe('useWhatsAppAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      (whatsappService.getAnalytics as vi.Mock).mockResolvedValue({
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
      (whatsappService.getAnalytics as vi.Mock).mockRejectedValue(
        new Error('Load failed')
      );

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

      (whatsappService.getMessageStats as vi.Mock).mockResolvedValue({
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

      (whatsappService.getConversationStats as vi.Mock).mockResolvedValue({
        data: mockStats,
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      let stats;
      await act(async () => {
        stats = await result.current.getConversationStats('account-1');
      });

      expect(stats?.activeConversations).toBe(15);
    });
  });

  describe('exportAnalytics', () => {
    it('should export analytics as CSV', async () => {
      (whatsappService.exportAnalytics as vi.Mock).mockResolvedValue({
        data: 'name,count\nmessages,100',
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      // Mock the download function
      global.URL.createObjectURL = vi.fn();
      global.URL.revokeObjectURL = vi.fn();

      await act(async () => {
        await result.current.exportAnalytics('account-1', 'csv');
      });

      expect(whatsappService.exportAnalytics).toHaveBeenCalledWith(
        'account-1',
        expect.any(String),
        expect.any(String),
        'csv'
      );
    });

    it('should export analytics as JSON', async () => {
      (whatsappService.exportAnalytics as vi.Mock).mockResolvedValue({
        data: '{"messages":100}',
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      global.URL.createObjectURL = vi.fn();
      global.URL.revokeObjectURL = vi.fn();

      await act(async () => {
        await result.current.exportAnalytics('account-1', 'json');
      });

      expect(whatsappService.exportAnalytics).toHaveBeenCalledWith(
        'account-1',
        expect.any(String),
        expect.any(String),
        'json'
      );
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

      (whatsappService.getAnalytics as vi.Mock).mockResolvedValue({
        data: mockAnalytics,
      });

      const { result } = renderHook(() => useWhatsAppAnalytics());

      // First load
      await act(async () => {
        await result.current.loadAnalytics('account-1');
      });

      // Refresh
      await act(async () => {
        await result.current.refresh('account-1');
      });

      await waitFor(() => {
        expect(result.current.analytics?.totalMessages).toBe(200);
      });
    });
  });
});
