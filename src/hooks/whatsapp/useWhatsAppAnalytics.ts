/**
 * useWhatsAppAnalytics Hook
 * 
 * Hook for managing WhatsApp analytics and statistics
 * Tracks messages, conversations, and performance metrics
 */

import { useState, useCallback, useEffect } from 'react';
import { whatsappService, AnalyticsData } from '../../services/whatsapp/whatsapp.service';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface UseWhatsAppAnalyticsReturn {
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

  const loadAnalytics = useCallback(async (accountId: string, range?: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const targetRange = range || dateRange;
      const response = await whatsappService.getAnalytics(
        accountId,
        targetRange.startDate.toISOString(),
        targetRange.endDate.toISOString()
      );
      
      setAnalytics(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const setDateRange = useCallback((startDate: Date, endDate: Date) => {
    setDateRangeState({ startDate, endDate });
  }, []);

  const getMessageStats = useCallback(async (accountId: string, range?: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const targetRange = range || dateRange;
      const response = await whatsappService.getMessageStats(
        accountId,
        targetRange.startDate.toISOString(),
        targetRange.endDate.toISOString()
      );
      
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load message stats';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const getConversationStats = useCallback(async (accountId: string, range?: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const targetRange = range || dateRange;
      const response = await whatsappService.getConversationStats(
        accountId,
        targetRange.startDate.toISOString(),
        targetRange.endDate.toISOString()
      );
      
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conversation stats';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const exportAnalytics = useCallback(async (accountId: string, format: 'csv' | 'json') => {
    try {
      setError(null);
      
      const response = await whatsappService.exportAnalytics(
        accountId,
        dateRange.startDate.toISOString(),
        dateRange.endDate.toISOString(),
        format
      );
      
      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
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
  }, [dateRange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async (accountId: string) => {
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
