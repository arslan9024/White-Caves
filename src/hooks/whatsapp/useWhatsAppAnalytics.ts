/**
 * useWhatsAppAnalytics Hook
 *
 * Hook for managing WhatsApp analytics and statistics
 * Tracks messages, conversations, and performance metrics
 */

import { useState, useCallback } from 'react';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

type AnalyticsData = Record<string, unknown>;

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface UseWhatsAppAnalyticsReturn {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  dateRange: DateRange;

  // Analytics methods
  loadAnalytics: (accountId: string, dateRange?: DateRange) => Promise<void>;
  setDateRange: (startDate: Date, endDate: Date) => void;
  getMessageStats: (accountId: string, dateRange?: DateRange) => Promise<AnalyticsData>;
  getConversationStats: (accountId: string, dateRange?: DateRange) => Promise<AnalyticsData>;
  exportAnalytics: (accountId: string, format: 'csv' | 'json') => Promise<void>;

  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useWhatsAppAnalytics = (): UseWhatsAppAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRangeState] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: new Date(),
  });

  const loadAnalytics = useCallback(
    async (accountId: string, range?: DateRange) => {
      try {
        setIsLoading(true);
        setError(null);

        const _targetRange = range || dateRange;
        const response = await whatsappService.getCounters(accountId, 'month');
        setAnalytics(response.data as AnalyticsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load analytics';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [dateRange]
  );

  const setDateRange = useCallback((startDate: Date, endDate: Date) => {
    setDateRangeState({ startDate, endDate });
  }, []);

  const getMessageStats = useCallback(
    async (accountId: string, range?: DateRange) => {
      try {
        setIsLoading(true);
        setError(null);

        const _targetRange = range || dateRange;
        const response = await whatsappService.getCounters(accountId, 'month');
        return response.data as AnalyticsData;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load message stats';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dateRange]
  );

  const getConversationStats = useCallback(
    async (accountId: string, range?: DateRange) => {
      try {
        setIsLoading(true);
        setError(null);

        const _targetRange = range || dateRange;
        const response = await whatsappService.getConversations(accountId);
        return { conversations: response.data, range: targetRange } as AnalyticsData;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load conversation stats';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dateRange]
  );

  const exportAnalytics = useCallback(async (accountId: string, format: 'csv' | 'json') => {
    try {
      setError(null);

      const response = await whatsappService.getCounters(accountId, 'month');

      // Create download link
      const serialized =
        format === 'csv'
          ? `key,value\n${Object.entries(response.data as Record<string, unknown>)
              .map(([k, v]) => `${k},${String(v)}`)
              .join('\n')}`
          : JSON.stringify(response.data, null, 2);

      const blob = new Blob([serialized], {
        type: format === 'csv' ? 'text/csv' : 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `whatsapp-analytics-${new Date().getTime()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export analytics';
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    const accountId = 'default';
    await loadAnalytics(accountId);
  }, [loadAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    dateRange,
    loadAnalytics,
    setDateRange,
    getMessageStats,
    getConversationStats,
    exportAnalytics,
    clearError,
    refresh,
  };
};
