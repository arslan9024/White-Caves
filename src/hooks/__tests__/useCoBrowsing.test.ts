import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCoBrowsing } from '../useCoBrowsing';

describe('useCoBrowsing Hook', () => {
  beforeEach(() => {
    window.dispatchEvent(new CustomEvent('cobrowsing:clear', { detail: { sessionId: 'test-session' } }));
  });

  it('initializes with default state values', () => {
    const { result } = renderHook(() => useCoBrowsing({ sessionId: 'test-session' }));

    expect(result.current.activeTool).toBe('pen');
    expect(result.current.strokeColor).toBe('#EF4444');
    expect(result.current.annotations).toEqual([]);
    expect(result.current.isConnected).toBe(true);
  });

  it('updates tool and stroke color correctly', () => {
    const { result } = renderHook(() => useCoBrowsing({ sessionId: 'test-session' }));

    act(() => {
      result.current.setActiveTool('rectangle');
      result.current.setStrokeColor('#1E293B');
    });

    expect(result.current.activeTool).toBe('rectangle');
    expect(result.current.strokeColor).toBe('#1E293B');
  });

  it('adds and clears annotations', () => {
    const { result } = renderHook(() => useCoBrowsing({ sessionId: 'test-session' }));

    act(() => {
      result.current.addAnnotation({
        type: 'pin',
        start: { x: 100, y: 150 },
        color: '#EF4444',
        strokeWidth: 3,
      });
    });

    expect(result.current.annotations.length).toBe(1);
    expect(result.current.annotations[0].type).toBe('pin');

    act(() => {
      result.current.clearAnnotations();
    });

    expect(result.current.annotations.length).toBe(0);
  });

  it('broadcasts cursor positions and updates participant list', () => {
    const { result } = renderHook(() =>
      useCoBrowsing({
        sessionId: 'test-session',
        currentUser: { id: 'broker-1', name: 'Agent Sarah', role: 'broker' },
      })
    );

    act(() => {
      result.current.broadcastCursor(250, 400);
    });

    expect(result.current.participants.length).toBe(1);
    expect(result.current.participants[0].cursor).toEqual({ x: 250, y: 400 });
  });
});
