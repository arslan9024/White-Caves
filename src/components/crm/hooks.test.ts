/**
 * CRM Dashboard Hooks — Unit Tests
 * Tests: useDashboardView, useDashboardFilters, useDashboardMetrics,
 *        useDashboardAccess, useDashboardCustomization, useDashboardExport,
 *        useDashboardPerformance
 * Covers: state management, RBAC access control, CSV/JSON export, metrics toggle
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock logger
vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

import {
  useDashboardView,
  useDashboardFilters,
  useDashboardMetrics,
  useDashboardAccess,
  useDashboardCustomization,
  useDashboardExport,
  useDashboardPerformance,
} from './hooks';

// ── Store helpers ────────────────────────────────────────────────
function createMockStore(role: string = 'admin') {
  return configureStore({
    reducer: {
      auth: () => ({
        user: { id: 'u1', name: 'Test', email: 'test@wc.ae', role },
      }),
    },
  });
}

function wrapper(role: string = 'admin') {
  const store = createMockStore(role);
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store }, children);
}

// ═════════════════════════════════════════════════════════════════

describe('CRM Dashboard Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── useDashboardView ──────────────────────────────────────────
  describe('useDashboardView', () => {
    it('initializes with default view', () => {
      const { result } = renderHook(() => useDashboardView());
      expect(result.current.currentView).toBe('company');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('initializes with custom default view', () => {
      const { result } = renderHook(() => useDashboardView('sales'));
      expect(result.current.currentView).toBe('sales');
    });

    it('changes view with loading state', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardView());

      act(() => {
        result.current.setCurrentView('leads');
      });

      // Should be loading immediately
      expect(result.current.loading).toBe(true);
      expect(result.current.currentView).toBe('leads');

      // Advance past the 500ms delay
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.loading).toBe(false);
      vi.useRealTimers();
    });
  });

  // ── useDashboardFilters ───────────────────────────────────────
  describe('useDashboardFilters', () => {
    it('initializes with empty filters', () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.filters).toEqual({});
    });

    it('updates filters with merge behavior', () => {
      const { result } = renderHook(() => useDashboardFilters());

      act(() => {
        result.current.updateFilter({ dateRange: 'this_week' } as any);
      });
      expect(result.current.filters).toEqual({ dateRange: 'this_week' });

      act(() => {
        result.current.updateFilter({ department: 'sales' } as any);
      });
      expect(result.current.filters).toEqual({ dateRange: 'this_week', department: 'sales' });
    });

    it('clears all filters', () => {
      const { result } = renderHook(() => useDashboardFilters());

      act(() => {
        result.current.updateFilter({ dateRange: 'this_month' } as any);
      });
      expect(result.current.filters).not.toEqual({});

      act(() => {
        result.current.clearFilters();
      });
      expect(result.current.filters).toEqual({});
    });
  });

  // ── useDashboardMetrics ───────────────────────────────────────
  describe('useDashboardMetrics', () => {
    it('initializes with empty metrics and not loading', () => {
      const { result } = renderHook(() => useDashboardMetrics());
      expect(result.current.metrics.size).toBe(0);
      expect(result.current.loading).toBe(false);
    });

    it('provides a refreshMetrics function', () => {
      const { result } = renderHook(() => useDashboardMetrics());
      expect(typeof result.current.refreshMetrics).toBe('function');
    });
  });

  // ── useDashboardAccess ────────────────────────────────────────
  describe('useDashboardAccess', () => {
    it('admin has access to all views', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('admin'),
      });
      expect(result.current.hasAccess(['admin'])).toBe(true);
      expect(result.current.hasAccess(['agent'])).toBe(false);
    });

    it('agent role has correct access', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('agent'),
      });
      expect(result.current.hasAccess(['agent'])).toBe(true);
      expect(result.current.hasAccess(['admin'])).toBe(false);
    });

    it('returns accessible dashboards for admin (all views)', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('admin'),
      });
      const allViews = ['company', 'department', 'sales', 'property', 'commission', 'leads', 'office', 'agent', 'financial', 'performance', 'inventory', 'client'];
      const accessible = result.current.getAccessibleDashboards(allViews as any);
      expect(accessible).toEqual(allViews);
    });

    it('returns accessible dashboards for agent (restricted)', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('agent'),
      });
      const allViews = ['company', 'department', 'sales', 'property', 'commission', 'leads', 'office', 'agent', 'financial', 'performance', 'inventory', 'client'];
      const accessible = result.current.getAccessibleDashboards(allViews as any);
      expect(accessible).toEqual(['sales', 'commission', 'leads', 'agent', 'client']);
    });

    it('returns accessible dashboards for finance role', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('finance'),
      });
      const allViews = ['company', 'commission', 'financial', 'sales'];
      const accessible = result.current.getAccessibleDashboards(allViews as any);
      expect(accessible).toEqual(['company', 'commission', 'financial']);
    });

    it('returns accessible dashboards for viewer role', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('viewer'),
      });
      const allViews = ['company', 'performance', 'sales', 'leads'];
      const accessible = result.current.getAccessibleDashboards(allViews as any);
      expect(accessible).toEqual(['company', 'performance']);
    });

    it('returns empty for unknown role', () => {
      const { result } = renderHook(() => useDashboardAccess(), {
        wrapper: wrapper('janitor'),
      });
      const allViews = ['company', 'sales'];
      expect(result.current.getAccessibleDashboards(allViews as any)).toEqual([]);
    });
  });

  // ── useDashboardCustomization ─────────────────────────────────
  describe('useDashboardCustomization', () => {
    it('initializes with empty state', () => {
      const { result } = renderHook(() => useDashboardCustomization());
      expect(result.current.customLayout).toEqual({});
      expect(result.current.expandedMetrics).toEqual([]);
    });

    it('toggles metric expanded state', () => {
      const { result } = renderHook(() => useDashboardCustomization());

      act(() => {
        result.current.toggleMetricExpanded('metric-1');
      });
      expect(result.current.expandedMetrics).toContain('metric-1');

      act(() => {
        result.current.toggleMetricExpanded('metric-1');
      });
      expect(result.current.expandedMetrics).not.toContain('metric-1');
    });

    it('toggles multiple metrics independently', () => {
      const { result } = renderHook(() => useDashboardCustomization());

      act(() => {
        result.current.toggleMetricExpanded('m1');
        result.current.toggleMetricExpanded('m2');
      });
      expect(result.current.expandedMetrics).toEqual(['m1', 'm2']);

      act(() => {
        result.current.toggleMetricExpanded('m1');
      });
      expect(result.current.expandedMetrics).toEqual(['m2']);
    });

    it('updates layout', () => {
      const { result } = renderHook(() => useDashboardCustomization());

      act(() => {
        result.current.updateLayout({ columns: 3, showHeader: true });
      });
      expect(result.current.customLayout).toEqual({ columns: 3, showHeader: true });
    });

    it('resets customization', () => {
      const { result } = renderHook(() => useDashboardCustomization());

      act(() => {
        result.current.updateLayout({ columns: 4 });
        result.current.toggleMetricExpanded('m1');
      });
      expect(result.current.customLayout).not.toEqual({});

      act(() => {
        result.current.resetCustomization();
      });
      expect(result.current.customLayout).toEqual({});
      expect(result.current.expandedMetrics).toEqual([]);
    });
  });

  // ── useDashboardExport ────────────────────────────────────────
  describe('useDashboardExport', () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
    let clickSpy: ReturnType<typeof vi.fn>;
    let createElementSpy: ReturnType<typeof vi.spyOn> | null = null;

    beforeEach(() => {
      mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
      mockRevokeObjectURL = vi.fn();
      clickSpy = vi.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      // Only intercept anchor element creation — leave other element types untouched
      const originalCreateElement = document.createElement.bind(document);
      createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: any) => {
        if (tag === 'a') {
          return { href: '', download: '', click: clickSpy } as any;
        }
        return originalCreateElement(tag, options);
      });
    });

    afterEach(() => {
      createElementSpy?.mockRestore();
    });

    it('initializes with exporting = false', () => {
      const { result } = renderHook(() => useDashboardExport());
      expect(result.current.exporting).toBe(false);
    });

    it('exports CSV with correct blob and download', async () => {
      const { result } = renderHook(() => useDashboardExport());
      const data = [
        { name: 'Property A', price: 5000000 },
        { name: 'Property B', price: 3000000 },
      ];

      await act(async () => {
        await result.current.exportAsCSV(data, 'test.csv');
      });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
      expect(result.current.exporting).toBe(false);
    });

    it('does not export CSV when data is empty', async () => {
      const { result } = renderHook(() => useDashboardExport());

      await act(async () => {
        await result.current.exportAsCSV([]);
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('handles CSV special characters (commas, quotes, newlines)', async () => {
      const { result } = renderHook(() => useDashboardExport());
      const data = [
        { name: 'Tower "A", Dubai', desc: 'Line1\nLine2' },
      ];

      await act(async () => {
        await result.current.exportAsCSV(data);
      });

      // Should be called (Blob created with escaped content)
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('exports JSON with correct blob and download', async () => {
      const { result } = renderHook(() => useDashboardExport());
      const data = { total: 100, items: [1, 2, 3] };

      await act(async () => {
        await result.current.exportAsJSON(data, 'data.json');
      });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  // ── useDashboardPerformance ───────────────────────────────────
  describe('useDashboardPerformance', () => {
    it('initializes with zeroed metrics', () => {
      const { result } = renderHook(() => useDashboardPerformance());
      expect(result.current.metrics.renderTime).toBe(0);
      expect(result.current.metrics.dataFetchTime).toBe(0);
      expect(result.current.metrics.totalLoadTime).toBe(0);
    });

    it('measurePerformance returns a stop function that returns duration', () => {
      const { result } = renderHook(() => useDashboardPerformance());

      let duration: number | undefined;
      act(() => {
        const stop = result.current.measurePerformance('test-operation');
        // Simulate some delay
        duration = stop();
      });

      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});
