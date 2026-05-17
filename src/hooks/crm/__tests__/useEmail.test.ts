/**
 * useEmail — Unit tests
 * Phase 3B: Email Automation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmail } from '../useEmail';

const mockDispatch = vi.fn();
const mockUnwrap = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    sendEmailAPI: vi.fn((p) => ({ type: 'mock/sendEmail', payload: p })),
    sendTemplateEmailAPI: vi.fn((p) => ({ type: 'mock/sendTemplateEmail', payload: p })),
    fetchEmailTemplatesAPI: vi.fn(() => ({ type: 'mock/fetchEmailTemplates' })),
    fetchEmailStatsAPI: vi.fn(() => ({ type: 'mock/fetchEmailStats' })),
  };
});

describe('useEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({});
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });
  });

  describe('initial state', () => {
    it('starts with null templates and stats', () => {
      const { result } = renderHook(() => useEmail());
      expect(result.current.templates).toBeNull();
      expect(result.current.stats).toBeNull();
      expect(result.current.lastResult).toBeNull();
    });

    it('starts with no loading/error', () => {
      const { result } = renderHook(() => useEmail());
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('sendEmail', () => {
    it('dispatches sendEmailAPI', async () => {
      mockUnwrap.mockResolvedValue({ success: true, messageId: 'msg_123' });
      const { result } = renderHook(() => useEmail());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.sendEmail('test@example.com', 'Test Subject', 'Body');
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(sendResult).toEqual({ success: true, messageId: 'msg_123' });
    });

    it('handles send error', async () => {
      mockUnwrap.mockRejectedValue('Network error');
      const { result } = renderHook(() => useEmail());

      await act(async () => {
        await result.current.sendEmail('test@example.com', 'Test', 'Body');
      });

      expect(result.current.error).toBe('Network error');
    });
  });

  describe('sendTemplate', () => {
    it('dispatches sendTemplateEmailAPI', async () => {
      mockUnwrap.mockResolvedValue({ success: true, messageId: 'msg_456', template: 'welcome' });
      const { result } = renderHook(() => useEmail());

      await act(async () => {
        await result.current.sendTemplate('welcome', 'test@example.com', { name: 'John' });
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(result.current.lastResult).toBeTruthy();
    });
  });

  describe('fetchTemplates', () => {
    it('dispatches fetchEmailTemplatesAPI', async () => {
      mockUnwrap.mockResolvedValue([
        { name: 'welcome', description: 'Welcome email' },
        { name: 'viewingConfirmation', description: 'Viewing confirmation' },
      ]);
      const { result } = renderHook(() => useEmail());

      await act(async () => {
        await result.current.fetchTemplates();
      });

      expect(result.current.templates).toHaveLength(2);
    });
  });

  describe('fetchStats', () => {
    it('dispatches fetchEmailStatsAPI', async () => {
      mockUnwrap.mockResolvedValue({ sent: 10, failed: 2, devMode: 5, isDevMode: true });
      const { result } = renderHook(() => useEmail());

      await act(async () => {
        await result.current.fetchStats();
      });

      expect(result.current.stats?.sent).toBe(10);
      expect(result.current.stats?.isDevMode).toBe(true);
    });
  });

  describe('handler exposure', () => {
    it('exposes all functions', () => {
      const { result } = renderHook(() => useEmail());
      expect(typeof result.current.sendEmail).toBe('function');
      expect(typeof result.current.sendTemplate).toBe('function');
      expect(typeof result.current.fetchTemplates).toBe('function');
      expect(typeof result.current.fetchStats).toBe('function');
    });

    it('exposes all state', () => {
      const { result } = renderHook(() => useEmail());
      expect(result.current).toHaveProperty('templates');
      expect(result.current).toHaveProperty('stats');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('lastResult');
    });
  });
});
