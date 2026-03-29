import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Create mock dispatch to track calls
const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

// Mock the analytics slice actions
vi.mock('../../../store/analyticsSlice', () => ({
  updateWebVital: vi.fn((payload) => ({ type: 'analytics/updateWebVital', payload })),
  recordPageView: vi.fn(() => ({ type: 'analytics/recordPageView' })),
}));

// Mock web-vitals module  
const mockOnCLS = vi.fn();
const mockOnFCP = vi.fn();
const mockOnLCP = vi.fn();
const mockOnTTFB = vi.fn();
const mockOnINP = vi.fn();

vi.mock('web-vitals', () => ({
  onCLS: (...args: any[]) => mockOnCLS(...args),
  onFCP: (...args: any[]) => mockOnFCP(...args),
  onLCP: (...args: any[]) => mockOnLCP(...args),
  onTTFB: (...args: any[]) => mockOnTTFB(...args),
  onINP: (...args: any[]) => mockOnINP(...args),
}));

import WebVitalsTracker from '../WebVitalsTracker';
import { recordPageView, updateWebVital } from '../../../store/analyticsSlice';

describe('WebVitalsTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders nothing (returns null)', () => {
      const { container } = render(<WebVitalsTracker />);
      expect(container.innerHTML).toBe('');
    });
  });

  // ── Page View Recording ────────────────────────────────────
  describe('page view recording', () => {
    it('dispatches recordPageView on mount', () => {
      render(<WebVitalsTracker />);
      expect(mockDispatch).toHaveBeenCalledWith(recordPageView());
    });
  });

  // ── Web Vitals Registration ────────────────────────────────
  describe('web vitals', () => {
    it('registers web vitals callbacks on mount', async () => {
      render(<WebVitalsTracker />);
      // Wait for the dynamic import to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      expect(mockOnCLS).toHaveBeenCalled();
      expect(mockOnFCP).toHaveBeenCalled();
      expect(mockOnLCP).toHaveBeenCalled();
      expect(mockOnTTFB).toHaveBeenCalled();
      expect(mockOnINP).toHaveBeenCalled();
    });

    it('dispatches updateWebVital when a metric is reported', async () => {
      render(<WebVitalsTracker />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Simulate a CLS metric callback
      const clsCallback = mockOnCLS.mock.calls[0]?.[0];
      if (clsCallback) {
        clsCallback({ name: 'CLS', value: 0.05, rating: 'good' });
        expect(mockDispatch).toHaveBeenCalledWith(
          updateWebVital({ name: 'CLS', value: 0.05, rating: 'good' })
        );
      }
    });

    it('dispatches updateWebVital for FCP metric', async () => {
      render(<WebVitalsTracker />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const fcpCallback = mockOnFCP.mock.calls[0]?.[0];
      if (fcpCallback) {
        fcpCallback({ name: 'FCP', value: 1800, rating: 'needs-improvement' });
        expect(mockDispatch).toHaveBeenCalledWith(
          updateWebVital({ name: 'FCP', value: 1800, rating: 'needs-improvement' })
        );
      }
    });

    it('dispatches updateWebVital for LCP metric', async () => {
      render(<WebVitalsTracker />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const lcpCallback = mockOnLCP.mock.calls[0]?.[0];
      if (lcpCallback) {
        lcpCallback({ name: 'LCP', value: 2500, rating: 'good' });
        expect(mockDispatch).toHaveBeenCalledWith(
          updateWebVital({ name: 'LCP', value: 2500, rating: 'good' })
        );
      }
    });
  });

  // ── Duplicate Prevention ───────────────────────────────────
  describe('duplicate prevention', () => {
    it('does not double-register on re-render', async () => {
      const { rerender } = render(<WebVitalsTracker />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const firstCallCount = mockOnCLS.mock.calls.length;

      rerender(<WebVitalsTracker />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Should not have registered again
      expect(mockOnCLS.mock.calls.length).toBe(firstCallCount);
    });
  });
});
